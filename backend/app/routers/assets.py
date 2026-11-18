import os
import uuid
import mimetypes
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List

from app.models.database import get_db, Asset, Order, User
from app.auth import get_current_user, require_admin
from app.config import settings, UPLOADS_DIR

router = APIRouter(prefix="/api", tags=["assets"])

ALLOWED_EXTENSIONS = set(settings.ALLOWED_EXTENSIONS)

MIME_TYPE_MAP = {
    "video": "video/mp4",
    "audio": "audio/mpeg",
    "image": "image/png",
    "3d": "model/gltf-binary",
    "archive": "application/zip",
    "other": "application/octet-stream",
}

EXT_TYPE_MAP = {
    "jpg": "image", "jpeg": "image", "png": "image", "tif": "image", "tiff": "image",
    "webp": "image", "gif": "image", "bmp": "image",
    "mp4": "video", "mov": "video", "webm": "video", "avi": "video", "mkv": "video",
    "wav": "audio", "mp3": "audio", "ogg": "audio", "flac": "audio", "aac": "audio",
    "glb": "3d", "gltf": "3d", "obj": "3d", "fbx": "3d",
    "zip": "archive",
}

def _get_order_or_404(order_id: int, db: Session, user: User):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if user.role != "admin" and order.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return order

@router.post("/orders/{order_id}/assets")
async def upload_asset(order_id: int, file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = _get_order_or_404(order_id, db, current_user)
    
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed")
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File too large (max {settings.MAX_UPLOAD_SIZE_MB}MB)")
    
    # Determine file type
    file_type = EXT_TYPE_MAP.get(ext, "other")
    
    # Save file
    order_dir = UPLOADS_DIR / str(order_id) / "input"
    order_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = order_dir / safe_name
    with open(file_path, "wb") as f:
        f.write(content)
    
    asset = Asset(
        order_id=order_id,
        filename=file.filename,
        file_type=file_type,
        file_size_bytes=len(content),
        storage_path=str(file_path),
        asset_role="input",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    
    return {"id": asset.id, "filename": asset.filename, "file_type": asset.file_type, "size": asset.file_size_bytes}

@router.get("/orders/{order_id}/assets")
def list_assets(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = _get_order_or_404(order_id, db, current_user)
    assets = db.query(Asset).filter(Asset.order_id == order_id).all()
    return [{"id": a.id, "filename": a.filename, "file_type": a.file_type, "size": a.file_size_bytes, "role": a.asset_role, "uploaded_at": str(a.uploaded_at)} for a in assets]

@router.get("/assets/{asset_id}/preview")
def preview_asset(asset_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Serve asset file inline for preview (video, audio, image, 3D)."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    order = db.query(Order).filter(Order.id == asset.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if not os.path.exists(asset.storage_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    content_type = MIME_TYPE_MAP.get(asset.file_type, "application/octet-stream")
    # Try to guess more specific type from filename
    guessed = mimetypes.guess_type(asset.filename)[0]
    if guessed:
        content_type = guessed
    
    return FileResponse(
        asset.storage_path,
        media_type=content_type,
        headers={"Content-Disposition": "inline", "Cache-Control": "public, max-age=3600"},
    )

@router.get("/assets/{asset_id}/stream")
def stream_asset(asset_id: int, request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Stream asset file with range support for video/audio seeking."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    order = db.query(Order).filter(Order.id == asset.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if not os.path.exists(asset.storage_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    file_size = os.path.getsize(asset.storage_path)
    content_type = MIME_TYPE_MAP.get(asset.file_type, "application/octet-stream")
    guessed = mimetypes.guess_type(asset.filename)[0]
    if guessed:
        content_type = guessed
    
    range_header = request.headers.get("range")
    if range_header:
        range_str = range_header.replace("bytes=", "")
        parts = range_str.split("-")
        start = int(parts[0]) if parts[0] else 0
        end = int(parts[1]) if parts[1] else file_size - 1
        end = min(end, file_size - 1)
        chunk_size = end - start + 1
        
        def file_iterator():
            with open(asset.storage_path, "rb") as f:
                f.seek(start)
                remaining = chunk_size
                while remaining > 0:
                    read_size = min(65536, remaining)
                    data = f.read(read_size)
                    if not data:
                        break
                    remaining -= len(data)
                    yield data
        
        return StreamingResponse(
            file_iterator(),
            status_code=206,
            media_type=content_type,
            headers={
                "Content-Range": f"bytes {start}-{end}/{file_size}",
                "Accept-Ranges": "bytes",
                "Content-Length": str(chunk_size),
                "Cache-Control": "public, max-age=3600",
            },
        )
    
    return FileResponse(asset.storage_path, media_type=content_type)

@router.get("/assets/{asset_id}/download")
def download_asset(asset_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    order = db.query(Order).filter(Order.id == asset.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return FileResponse(asset.storage_path, filename=asset.filename)

@router.delete("/assets/{asset_id}")
def delete_asset(asset_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    order = db.query(Order).filter(Order.id == asset.order_id).first()
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    # Delete file
    try:
        os.remove(asset.storage_path)
    except FileNotFoundError:
        pass
    db.delete(asset)
    db.commit()
    return {"message": "Asset deleted"}
