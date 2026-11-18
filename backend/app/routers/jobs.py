from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import json
import asyncio

from app.models.database import get_db, Job, Order, User, Asset
from app.auth import get_current_user, require_admin
from app.services.comfyui import comfyui

router = APIRouter(prefix="/api", tags=["jobs"])

WORKFLOW_MAP = {
    "restore": "restore",
    "colorize": "colorize",
    "enhance": "enhance",
    "upscale": "upscale",
    "animate": "animate",
    "inpaint": "inpaint",
}

class JobResponse(BaseModel):
    id: int
    order_id: int
    workflow_name: str
    status: str
    progress_pct: int
    error_message: Optional[str]
    started_at: Optional[str]
    completed_at: Optional[str]
    created_at: str

@router.get("/orders/{order_id}/jobs", response_model=List[JobResponse])
def list_jobs(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    jobs = db.query(Job).filter(Job.order_id == order_id).all()
    return [_job_to_response(j) for j in jobs]

@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    order = db.query(Order).filter(Order.id == job.order_id).first()
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    # Update progress from ComfyUI
    if job.status == "running" and job.comfyui_prompt_id:
        try:
            import asyncio
            loop = asyncio.new_event_loop()
            progress = loop.run_until_complete(comfyui.get_progress(job.comfyui_prompt_id))
            loop.close()
            if progress["status"] == "completed":
                job.status = "completed"
                job.progress_pct = 100
                job.completed_at = __import__("datetime").datetime.utcnow()
                db.commit()
            elif progress["status"] == "running":
                job.progress_pct = min(job.progress_pct + 5, 95)
                db.commit()
        except Exception:
            pass
    return _job_to_response(job)

@router.post("/orders/{order_id}/process")
def start_processing(order_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status not in ("paid", "processing"):
        raise HTTPException(status_code=400, detail="Order must be paid before processing")
    
    workflow_name = WORKFLOW_MAP.get(order.service_type, "enhance")
    
    # Get input assets
    input_assets = db.query(Asset).filter(Asset.order_id == order_id, Asset.asset_role == "input").all()
    if not input_assets:
        raise HTTPException(status_code=400, detail="No input assets uploaded")
    
    job = Job(
        order_id=order_id,
        workflow_name=workflow_name,
        status="queued",
        settings_json=json.dumps({"input_count": len(input_assets)}),
    )
    db.add(job)
    order.status = "processing"
    db.commit()
    db.refresh(job)
    
    return {"message": "Processing started", "job_id": job.id, "workflow": workflow_name}

@router.post("/jobs/{job_id}/retry")
def retry_job(job_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != "failed":
        raise HTTPException(status_code=400, detail="Only failed jobs can be retried")
    job.status = "queued"
    job.error_message = None
    job.progress_pct = 0
    db.commit()
    return {"message": "Job requeued", "job_id": job.id}

def _job_to_response(job: Job) -> JobResponse:
    return JobResponse(
        id=job.id,
        order_id=job.order_id,
        workflow_name=job.workflow_name,
        status=job.status,
        progress_pct=job.progress_pct,
        error_message=job.error_message,
        started_at=str(job.started_at) if job.started_at else None,
        completed_at=str(job.completed_at) if job.completed_at else None,
        created_at=str(job.created_at),
    )
