from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.models.database import get_db, Order, User, Job, Asset, Payment
from app.auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/orders")
def admin_list_orders(status: str = None, service_type: str = None, db: Session = Depends(get_db), admin=Depends(require_admin)):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    if service_type:
        query = query.filter(Order.service_type == service_type)
    orders = query.order_by(Order.created_at.desc()).all()
    return [{"id": o.id, "user_id": o.user_id, "user_email": o.user.email, "service_type": o.service_type, "package_tier": o.package_tier, "status": o.status, "price_cents": o.price_cents, "created_at": str(o.created_at)} for o in orders]

@router.get("/users")
def admin_list_users(db: Session = Depends(get_db), admin=Depends(require_admin)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "name": u.name, "role": u.role, "created_at": str(u.created_at), "order_count": len(u.orders)} for u in users]

@router.get("/stats")
def admin_stats(db: Session = Depends(get_db), admin=Depends(require_admin)):
    total_orders = db.query(Order).count()
    total_users = db.query(User).count()
    total_revenue = db.query(Payment).filter(Payment.status == "succeeded").with_entities(__import__("sqlalchemy").func.sum(Payment.amount_cents)).scalar() or 0
    
    status_counts = {}
    for status in ["pending", "paid", "processing", "review", "delivered", "cancelled"]:
        status_counts[status] = db.query(Order).filter(Order.status == status).count()
    
    service_counts = {}
    for st in ["restore", "colorize", "enhance", "upscale", "animate", "bundle", "short_video", "long_video", "music", "game_assets"]:
        service_counts[st] = db.query(Order).filter(Order.service_type == st).count()
    
    return {
        "total_orders": total_orders,
        "total_users": total_users,
        "total_revenue_cents": total_revenue,
        "orders_by_status": status_counts,
        "orders_by_service": service_counts,
    }

@router.post("/orders/{order_id}/approve")
def approve_order(order_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "paid":
        raise HTTPException(status_code=400, detail="Order must be paid before approval")
    if not order.inputs_approved:
        raise HTTPException(status_code=400, detail="Inputs must be approved first")
    order.status = "processing"
    db.commit()
    return {"message": "Order approved for processing", "order_id": order_id}

@router.post("/orders/{order_id}/approve-inputs")
def approve_inputs(order_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.inputs_approved = True
    db.commit()
    return {"message": "Inputs approved", "order_id": order_id}

@router.post("/orders/{order_id}/deliver")
def deliver_order(order_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "delivered"
    order.delivered_at = datetime.utcnow()
    db.commit()
    return {"message": "Order marked as delivered", "order_id": order_id}

@router.get("/jobs")
def admin_list_jobs(status: str = None, db: Session = Depends(get_db), admin=Depends(require_admin)):
    query = db.query(Job)
    if status:
        query = query.filter(Job.status == status)
    jobs = query.order_by(Job.created_at.desc()).all()
    return [{"id": j.id, "order_id": j.order_id, "workflow": j.workflow_name, "status": j.status, "progress": j.progress_pct, "error": j.error_message, "created_at": str(j.created_at)} for j in jobs]

@router.get("/comfyui/status")
async def comfyui_status(admin=Depends(require_admin)):
    try:
        stats = await __import__("app.services.comfyui", fromlist=["comfyui"]).comfyui.get_system_stats()
        queue = await __import__("app.services.comfyui", fromlist=["comfyui"]).comfyui.get_queue()
        return {"status": "online", "stats": stats, "queue": queue}
    except Exception as e:
        return {"status": "offline", "error": str(e)}
