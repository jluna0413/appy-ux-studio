# 01 — Port Management & Gating

## Overview

Every service in the agency gets a deterministic, documented port. No ad-hoc assignment. A single reverse proxy (nginx/Caddy) provides path-based routing so clients never see raw ports.

## Goals

1. Eliminate port conflicts between projects
2. Provide a single entry point (port 80/443) for all services
3. Enable easy addition/removal of client projects
4. Maintain a single source of truth for port allocation

## Key Decisions

- **Port blocks**: Each project gets 3 consecutive ports (frontend, admin, backend)
- **Blocks start at 5200**, increment by 10 per project
- **Reverse proxy**: nginx or Caddy on port 80/443 with path-based routing
- **Strict port**: Vite `strictPort: true` to fail fast on conflicts
- **Registry**: `PORT_REGISTRY.md` is the single source of truth

## Files in This Section

| File | Purpose |
|------|---------|
| `overview.md` | This file — section summary |
| `port-registry.toml` | Machine-readable port allocation |
| `allocation-rules.md` | Detailed allocation rules and process |
| `nginx-config.toml` | Reverse proxy configuration template |
| `research.md` | Research findings and references |

## Quick Reference

- **Current ports**: Backend 8002, Client Portal 5180, Admin 5181
- **Next available block**: 5200
- **Registry location**: `EVO-X2 Migration/PORT_REGISTRY.md`
- **Config template**: `plans/01-port-management/port-registry.toml`
