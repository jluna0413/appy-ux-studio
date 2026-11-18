# AMD Migration Plan & System Architecture — EVO-X2

**Date:** 2026-11-15
**Source:** Intel Arc B70 (XPU) workstation — `E:\AI Playground\resources\ComfyUI\`
**Target:** GMKtec EVO-X2 (64GB RAM, 1TB SSD, AMD) — OS TBD on arrival
**Purpose:** Complete migration plan, risk analysis, and system architecture for agency backend

---

## PART 1: AMD Migration — Risk Analysis & Plan

### 1.1 Current Environment (Arc B70 / XPU)

| Component | Detail |
|-----------|--------|
| **GPU** | Intel Arc B70 (XPU) |
| **RAM** | 64GB+ (unified) |
| **Backend** | Intel XPU via `comfyui-xpu-guard`, `comfyui-xpu-cache-clean`, `ComfyUI-AIMDO-XPU`, `ComfyUI-OmniXPU` |
| **PyTorch** | XPU build (Intel Extension for PyTorch) |
| **ComfyUI** | `E:\AI Playground\resources\ComfyUI\` |
| **Models** | ~180+ GB across 40+ model directories |
| **Custom Nodes** | 40+ installed |
| **Workflows** | 20+ saved workflows |

### 1.2 Target Environment (EVO-X2)

| Component | Detail |
|-----------|--------|
| **CPU/GPU** | AMD APU (integrated GPU) — exact model TBD on arrival |
| **RAM** | 64GB unified memory |
| **Storage** | 1TB SSD |
| **OS** | **TBD** — Windows expected, Linux planned (dual-boot or migration) |
| **Backend** | If Windows: DirectML or Vulkan; If Linux: ROCm |

### 1.3 Migration Risks

#### Risk 1: XPU-Specific Custom Nodes (HIGH)
These nodes are Intel XPU-specific and will NOT work on AMD:

| Node | Directory | Function | AMD Equivalent Needed |
|------|-----------|----------|----------------------|
| ComfyUI-AIMDO-XPU | `custom_nodes/ComfyUI-AIMDO-XPU/` | XPU optimization | DirectML/Vulkan optimization or remove |
| ComfyUI-OmniXPU | `custom_nodes/ComfyUI-OmniXPU/` | XPU optimization | DirectML/Vulkan optimization or remove |
| ComfyUI-XPU-CacheClean | `custom_nodes/ComfyUI-XPU-CacheClean/` | Cache cleaning (XPU) | Generic cache cleaner or remove |
| comfyui-xpu-guard | `custom_nodes/comfyui-xpu-guard/` | XPU guard (prevents OOM) | AMD memory management or remove |
| ComfyUI-XPUSYS-Monitor | `custom_nodes/ComfyUI-XPUSYS-Monitor/` | System monitoring (XPU) | Generic monitor or remove |
| hqh-xpu | `custom_nodes/hqh-xpu/` | XPU utilities | AMD-specific utilities or remove |
| aipg-auth | `custom_nodes/aipg-auth/` | AI Playground auth (XPU) | May need AMD-compatible auth |

**Mitigation:** These are optimization/monitoring nodes, not core functionality. Removing them won't break workflows — they just won't have XPU-specific optimizations. On AMD, use DirectML/Vulkan/ROCm equivalents or rely on ComfyUI's built-in memory management.

#### Risk 2: Model Compatibility (MEDIUM)
- **GFPGAN/basicsr/facexlib/realesrgan** are PyTorch-based and should work on AMD via DirectML/ROCm
- **Diffusion models** (SDXL, FLUX, Qwen, Wan, etc.) are standard PyTorch and should work on AMD
- **GGUF models** (Boogu, etc.) use llama.cpp-style loading — should work on AMD
- **XPU-optimized models** (convrot, int8_convrot variants) may have XPU-specific quantization that doesn't work on AMD
- **SeedVR2** (diffusion-based upscaler) — needs validation on AMD

**Mitigation:** Test each model on EVO-X2. Keep fallback to CPU inference. Have non-quantized (fp16/bf16) versions available as fallback.

#### Risk 3: Custom Node Compatibility (MEDIUM)
- Most custom nodes are Python-based and should work on AMD
- Nodes with CUDA-specific code (e.g., `torch.cuda`) will fail on AMD
- Nodes with XPU-specific imports will fail

**Mitigation:** Audit each custom node for CUDA/XPU-specific code. Replace or patch as needed. ComfyUI-Manager can help identify incompatible nodes.

#### Risk 4: Performance (LOW-MEDIUM)
- AMD integrated GPU (APU) is likely less powerful than Arc B70 for inference
- 64GB unified memory helps but GPU compute may be slower
- Need to benchmark and set realistic SLAs

**Mitigation:** Benchmark on arrival. Use quantized models (int4/int8) for speed. Consider CPU+GPU hybrid inference.

#### Risk 5: Storage (LOW)
- Models total ~180+ GB, target has 1TB SSD
- Need to be selective about which models to migrate
- Some models may be redundant (multiple quantization levels of same model)

**Mitigation:** Audit and deduplicate models. Keep only the best-performing version of each model. Estimated need: ~100-120 GB for essential models.

### 1.4 Migration Process (Step-by-Step)

#### Phase 1: Pre-Migration (on current machine, BEFORE EVO-X2 arrives)
1. **Download missing models** (GFPGAN weights, DDColor, inpaint, LivePortrait, rembg)
2. **Install missing custom nodes** (ComfyUI-DDColor, ComfyUI-GFPGAN, ComfyUI-LivePortrait)
3. **Test all workflows** on current machine — document which work
4. **Create workflow templates** for each agency service
5. **Document VRAM requirements** per workflow
6. **Audit models** — identify redundant/duplicate models, keep only essentials
7. **Create migration manifest** — list of all files to copy

#### Phase 2: EVO-X2 Arrival
1. **Record hardware specs** (CPU, GPU, RAM, storage, OS)
2. **Install OS** (Windows or Linux per user decision)
3. **Install AMD drivers** (Adrenalin for Windows, ROCm for Linux)
4. **Install Python + PyTorch** (AMD-compatible build)
5. **Install ComfyUI** from scratch (or copy from backup)
6. **Copy models** (via robocopy/rsync from backup drive)
7. **Copy custom nodes** (via robocopy/rsync)
8. **Copy workflows** (via robocopy/rsync)
9. **Configure extra_model_paths.yaml**

#### Phase 3: Validation
1. **Start ComfyUI** on EVO-X2
2. **Test each workflow** — document pass/fail
3. **Benchmark performance** — time per operation
4. **Fix incompatible nodes** — patch or replace
5. **Update workflows** for AMD (remove XPU-specific nodes)
6. **Set SLAs** based on benchmark results

#### Phase 4: Optimization
1. **Install AMD-specific optimizations** (DirectML, Vulkan, ROCm)
2. **Test quantized models** (int4/int8) for speed
3. **Configure memory management** (AMD-specific)
4. **Set up monitoring** (GPU usage, VRAM, temperature)
5. **Document final configuration**

---

## PART 2: System Architecture — Admin & Client Backends

### 2.1 Overview

The agency needs a complete system for:
- **Admin backend:** Manage orders, assets, workflows, clients, payments
- **Client backend:** Place orders, upload assets, monitor progress, receive deliverables
- **Payment system:** Process payments, track revenue, manage refunds
- **Asset pipeline:** Upload → Process → Deliver

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Landing Page │  │ Order Form   │  │ Progress Tracker │    │
│  │ (Showcase)   │  │ (Upload)     │  │ (Status/Download)│    │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘    │
└─────────┼────────────────┼───────────────────┼──────────────┘
          │                │                   │
          ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (FastAPI/Flask)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Auth     │  │ Orders   │  │ Assets   │  │ Payments │    │
│  │ (JWT)    │  │ (CRUD)   │  │ (Upload) │  │ (Stripe) │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────┬────────────┬────────────┬────────────┬────────────┘
          │            │            │            │
          ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite/PostgreSQL)              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────┐  │
│  │ Users  │  │ Orders │  │ Assets │  │ Jobs   │  │ Payments│ │
│  └────────┘  └────────┘  └────────┘  └────────┘  └──────┘  │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    WORKER QUEUE (Celery/RQ)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Job Processor → ComfyUI API → Asset Delivery         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMFYUI (Local)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Restore  │  │ Colorize │  │ Upscale  │  │ Animate  │    │
│  │ Workflow │  │ Workflow │  │ Workflow │  │ Workflow │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'client',  -- client, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_type VARCHAR(50) NOT NULL,  -- restore, colorize, enhance, upscale, animate, bundle, 3d, music, video
    package_tier VARCHAR(50),  -- basic, standard, premium
    status VARCHAR(50) DEFAULT 'pending',  -- pending, paid, processing, review, delivered, cancelled
    price_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    inputs_approved BOOLEAN DEFAULT FALSE,
    revision_count INTEGER DEFAULT 0,
    max_revisions INTEGER DEFAULT 1,
    turnaround_hours INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP
);
```

