# 02 — Marketplace & Skills Evaluation (Creative Studio, AMD EVO-X2)

**Goal:** build a tangible, visual/audio production stack for EVO-X2 (AMD, 64GB) while keeping it simple, stable, and sellable. Trial in sandbox/profile, validate on hardware, then promote.

## A. Installed/local skills to leverage (creative core)
| Area | Skills/assets | What we can produce now | EVO-X2 migration/validation notes |
|---|---|---|---|
| Motion/video (HTML→video) | `hyperframes` | Short-form promos, captioned reels, infomercials, intros/outros, kinetic type/motion graphics | Depends on Node/ffmpeg/Chrome headless; benchmark render speed and stability. **Heavy lane** for final renders. |
| Image/video/3D generation & workflows | `comfyui` (+ workflow refs/scripts) | Images, thumbnails, style assets, some video/audio/3D workflows depending on models/nodes | **Key AMD target:** validate backend (DirectML/Vulkan/CPU/ROCm as available) and per-workflow render times/quality. |
| Visual design & web/presentation | `sketch`, `claude-design`, `popular-web-designs`, `design-md`, `architecture-diagram`, `baoyu-infographic` | Landing/web visuals, infomercials pages, slide/deck designs, branded mockups/templates | Mostly light-lane; export formats (HTML/PDF/PPTX/images) to confirm per workflow. |
| Content packaging | `youtube-content`, `social-media-content-calendar`, `humanizer` | Scripts/captions/hooks, repurposing plans, descriptions (supporting video offers) | Light-lane; supports but doesn’t replace core visual production. |
| Music/audio (knowledge) | `songwriting-and-ai-music` | Songwriting/soundtrack briefs, prompt craft for music generation | Pairs with ACE-Step/music pipeline once validated. |
| Docs/delivery | `pptx/powerpoint`, `pdf`, `docx`, `xlsx` | Slide decks, client handover PDFs, briefs, asset lists | Core delivery formats for tangible packages. |

## B. Hermes catalog candidates to trial (visual/audio production)
*From catalog search (community tier unless noted). Not installed/validated — trial, benchmark, then adopt/defer/reject.*

| Candidate | Kind | Target capability | Offer it supports | Priority | Validation focus |
|---|---|---|---|---|---|
| `skills-sh/artokun/comfyui-mcp/video-upscale` | skill | Video upscaling via ComfyUI/MCP workflow | Video upscale & enhancement | **High** | Quality, speed/min, max res/length, AMD backend compatibility |
| `skills-sh/awesome-genmedia/skills/topaz-upscale-video` | skill | Topaz-based video upscale (if available/licensed) | Premium upscale option | Medium | Licensing/cost, install deps, quality vs open workflows |
| `skills-sh/openmontageinc/openmontage/acestep` (and related `acestep`) | skill | ACE-Step music/soundtrack generation | Custom soundtrack / music beds | **High** | **ACE-Step 1.5** availability/runtime, quality, generation time, AMD/CPU/Vulkan support |
| `skills-sh/layerai/skills/layer-audio` | skill | Audio/music workflows | Soundtrack/SFX support | Medium | Fit with ACE-Step, ease of use, output quality |
| `skills-sh/layerai/skills/layer-video-fixes` | skill | Video fixes/enhancement utilities | Cleanup/repair add-ons | Medium | Actual capabilities, reliability |
| `shipyard-video` | skill | Video production workflows | Short-form/video packaging | Medium | Deps, render speed, output quality on 1 box |
| `skills-sh/inference-sh/skills/ai-video-generation` | skill | AI video generation workflows | H3/alt video-gen exploration | Medium | Model/runtime needs, quality, speed on EVO-X2 |
| `comfyui-directml-amd` | skill | AMD/DirectML path for ComfyUI (Windows) | Images/video/3D workflows on AMD | **High** | Compatibility with EVO-X2 APU, node/model support, perf/stability |
| `whisper-gpu-transcriber-skill` | skill | Transcription for captions/subtitles | Captions/subtitle add-on for videos | Medium | Backend support on AMD/Windows/Linux, accuracy/speed |

> **H3 video generation:** no confirmed installed skill found; evaluate via ComfyUI/community workflow or relevant catalog tool on arrival — treat as R&D until benchmarked.

## C. Existing hardware note (Intel Arc B70)
- Proven breakthroughs exist (e.g. local inference/TTS portability work). For this **visual-creative pivot**, treat Arc B70 only as an **optional secondary/test asset** if a specific tool runs better there; do not build core offers around it unless validated.

## D. Evaluation protocol (per candidate/tool)
1. **Tangible output:** does it produce a demoable visual/audio result clients value?
2. **Install & deps:** OS/runtime, models, licenses/cost, disk footprint (1TB budget).
3. **Smoke test:** minimal reproducible output (sample clip/image/track) with recorded command/settings.
4. **Benchmark:** time per asset/minute, quality, resource use, stability/failure modes on EVO-X2.
5. **Productize:** can we wrap into a fixed-scope package with clear inputs, presets, and QA checklist?
6. **Decision:** Adopt / Adopt-with-guardrails / Defer / Reject.

## E. Decision log
| Date | Item | Version | OS | Hardware/Backend | Test | Result (time/quality) | Decision | Notes/template |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |
