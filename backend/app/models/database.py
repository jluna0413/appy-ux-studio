from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

from app.config import settings

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ── Enums ──
class UserRole(str, enum.Enum):
    CLIENT = "client"
    ADMIN = "admin"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    REVIEW = "review"
    REVISION = "revision"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class ServiceType(str, enum.Enum):
    RESTORE = "restore"
    COLORIZE = "colorize"
    ENHANCE = "enhance"
    UPSCALE = "upscale"
    ANIMATE = "animate"
    BUNDLE = "bundle"
    SHORT_VIDEO = "short_video"
    LONG_VIDEO = "long_video"
    VIDEO_UPSCALE = "video_upscale"
    VIDEO_STYLE_TRANSFER = "video_style_transfer"
    MUSIC = "music"
    GAME_ASSETS = "game_assets"
    CUSTOM = "custom"

class AssetRole(str, enum.Enum):
    INPUT = "input"
    OUTPUT = "output"
    PREVIEW = "preview"
    DELIVERY = "delivery"

class JobStatus(str, enum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentProvider(str, enum.Enum):
    PAYPAL = "paypal"
    STRIPE = "stripe"

class ChannelType(str, enum.Enum):
    FIVERR = "fiverr"
    UPWORK = "upwork"
    FREELANCER = "freelancer"
    PEOPLEPERHOUR = "peopleperhour"
    GURU = "guru"
    LINKEDIN = "linkedin"
    DIRECT = "direct"
    OTHER = "other"

# ── Models ──
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.CLIENT.value)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")

class Channel(Base):
    __tablename__ = "channels"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    config_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    platform_orders = relationship("PlatformOrder", back_populates="channel", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="channel")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=True)
    service_type = Column(String(50), nullable=False)
    package_tier = Column(String(50), default="basic")
    status = Column(String(50), default=OrderStatus.PENDING.value)
    price_cents = Column(Integer, nullable=False)
    currency = Column(String(3), default="USD")
    inputs_approved = Column(Boolean, default=False)
    revision_count = Column(Integer, default=0)
    max_revisions = Column(Integer, default=1)
    turnaround_hours = Column(Integer, default=48)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    delivered_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="orders")
    channel = relationship("Channel", back_populates="orders")
    assets = relationship("Asset", back_populates="order", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")
    revisions = relationship("Revision", back_populates="order", cascade="all, delete-orphan")
    platform_orders = relationship("PlatformOrder", back_populates="order", cascade="all, delete-orphan")

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50))
    file_size_bytes = Column(Integer, default=0)
    storage_path = Column(String(500), nullable=False)
    asset_role = Column(String(50), default=AssetRole.INPUT.value)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="assets")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    workflow_name = Column(String(100), nullable=False)
    status = Column(String(50), default=JobStatus.QUEUED.value)
    progress_pct = Column(Integer, default=0)
    settings_json = Column(Text, default="{}")
    comfyui_prompt_id = Column(String(100), nullable=True)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="jobs")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    provider = Column(String(50), default=PaymentProvider.PAYPAL.value)
    provider_payment_id = Column(String(100), nullable=True)
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(String(50), default=PaymentStatus.PENDING.value)
    payment_method = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="payments")

class Revision(Base):
    __tablename__ = "revisions"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    revision_number = Column(Integer, nullable=False)
    feedback = Column(Text, default="")
    status = Column(String(50), default="requested")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    order = relationship("Order", back_populates="revisions")

class PlatformOrder(Base):
    __tablename__ = "platform_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    platform_order_id = Column(String(100), nullable=False)
    platform_buyer_id = Column(String(100), nullable=True)
    platform_buyer_name = Column(String(255), nullable=True)
    platform_url = Column(String(500), nullable=True)
    sync_status = Column(String(50), default="pending")
    synced_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    channel = relationship("Channel", back_populates="platform_orders")
    order = relationship("Order", back_populates="platform_orders")

class ChannelWebhook(Base):
    __tablename__ = "channel_webhooks"
    
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    event_type = Column(String(100), nullable=False)
    payload_json = Column(Text, nullable=False)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    channel = relationship("Channel")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    category = Column(String(50), nullable=False)  # music, video, game_asset, image, template
    subcategory = Column(String(50), nullable=True)
    price_cents = Column(Integer, nullable=False)
    currency = Column(String(3), default="USD")
    preview_url = Column(String(500), nullable=True)
    file_url = Column(String(500), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    file_type = Column(String(50), nullable=True)
    license_type = Column(String(50), default="royalty_free")
    tags = Column(Text, default="[]")  # JSON array
    is_active = Column(Boolean, default=True)
    download_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    purchases = relationship("Purchase", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("ProductReview", back_populates="product", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    added_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="cart_items")

class Purchase(Base):
    __tablename__ = "purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=True)
    download_token = Column(String(100), unique=True, nullable=False)
    download_count = Column(Integer, default=0)
    max_downloads = Column(Integer, default=5)
    purchased_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    product = relationship("Product", back_populates="purchases")
    user = relationship("User")

class ProductReview(Base):
    __tablename__ = "product_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    review = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="reviews")
    user = relationship("User")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
