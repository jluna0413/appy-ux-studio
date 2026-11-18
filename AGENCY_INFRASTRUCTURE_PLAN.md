# Agency Infrastructure & Multi-Project Management Plan

**Date:** 2026-11-16
**Status:** PLANNING PHASE — Must be established before taking on clients
**Target Hardware:** GMKtec EVO-X2 (64GB RAM, 1TB SSD, AMD APU)
**OS:** TBD (Windows expected, Linux planned)

---

## 1. Problem Statement

The agency will manage multiple concurrent projects across:
- **Multiple clients** (each with potentially multiple projects)
- **Multiple channels** (Fiverr, Upwork, Freelancer, PeoplePerHour, Guru, Direct)
- **Multiple project types** (custom agency work, shop products, internal tools, personal projects)
- **Multiple environments** (development, staging, production)

Without a structured system, we risk:
- Port conflicts between projects
- Data leakage between clients
- Git history pollution
- Credential exposure
- No rollback capability
- No audit trail

---

## 2. Port Management System

### 2.1 Port Allocation Strategy

**Principle: Every service gets a deterministic, documented port. No ad-hoc assignment.**

#### Port Ranges

| Range | Purpose | Count |
|-------|---------|-------|
| 3000–3099 | Frontend dev servers (Vite/React) | 100 |
| 4000–4099 | Frontend production (nginx/serve) | 100 |
| 5000–5099 | Backend APIs (FastAPI/Flask) | 100 |
| 6000–6099 | Admin dashboards | 100 |
| 7000–7099 | Shop/storefronts | 100 |
| 8000–8099 | Internal tools & services | 100 |
| 9000–9099 | Database & infrastructure | 100 |
| 10000–10099 | ComfyUI & AI services | 100 |

#### Port Registry (Single Source of Truth)

Create `PORT_REGISTRY.md` in the agency root:

```markdown
# Port Registry — Appy-UX Studio

## Core Services (Always Running)
| Port | Service | Project | Owner |
|------|---------|---------|-------|
| 8000 | Backend API (legacy) | — | — |
| 8002 | Backend API (Appy-UX) | appy-ux-studio | agency |
| 8188 | ComfyUI (Intel Arc) | comfyui | agency |
| 9000 | PostgreSQL | db-primary | infra |
| 9001 | Redis | cache-primary | infra |

## Frontend Dev Servers
| Port | Service | Project | Owner |
|------|---------|---------|-------|
| 5180 | Client Portal (dev) | appy-ux-studio | agency |
| 5181 | Admin Dashboard (dev) | appy-ux-studio | agency |

## Project-Specific Ports (Allocated per project)
| Port | Service | Project | Client | Allocated |
|------|---------|---------|--------|-----------|
| 5200 | Client Portal | client-alpha | alpha-corp | 2026-11-20 |
| 5201 | Admin Dashboard | client-alpha | alpha-corp | 2026-11-20 |
| 5202 | Backend API | client-alpha | alpha-corp | 2026-11-20 |
```

#### Port Allocation Rules

1. **Never use default ports** (3000, 5173, 8000, 8080) — they conflict
2. **Each project gets a block of 3 consecutive ports**: frontend, admin, backend
3. **Port blocks start at 5200** and increment by 10 per project
4. **Register every port** in `PORT_REGISTRY.md` before use
5. **Use `strictPort: true`** in Vite config to fail fast on conflicts
6. **Environment variable override**: `PORT` env var can override for CI/CD

#### Port Conflict Detection

```bash
# Check if a port is in use
netstat -ano | findstr :PORT

# Or use a script
python -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = s.connect_ex(('localhost', PORT))
s.close()
print('IN USE' if result == 0 else 'FREE')
"
```

### 2.2 Port Gating (Access Control)

**Problem:** How do we prevent clients from accessing each other's services?

**Solution: Reverse proxy with path-based routing**

Instead of exposing ports directly, use a single reverse proxy (nginx or Caddy) on port 80/443:

```
https://appyux.studio/                    → Landing page
https://appyux.studio/portal               → Client portal (port 5180)
https://appyux.studio/admin                → Admin dashboard (port 5181)
https://appyux.studio/api                  → Backend API (port 8002)
https://appyux.studio/shop                 → Shop (port 7000)

https://client-alpha.appyux.studio/        → Client Alpha portal (port 5200)
https://client-alpha.appyux.studio/admin   → Client Alpha admin (port 5201)
https://client-alpha.appyux.studio/api     → Client Alpha API (port 5202)
```