#### Assets Table
```sql
CREATE TABLE assets (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),  -- image, video, audio, 3d, archive
    file_size_bytes INTEGER,
    storage_path VARCHAR(500) NOT NULL,
    asset_role VARCHAR(50),  -- input, output, preview, source
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Jobs Table
```sql
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    workflow_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'queued',  -- queued, running, completed, failed
    progress_pct INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    comfyui_prompt_id VARCHAR(100),
    settings_json TEXT  -- JSON of workflow parameters
);
```

#### Payments Table
```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    stripe_payment_intent_id VARCHAR(100),
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',  -- pending, succeeded, failed, refunded
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Revisions Table
```sql
CREATE TABLE revisions (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    revision_number INTEGER NOT NULL,
    feedback TEXT,
    status VARCHAR(50) DEFAULT 'requested',  -- requested, in_progress, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

### 2.4 API Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh JWT token |

#### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | List user's orders |
| GET | `/api/orders/:id` | Get order details |
| PATCH | `/api/orders/:id` | Update order (admin) |
| DELETE | `/api/orders/:id` | Cancel order |

#### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/:id/assets` | Upload input asset |
| GET | `/api/orders/:id/assets` | List order assets |
| GET | `/api/assets/:id/download` | Download asset |
| DELETE | `/api/assets/:id` | Delete asset |

