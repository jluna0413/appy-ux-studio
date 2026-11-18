"""
Seed script for Appy-UX Studio backend.
Creates an admin user and sample data.
Run: python scripts/seed.py
"""
import sys
sys.path.insert(0, ".")

from app.models.database import SessionLocal, User, Order, Channel, init_db, Product
from app.auth import hash_password

init_db()
db = SessionLocal()

# Create default channels
default_channels = [
    {"name": "fiverr", "display_name": "Fiverr"},
    {"name": "upwork", "display_name": "Upwork"},
    {"name": "freelancer", "display_name": "Freelancer.com"},
    {"name": "peopleperhour", "display_name": "PeoplePerHour"},
    {"name": "guru", "display_name": "Guru"},
    {"name": "linkedin", "display_name": "LinkedIn"},
    {"name": "direct", "display_name": "Direct"},
]
for ch in default_channels:
    existing = db.query(Channel).filter(Channel.name == ch["name"]).first()
    if not existing:
        channel = Channel(name=ch["name"], display_name=ch["display_name"])
        db.add(channel)
        print(f"Created channel: {ch['display_name']}")
db.commit()

# Create admin user
admin = db.query(User).filter(User.email == "admin@appyux.studio").first()
if not admin:
    admin = User(
        email="admin@appyux.studio",
        name="Admin",
        password_hash=hash_password("admin123"),
        role="admin",
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Created admin user: {admin.email} (id={admin.id})")
else:
    print(f"Admin user already exists: {admin.email}")

# Create test client
client = db.query(User).filter(User.email == "client@test.com").first()
if not client:
    client = User(
        email="client@test.com",
        name="Test Client",
        password_hash=hash_password("client123"),
        role="client",
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    print(f"Created client user: {client.email} (id={client.id})")
else:
    print(f"Client user already exists: {client.email}")

# Create default channels
default_channels = [
    {"name": "fiverr", "display_name": "Fiverr"},
    {"name": "upwork", "display_name": "Upwork"},
    {"name": "freelancer", "display_name": "Freelancer.com"},
    {"name": "peopleperhour", "display_name": "PeoplePerHour"},
    {"name": "guru", "display_name": "Guru"},
    {"name": "linkedin", "display_name": "LinkedIn"},
    {"name": "direct", "display_name": "Direct"},
]
for ch in default_channels:
    existing = db.query(Channel).filter(Channel.name == ch["name"]).first()
    if not existing:
        channel = Channel(name=ch["name"], display_name=ch["display_name"])
        db.add(channel)
        print(f"Created channel: {ch['display_name']}")
db.commit()

# Create sample shop products
from app.models.database import Product
sample_products = [
    {"title": "Vintage Portrait Restoration", "description": "Beautifully restored 1920s portrait - royalty free", "category": "image", "subcategory": "restored", "price_cents": 999, "tags": '["vintage", "portrait", "restored"]'},
    {"title": "Lo-Fi Ambient Music Pack", "description": "10 royalty-free ambient tracks for videos", "category": "music", "subcategory": "ambient", "price_cents": 1499, "tags": '["ambient", "lofi", "music", "pack"]'},
    {"title": "Game Texture Pack - Stone", "description": "20 high-res stone textures for game dev", "category": "game_asset", "subcategory": "texture", "price_cents": 1999, "tags": '["texture", "game", "stone", "pbr"]'},
    {"title": "Social Media Video Template", "description": "Vertical video template for Instagram/TikTok", "category": "video", "subcategory": "template", "price_cents": 799, "tags": '["video", "template", "social", "vertical"]'},
    {"title": "Colorized Historical Photo", "description": "AI-colorized 1940s street scene", "category": "image", "subcategory": "colorized", "price_cents": 599, "tags": '["colorized", "historical", "photo"]'},
]
for p in sample_products:
    existing = db.query(Product).filter(Product.title == p["title"]).first()
    if not existing:
        product = Product(**p)
        db.add(product)
        print(f"Created product: {p['title']}")
db.commit()

print("Seed complete.")
print("Admin login: admin@appyux.studio / admin123")
print("Client login: client@test.com / client123")
