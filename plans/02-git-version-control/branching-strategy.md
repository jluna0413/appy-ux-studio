# Branching Strategy — Git Flow (Simplified)

## Branch Types

| Branch | Purpose | Lifetime | Merge Target |
|--------|---------|----------|-------------|
| `main` | Production-ready code | Permanent | — |
| `develop` | Integration branch | Permanent | `main` (via release) |
| `feature/*` | New features | Short-lived | `develop` |
| `fix/*` | Bug fixes | Short-lived | `develop` |
| `hotfix/*` | Critical production fixes | Short-lived | `main` + `develop` |
| `release/*` | Release preparation | Short-lived | `main` + `develop` |
| `client/*` | Client-specific work | Short-lived | `develop` |

## Workflow

```
1. Create feature branch from develop
   git checkout -b feature/new-feature develop

2. Make changes, commit with conventional commits
   git commit -m "feat: add new feature"

3. Push and create PR
   git push origin feature/new-feature
   # Create PR on GitHub/GitLab

4. Code review + CI checks

5. Merge to develop (squash or merge commit)

6. Delete feature branch
   git branch -d feature/new-feature

7. When ready for release:
   git checkout -b release/v1.0.0 develop
   # Final testing, version bump
   git checkout main
   git merge release/v1.0.0
   git tag v1.0.0
   git checkout develop
   git merge release/v1.0.0
```

## Branch Naming Convention

- `feature/<description>` — new features (e.g., `feature/channel-integration`)
- `fix/<description>` — bug fixes (e.g., `fix/login-redirect`)
- `hotfix/<description>` — critical production fixes (e.g., `hotfix/payment-crash`)
- `release/<version>` — release preparation (e.g., `release/v1.2.0`)
- `client/<client-id>/<description>` — client-specific work (e.g., `client/alpha/logo-update`)

## Rules

1. **Never push directly to `main`** — all changes via PR
2. **Delete branches after merge** — keep branch list clean
3. **One concern per branch** — don't mix features
4. **Rebase before PR** — keep history clean
5. **Squash merge** for feature branches — one commit per feature
6. **Merge commit** for release branches — preserve history