#### Jobs (Processing)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/:id/jobs` | List jobs for order |
| GET | `/api/jobs/:id` | Get job status/progress |
| POST | `/api/jobs/:id/retry` | Retry failed job (admin) |

#### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-intent` | Create Stripe payment intent |
| POST | `/api/payments/webhook` | Stripe webhook handler |
| GET | `/api/payments/:id` | Get payment status |

#### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | List all orders |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/stats` | Dashboard stats |
| POST | `/api/admin/orders/:id/approve` | Approve order for processing |
| POST | `/api/admin/orders/:id/deliver` | Mark as delivered |

---

## PART 3: Asset Upload & Delivery Pipeline

### 3.1 Upload Flow
```
Client uploads file(s)
    ↓
Validate file type/size
    ↓
Store in /uploads/{order_id}/input/
    ↓
Create asset record in DB
    ↓
Notify admin (email/dashboard)
    ↓
Admin reviews & approves
    ↓
Job queued for processing
```

### 3.2 Processing Flow
```
Job queued
    ↓
Worker picks up job
    ↓
Load workflow template
    ↓
Send image to ComfyUI API (localhost:8188)
    ↓
ComfyUI processes (restore/colorize/enhance/upscale/animate)
    ↓
Poll for completion
    ↓
Download result from ComfyUI output
    ↓
Store in /uploads/{order_id}/output/
    ↓
Create asset record
    ↓
Notify client (email/dashboard)
    ↓
Status → "review"
```

### 3.3 Delivery Flow
```
Client reviews preview
    ↓
Client requests revisions (if within limit)
    ↓  OR
Client approves
    ↓
Final files packaged (ZIP)
    ↓
Stored in /uploads/{order_id}/delivery/
    ↓
Download link sent to client
    ↓
Status → "delivered"
```