**Benefits:**
- Single entry point (port 80/443)
- SSL termination at proxy
- Path-based routing
- No port exposure to clients
- Easy to add/remove projects

---

## 3. Git & Version Control Strategy

### 3.1 Repository Structure

**Decision: Polyrepo (one repo per project/client) + one agency monorepo**

```
github.com/appy-ux/
├── agency-core/                    # Agency internal tools & templates
│   ├── backend/                    # Shared backend boilerplate
│   ├── frontend/                   # Shared frontend boilerplate
│   ├── templates/                  # Reusable templates
│   ├── boilerplates/               # Service boilerplates
│   └── docs/                       # Agency documentation
│
├── appy-ux-studio/                 # Main agency website + portal
│   ├── backend/                    # Agency backend (FastAPI)
│   ├── client-portal/              # Client portal (React)
│   ├── admin-dashboard/            # Admin dashboard (React)
│   ├── mockups/                    # Landing page + shop
│   └── docs/                       # Project docs
│
├── client-alpha/                   # Client Alpha's project
│   ├── backend/
│   ├── frontend/
│   └── docs/
│
├── client-beta/                    # Client Beta's project
│   └── ...
│
└── personal-projects/              # Owner's personal projects
    ├── project-x/
    └── project-y/
```

### 3.2 Branching Strategy

**Git Flow (simplified for small agency):**

```
main (production)
├── develop (staging)
│   ├── feature/channel-integration
│   ├── feature/shop-ecommerce
│   └── feature/client-alpha-onboarding
├── hotfix/critical-bug-fix
└── release/v1.2.0
```

**Branch Naming Convention:**
- `feature/<description>` — new features
- `fix/<description>` — bug fixes
- `hotfix/<description>` — critical production fixes
- `release/<version>` — release preparation
- `client/<client-id>/<description>` — client-specific work

### 3.3 Client Project Isolation in Git

1. **Each client gets their own repository** — no shared git history
2. **Agency core repo** contains shared templates/boilerplates (read-only for clients)
3. **Client repos** are created from agency templates (fork or template)
4. **No cross-client commits** — enforced by repository boundaries
5. **Agency owns all repos** — clients get read access only (or none)

### 3.4 Commit & PR Standards

- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **PR required** for all changes to `main` and `develop`
- **Code review** by agency owner or senior dev
- **CI checks** must pass before merge
- **No direct pushes** to `main`

---

## 4. Project Isolation Model

### 4.1 Isolation Levels

| Level | Scope | Isolation Method |
|-------|-------|-----------------|
| **L0: Agency Core** | Shared tools, templates, boilerplates | Single repo, read-only for clients |
| **L1: Agency Projects** | Internal agency work (website, portal, shop) | Separate repo, agency-only access |
| **L2: Client Projects** | Client-specific deliverables | Separate repo per client, agency-owned |
| **L3: Personal Projects** | Owner's personal work | Separate repo, owner-only access |

### 4.2 Filesystem Isolation

```
/opt/agency/                          # or D:\ on Windows
├── core/                            # Agency core (templates, tools)
│   ├── templates/
│   ├── boilerplates/
│   └── scripts/
│
├── projects/
│   ├── agency/
│   │   ├── appy-ux-studio/          # Main agency project
│   │   └── internal-tools/
│   │
│   ├── clients/
│   │   ├── client-alpha/
│   │   │   ├── src/
│   │   │   ├── data/
│   │   │   └── .env                 # Client-specific config
│   │   └── client-beta/
│   │
│   └── personal/
│       ├── project-x/
│       └── project-y/
│
├── data/
│   ├── databases/
│   │   ├── agency.db                # Agency database
│   │   ├── client-alpha.db          # Client Alpha database
│   │   └── client-beta.db           # Client Beta database
│   │
│   ├── uploads/
│   │   ├── agency/
│   │   ├── client-alpha/
│   │   └── client-beta/
│   │
│   └── backups/
│       ├── daily/
│       ├── weekly/
│       └── monthly/
│
├── config/
│   ├── nginx.conf                   # Reverse proxy config
│   ├── ports.registry               # Port allocation
│   └── credentials/                 # Encrypted credential store
│       ├── agency.enc
│       ├── client-alpha.enc
│       └── client-beta.enc
│
└── logs/
    ├── agency/
    ├── client-alpha/
    └── client-beta/
```

