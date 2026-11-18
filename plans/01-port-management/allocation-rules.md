# Port Allocation Rules

## Rules

1. **Never use default ports** (3000, 5173, 8000, 8080) — they conflict with other projects and tools
2. **Each project gets 3 consecutive ports**: frontend (dev), admin (dev), backend (API)
3. **Port blocks start at 5200** and increment by 10 per project
4. **Register every port** in `PORT_REGISTRY.md` AND `port-registry.toml` before use
5. **Use `strictPort: true`** in Vite config to fail fast on conflicts
6. **Environment variable override**: `PORT` env var can override for CI/CD
7. **One project per port block** — no sharing between projects
8. **Core services** (backend, ComfyUI) use fixed ports outside project blocks
9. **Infrastructure** (DB, cache, proxy) uses 9000+ range

## Allocation Process

### Step 1: Check Availability
```bash
# Check if port is in use
netstat -ano | findstr :PORT
# Or use the check script
python scripts/check_port.py PORT
```

### Step 2: Assign Block
```bash
# Find next available block
python scripts/allocate_port.py --project client-name
# Output: Block 5200 assigned (frontend:5200, admin:5201, backend:5202)
```

### Step 3: Register
- Add to `PORT_REGISTRY.md`
- Add to `port-registry.toml`
- Commit to git

### Step 4: Configure
- Update Vite config with `port` and `strictPort: true`
- Update `.env` with `BACKEND_PORT`, `FRONTEND_PORT`, `ADMIN_PORT`
- Update reverse proxy config

### Step 5: Verify
```bash
# Start all services and verify no conflicts
npm run dev  # Should use assigned port
python -m uvicorn app.main:app --port BACKEND_PORT
```

## Conflict Resolution

If a port conflict occurs:
1. Check `PORT_REGISTRY.md` for the assigned port
2. Check if another process is using it: `netstat -ano | findstr :PORT`
3. Kill the conflicting process or reassign the port
4. Update registry and configs

## Port Gating (Access Control)

Instead of exposing ports directly, use a reverse proxy:

```
https://appyux.studio/           → Landing page
https://appyux.studio/portal      → Client portal (port 5180)
https://appyux.studio/admin       → Admin dashboard (port 5181)
https://appyux.studio/api         → Backend API (port 8002)

https://client-alpha.appyux.studio/  → Client Alpha portal (port 5200)
```

**Benefits:**
- Single entry point (port 80/443)
- SSL termination at proxy
- No port exposure to clients
- Easy to add/remove projects
