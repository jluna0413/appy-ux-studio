# 01 — EVO-X2 Bring-up & Benchmark Checklist (Creative Studio)

**Purpose:** get the EVO-X2 production-ready for **visual & artistic production** (Windows first if that’s what ships; Linux planned) with evidence-backed render/generation times to set honest SLAs.

> **OS on arrival:** unknown — record what ships, then follow the matching path. Do not assume drivers/backends.

## Phase 0 — Pre-arrival prep (do now)
- [ ] Lock first 3 launch offers and their package specs (duration/count/resolution/fps/slide count)
- [ ] Create portfolio sample briefs and gather properly licensed fonts/assets/refs
- [ ] Prepare migration bundle: Hermes profiles/config/skills, `EVO-X2 Migration/` templates/boilerplates
- [ ] Define access architecture choice (local web UI / open-cloud, file delivery) — `plans/04-access-architecture.md`
- [ ] List required accounts/keys (if any APIs/services used) — store in password manager, not in repo

## Phase 1 — Arrival & baseline (Day 1)
### System inventory & baseline
- [ ] Record shipped OS/build, exact CPU/APU/GPU model, RAM config/speed, SSD, BIOS/firmware
- [ ] Update OS, install AMD chipset/GPU drivers (Adrenalin/PRO as appropriate), set power/perf plan
- [ ] Create folder layout: `C:\agency\{workspace,clients,templates,assets,models,cache,renders,tools,logs,backups}` (or Linux equivalent)
- [ ] Install core tools: Git, Python (uv/venv), Node.js, ffmpeg, 7zip, browser(s)
- [ ] Verify basics: `ffmpeg -version`, `node -v`, `python --version`, disk free, temps/idle behavior
- [ ] Security/ops: password manager, LAN/firewall rules, backup target, restore test

### Hermes & creative environment
- [ ] Install/configure Hermes; migrate profiles/skills/configs (secrets isolated)
- [ ] Install/verify **hyperframes** deps and run a short test render (record time)
- [ ] Install/verify **ComfyUI** and confirm UI access (local web)
- [ ] Smoke test design/doc tools: `sketch`/`claude-design`/`popular-web-designs`, PPTX/PDF export

## Phase 2 — Creative pipeline benchmarks (evidence for SLAs)
> Run each on a small, repeatable sample. Record: OS, driver/runtime versions, backend, settings, input specs, output specs, time, resource use, quality notes, failures.

| Pipeline | Candidate tools/backends | Benchmark tests | Capture (pass criteria) |
|---|---|---|---|
| **Short-form video (Hyperframes)** | hyperframes + ffmpeg (+ Chrome headless) | 15s / 30s / 60s comp render | seconds per export, stability, output quality/playback |
| **Video upscaling** | ComfyUI workflows, catalog upscalers (e.g. video-upscale) | 10–30s clips: 720p→1080p, 1080p→4K (if feasible) | time per input-minute, VRAM/RAM use, visual quality, artifacts |
| **Frame interpolation** | ComfyUI/interpolation workflows or catalog tools | 24/30fps→60fps on 10–30s clips | time per input-minute, smoothness/artifacts, audio sync |
| **Soundtrack/music (ACE-Step 1.5)** | ACE-Step skill/runtime candidates | 30s / 60s / 120s beds, varied moods | generation time, quality/usability, format export, resource use |
| **Image generation/assets** | ComfyUI (+ DirectML/Vulkan/CPU as applicable) | thumbnail set, style frames, simple assets | time per image/batch, quality, backend stability |
| **3D/simple renders** | ComfyUI 3D workflows or candidate tools | basic asset/render test | feasibility, time, quality (or mark defer) |
| **H3 video generation (R&D)** | available workflow/tool if found | short test clip | viability, time, quality — **do not promise until proven** |
| **Slides/web visuals** | design skills + export | 10-slide deck, 1 landing visual/page | production time (light lane), export fidelity |

**AMD acceleration to evaluate:** Vulkan, DirectML (Windows), ROCm (Linux if applicable), CPU fallback. Pick the most stable backend per pipeline; document exact versions.

## Phase 3 — Local access layer (web / open-cloud)
- [ ] Stand up chosen local web UI(s): Hermes dashboard and/or ComfyUI/other creative UIs as needed
- [ ] LAN access test from another device; auth enabled; bind safely (not open to LAN without auth)
- [ ] File/artifact delivery path for large renders (share/sync/folder) — test with a sample mp4/wav/pdf
- [ ] Reverse proxy/TLS if needed; document start/stop, ports, health checks
- [ ] Runbook: backup/restore configs/templates/assets

## Phase 4 — Linux plan (post-stabilization or dual-boot)
- [ ] Decide: dual-boot vs dedicated Linux vs WSL2 for specific workloads
- [ ] Re-test key creative pipelines; compare stability/perf vs Windows (esp. ComfyUI/AMD backends)
- [ ] Keep portable configs/templates/workflows; note OS-specific steps

## Phase 5 — Production readiness gate
- [ ] Capacity/SLA sheet finalized from measured numbers (`plans/03-capacity-sla-model.md`)
- [ ] First 3 offers locked with validated caps (max duration/res/fps/count) and turnaround
- [ ] Portfolio samples created (hyperframes video, before/after upscale, slide deck/web visual; soundtrack once ready)
- [ ] Creative Agency OS templates in use (intake → pre-prod → produce → QA → handover)
- [ ] Backup/restore tested; secrets/licensing rules documented

## Evidence log (fill during bring-up)
| Date | OS | Pipeline/tool | Version/driver/backend | Test input | Time | Output/quality | Notes |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
