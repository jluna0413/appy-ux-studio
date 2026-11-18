# Skills, Tools & Stack Inventory — EVO-X2 Migration

**Purpose:** track what we already have, what to migrate to the EVO-X2, and what to acquire/trial (AMD + local web/open-cloud) — while preserving and productizing **proven Intel Arc B70/XPU breakthroughs** as a multi-vendor service capability.

## 1) Proven, serviceable assets today (high-value differentiators)

### Intel Arc B70 / XPU & device-portability breakthroughs (client-serviceable)
| Skill/asset | Proven capability (from skill knowledge) | Client-facing service potential | Productization artifact |
|---|---|---|---|
| `fish-speech-s2-xpu` | Fish Speech S2 Pro TTS on Intel Arc via s2.cpp/Vulkan; voice cloning, emotion tags, low-latency vs prior Ming ceiling | Local/private TTS & voice-cloning setup on Intel Arc, Vulkan TTS pipelines, creator/voice workflows | Setup/runbook, troubleshooting checklist, benchmark template, sanitized demo |
| `xpu-tts-inference` | TTS inference on Intel XPU without CUDA; documents XPU ceiling/pitfalls and escalation paths | “Make TTS work on Intel GPU” diagnostics, quality/perf tuning, alternative-stack recommendations | Diagnostic + fix report template, environment capture checklist |
| `pytorch-device-portability` | Port CUDA-assuming PyTorch workloads to XPU/CPU/MPS; device checks, autocast/allocator/memory pitfalls | CUDA→XPU portability fixes, “it only runs on NVIDIA” remediation, local inference enablement | Portability audit, patch/runbook, verification script template |
| `llama-cpp` | Local GGUF inference, quant selection, Vulkan/CPU/other backends, HF model discovery | Local LLM setup/optimization (privacy/offline), model sizing/quant guidance across hardware | Model selection & sizing guide, install/runbook, perf benchmark sheet |
| `litellm-workflow-generation` | Multi-agent/workflow specs via LiteLLM (local/API) | Workflow/agent blueprinting, local+API hybrid routing designs | Workflow blueprint boilerplate, config templates |
| `windows-system-diagnostics` | Diagnose Windows audio/services/popups issues | Client workstation troubleshooting (often blocks AI/media workloads) | Diagnostic report template |
| `global-dev-rules`, `decision-model`, `handwired` | Dev discipline, typed decisions, TS→WGSL→HLSL compiler workflows | Engineering process hardening, specialized dev tooling consults/templates | SOPs/checklists, reusable patterns |

**Positioning:** we don’t only “build on AMD” — we **diagnose, port, and optimize local AI across vendors** (AMD, Intel Arc/XPU, CPU; Windows/Linux), backed by documented breakthroughs.

## 2) Installed/available Hermes skills to leverage & migrate
| Cluster | Key skills | Agency use | EVO-X2 migration/validation notes |
|---|---|---|---|
| Local inference & portability | `llama-cpp`, `pytorch-device-portability`, `litellm-workflow-generation`, `huggingface-hub`, `huggingface-tokenizers` | Local LLM gateway, model selection/quants, workflow specs, private/offline-ish processing | **Validate AMD paths on arrival:** Vulkan (llama.cpp), DirectML/ROCm where applicable; benchmark tokens/s, RAM, stability. Prefer GGUF baseline on 64GB unified. |
| Creative & media | `comfyui`, `hyperframes`, `manim-video`, `p5js`, `sketch`, `claude-design`, `architecture-diagram`, `baoyu-infographic`, `design-md`, `youtube-content`, `social-media-content-calendar`, `humanizer` | Content/repurposing packs, visuals, thumbnails/assets, calendars, decks/diagrams | Heavy renders = queued/slot-based. Benchmark image/video pipelines on EVO-X2. |
| Voice/audio | `fish-speech-s2-xpu`, `xpu-tts-inference`, `songsee` | TTS/voice workflows, audio analysis | Intel Arc paths proven; **reassess/port for AMD** (CPU/Vulkan/DirectML/ROCm) on arrival — no drop-in assumptions. |
| Research & knowledge | `research/*` (`grounded-citations`, `competitor-news-monitor`, `scrapling`, `rss-feeds`, `arxiv`, `llm-wiki`), `web/*` | Cited briefs, competitor/market research, monitoring, source-backed deliverables | Low compute, high value (“light lane”). Confirm browser/scraping deps on both Windows/Linux. |
| Docs & productivity | `docx`, `pdf`, `pptx/powerpoint`, `xlsx`, `notion`, `obsidian`, `meeting-action-items`, `weekly-review-planning`, `live-dashboard` | Reports, SOPs, templates, trackers, client handovers | Core delivery formats; easy to productize/white-label. |
| Automation, dev & ops | `hermes-agent`, `autonomous-ai-agents/*`, `devops/kanban-*`, `github`, `systematic-debugging`, `test-driven-development` | Agent/workflow orchestration, repeatable pipelines, versioned templates, QA discipline | Migrate profiles/configs/skills; keep secrets separate. Validate local web UI/open-cloud access model. |

