from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import json

from app.models.database import get_db, Payment, Order, User
from app.auth import get_current_user, require_admin
from app.config import settings

router = APIRouter(prefix="/api/payments", tags=["payments"])

# ── Schemas ──
class CreatePaymentRequest(BaseModel):
    order_id: int
    provider: str = "paypal"  # paypal or stripe

class PaymentResponse(BaseModel):
    id: int
    order_id: int
    provider: str
    provider_payment_id: Optional[str]
    amount_cents: int
    currency: str
    status: str
    created_at: str

# ── PayPal Integration ──
def _get_paypal_sdk():
    """Initialize PayPal SDK."""
    import paypalrestsdk
    paypalrestsdk.configure({
        "mode": settings.PAYPAL_MODE,
        "client_id": settings.PAYPAL_CLIENT_ID,
        "client_secret": settings.PAYPAL_CLIENT_SECRET,
    })
    return paypalrestsdk

@router.post("/create-intent")
def create_payment_intent(req: CreatePaymentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    if order.status != "pending":
        raise HTTPException(status_code=400, detail="Order is not in pending status")
    
    if req.provider == "paypal":
        return _create_paypal_payment(order, db)
    elif req.provider == "stripe":
        return _create_stripe_payment(order, db)
    else:
        raise HTTPException(status_code=400, detail="Unsupported payment provider")

def _create_paypal_payment(order: Order, db: Session):
    paypal = _get_paypal_sdk()
    payment = paypal.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": f"http://localhost:8000/api/payments/paypal/return?order_id={order.id}",
            "cancel_url": f"http://localhost:8000/api/payments/paypal/cancel?order_id={order.id}",
        },
        "transactions": [{
            "amount": {
                "total": f"{order.price_cents / 100:.2f}",
                "currency": order.currency,
            },
            "description": f"Appy-UX Studio - Order #{order.id} ({order.service_type})",
        }],
    })
    
    if payment.create():
        # Save payment record
        db_payment = Payment(
            order_id=order.id,
            provider="paypal",
            provider_payment_id=payment.id,
            amount_cents=order.price_cents,
            currency=order.currency,
            status="pending",
        )
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        
        # Find approval URL
        approval_url = None
        for link in payment.links:
            if link.rel == "approval_url":
                approval_url = link.href
                break
        
        return {"payment_id": db_payment.id, "approval_url": approval_url, "provider": "paypal"}
    else:
        raise HTTPException(status_code=500, detail=f"PayPal error: {payment.error}")

def _create_stripe_payment(order: Order, db: Session):
    import stripe
    stripe.api_key = settings.STRIPE_SECRET_KEY
    
    intent = stripe.PaymentIntent.create(
        amount=order.price_cents,
        currency=order.currency.lower(),
        metadata={"order_id": str(order.id)},
    )
    
    db_payment = Payment(
        order_id=order.id,
        provider="stripe",
        provider_payment_id=intent.id,
        amount_cents=order.price_cents,
        currency=order.currency,
        status="pending",
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    return {"payment_id": db_payment.id, "client_secret": intent.client_secret, "provider": "stripe"}

@router.get("/paypal/return")
def paypal_return(order_id: int, paymentId: str, PayerID: str, db: Session = Depends(get_db)):
    paypal = _get_paypal_sdk()
    payment = paypal.Payment.find(paymentId)
    
    if payment.execute({"payer_id": PayerID}):
        # Update payment record
        db_payment = db.query(Payment).filter(Payment.provider_payment_id == paymentId).first()
        if db_payment:
            db_payment.status = "succeeded"
            db_payment.payment_method = "paypal"
            db.commit()
        
        # Update order status
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            order.status = "paid"
            db.commit()
        
        return {"message": "Payment successful", "order_id": order_id, "status": "paid"}
    else:
        raise HTTPException(status_code=400, detail=f"Payment execution failed: {payment.error}")

@router.get("/paypal/cancel")
def paypal_cancel(order_id: int):
    return {"message": "Payment cancelled", "order_id": order_id}

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Stripe webhook handler."""
    import stripe
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event["type"] == "payment_intent.succeeded":
        pi = event["data"]["object"]
        order_id = int(pi["metadata"].get("order_id", 0))
        if order_id:
            db_payment = db.query(Payment).filter(Payment.provider_payment_id == pi["id"]).first()
            if db_payment:
                db_payment.status = "succeeded"
                db.commit()
            order = db.query(Order).filter(Order.id == order_id).first()
            if order:
                order.status = "paid"
                db.commit()
    
    return {"status": "ok"}

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return PaymentResponse(
        id=payment.id,
        order_id=payment.order_id,
        provider=payment.provider,
        provider_payment_id=payment.provider_payment_id,
        amount_cents=payment.amount_cents,
        currency=payment.currency,
        status=payment.status,
        created_at=str(payment.created_at),
    )
