from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json

from app.models.database import get_db, Channel, PlatformOrder, ChannelWebhook, Order, User
from app.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/channels", tags=["channels"])

# ── Schemas ──
class ChannelResponse(BaseModel):
    id: int
    name: str
    display_name: str
    is_active: bool
    created_at: str

class ChannelCreate(BaseModel):
    name: str
    display_name: str
    config: dict = {}

class PlatformOrderResponse(BaseModel):
    id: int
    order_id: Optional[int]
    channel_id: int
    channel_name: str
    platform_order_id: str
    platform_buyer_name: Optional[str]
    platform_url: Optional[str]
    sync_status: str
    created_at: str

class PlatformOrderCreate(BaseModel):
    channel_name: str
    platform_order_id: str
    platform_buyer_id: Optional[str] = None
    platform_buyer_name: Optional[str] = None
    platform_url: Optional[str] = None
    service_type: str
    package_tier: str = "basic"
    price_cents: int
    notes: str = ""

class ChannelStatsResponse(BaseModel):
    channel_name: str
    display_name: str
    total_orders: int
    total_revenue_cents: int
    pending_sync: int

# ── Channel CRUD ──
@router.get("", response_model=List[ChannelResponse])
def list_channels(db: Session = Depends(get_db), admin=Depends(require_admin)):
    channels = db.query(Channel).all()
    return [ChannelResponse(id=c.id, name=c.name, display_name=c.display_name, is_active=c.is_active, created_at=str(c.created_at)) for c in channels]

