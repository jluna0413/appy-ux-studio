# Port Management — Research Findings

## Research Date: 2026-11-16

## Key Findings

### 1. Port Conflict Prevention
- **Problem**: Multiple projects using default ports (3000, 5173, 8000) causes conflicts
- **Solution**: Deterministic port allocation with registry
- **Reference**: Vite `strictPort: true` fails fast on conflicts instead of auto-incrementing

### 2. Reverse Proxy Benefits
- **Single entry point**: Port 80/443 for all services
- **SSL termination**: One certificate for all services
- **Path-based routing**: `/api`, `/portal`, `/admin` → different backends
- **No port exposure**: Clients never see internal ports
- **Easy scaling**: Add new projects by adding location blocks

### 3. Port Range Strategy
- **Inspired by**: Kubernetes service port ranges, Docker port conventions
- **Pattern**: 100-port blocks per category, 10-port blocks per project
- **Rationale**: Easy to identify service type by port number

### 4. Environment Variable Override
- **Pattern**: `PORT` env var overrides config for CI/CD and containerized deployments
- **Reference**: Heroku, Railway, Render all use `PORT` env var
- **Implementation**: Vite reads `process.env.PORT`, FastAPI reads `settings.BACKEND_PORT`

### 5. Monitoring Port Usage
- **Tool**: `netstat -ano` (Windows), `ss -tlnp` (Linux)
- **Script**: `scripts/check_ports.py` — scans all registered ports and reports status
- **Alert**: Notify if a registered port is in use by an unexpected process

## References

- [Vite Server Configuration](https://vitejs.dev/config/server-options.html)
- [nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Caddy Server](https://caddyserver.com/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Port Range Conventions (IANA)](https://www.iana.org/assignments/service-names-port-numbers/)
