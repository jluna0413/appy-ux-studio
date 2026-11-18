# 03 — Capacity & SLA Model (Single EVO-X2, 64GB/1TB) — Creative Studio

**Premise:** one dedicated machine = finite throughput. Creative work is **demoable but render-heavy**. Sell **fixed-scope, slot-based delivery** and quote turnaround from benchmarks, not guesses.

## Execution lanes
| Lane | Examples | Concurrency (initial) | Notes |
|---|---|---|---|
| **Heavy (GPU/CPU/render-bound)** | Hyperframes video renders, video upscaling, frame-rate interpolation, AI image/3D generation, music/soundtrack generation, large exports/encodes | **1 at a time** | Queue into booked slots; expect thermals/long runs; never overlap heavy jobs |
| **Medium** | ComfyUI graph prep/test runs, asset prep/conversion, batch file processing, browser previews/captures | **1 (or 1 + light)** | Watch RAM/VRAM/unified memory and disk I/O |
| **Light** | Scripting/storyboards, slide/web design, copy/captions, client comms, intake/scoping, QA review (non-render), templating | **2–3 parallel** | Bounded by owner attention/review, not compute |

**Reserve headroom:** keep ~20–25% RAM/CPU (and GPU/unified memory) for OS, agent/orchestration, browser/tools. Internal template-building and sample creation fill idle gaps but never block paid P0/P1 slots.

## Queue & priority
- **P0:** paid urgent / due today
- **P1:** standard paid orders
- **P2:** revisions (within scope)
- **P3:** internal samples, template/R&D, benchmarks
- Rule: do not start a heavy job if it risks a P0/P1 deadline; batch by “next available render slot.”

## Turnaround SLAs (starting point — **recalibrate after EVO-X2 benchmarks**)
| Package tier | Scope | Slot/capacity (initial) | Advertised turnaround | Client inputs required upfront |
|---|---|---|---|---|
| **Micro** | 1 small deliverable (thumbnail/graphic, short clip fix, 5–10 slides polish, short music loop) | 1–3/day mixed (if no long heavy job) | **24–48h** | Brief, assets, brand/style refs, output specs |
| **Standard** | Core package (15–30s promo video, 10–20 slides, single clip upscale/frame-boost, 1 soundtrack bed) | 1/day typical | **48–72h** | All Micro inputs + script/outline, source files/length, format targets |
| **Batch/Enhanced** | Longer/multi-asset (30–60s+ video, multi-clip upscale, 20–40 slides, asset packs) | 1 active batch queued | **3–5 days / booked slot** | Final scope, all assets, approvals plan, batch list |
| **Custom/Pilot** | New style/pipeline (H3 experiment, 3D-heavy pack, complex infomercial) | 1 active at a time | **5–7 days (scoped)** | Detailed brief, refs, milestones, acceptance criteria |

**Benchmark before promising:** measure *per-minute* times for upscaling & frame interpolation, *per-export* render for hyperframes, and *per-track/per-image* generation times on EVO-X2; publish realistic caps (max minutes, resolution, fps, duration).

## Pricing/ops guardrails
- Fixed scope + fixed inputs + fixed revision rounds (e.g. 1–2) in every offer; extras = new scope/slot.
- Quote by **duration/count/complexity**, not unlimited runtime (e.g. “up to 60s source, up to 1080p→4K or 30→60fps” once validated).
- Rush add-on only when the heavy lane/queue is free.
- Use “next available render slot” language; provide preview/proof frames or short sample when useful.
- Track per job: intake complete, queue time, heavy-lane minutes, render attempts, revision count, delivered-on-time.

## Scale triggers (add capacity/cluster or offload)
- Sustained queue > 3 days
- Frequent need to overlap heavy jobs (e.g. render + upscale + generation)
- Per-job render/generation time makes SLAs unreliable
- > ~60–70% utilization of heavy lane over 2+ weeks

## Metrics dashboard (weekly)
| Metric | Target (initial) | Actual |
|---|---|---|
| On-time delivery % | ≥ 95% |  |
| Avg cycle time vs SLA | within buffer |  |
| Revision rate | < 20% jobs |  |
| Heavy-lane utilization | track |  |
| Render minutes per paid job | track |  |
| Queue length (days) | < 3 |  |
