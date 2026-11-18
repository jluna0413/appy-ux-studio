# Version Control, Dev Sandbox & Code Review Plan

**Date:** 2026-11-16
**Status:** PLANNING PHASE
**Context:** User doesn't code — everything must be hands-off and agent-driven

---

## 1. The Problem

The agency needs a system where:
- Code changes are made by AI agents, not the human owner
- Changes are validated before going live
- The owner can review and approve without understanding code
- Multiple agents can work in parallel without conflicts
- Nothing breaks production

**Current state:** Git is not even initialized (no .git directory found). No version control exists.

---

## 2. Recommended Architecture: "Hands-Off Git"

### 2.1 Core Principle: Agents Do Everything, Human Approves

```
Agent makes change → Pushes to feature branch → Opens PR →
  CodeRabbit auto-reviews → Agent fixes issues →
  Human (owner) reviews summary → Approves → Merge → Deploy
```

The human owner never touches git commands. They only:
1. Review PR summaries (plain English)
2. Click "Approve" or "Request Changes"
3. Monitor the dashboard

### 2.2 Tool Stack

| Tool | Role | Cost | When to Use |
|------|------|------|-------------|
| **OpenCode** (OpenCode Go plan) | Primary coding agent | $20/mo | Feature implementation, refactoring, bug fixes |
| **Codex** (OpenAI API) | Secondary coding agent | Pay-per-use (~$0.01-0.10/task) | Complex refactors, alternative perspective |
| **CodeRabbit** | Automated PR reviewer | Free tier (public repos) / $12/mo (private) | Every PR — catches bugs, security, style |
| **Git Worktrees** | Dev sandbox isolation | Free | Parallel agent work, non-destructive testing |
| **GitHub Actions** | CI/CD pipeline | Free (public) / $0.008/min (private) | Automated tests, lint, build verification |

### 2.3 Why Both OpenCode AND Codex?

| Scenario | Use OpenCode | Use Codex |
|----------|-------------|-----------|
| Routine features | ✅ Primary | — |
| Complex refactors | ✅ Primary | ✅ Second opinion |
| Code review | ✅ Built-in | ✅ Alternative review |
| When OpenCode is rate-limited | — | ✅ Fallback |
| Security-sensitive changes | ✅ | ✅ (dual review) |
| When stuck on a bug | ✅ | ✅ (fresh perspective) |

**Rule:** OpenCode is primary. Codex is fallback + second opinion. Never run both on the same task simultaneously (wastes tokens).

---

## 3. Dev Sandbox Spawning System

### 3.1 Git Worktree Isolation

Each agent task gets its own isolated worktree:

```
EVO-X2 Migration/                    ← Main working tree (production)
├── .git/                            ← Shared object database
├── .worktrees/                      ← Git worktrees (gitignored)
│   ├── feature-channel-linkedin/    ← Agent A's sandbox
│   ├── fix-slider-glitch/           ← Agent B's sandbox
│   └── refactor-backend/            ← Agent C's sandbox
```

### 3.2 Worktree Lifecycle

```
1. CREATE: git worktree add -b feature/name .worktrees/feature-name main
2. WORK: Agent edits files in .worktrees/feature-name/
3. TEST: Run tests in the worktree (isolated)
4. COMMIT: git add + git commit in the worktree
5. PUSH: git push origin feature/name
6. PR: gh pr create
7. REVIEW: CodeRabbit auto-reviews
8. MERGE: Human approves → merge to main
9. CLEANUP: git worktree remove .worktrees/feature-name
```

### 3.3 Sandbox Rules

- **Never touch main directly** — all changes via feature branches
- **Each agent gets its own worktree** — no shared working directories
- **Tests must pass before PR** — agent runs tests in worktree
- **CodeRabbit reviews every PR** — automated quality gate
- **Human approves every merge** — final gate
- **Rollback is one click** — revert the PR on GitHub

### 3.4 Port Isolation for Sandboxes

