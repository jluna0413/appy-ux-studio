import uuid
import json
import sqlalchemy
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.models.database import get_db, Product, CartItem, Purchase, ProductReview, User, Payment, Order
from app.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/shop", tags=["shop"])

# ── Schemas ──
class ProductResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    subcategory: Optional[str]
    price_cents: int
    currency: str
    preview_url: Optional[str]
    file_type: Optional[str]
    license_type: str
    tags: list
    download_count: int
    is_active: bool
    created_at: str

class ProductCreate(BaseModel):
    title: str
    description: str = ""
    category: str
    subcategory: Optional[str] = None
    price_cents: int
    preview_url: Optional[str] = None
    file_url: Optional[str] = None
    file_size_bytes: int = 0
    file_type: Optional[str] = None
    license_type: str = "royalty_free"
    tags: list = []

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    title: str
    price_cents: int
    quantity: int
    preview_url: Optional[str]

class PurchaseResponse(BaseModel):
    id: int
    product_id: int
    title: str
    download_token: str
    download_count: int
    max_downloads: int
    purchased_at: str

# ── Products (Public) ──
@router.get("/products", response_model=List[ProductResponse])
def list_products(category: str = None, tag: str = None, min_price: int = None, max_price: int = None, sort: str = "newest", db: Session = Depends(get_db)):
    query = db.query(Product).filter(Product.is_active == True)
    if category:
        query = query.filter(Product.category == category)
    if min_price is not None:
        query = query.filter(Product.price_cents >= min_price)
    if max_price is not None:
        query = query.filter(Product.price_cents <= max_price)
    if tag:
        query = query.filter(Product.tags.contains(tag))
    
    if sort == "price_asc":
        query = query.order_by(Product.price_cents.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price_cents.desc())
    elif sort == "popular":
        query = query.order_by(Product.download_count.desc())
    else:
        query = query.order_by(Product.created_at.desc())
    
    products = query.all()
    return [_product_to_response(p) for p in products]

@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _product_to_response(product)

@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    from sqlalchemy import func
    cats = db.query(Product.category, func.count(Product.id)).filter(Product.is_active == True).group_by(Product.category).all()
    return [{"category": c[0], "count": c[1]} for c in cats]

@router.get("/search")
def search_products(q: str, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True, Product.title.contains(q) | Product.description.contains(q)).all()
    return [_product_to_response(p) for p in products]

# ── Cart ──
@router.get("/cart", response_model=List[CartItemResponse])
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return [CartItemResponse(id=i.id, product_id=i.product_id, title=i.product.title, price_cents=i.product.price_cents, quantity=i.quantity, preview_url=i.product.preview_url) for i in items]

@router.post("/cart")
def add_to_cart(product_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    existing = db.query(CartItem).filter(CartItem.user_id == current_user.id, CartItem.product_id == product_id).first()
    if existing:
        existing.quantity += 1
    else:
        item = CartItem(user_id=current_user.id, product_id=product_id)
        db.add(item)
    db.commit()
    return {"message": "Added to cart"}

@router.delete("/cart/{item_id}")
def remove_from_cart(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed from cart"}

@router.post("/cart/checkout")
def checkout_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    total = sum(i.product.price_cents * i.quantity for i in items)
    
    # Create order for the purchase
    from app.models.database import Order
    order = Order(
        user_id=current_user.id,
        service_type="shop_purchase",
        package_tier="instant",
        price_cents=total,
        status="pending",
        notes="Shop purchase",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Create payment intent (PayPal)
    import paypalrestsdk
    paypalrestsdk.configure({
        "mode": "sandbox",
        "client_id": "your-paypal-client-id",
        "client_secret": "your-paypal-client-secret",
    })
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": f"http://localhost:8000/api/shop/checkout/return?order_id={order.id}",
            "cancel_url": f"http://localhost:8000/api/shop/checkout/cancel?order_id={order.id}",
        },
        "transactions": [{"amount": {"total": f"{total / 100:.2f}", "currency": "USD"}, "description": f"Appy-UX Shop - Order #{order.id}"}],
    })
    
    if payment.create():
        from app.models.database import Payment as PaymentModel
        db_payment = PaymentModel(order_id=order.id, provider="paypal", provider_payment_id=payment.id, amount_cents=total, status="pending")
        db.add(db_payment)
        db.commit()
        
        approval_url = None
        for link in payment.links:
            if link.rel == "approval_url":
                approval_url = link.href
                break
        
        return {"order_id": order.id, "approval_url": approval_url, "total_cents": total}
    else:
        raise HTTPException(status_code=500, detail="Payment creation failed")

