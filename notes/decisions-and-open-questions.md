# Decisions & Open Questions — EVO-X2 Migration

## Confirmed decisions (from user)
- **Hardware (new):** GMKtec EVO-X2, 64GB RAM, 1TB SSD (AMD), dedicated to agency work; scale later with clusters.
- **OS on arrival:** **Unknown until it arrives** — user will update when delivered. Windows-based expected; plan to **run Linux** on it (dual-boot or migration path TBD).
- **Access:** primarily via **local web interface** or **local open-cloud setup** (LAN/self-hosted).
- **Strategy:** **Blend (A + B + C)** — (A) privacy-first/local AI ops, (B) content & media repurposing (slot-based renders), (C) automation & agent workflow / Agency OS — built with hardware-aware capacity (1-box constraints) and **modular, reusable, white-label templates/boilerplates** (dogfood while configuring).
- **Staging:** prep skills, plans, templates, and boilerplates in `EVO-X2 Migration/` until hardware arrives.

## Key strategic insight (2026-11-15)
- **Don’t overlook Intel/Arc expertise:** while prepping for AMD EVO-X2, we have **proven breakthroughs on Intel Arc B70 (XPU)** and related tooling that are directly serviceable to clients. Some client issues will be on Intel-based hardware (or heterogeneous setups) — e.g. local inference, PyTorch device portability (CUDA→XPU), Vulkan/XPU TTS pipelines (Fish Speech S2/s2.cpp), driver/runtime quirks, Windows diagnostics. This is a differentiator: multi-vendor local-AI & hardware troubleshooting (AMD + Intel Arc) packaged as audits/fixes/runbooks/templates.

## Open questions (need answers to finalize pivot & offers)
1. **Exact hardware/OS details (on arrival):** What OS ships with EVO-X2? Exact CPU/APU/GPU model? Target Linux distro (Ubuntu/Fedora/etc.), dual-boot vs replace vs WSL2 for specific workloads?
2. **Local vs API-hybrid:** prioritize running models locally on EVO-X2 (privacy/cost, more setup) or API-backed delivery with local orchestration/templates (faster to ship)?
3. **First 2–3 productized offers to launch:** lock packages/SLAs for the blend — e.g. Research Brief, Automation/Workflow Blueprint, Content Repurposing Pack, Local AI & GPU Troubleshooting/Setup (AMD + Intel Arc).
4. **Access stack choice:** which local web UI/open-cloud components (Hermes dashboard, file share/sync, reverse proxy/auth, etc.)?
5. **Community catalog risk posture:** trial community-tier skills/plugins in sandbox profile first, then promote? any categories off-limits?
6. **Existing project priority:** migrate/continue TakeOut or other heavy projects on the agency box, or keep it dedicated to light/queued client work?
7. **Intel Arc B70 availability:** will the Arc B70 machine remain accessible as a lab/test asset alongside EVO-X2 for client troubleshooting/repro?

## Decision log
| Date | Decision | Rationale | Owner | Follow-up |
|---|---|---|---|---|
| 2026-11-15 | Create `EVO-X2 Migration/` staging workspace with plans, templates, boilerplates, skills, notes | Prep before hardware arrival; dogfood into resellable assets | Orchestrator | Populate and refine as choices are made |
| 2026-11-15 | Adopt **Blend (A+B+C)** strategy | Balance quick-turnover light-lane revenue with local-AI/media capability growth under 1-box constraints | User + Orchestrator | Finalize first 2–3 offers and slot SLAs |
| 2026-11-15 | Treat **Intel Arc B70/XPU breakthroughs** as core serviceable assets | Clients may need Intel/Arc troubleshooting; proven wins (TTS/XPU/portability) differentiate us beyond AMD-only focus | User | Inventory skills, create troubleshooting offer/boilerplate, capture sanitized case studies |
| 2026-11-15 | OS shipped with EVO-X2 = **TBD on arrival** | User will report when delivered | User | Update bring-up/access plans and benchmarks at that point |

## Notes / risks
- AMD acceleration path is **unknown until benchmarked** (Vulkan vs DirectML vs ROCm varies by OS/APU/driver). All performance claims must be evidence-backed.
- Intel Arc/XPU fixes are environment-specific (driver/runtime/Vulkan/SYCL/IPEX/oneAPI versions); troubleshooting offers must be scoped with diagnostics, stated assumptions, and verified outcomes.
- One-box constraint: sell slot-based, fixed-scope delivery; avoid parallel heavy jobs.
- Keep secrets/client data out of templates and versioned repos.