Each worktree gets its own port block (from PORT_REGISTRY.md):
- Worktree 1: ports 5300-5302 (frontend, admin, backend)
- Worktree 2: ports 5310-5312
- Main: ports 5180-5181, 8002 (production)

### 3.5 Database Isolation for Sandboxes

Each worktree gets its own SQLite database:
- Main: `data/databases/appyux_agency.db`
- Worktree 1: `data/databases/sandbox_1.db`
- Worktree 2: `data/databases/sandbox_2.db`

This prevents test data from polluting production.

---

## 4. CodeRabbit Integration

### 4.1 Setup (One-Time)

1. Sign up at coderabbit.ai with GitHub account
2. Install CodeRabbit GitHub App on the agency org
3. Grant access to all repositories
4. Configure `.coderabbit.yaml` in repo root:

```yaml
# .coderabbit.yaml
language: en-US
early_access: false
reviews:
  profile: chill  # or 'assertive' for stricter
  request_changes_workflow: false  # Don't block merge, just comment
  high_level_summary: true
  poem: false
  review_status: true
  collapse_walkthrough: false
  auto_review:
    enabled: true
    drafts: false
    base_branches:
      - main
      - develop
  path_instructions:
    - path: "backend/**/*.py"
      instructions: "Check for SQL injection, proper error handling, and type hints"
    - path: "frontend/**/*.jsx"
      instructions: "Check for XSS, accessibility, and responsive design"
    - path: "**/*.html"
      instructions: "Check for accessibility and semantic HTML"
  tools:
    ruff:
      enabled: true
    eslint:
      enabled: true
chat:
  auto_reply: true
```

### 4.2 CodeRabbit Workflow

```
Agent opens PR
  → CodeRabbit auto-reviews within 2-3 minutes
  → Posts summary comment + inline suggestions
  → Agent reads CodeRabbit feedback
  → Agent pushes fixes
  → CodeRabbit re-reviews
  → Human reviews final summary
  → Human approves → Merge
```

### 4.3 CodeRabbit Commands (Agent-Usable)

Agents can interact with CodeRabbit via PR comments:
- `@coderabbitai review` — Trigger incremental review
- `@coderabbitai full review` — Full review of entire PR
- `@coderabbitai resolve` — Mark a comment as resolved
- `@coderabbitai generate docstrings` — Auto-generate documentation
- `@coderabbitai generate tests` — Auto-generate tests

### 4.4 CodeRabbit Pricing

| Plan | Cost | Features |
|------|------|----------|
| **Free** | $0 | Public repos only, basic reviews |
| **Pro** | $12/mo per user | Private repos, full features, security scans |
| **Enterprise** | Custom | SSO, self-hosted, custom rules |

**Recommendation:** Start with Free tier for public repos. Upgrade to Pro when repositories go private.

---

## 5. Agent Workflow: End-to-End

### 5.1 Feature Implementation Flow

```
1. Human describes feature in plain English
   "Add a contact form to the landing page"

2. Orchestrator (this agent) breaks it down:
   - Task A: Backend endpoint for form submission → OpenCode
   - Task B: Frontend modal component → OpenCode
   - Task C: Integration + testing → OpenCode

3. For each task:
   a. Create worktree: git worktree add -b feature/contact-form .worktrees/contact-form main
   b. Launch OpenCode in worktree: opencode run "Implement contact form endpoint..."
   c. OpenCode makes changes, runs tests
   d. OpenCode commits: git commit -m "feat: add contact form endpoint"
   e. OpenCode pushes: git push origin feature/contact-form
   f. OpenCode creates PR: gh pr create

4. CodeRabbit auto-reviews PR
   → Posts summary + suggestions

5. If issues found:
   a. Agent reads CodeRabbit feedback
   b. Agent pushes fixes
   c. CodeRabbit re-reviews

6. Human reviews final PR summary (plain English)
   → Approves or requests changes

7. Merge → Deploy → Cleanup worktree
```

### 5.2 Hotfix Flow (Emergency)

```
1. Human reports critical bug
2. Orchestrator creates hotfix branch from main
3. OpenCode/Codex implements fix in worktree
4. Tests pass → PR created
5. CodeRabbit reviews (fast-track)
6. Human approves → Merge → Deploy
7. Backport to develop branch
```

