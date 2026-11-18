# Add to database.py - Channel and PlatformOrder models

# Add these enums and models to the existing database.py

class ChannelType(str, enum.Enum):
    FIVERR = "fiverr"
    UPWORK = "upwork"
    FREELANCER = "freelancer"
    PEOPLEPERHOUR = "peopleperhour"
    GURU = "guru"
    DIRECT = "direct"
    OTHER = "other"

# New tables to add:

class Channel(Base):
    __tablename__ = "channels"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)  # fiverr, upwork, etc.
    display_name = Column(String(100), nullable=False)  # Fiverr, Upwork, etc.
    is_active = Column(Boolean, default=True)
    config_json = Column(Text, default="{}")  # API keys, webhook secrets, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    
    platform_orders = relationship("PlatformOrder", back_populates="channel", cascade="all, delete-orphan")

class PlatformOrder(Base):
    __tablename__ = "platform_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)  # linked internal order
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    platform_order_id = Column(String(100), nullable=False)  # Fiverr/Upwork order ID
    platform_buyer_id = Column(String(100), nullable=True)  # Buyer's platform ID
    platform_buyer_name = Column(String(255), nullable=True)  # Buyer's display name
    platform_url = Column(String(500), nullable=True)  # Link to platform order
    sync_status = Column(String(50), default="pending")  # pending, synced, failed
    synced_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    channel = relationship("Channel", back_populates="platform_orders")
    order = relationship("Order", backref="platform_orders")

class ChannelWebhook(Base):
    __tablename__ = "channel_webhooks"
    
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    event_type = Column(String(100), nullable=False)  # order.created, order.completed, etc.
    payload_json = Column(Text, nullable=False)  # Raw webhook payload
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    channel = relationship("Channel")

# Add channel_id to Order model
# Order.channel_id = Column(Integer, ForeignKey("channels.id"), nullable=True)
# Order.channel = relationship("Channel")