### 4.3 Database Isolation

**Strategy: One database per client (schema-level isolation)**

- **Agency DB**: `appyux_agency.db` — agency orders, users, channels, products
- **Client Alpha DB**: `client_alpha.db` — client's project data
- **Client Beta DB**: `client_beta.db` — client's project data

**Why not row-level tenancy?**
- Simpler backup/restore per client
- No risk of cross-client data leakage
- Easy to export client data on contract end
- Better performance isolation

**Connection string pattern:**
```
sqlite:///data/databases/{project_id}.db
```

### 4.4 Credential Isolation

- **Never store credentials in git** — use `.env` files (gitignored)
- **Encrypted credential store** per project: `config/credentials/{project}.enc`
- **Environment variables** for runtime secrets
- **Per-project API keys** for external services (PayPal, Stripe, etc.)
- **Rotation schedule**: Rotate all credentials quarterly

---

## 5. Multi-Tenant Architecture (For SaaS Scaling)

### 5.1 Tenant Model

```
Tenant (Client)
├── Users (client's team members)
├── Projects (work items)
├── Channels (where orders come from)
├── Assets (files, deliverables)
├── Billing (invoices, payments)
└── Settings (branding, preferences)
```

### 5.2 Tenant Context Propagation

Every request must carry tenant context:

```
Request → JWT (contains tenant_id) → Middleware extracts tenant_id → 
  → All DB queries filtered by tenant_id → 
  → All file operations scoped to tenant directory →
  → All logs tagged with tenant_id
```

### 5.3 Isolation Enforcement

1. **Database-level**: Each tenant has their own database file (SQLite) or schema (PostgreSQL)
2. **Filesystem-level**: Each tenant has their own upload directory
3. **API-level**: Middleware validates tenant_id on every request
4. **Log-level**: All logs tagged with tenant_id for audit
5. **Test-level**: CI tests attempt cross-tenant access and assert failure

---

## 6. Channel Management

### 6.1 Channel Architecture

```
Channel (Fiverr, Upwork, etc.)
├── Webhook Receiver (per channel)
├── Order Sync (platform → internal)
├── Status Sync (internal → platform)
└── Credential Store (per channel, encrypted)
```

### 6.2 Multi-Channel Order Flow

```
Platform Order Created
  → Webhook received at /api/channels/webhooks/{channel}
  → PlatformOrder created (sync_status: pending)
  → Internal Order created (linked to PlatformOrder)
  → Admin notified
  → Work begins
  → Deliverable uploaded
  → Platform order marked complete (sync_status: synced)
  → Client notified on platform
```

### 6.3 Channel Isolation

- Each channel has its own webhook endpoint
- Each channel has its own credential set (API keys, webhook secrets)
- Platform orders are linked to internal orders via `platform_orders` table
- Channel stats tracked separately per channel

---

## 7. Security & Access Control

### 7.1 Role-Based Access Control (RBAC)

| Role | Scope | Permissions |
|------|-------|-------------|
| **Owner** | Everything | Full access, credential management, billing |
| **Admin** | Agency operations | Order management, user management, shop management |
| **Client** | Own projects only | View orders, upload files, request revisions |
| **Viewer** | Read-only | View deliverables, download files |

### 7.2 Access Matrix

| Resource | Owner | Admin | Client | Viewer |
|----------|-------|-------|--------|--------|
| Agency settings | ✅ | ❌ | ❌ | ❌ |
| All client orders | ✅ | ✅ | ❌ | ❌ |
| Own client orders | ✅ | ✅ | ✅ | ✅ |
| Shop products | ✅ | ✅ | ✅ | ✅ |
| Shop admin | ✅ | ✅ | ❌ | ❌ |
| Credentials | ✅ | ❌ | ❌ | ❌ |
| Channel config | ✅ | ✅ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ | ❌ |

### 7.3 Security Checklist