### 3.4 File Storage Structure
```
/uploads/
├── {order_id}/
│   ├── input/          # Client-uploaded source files
│   │   └── photo.jpg
│   ├── output/         # ComfyUI processed results
│   │   └── photo_restored.png
│   ├── preview/        # Watermarked previews for review
│   │   └── photo_preview.jpg
│   └── delivery/       # Final packaged deliverables
│       └── order_123_deliverables.zip
```

---

## PART 4: Payment System

### 4.1 Payment Flow
```
Client selects package
    ↓
Order created (status: pending)
    ↓
Stripe Payment Intent created
    ↓
Client pays via Stripe Checkout
    ↓
Webhook: payment.succeeded
    ↓
Order status → "paid"
    ↓
Admin notified → reviews inputs
    ↓
Admin approves → Job queued
    ↓
Processing → Review → Delivery
```

### 4.2 Payment Integration (Stripe)
- **Stripe Checkout** for one-time payments
- **Webhook** for payment confirmation
- **Refund API** for cancellations
- **Invoice generation** for records

### 4.3 Pricing Model
| Service | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Image Restoration | $29/img | $49/img (3-pack) | $99/img (bundle) |
| Colorizing | $25/img | $40/img (3-pack) | $75/img (bundle) |
| Enhancement | $20/img | $35/img (3-pack) | $60/img (bundle) |
| Upscaling | $15/img | $25/img (3-pack) | $45/img (bundle) |
| Image Animation | $39/clip | $69/clip (3-pack) | $129/clip (bundle) |
| Memory Revival Bundle | $79/img | $149/img (3-pack) | $299/img (bundle) |
| Short-form Video | $119-179 | $179-249 | $249-349 |
| Long-form Video | $199+ | $299+ (2K) | $399+ (4K) |
| Music/Sound | $39-179 | $99-249 | $179-349 |
| Game Assets | $39-149 | $99-249 | $199-399 |

### 4.4 Revenue Tracking
- Dashboard: total revenue, orders by service, revenue by period
- Export: CSV/PDF reports
- Tax: Track by jurisdiction (future)

---

## PART 5: Admin Dashboard Features

### 5.1 Order Management
- View all orders (filter by status, service, date)
- Approve/reject orders
- Assign to processing queue
- Track revision requests
- Mark as delivered

### 5.2 Asset Management
- View uploaded files per order
- Download input/output files
- Manage storage (cleanup old files)
- Watermark previews for client review

### 5.3 Job Monitoring
- Real-time job status (queued/running/completed/failed)
- Progress percentage per job
- Error logs and retry functionality
- ComfyUI queue status

### 5.4 Client Management
- View all clients
- Order history per client
- Communication log
- Notes/flags

### 5.5 Analytics
- Revenue dashboard
- Orders by service type
- Average turnaround time
- Revision rate
- Client satisfaction (future)

---

## PART 6: Client Portal Features

### 6.1 Order Placement
- Browse services and packages
- Select package tier
- Upload source files
- Add notes/instructions
- Checkout via Stripe

### 6.2 Order Tracking
- Real-time status updates
- Progress bar (queued → processing → review → delivered)
- Estimated completion time
- Email notifications at each stage

### 6.3 Review & Revision
- Preview watermarked results
- Request revisions (within limit)
- Approve final delivery
- Download final files (ZIP)

### 6.4 Account Management
- View order history
- Manage profile
- Download past deliverables
- Re-order previous services

---

## PART 7: Technology Stack Recommendation

### Backend
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| API Framework | FastAPI (Python) | Async, fast, auto-docs, Python ecosystem |
| Database | SQLite (dev) → PostgreSQL (prod) | Simple start, scalable |
| Auth | JWT (python-jose) | Stateless, standard |
| File Storage | Local filesystem → S3/MinIO (prod) | Simple start, scalable |
| Task Queue | Celery + Redis (or RQ) | Async job processing |
| Payments | Stripe | Industry standard, easy integration |