### 5.3 PR Review Flow (CodeRabbit + Agent)

```
1. Agent opens PR
2. CodeRabbit reviews (2-3 min)
3. Agent reads CodeRabbit comments
4. Agent fixes issues
5. CodeRabbit re-reviews
6. If clean → Human notified
7. Human approves → Merge
```

---

## 6. Git Repository Setup

### 6.1 Initialize Repositories

```bash
# Agency core (shared templates, tools)
mkdir -p /opt/agency/core && cd /opt/agency/core
git init && git remote add origin https://github.com/appy-ux/agency-core.git

# Agency main project
mkdir -p /opt/agency/projects/agency/appy-ux-studio
cd /opt/agency/projects/agency/appy-ux-studio
git init && git remote add origin https://github.com/appy-ux/appy-ux-studio.git

# Client projects (created from template)
# gh repo create appy-ux/client-alpha --template appy-ux/agency-core
```

### 6.2 .gitignore

```gitignore
# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/
.venv/
__pycache__/

# Build outputs
dist/
build/
*.pyc

# Database
*.db
*.sqlite
*.sqlite3

# Uploads
uploads/

# Worktrees
.worktrees/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# ComfyUI (if in repo)
models/
output/
input/
```

### 6.3 Branch Protection Rules (GitHub)

For `main` branch:
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass (CI tests)
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ Restrict who can push (only via PR)
- ✅ Allow force pushes: No
- ✅ Allow deletions: No

For `develop` branch:
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass
- ✅ Allow force pushes: No

---

## 7. CI/CD Pipeline (Local & Free — No GitHub Actions)

### 7.1 Why Not GitHub Actions?

GitHub Actions is powerful but:
- Requires YAML configuration (technical)
- Runs on GitHub servers (cloud dependency)
- Free tier has limits (2000 min/mo for private repos)
- Costs can accumulate with heavy usage
- User does not know how to configure or operate it

### 7.2 Alternative: Local Pre-Commit Hooks (Free, Automatic)

Pre-commit hooks run automatically before every commit. They are free, local, and require zero cloud infrastructure.

**Setup (one-time, agent does this):**



### 7.3 How It Works (Hands-Off)



The user never touches this. Agents run it automatically.

### 7.4 Alternative: Gitea Actions (Self-Hosted, Free)

If you want CI/CD (automated testing on push), use Gitea (free, open-source GitHub alternative) with Gitea Actions:
- Self-hosted on EVO-X2 (no cloud costs)
- GitHub Actions compatible (same YAML syntax)
- Free forever, no usage limits
- Runs on your own hardware

### 7.5 Alternative: Simple Test Script (Zero Config)

For the simplest possible approach, a single bash script that agents run:

=== Backend Lint ===
=== Backend Tests ===

This is the recommended starting point. No configuration, no cloud, no costs.

### 7.6 Recommendation

| Phase | Approach | Cost | Complexity |
|-------|----------|------|------------|
| Phase 1 (Now) | Pre-commit hooks + test.sh | /usr/bin/bash | Low |
| Phase 2 (Later) | Add Gitea Actions for automated CI | /usr/bin/bash | Medium |
| Phase 3 (Scale) | GitHub Actions if moving to cloud | /usr/bin/bash-5/mo | Medium |

Start with pre-commit hooks + test.sh. Add Gitea Actions later if needed.

### 7.7 Rollback Procedure

1. Identify last known good version (git tag)
2. git checkout <tag>
3. Rebuild and redeploy
4. Verify health checks
5. Notify team of rollback

## 8. Agent Delegation Strategy

### Google Labs Jules (NEW — Cloud-Based Async Coding Agent)

**What it is:** Google's autonomous coding agent that runs in isolated cloud VMs. You describe a task, Jules plans it, you approve, it executes, runs tests, and opens a PR.