@router.post("", response_model=ChannelResponse)
def create_channel(req: ChannelCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    existing = db.query(Channel).filter(Channel.name == req.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Channel already exists")
    channel = Channel(name=req.name, display_name=req.display_name, config_json=json.dumps(req.config))
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return ChannelResponse(id=channel.id, name=channel.name, display_name=channel.display_name, is_active=channel.is_active, created_at=str(channel.created_at))

@router.patch("/{channel_id}")
def update_channel(channel_id: int, is_active: bool = None, config: dict = None, db: Session = Depends(get_db), admin=Depends(require_admin)):
    channel = db.query(Channel).filter(Channel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    if is_active is not None:
        channel.is_active = is_active
    if config is not None:
        channel.config_json = json.dumps(config)
    db.commit()
    return {"message": "Channel updated"}

# ── Platform Orders ──
@router.get("/platform-orders", response_model=List[PlatformOrderResponse])
def list_platform_orders(channel_name: str = None, sync_status: str = None, db: Session = Depends(get_db), admin=Depends(require_admin)):
    query = db.query(PlatformOrder)
    if channel_name:
        channel = db.query(Channel).filter(Channel.name == channel_name).first()
        if channel:
            query = query.filter(PlatformOrder.channel_id == channel.id)
    if sync_status:
        query = query.filter(PlatformOrder.sync_status == sync_status)
    pos = query.order_by(PlatformOrder.created_at.desc()).all()
    return [PlatformOrderResponse(
        id=po.id, order_id=po.order_id, channel_id=po.channel_id,
        channel_name=po.channel.name, platform_order_id=po.platform_order_id,
        platform_buyer_name=po.platform_buyer_name, platform_url=po.platform_url,
        sync_status=po.sync_status, created_at=str(po.created_at)
    ) for po in pos]

@router.post("/platform-orders", response_model=PlatformOrderResponse)
def create_platform_order(req: PlatformOrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a platform order and optionally link to an internal order."""
    channel = db.query(Channel).filter(Channel.name == req.channel_name).first()
    if not channel:
        raise HTTPException(status_code=404, detail=f"Channel '{req.channel_name}' not found")
    
    # Create internal order
    order = Order(
        user_id=current_user.id,
        channel_id=channel.id,
        service_type=req.service_type,
        package_tier=req.package_tier,
        price_cents=req.price_cents,
        notes=req.notes,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Create platform order link
    po = PlatformOrder(
        order_id=order.id,
        channel_id=channel.id,
        platform_order_id=req.platform_order_id,
        platform_buyer_id=req.platform_buyer_id,
        platform_buyer_name=req.platform_buyer_name,
        platform_url=req.platform_url,
        sync_status="synced",
        synced_at=datetime.utcnow(),
    )
    db.add(po)
    db.commit()
    db.refresh(po)
    
    return PlatformOrderResponse(
        id=po.id, order_id=po.order_id, channel_id=po.channel_id,
        channel_name=channel.name, platform_order_id=po.platform_order_id,
        platform_buyer_name=po.platform_buyer_name, platform_url=po.platform_url,
        sync_status=po.sync_status, created_at=str(po.created_at)
    )

@router.get("/stats", response_model=List[ChannelStatsResponse])
def channel_stats(db: Session = Depends(get_db), admin=Depends(require_admin)):
    channels = db.query(Channel).all()
    result = []
    for ch in channels:
        orders = db.query(Order).filter(Order.channel_id == ch.id).all()
        total_revenue = sum(o.price_cents for o in orders if o.status in ("paid", "processing", "review", "delivered"))
        pending = db.query(PlatformOrder).filter(PlatformOrder.channel_id == ch.id, PlatformOrder.sync_status == "pending").count()
        result.append(ChannelStatsResponse(
            channel_name=ch.name,
            display_name=ch.display_name,
            total_orders=len(orders),
            total_revenue_cents=total_revenue,
            pending_sync=pending,
        ))
    return result

# ── LinkedIn helpers ──
LINKEDIN_LEAD_EVENT_KEYWORDS = ("connection", "message", "job", "lead", "inquiry", "applicant", "conversation")


def _get_or_create_linkedin_channel(db: Session) -> Channel:
    channel = db.query(Channel).filter(Channel.name == "linkedin").first()
    if not channel:
        channel = Channel(name="linkedin", display_name="LinkedIn")
        db.add(channel)
        db.commit()
        db.refresh(channel)
    return channel


def _linkedin_lead_data(payload: dict) -> dict:
    merged = dict(payload or {})
    for key in ("data", "lead", "applicant", "sender", "profile", "from", "buyer", "user", "actor"):
        value = payload.get(key) if isinstance(payload, dict) else None
        if isinstance(value, dict):
            merged.update(value)
    # unwrap nested buyer/sender objects if present
    for nested_key in ("buyer", "sender", "applicant", "profile", "from", "user", "actor"):
        nested = merged.get(nested_key)
        if isinstance(nested, dict):
            for k, v in nested.items():
                if k not in merged:
                    merged[k] = v
    return merged


def _first_value(data: dict, keys) -> Optional[object]:
    for key in keys:
        if isinstance(data, dict) and data.get(key) is not None:
            return data.get(key)
    return None


def _is_linkedin_lead_event(event_type: str) -> bool:
    normalized = str(event_type or "").lower().replace("-", "_").replace(" ", "_")
    if normalized in ("unknown", "ping", "verification", "verify", "health", "status"):
        return False
    return any(keyword in normalized for keyword in LINKEDIN_LEAD_EVENT_KEYWORDS)


async def _handle_linkedin_webhook(payload: dict, db: Session) -> dict:
    channel = _get_or_create_linkedin_channel(db)

    event_type = payload.get("event_type", payload.get("type", payload.get("event", "unknown"))) if isinstance(payload, dict) else "unknown"
    if isinstance(event_type, dict):
        event_type = event_type.get("name") or event_type.get("type") or "unknown"
    event_type = str(event_type)

    webhook = ChannelWebhook(
        channel_id=channel.id,
        event_type=event_type,
        payload_json=json.dumps(payload),
    )
    db.add(webhook)
    db.commit()

    created = False
    if _is_linkedin_lead_event(event_type):
        data = _linkedin_lead_data(payload if isinstance(payload, dict) else {})
        platform_order_id = _first_value(data, [
            "lead_id", "application_id", "conversation_id", "message_id",
            "thread_id", "request_id", "inquiry_id", "id", "order_id",
        ])
        if platform_order_id is None:
            platform_order_id = _first_value(payload if isinstance(payload, dict) else {}, ["id", "order_id"])
        if platform_order_id is None:
            platform_order_id = f"linkedin-{webhook.id}"

        buyer_id = _first_value(data, [
            "buyer_id", "sender_id", "applicant_id", "profile_id", "from_id",
            "user_id", "actor_id", "member_id", "id",
        ])
        buyer_name = _first_value(data, [
            "buyer_name", "sender_name", "applicant_name", "profile_name",
            "from_name", "user_name", "actor_name", "name", "full_name",
            "firstName", "first_name",
        ])
        if buyer_name is None:
            first = _first_value(data, ["firstName", "first_name"])
            last = _first_value(data, ["lastName", "last_name"])
            if first or last:
                buyer_name = " ".join(str(x) for x in (first, last) if x)

        url = _first_value(data, [
            "url", "profile_url", "lead_url", "application_url",
            "conversation_url", "message_url", "job_url",
        ])

        po = PlatformOrder(
            channel_id=channel.id,
            platform_order_id=str(platform_order_id),
            platform_buyer_id=str(buyer_id) if buyer_id is not None else None,
            platform_buyer_name=str(buyer_name) if buyer_name is not None else None,
            platform_url=str(url) if url is not None else None,
            sync_status="pending",
        )
        db.add(po)
        db.commit()
        created = True

    return {"status": "received", "channel": "linkedin", "event": event_type, "platform_order_created": created}


# ── Webhooks ──
@router.post("/webhooks/linkedin")
async def linkedin_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    return await _handle_linkedin_webhook(payload, db)


@router.post("/linkedin/webhook")
async def linkedin_webhook_alias(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    return await _handle_linkedin_webhook(payload, db)


@router.post("/webhooks/{channel_name}")
async def channel_webhook(channel_name: str, request: Request, db: Session = Depends(get_db)):
    # LinkedIn has a dedicated handler; delegate so direct calls behave consistently.
    if channel_name == "linkedin":
        payload = await request.json()
        return await _handle_linkedin_webhook(payload, db)

    channel = db.query(Channel).filter(Channel.name == channel_name).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    payload = await request.json()
    event_type = payload.get("event_type", payload.get("type", "unknown"))
    
    webhook = ChannelWebhook(
        channel_id=channel.id,
        event_type=event_type,
        payload_json=json.dumps(payload),
    )
    db.add(webhook)
    db.commit()
    
    # Process webhook based on event type
    if event_type in ("order.created", "order_placed", "new_order"):
        # Auto-create platform order from webhook
        platform_order_id = payload.get("order_id", payload.get("id", "unknown"))
        buyer_name = payload.get("buyer_name", payload.get("buyer", {}).get("name", "Unknown"))
        buyer_id = payload.get("buyer_id", payload.get("buyer", {}).get("id"))
        url = payload.get("order_url", payload.get("url"))
        
        po = PlatformOrder(
            channel_id=channel.id,
            platform_order_id=str(platform_order_id),
            platform_buyer_id=str(buyer_id) if buyer_id else None,
            platform_buyer_name=buyer_name,
            platform_url=url,
            sync_status="pending",
        )
        db.add(po)
        db.commit()
    
    return {"status": "received", "channel": channel_name, "event": event_type}

# Backwards/alternative names for the LinkedIn webhook handler
handle_linkedin_webhook = _handle_linkedin_webhook
linkedin_lead_webhook = linkedin_webhook


@router.get("/webhooks")
def list_webhooks(channel_name: str = None, processed: bool = None, db: Session = Depends(get_db), admin=Depends(require_admin)):
    query = db.query(ChannelWebhook)
    if channel_name:
        channel = db.query(Channel).filter(Channel.name == channel_name).first()
        if channel:
            query = query.filter(ChannelWebhook.channel_id == channel.id)
    if processed is not None:
        query = query.filter(ChannelWebhook.processed == processed)
    webhooks = query.order_by(ChannelWebhook.created_at.desc()).limit(50).all()
    return [{"id": w.id, "channel": w.channel.name, "event_type": w.event_type, "processed": w.processed, "created_at": str(w.created_at)} for w in webhooks]
