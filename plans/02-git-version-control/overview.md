# 02 — Git & Version Control Strategy

## Overview

Polyrepo structure (one repo per project/client) + one agency monorepo for shared tools and templates. Git Flow branching with conventional commits.

## Goals

1. Isolate client projects in separate repositories
2. Share templates and boilerplates via agency-core repo
3. Enforce code review via PRs for all changes
4. Maintain clean git history with conventional commits
5. Enable easy rollback and audit

## Key Decisions

- **Polyrepo**: One repo per client/project + agency-core for shared assets
- **Branching**: Git Flow (main → develop → feature/* → PR → merge)
- **Commits**: Conventional Commits (feat:, fix:, docs:, etc.)
- **Access**: Agency owns all repos; clients get read-only or no access
- **Templates**: Client repos created from agency templates

## Files in This Section

| File | Purpose |
|------|---------|
| `overview.md` | This file — section summary |
| `branching-strategy.md` | Detailed branching model |
| `repo-structure.toml` | Repository layout configuration |
| `commit-standards.md` | Commit and PR standards |
| `research.md` | Research findings and references |
