# 03 — Project Isolation

## Overview

Three levels of isolation: filesystem, database, and credentials. Each client project gets its own directory, database file, and encrypted credential store.

## Goals

1. Prevent data leakage between clients
2. Enable easy client data export on contract end
3. Isolate credentials per project
4. Support independent backup/restore per client

## Isolation Levels

| Level | Scope | Method |
|-------|-------|--------|
| L0: Agency Core | Shared tools, templates | Single repo, read-only |
| L1: Agency Projects | Internal agency work | Separate repo, agency-only |
| L2: Client Projects | Client deliverables | Separate repo per client |
| L3: Personal Projects | Owner's personal work | Separate repo, owner-only |

## Files in This Section

| File | Purpose |
|------|---------|
| `overview.md` | This file — section summary |
| `filesystem-isolation.md` | Directory structure and file isolation |
| `database-isolation.md` | Database per client strategy |
| `credential-isolation.md` | Encrypted credential management |
| `research.md` | Research findings and references |