**Key features:**
- **Async cloud execution** — works in the background, you can close your laptop
- **Plan-then-execute** — shows a step-by-step plan for your approval before writing code
- **Built-in Critic + test runs** — reviewer agent checks changes, runs your test suite
- **CI auto-fix** — detects and repairs failing CI on its own PRs
- **GitHub-native** — label an issue with 'jules' and it starts working
- **CLI (Jules Tools)** — `jules remote new`, `jules remote list`, `jules remote pull`
- **MCP support** — Linear, Neon, Supabase, Context7, and more
- **REST API** — integrate into CI/CD, Slack, Linear, Jira

**Pricing:**
| Plan | Cost | Tasks/Day | Concurrent | Model |
|------|------|-----------|------------|-------|
| Free | $0 | 15 | 3 | Gemini 3 Flash |
| Pro | $19.99/mo | 100 | 15 | Gemini 3.1 Pro |
| Ultra | $99.99/mo | 300 | 60 | Priority access |

**How it fits the hands-off workflow:**
```
Owner describes feature → Orchestrator creates GitHub issue with 'jules' label →
  Jules clones repo into cloud VM → writes plan →
  Owner reviews plan → approves →
  Jules makes changes → runs tests → opens PR →
  CodeRabbit auto-reviews PR →
  Owner reviews plain-English summary → approves → merge
```

**Jules vs OpenCode vs Codex:**

| Feature | Jules | OpenCode | Codex |
|---------|-------|----------|-------|
| Execution | Cloud VM (async) | Local (sync) | Local (sync) |
| Plan review | ✅ Built-in | ❌ | ❌ |
| Test running | ✅ In cloud VM | ✅ Local | ✅ Local |
| CI auto-fix | ✅ | ❌ | ❌ |
| Cost | Free/$20/mo | $10/mo | Pay-per-use |
| Model | Gemini 3.1 Pro | Configurable | GPT-4o/o3 |
| MCP support | ✅ | ✅ | ❌ |
| Offline | ❌ | ✅ | ✅ |

**Recommendation:** Use Jules as the **primary** coding agent for complex tasks (it has plan review, test running, and CI auto-fix). Use OpenCode for quick local tasks. Use Codex as fallback.

**Jules Tools CLI:**
```bash
# Install
npm install -g @google/jules

# Create a task
jules remote new --repo appy-ux/appy-ux-studio --branch main "Add contact form to landing page"

# List active sessions
jules remote list

# Pull work-in-progress code locally
jules remote pull <session-id>

# Interactive TUI
jules
```

**Google CLI (gcloud):** Not directly a coding tool, but useful for managing Google Cloud resources if you deploy to GCP or use Jules' cloud VMs. Install via the installer from cloud.google.com/sdk.

### ⚠️ CONSTRAINT: Free Tier Only

**Google + Jules will use FREE tier exclusively.** No paid plans.

| Service | Free Tier | Paid (NOT using) |
|---------|-----------|------------------|
| Jules | 15 tasks/day, 3 concurrent, Gemini 3 Flash | Pro $19.99/mo, Ultra $99.99/mo |
| Google Cloud | Free tier (limited resources) | Pay-as-you-go |
| CodeRabbit | Free (public repos) | Pro $12/mo |
| GitHub | Free (public repos) | Pro $4/user/mo |

**Free tier limitations to be aware of:**
- Jules: 15 tasks/day, 3 concurrent — enough for daily agency work
- Jules model: Gemini 3 Flash (not Gemini 3.1 Pro) — slightly lower quality but still capable
- CodeRabbit: Public repos only — repos must be public for free tier
- GitHub Actions: Not using (pre-commit hooks instead, free)

**If free tier limits are hit:**
- Wait until next day (tasks reset daily)
- Use OpenCode (local, $10/mo) as fallback
- Use Codex (pay-per-use, ~$0.01-0.10/task) for overflow
- Use local models (free) for simple tasks

**Cost target: $10/mo total** (OpenCode Go only). Everything else is free.

