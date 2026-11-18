from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.models.database import get_db
from app.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/inquiries", tags=["inquiries"])

class InquiryCreate(BaseModel):
    name: str
    email: str
    service: str
    message: str = ""
    package: Optional[str] = None

class InquiryResponse(BaseModel):
    id: int
    name: str
    email: str
    service: str
    message: str
    package: Optional[str]
    status: str
    created_at: str

# In-memory store for inquiries (can be moved to DB later)
_inquiries = []
_inquiry_counter = 0

@router.post("", response_model=InquiryResponse)
def create_inquiry(req: InquiryCreate, db: Session = Depends(get_db)):
    global _inquiry_counter
    _inquiry_counter += 1
    inquiry = {
        "id": _inquiry_counter,
        "name": req.name,
        "email": req.email,
        "service": req.service,
        "message": req.message,
        "package": req.package,
        "status": "new",
        "created_at": datetime.utcnow().isoformat(),
    }
    _inquiries.append(inquiry)
    return InquiryResponse(**inquiry)

@router.get("", response_model=list[InquiryResponse])
def list_inquiries(status: str = None, admin=Depends(require_admin)):
    if status:
        return [InquiryResponse(**i) for i in _inquiries if i["status"] == status]
    return [InquiryResponse(**i) for i in _inquiries]

@router.patch("/{inquiry_id}")
def update_inquiry(inquiry_id: int, status: str, admin=Depends(require_admin)):
    for i in _inquiries:
        if i["id"] == inquiry_id:
            i["status"] = status
            return {"message": "Updated"}
    raise HTTPException(status_code=404, detail="Inquiry not found")