@router.get("/checkout/return")
def checkout_return(order_id: int, paymentId: str, PayerID: str, db: Session = Depends(get_db)):
    import paypalrestsdk
    paypalrestsdk.configure({"mode": "sandbox", "client_id": "your-paypal-client-id", "client_secret": "your-paypal-client-secret"})
    payment = paypalrestsdk.Payment.find(paymentId)
    
    if payment.execute({"payer_id": PayerID}):
        # Update payment
        from app.models.database import Payment as PaymentModel
        db_payment = db.query(PaymentModel).filter(PaymentModel.provider_payment_id == paymentId).first()
        if db_payment:
            db_payment.status = "succeeded"
            db.commit()
        
        # Update order
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            order.status = "paid"
            db.commit()
        
        # Create purchases and download tokens
        cart_items = db.query(CartItem).filter(CartItem.user_id == order.user_id).all()
        for item in cart_items:
            purchase = Purchase(
                user_id=order.user_id,
                product_id=item.product_id,
                payment_id=db_payment.id if db_payment else None,
                download_token=__import__("uuid").uuid4().hex,
            )
            db.add(purchase)
            item.product.download_count += 1
        db.commit()
        
        # Clear cart
        for item in cart_items:
            db.delete(item)
        db.commit()
        
        return {"message": "Payment successful", "order_id": order_id}
    else:
        raise HTTPException(status_code=400, detail="Payment execution failed")

# ── Downloads ──
@router.get("/downloads", response_model=List[PurchaseResponse])
def list_downloads(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    purchases = db.query(Purchase).filter(Purchase.user_id == current_user.id).all()
    return [PurchaseResponse(id=p.id, product_id=p.product_id, title=p.product.title, download_token=p.download_token, download_count=p.download_count, max_downloads=p.max_downloads, purchased_at=str(p.purchased_at)) for p in purchases]

@router.get("/download/{token}")
def download_product(token: str, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.download_token == token).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Download not found")
    if purchase.download_count >= purchase.max_downloads:
        raise HTTPException(status_code=403, detail="Download limit reached")
    if purchase.expires_at and purchase.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Download link expired")
    
    purchase.download_count += 1
    db.commit()
    
    from fastapi.responses import FileResponse
    # In production, serve from S3 or local storage
    return FileResponse(purchase.product.file_url, filename=f"{purchase.product.title}.{purchase.product.file_type}")

# ── Admin: Product Management ──
@router.post("/admin/products")
def create_product(req: ProductCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    product = Product(
        title=req.title,
        description=req.description,
        category=req.category,
        subcategory=req.subcategory,
        price_cents=req.price_cents,
        preview_url=req.preview_url,
        file_url=req.file_url,
        file_size_bytes=req.file_size_bytes,
        file_type=req.file_type,
        license_type=req.license_type,
        tags=json.dumps(req.tags),
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id, "title": product.title}

@router.patch("/admin/products/{product_id}")
def update_product(product_id: int, req: ProductCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in req.dict(exclude_unset=True).items():
        if field == "tags":
            setattr(product, field, json.dumps(value))
        else:
            setattr(product, field, value)
    db.commit()
    return {"message": "Product updated"}

@router.delete("/admin/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.commit()
    return {"message": "Product deactivated"}

@router.get("/admin/stats")
def shop_stats(db: Session = Depends(get_db), admin=Depends(require_admin)):
    total_products = db.query(Product).filter(Product.is_active == True).count()
    total_purchases = db.query(Purchase).count()
    total_revenue = db.query(Payment).filter(Payment.status == "succeeded").with_entities(sqlalchemy.func.sum(Payment.amount_cents)).scalar() or 0
    top_products = db.query(Product).order_by(Product.download_count.desc()).limit(5).all()
    return {
        "total_products": total_products,
        "total_purchases": total_purchases,
        "total_revenue_cents": total_revenue,
        "top_products": [{"id": p.id, "title": p.title, "downloads": p.download_count, "price_cents": p.price_cents} for p in top_products],
    }

# ── Helpers ──
def _product_to_response(p: Product) -> ProductResponse:
    return ProductResponse(
        id=p.id,
        title=p.title,
        description=p.description,
        category=p.category,
        subcategory=p.subcategory,
        price_cents=p.price_cents,
        currency=p.currency,
        preview_url=p.preview_url,
        file_type=p.file_type,
        license_type=p.license_type,
        tags=json.loads(p.tags) if p.tags else [],
        download_count=p.download_count,
        is_active=p.is_active,
        created_at=str(p.created_at),
    )