| Task Type | Primary Agent | Fallback | Notes |
|-----------|--------------|----------|-------|
| Feature implementation | Jules (cloud) | OpenCode | Jules has plan review + test running |
| Bug fix | Jules (cloud) | OpenCode | Jules has CI auto-fix |
| Refactoring | Jules (cloud) | OpenCode | Jules handles multi-file well |
| Code review | CodeRabbit | OpenCode | CodeRabbit is automated |
| Security audit | Codex | OpenCode | Codex is better at security analysis |
| Documentation | OpenCode | Jules | OpenCode writes good docs |
| Test writing | Jules (cloud) | OpenCode | Jules runs tests in cloud VM |
| Complex debugging | Codex | Jules | Codex has better reasoning |
| Quick local fix | OpenCode | — | No cloud needed |

**Rule:** Jules is primary for complex tasks (plan review, test running, CI auto-fix). OpenCode for quick local tasks. Codex for security and deep reasoning. Never run two agents on the same task simultaneously.

For large features, use parallel agents in separate worktrees:

```
Feature: "Add contact form"
├── Agent 1 (OpenCode): Backend endpoint → worktree/feature-contact-backend
├── Agent 2 (OpenCode): Frontend modal → worktree/feature-contact-frontend
└── Agent 3 (Codex): Integration tests → worktree/feature-contact-tests

All three work in parallel, then merge into a single PR.
```

### Private Repositories (Client Code Protection)

**Problem:** Client code cannot be in public repos. CodeRabbit free tier only works for public repos.

**Solution: PR-Agent (Open Source, MIT) + Local LLMs**

#### PR-Agent (The-PR-Agent/pr-agent)
- **License:** MIT (free, open source)
- **Self-hosted:** Yes (Docker or local)
- **Private repos:** Yes (works with any repo)
- **Model:** Uses YOUR LLM (local or API) — no external data sharing
- **Features:** PR review, describe, improve, ask, update changelog
- **GitHub/GitLab/Bitbucket/Gitea/Azure DevOps:** All supported
- **Stars:** 16.3k on GitHub

**How it works:**
```
PR opened → PR-Agent fetches diff → sends to YOUR LLM (local) →
  LLM reviews code → posts comments on PR →
  All data stays local (no code sent to external services)
```

**Setup (one-time):**
```bash
# Clone PR-Agent
git clone https://github.com/The-PR-Agent/pr-agent.git
cd pr-agent

# Configure with local LLM (LM Studio or Ollama)
cat > .env << 'EOF'
OPENAI_API_KEY=not-needed
OPENAI_API_BASE=http://localhost:1234/v1
MODEL=gpt-4
EOF

# Run with Docker
docker-compose up -d
```

**PR-Agent + Local LLM = Free Private Code Review**
- No code leaves your machine
- No subscription needed
- Uses bonsai-2-9b or mimo-v2.6:9b as the reviewer
- Works with GitHub private repos

#### GitHub Free Tier (Private Repos)
- **Unlimited private repos** (free)
- **Unlimited collaborators** (free)
- **No advanced security** (Code scanning requires Pro)
- **2000 CI minutes/month** (free, but we use pre-commit hooks instead)
- **Jules works with private repos** (free tier)

#### Gitea (Self-Hosted Alternative)
- **Completely free** (open source)
- **Private repos** by default
- **Built-in CI** (Gitea Actions, GitHub Actions compatible)
- **Self-hosted on EVO-X2** — no cloud dependency
- **No external data sharing**

**Recommendation:** Use GitHub (free, private repos) + PR-Agent (self-hosted, free) + local LLMs for code review. All code stays private and local.

### 8.3 Agent Communication

Agents communicate via:
- **Git commits**: Each agent commits to its own branch
- **PR comments**: CodeRabbit provides feedback
- **Orchestrator (this agent)**: Coordinates, reviews, and merges

---

## 9. Rollback Strategy

### 9.1 Levels of Rollback

| Level | Action | Time | When to Use |
|-------|--------|------|-------------|
| **L1: Revert PR** | `git revert <commit>` | 1 min | Bad commit merged |
| **L2: Reset to tag** | `git reset --hard v1.0.0` | 2 min | Multiple bad commits |
| **L3: Restore backup** | Restore from backup dir | 10 min | Database corruption |
| **L4: Full restore** | Restore from system backup | 1 hour | Complete failure |

