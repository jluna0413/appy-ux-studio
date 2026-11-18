from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.models.database import get_db, Order, User, Asset, Job
from app.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/orders", tags=["orders"])

# ── Schemas ──
class OrderCreate(BaseModel):
    service_type: str
    package_tier: str = "basic"
    price_cents: int
    notes: str = ""

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    inputs_approved: Optional[bool] = None

class OrderResponse(BaseModel):
    id: int
    user_id: int
    service_type: str
    package_tier: str
    status: str
    price_cents: int
    currency: str
    inputs_approved: bool
    revision_count: int
    max_revisions: int
    turnaround_hours: int
    notes: str
    created_at: str
    updated_at: str
    delivered_at: Optional[str]

# ── Endpoints ──
@router.post("", response_model=OrderResponse)
def create_order(req: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = Order(
        user_id=current_user.id,
        service_type=req.service_type,
        package_tier=req.package_tier,
        price_cents=req.price_cents,
        notes=req.notes,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return _order_to_response(order)

@router.get("", response_model=List[OrderResponse])
def list_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "admin":
        orders = db.query(Order).order_by(Order.created_at.desc()).all()
    else:
        orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return [_order_to_response(o) for o in orders]

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return _order_to_response(order)

@router.patch("/{order_id}", response_model=OrderResponse)
def update_order(order_id: int, req: OrderUpdate, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if req.status is not None:
        order.status = req.status
        if req.status == "delivered":
            order.delivered_at = datetime.utcnow()
    if req.notes is not None:
        order.notes = req.notes
    if req.inputs_approved is not None:
        order.inputs_approved = req.inputs_approved
    db.commit()
    db.refresh(order)
    return _order_to_response(order)

@router.delete("/{order_id}")
def cancel_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if order.status not in ("pending", "paid"):
        raise HTTPException(status_code=400, detail="Cannot cancel order in current status")
    order.status = "cancelled"
    db.commit()
    return {"message": "Order cancelled"}

def _order_to_response(order: Order) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        service_type=order.service_type,
        package_tier=order.package_tier,
        status=order.status,
        price_cents=order.price_cents,
        currency=order.currency,
        inputs_approved=order.inputs_approved,
        revision_count=order.revision_count,
        max_revisions=order.max_revisions,
        turnaround_hours=order.turnaround_hours,
        notes=order.notes or "",
        created_at=str(order.created_at),
        updated_at=str(order.updated_at),
        delivered_at=str(order.delivered_at) if order.delivered_at else None,
    )