- [ ] All API endpoints require authentication (except public shop browsing)
- [ ] JWT tokens expire after 24 hours
- [ ] Refresh tokens stored in httpOnly cookies
- [ ] All passwords hashed with bcrypt (cost factor 12)
- [ ] API rate limiting (100 req/min per IP)
- [ ] CORS restricted to known origins
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection (token-based)
- [ ] File upload validation (type, size, content)
- [ ] Encrypted credential storage (AES-256)
- [ ] Audit logging for all admin actions
- [ ] Regular dependency updates (npm audit, pip audit)

---

## 8. Backup & Recovery

### 8.1 Backup Strategy

| Frequency | What | Retention | Method |
|-----------|------|-----------|--------|
| Hourly | Database (SQLite) | 24 hours | File copy to backup dir |
| Daily | Full project (code + data + uploads) | 30 days | Tar + compress |
| Weekly | Full system snapshot | 12 weeks | Disk image / rsync |
| Monthly | Archive to cold storage | 12 months | Compressed archive |

### 8.2 Backup Script

```bash
#!/bin/bash
# backup.sh — Run via cron every hour
BACKUP_DIR="/opt/agency/data/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Database backup
for db in /opt/agency/data/databases/*.db; do
    cp "$db" "$BACKUP_DIR/hourly/$(basename $db).$TIMESTAMP.bak"
done

# Uploads backup
tar -czf "$BACKUP_DIR/daily/uploads_$TIMESTAMP.tar.gz" /opt/agency/data/uploads/

# Cleanup old backups
find "$BACKUP_DIR/hourly" -name "*.bak" -mtime +1 -delete
find "$BACKUP_DIR/daily" -name "*.tar.gz" -mtime +30 -delete
```

### 8.3 Disaster Recovery

1. **RTO (Recovery Time Objective)**: 4 hours
2. **RPO (Recovery Point Objective)**: 1 hour
3. **Recovery procedure**:
   - Restore database from latest backup
   - Restore uploads from latest archive
   - Restart all services
   - Verify health checks
   - Notify affected clients

---

## 9. Deployment Strategy

### 9.1 Environment Tiers

| Environment | Purpose | URL Pattern | Auto-Deploy |
|-------------|---------|-------------|-------------|
| **Development** | Local dev | localhost:PORT | Manual |
| **Staging** | Pre-production testing | staging.appyux.studio | On push to develop |
| **Production** | Live | appyux.studio | On push to main (manual approval) |

### 9.2 Deployment Pipeline

```
Developer pushes to feature branch
  → CI runs tests + lint
  → PR created → Code review
  → Merge to develop → Auto-deploy to staging
  → QA testing on staging
  → Merge to main → Manual approval → Deploy to production
  → Health check → Notify team
```

### 9.3 Rollback Procedure

1. Identify last known good version (git tag)
2. `git checkout <tag>`
3. Rebuild and redeploy
4. Verify health checks
5. Notify team of rollback

---

## 10. Environment Management

### 10.1 Environment Variables

**Per-project `.env` file (gitignored):**

```env
# Project Identity
PROJECT_ID=appy-ux-studio
PROJECT_NAME="Appy-UX Studio"
TENANT_ID=agency

# Ports
BACKEND_PORT=8002
FRONTEND_PORT=5180
ADMIN_PORT=5181

# Database
DATABASE_URL=sqlite:///data/databases/appyux_agency.db

# Auth
JWT_SECRET=<random-256-bit-key>
JWT_EXPIRY=24h

# Payments
PAYPAL_CLIENT_ID=<encrypted>
PAYPAL_CLIENT_SECRET=<encrypted>
STRIPE_SECRET_KEY=<encrypted>

# ComfyUI
COMFYUI_URL=http://localhost:8188

# Channels
FIVERR_API_KEY=<encrypted>
UPWORK_API_KEY=<encrypted>
```

### 10.2 Environment Variable Management

- **Development**: `.env` file in project root (gitignored)
- **Staging**: Environment variables in CI/CD (GitHub Secrets)
- **Production**: Environment variables in server config (encrypted)
- **Never commit** `.env` files to git
- **Provide** `.env.example` with dummy values for onboarding

---

## 11. Development Workflow

### 11.1 New Project Onboarding

```
1. Create repository from agency template
2. Assign port block (next available in registry)
3. Create database file
4. Create upload directory
5. Generate .env from template
6. Register in PORT_REGISTRY.md
7. Add to reverse proxy config
8. Run seed script
9. Verify health checks
10. Document in project README
```

### 11.2 New Client Onboarding