### Frontend
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Landing Page | Static HTML/CSS/JS (current mockup) | Fast, no framework needed |
| Client Portal | React or Vue (SPA) | Interactive, modern |
| Admin Dashboard | React Admin or similar | Rapid admin UI |
| File Upload | Uppy or Dropzone.js | Reliable upload UX |

### ComfyUI Integration
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| API Client | Python requests/aiohttp | ComfyUI has REST API |
| Workflow Templates | JSON files | ComfyUI native format |
| Job Polling | Celery worker | Async, reliable |
| Result Download | ComfyUI output directory | Local file access |

---

## PART 8: Implementation Priority

### Phase 1: MVP (Weeks 1-2)
- [ ] FastAPI backend with auth, orders, assets endpoints
- [ ] SQLite database with schema
- [ ] Stripe payment integration
- [ ] File upload/download
- [ ] ComfyUI API integration (single workflow)
- [ ] Basic admin dashboard
- [ ] Basic client portal

### Phase 2: Core Features (Weeks 3-4)
- [ ] Multiple workflow support (restore, colorize, enhance, upscale, animate)
- [ ] Job queue with progress tracking
- [ ] Watermarked previews
- [ ] Revision system
- [ ] Email notifications
- [ ] Admin analytics

### Phase 3: Polish (Weeks 5-6)
- [ ] Real-time progress (WebSocket)
- [ ] Advanced admin features
- [ ] Client account management
- [ ] Automated delivery packaging
- [ ] Performance optimization
- [ ] Testing & QA

### Phase 4: Scale (Weeks 7-8)
- [ ] PostgreSQL migration
- [ ] S3/MinIO storage
- [ ] Multi-worker support
- [ ] Advanced analytics
- [ ] API documentation
- [ ] Deployment (Docker, etc.)

---

## PART 9: File Structure (Proposed)

```
appy-ux-studio/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # DB models (SQLAlchemy)
│   │   ├── auth.py              # JWT auth
│   │   ├── models/              # DB models
│   │   │   ├── user.py
│   │   │   ├── order.py
│   │   │   ├── asset.py
│   │   │   ├── job.py
│   │   │   └── payment.py
│   │   ├── routers/             # API routes
│   │   │   ├── auth.py
│   │   │   ├── orders.py
│   │   │   ├── assets.py
│   │   │   ├── jobs.py
│   │   │   ├── payments.py
│   │   │   └── admin.py
│   │   ├── services/            # Business logic
│   │   │   ├── comfyui.py       # ComfyUI API client
│   │   │   ├── storage.py       # File storage
│   │   │   ├── payments.py      # Stripe integration
│   │   │   └── notifications.py # Email notifications
│   │   └── workflows/           # ComfyUI workflow templates
│   │       ├── restore.json
│   │       ├── colorize.json
│   │       ├── enhance.json
│   │       ├── upscale.json
│   │       └── animate.json
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── landing/                 # Static landing page (current mockup)
│   ├── client-portal/           # React SPA
│   └── admin-dashboard/         # React Admin
├── uploads/                     # File storage
├── scripts/
│   ├── migrate_comfyui.py       # Migration script
│   └── seed_data.py             # Seed database
└── docs/
    ├── API.md                   # API documentation
    └── DEPLOYMENT.md            # Deployment guide
```

---

## PART 10: Next Steps

1. **Document complete** ✅ (this file)
2. **Download missing models/nodes** — proceed when ComfyUI is not running
3. **Create workflow templates** — for each agency service
4. **Build backend MVP** — FastAPI + SQLite + Stripe
5. **Build client portal** — React SPA
6. **Build admin dashboard** — React Admin
7. **Test end-to-end** — order → payment → processing → delivery
8. **Deploy** — local first, then cloud

---

## Notes
- ComfyUI is currently running a generation — all exploration was read-only
- No processes were started, stopped, or modified
- All findings are from filesystem exploration only
- Testing will begin when GPU frees up
- Migration to EVO-X2 will happen after EVO-X2 arrives and OS is confirmed
