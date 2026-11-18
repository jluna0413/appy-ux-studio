# Port Registry — Appy-UX Studio

**Last Updated:** 2026-11-16
**Rule:** Every port MUST be registered here before use. No ad-hoc port assignment.

---

## Core Services (Always Running)

| Port | Service | Project | Owner | Status |
|------|---------|---------|-------|--------|
| 8002 | Backend API | appy-ux-studio | agency | ✅ Active |
| 8188 | ComfyUI (Intel Arc) | comfyui | agency | ✅ Active |

## Frontend Dev Servers

| Port | Service | Project | Owner | Status |
|------|---------|---------|-------|--------|
| 5180 | Client Portal (dev) | appy-ux-studio | agency | ✅ Configured |
| 5181 | Admin Dashboard (dev) | appy-ux-studio | agency | ✅ Configured |

## Shop

| Port | Service | Project | Owner | Status |
|------|---------|---------|-------|--------|
| 7000 | Shop Frontend (dev) | appy-ux-studio | agency | 📋 Planned |

## Infrastructure

| Port | Service | Project | Owner | Status |
|------|---------|---------|-------|--------|
| 9000 | PostgreSQL | db-primary | infra | 📋 Planned |
| 9001 | Redis | cache-primary | infra | 📋 Planned |
| 80 | Reverse Proxy (HTTP) | proxy | infra | 📋 Planned |
| 443 | Reverse Proxy (HTTPS) | proxy | infra | 📋 Planned |

## Project Port Blocks (Allocated per project)

Each project gets a block of 3 consecutive ports: frontend, admin, backend.
Blocks start at 5200 and increment by 10 per project.

| Block | Frontend | Admin | Backend | Project | Client | Allocated |
|-------|----------|-------|---------|---------|--------|-----------|
| 5200 | 5200 | 5201 | 5202 | (available) | — | — |
| 5210 | 5210 | 5211 | 5212 | (available) | — | — |
| 5220 | 5220 | 5221 | 5222 | (available) | — | — |

## Reserved Ranges

| Range | Purpose |
|-------|---------|
| 3000–3099 | Frontend dev (Vite/React) — legacy, avoid |
| 4000–4099 | Frontend production (nginx/serve) |
| 5000–5099 | Backend APIs (FastAPI/Flask) |
| 6000–6099 | Admin dashboards |
| 7000–7099 | Shop/storefronts |
| 8000–8099 | Internal tools & services |
| 9000–9099 | Database & infrastructure |
| 10000–10099 | ComfyUI & AI services |

## Allocation Rules

1. **Never use default ports** (3000, 5173, 8000, 8080) — they conflict with other projects
2. **Each project gets 3 consecutive ports**: frontend, admin, backend
3. **Port blocks start at 5200** and increment by 10
4. **Register every port** here before use
5. **Use `strictPort: true`** in Vite config to fail fast on conflicts
6. **Environment variable override**: `PORT` env var can override for CI/CD
7. **One project per port block** — no sharing