### 9.2 Automated Rollback

GitHub Actions can auto-rollback if health check fails:

```yaml
- name: Health Check
  id: health
  run: curl -f http://appyux.studio/health || echo "FAILED" >> $GITHUB_OUTPUT
- name: Rollback if Failed
  if: steps.health.outputs.result == 'FAILED'
  run: |
    git revert HEAD --no-edit
    git push origin main
    ssh user@evo-x2 "cd /opt/agency/... && ./restart.sh"
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Before EVO-X2 Arrives)
- [ ] Initialize git repositories (agency-core, appy-ux-studio)
- [ ] Create .gitignore, .env.example
- [ ] Set up GitHub organization (appy-ux)
- [ ] Install OpenCode CLI (`npm i -g opencode-ai`)
- [ ] Install Codex CLI (`npm i -g @openai/codex`)
- [ ] Configure OpenCode auth (OpenCode Go plan)
- [ ] Configure Codex auth (OpenAI API key)
- [ ] Sign up for CodeRabbit (free tier)
- [ ] Create .coderabbit.yaml config
- [ ] Write basic tests for backend
- [ ] Set up GitHub Actions CI pipeline

### Phase 2: EVO-X2 Setup (Week 1)
- [ ] Clone repos to EVO-X2
- [ ] Set up worktree directory structure
- [ ] Configure branch protection rules
- [ ] Set up deployment pipeline
- [ ] Test full workflow: feature → PR → review → merge → deploy

### Phase 3: Agent Integration (Week 2)
- [ ] Test OpenCode on a real feature
- [ ] Test Codex as fallback
- [ ] Test CodeRabbit review flow
- [ ] Test parallel agent execution
- [ ] Test rollback procedures
- [ ] Document agent workflow for owner

### Phase 4: Production (Week 3+)
- [ ] First real feature via agent workflow
- [ ] Owner reviews and approves first PR
- [ ] Monitor and refine process
- [ ] Upgrade CodeRabbit to Pro if needed

---

## 11. Cost Estimate

| Tool | Monthly Cost | Notes |
|------|-------------|-------|
| OpenCode Go | $10/mo | Primary coding agent (local) |
| Jules Free | $0 | 15 tasks/day, 3 concurrent, Gemini 3 Flash |
| Jules Pro | $19.99/mo | 100 tasks/day, 15 concurrent, Gemini 3.1 Pro |
| Codex (OpenAI API) | $5-20/mo | Fallback + second opinion (or free local models) |
| CodeRabbit Free | $0 | Public repos only |
| Local CI (pre-commit) | $0 | Free, runs locally, no cloud costs |
| Gitea Actions (self-hosted) | $0 | Free alternative to GitHub Actions |
| **Total (Free tier)** | **$10/mo** | OpenCode Go only. Everything else is free. |

---

## 12. Owner's Role (Non-Technical)

The owner (you) only needs to:

1. **Describe features** in plain English → Orchestrator breaks them down
2. **Review PR summaries** → CodeRabbit + agent provide plain-English summaries
3. **Click "Approve"** on GitHub → Triggers merge + deploy
4. **Monitor dashboard** → See status of all agent work

You never need to:
- Write code
- Run git commands
- Debug merge conflicts
- Configure CI/CD
- Manage branches

All of that is handled by the orchestrator agent and the coding agents.

---

## 13. Open Questions

1. **Git hosting**: GitHub (recommended) or self-hosted Gitea?
2. **Repo visibility**: Public (free CodeRabbit) or Private ($12/mo)?
3. **OpenCode model**: Which model for OpenCode? (Claude Sonnet recommended)
4. **Codex model**: GPT-4o or o3-mini for Codex?
5. **Deployment**: Auto-deploy on merge or manual approval?
6. **Notification**: How should owner be notified of PRs ready for review? (Email, Discord, Telegram?)
