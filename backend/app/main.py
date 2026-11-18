from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from datetime import datetime

from app.config import settings, UPLOADS_DIR
from app.models.database import init_db
from app.routers import auth, orders, assets, jobs, payments, admin, channels, shop, inquiries

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
UPLOADS_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(assets.router)
app.include_router(jobs.router)
app.include_router(payments.router)
app.include_router(admin.router)
app.include_router(channels.router)
app.include_router(shop.router)
app.include_router(inquiries.router)

@app.on_event("startup")
def startup():
    init_db()
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} started")
    print(f"📊 Database: {settings.DATABASE_URL}")
    print(f"🎨 ComfyUI: {settings.COMFYUI_URL}")
    print(f"💳 PayPal: {settings.PAYPAL_MODE} mode")

@app.get("/")
def root():
    return {"name": settings.APP_NAME, "version": settings.APP_VERSION, "docs": "/docs", "health": "/health"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "name": settings.APP_NAME,
        "version": "0.1.0",
        "timestamp": datetime.utcnow().isoformat(),
    }