```
1. Create client record in agency database
2. Create client project repository
3. Assign port block
4. Create client database
5. Set up channel integrations (Fiverr, Upwork, etc.)
6. Configure branding/settings
7. Create client portal account
8. Send welcome email with credentials
9. Add to monitoring/alerting
```

### 11.3 Daily Operations

```
Morning:
  - Check health dashboard
  - Review overnight orders/webhooks
  - Check backup status

During day:
  - Process orders
  - Monitor ComfyUI queue
  - Respond to client messages

Evening:
  - Verify backups completed
  - Review daily metrics
  - Plan next day
```

---

## 12. Monitoring & Alerting

### 12.1 Health Checks

Every service must expose:
- `GET /health` → `{"status": "ok", "version": "x.y.z", "uptime": "..."}`

### 12.2 Monitoring Dashboard

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Service uptime | Health checks | Down > 5 min |
| API response time | Middleware | > 2s p95 |
| Error rate | Logs | > 1% of requests |
| Disk usage | System | > 80% |
| Memory usage | System | > 90% |
| ComfyUI queue | ComfyUI API | > 10 pending jobs |
| Backup status | Cron logs | Missed backup |

### 12.3 Alerting Channels

- **Email**: Critical alerts (service down, backup failed)
- **Discord/Slack**: Warning alerts (high error rate, disk usage)
- **Dashboard**: Info alerts (new orders, completed jobs)

---

## 13. Documentation Standards

### 13.1 Required Documentation Per Project

| Document | Purpose | Location |
|----------|---------|----------|
| `README.md` | Project overview, setup, run instructions | Project root |
| `PORT_REGISTRY.md` | Port allocation for this project | Agency root |
| `API.md` | API endpoint documentation | Project root |
| `DEPLOYMENT.md` | Deployment procedures | Project root |
| `CHANGELOG.md` | Version history | Project root |
| `.env.example` | Environment variable template | Project root |

### 13.2 Documentation Maintenance

- Update docs with every feature change
- Review docs quarterly
- Keep runbooks for common operations
- Maintain troubleshooting guides

---

## 14. Implementation Roadmap

### Phase 1: Foundation (Before EVO-X2 Arrives)
- [ ] Create agency-core repository with templates
- [ ] Set up port registry
- [ ] Create .env.example templates
- [ ] Document git workflow
- [ ] Set up backup scripts
- [ ] Create health check endpoints

### Phase 2: EVO-X2 Setup (Week 1 after arrival)
- [ ] Install OS and base tools
- [ ] Set up reverse proxy (nginx/Caddy)
- [ ] Configure port registry
- [ ] Set up database directory structure
- [ ] Configure credential store
- [ ] Set up monitoring

### Phase 3: Multi-Project Support (Week 2-3)
- [ ] Implement tenant context middleware
- [ ] Create project onboarding script
- [ ] Set up CI/CD pipeline
- [ ] Implement backup automation
- [ ] Create admin monitoring dashboard

### Phase 4: Client Onboarding (Week 4+)
- [ ] Create client onboarding workflow
- [ ] Set up channel integrations per client
- [ ] Test multi-tenant isolation
- [ ] Document client onboarding process
- [ ] First client project

---

## 15. Open Questions

1. **OS on EVO-X2**: Windows or Linux? (Affects tooling, paths, services)
2. **Git hosting**: GitHub, GitLab, or self-hosted Gitea?
3. **Reverse proxy**: nginx, Caddy, or Traefik?
4. **Database**: SQLite (simple) or PostgreSQL (scalable)?
5. **Monitoring**: Self-hosted (Grafana) or SaaS (Datadog)?
6. **Backup destination**: Local only or cloud (S3/Backblaze)?
7. **SSL**: Let's Encrypt (free) or paid certificate?
8. **Domain**: appyux.studio or subdomain per client?

---

## 16. Immediate Action Items

1. **Create `PORT_REGISTRY.md`** in agency root — document all current ports
2. **Create `.env.example`** for each project
3. **Add health check endpoints** to backend (`GET /health`)
4. **Create backup script** and test it
5. **Document git workflow** in agency-core repo
6. **Set up reverse proxy** config (even if not deployed yet)
7. **Create project onboarding script** (automates steps in §11.1)
8. **Review and finalize** this plan before EVO-X2 arrives