## 3) Hermes catalog candidates to trial (AMD + agency expansion)
*Community tier unless noted; trial in sandbox, benchmark, then adopt/defer/reject.*

| Candidate | Kind | Target need | Potential service/output | Priority | Status |
|---|---|---|---|---|---|
| `comfyui-directml-amd` | skill | AMD image workflows (Windows/DirectML) | Image packs, thumbnails, ad creatives (slot-based) | High | Not installed |
| `rocm-doctor` | skill | ROCm readiness/diagnostics (Linux) | Local AI workstation audit/runbook | High | Not installed |
| `rocm-vllm-deployment` | skill | Model serving on ROCm | Private LLM endpoint/setup templates | Medium | Not installed |
| `sglang-amd-bench` | skill | AMD inference benchmarking | Perf/benchmark reports, sizing guidance | Medium | Not installed |
| `whisper-gpu-transcriber-skill` | skill | Faster transcription | Subtitles, meeting/video-to-content packs | Medium | Not installed |
| `shipyard-video` | skill | Video workflows | Short-form/video template packages | Medium | Not installed |
| `local-fleet` | plugin | Local model/resource management | Multi-model/local inference management templates | Medium | Not installed |
| `inference-exchange` | plugin | Inference routing/management | Model gateway/routing boilerplates | Low–Med | Not installed |
| `model-forge` | plugin | Model build/management | Model ops templates (later) | Low–Med | Not installed |
| `local-inference-context` | skill | Local inference patterns | Playbooks/runbooks | Low | Not installed |
| `huggingface-local-models` | skill | Local HF model workflows | Compare vs installed llama-cpp/hub flow | Low | Not installed |

## 4) Migrate vs acquire (EVO-X2)
### Migrate (first wave)
- [ ] Hermes profiles, config, skills, and Agency OS/templates repo
- [ ] Prompt libraries, SOPs, checklists, sanitized portfolio samples
- [ ] Proven Intel Arc/XPU runbooks and sanitized case studies (serviceable immediately)
- [ ] Active client-agnostic assets (brand frameworks, report/brief/blueprint/troubleshooting templates)

### Acquire/install baseline (P0)
- [ ] OS updates, AMD chipset/GPU drivers, power/perf tuning (once OS confirmed)
- [ ] Git, Python (uv/venv), Node.js, ffmpeg, ripgrep, jq, 7zip, browsers
- [ ] Hermes runtime + auth/config (secrets isolated)
- [ ] Backup + restore test, password manager, LAN/firewall rules

### Acquire/install as needed (P1)
- [ ] llama.cpp (Vulkan build if beneficial), model weights/cache strategy
- [ ] LiteLLM/local gateway components (if used)
- [ ] ComfyUI + AMD-appropriate backend (DirectML/Vulkan) and only required models
- [ ] Transcription/media tooling validated for AMD/Windows/Linux
- [ ] Local web UI / open-cloud stack per `plans/04-access-architecture.md`

### Defer until justified by demand/benchmarks
- [ ] Heavy fine-tuning stacks, large multi-model fleet orchestration, cluster tooling
- [ ] Migrating high-contention projects (e.g. Unity/TakeOut workloads) onto the agency box

## 5) Validation record
| Date | Item (skill/tool/model) | OS | Hardware/Backend (AMD/Intel Arc/CPU/Vulkan/DirectML/ROCm/XPU/API) | Test | Result | Decision |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
