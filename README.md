# EVO-X2 Migration Workspace

Staging area to prepare skills, plans, templates, and boilerplates for the **GMKtec EVO-X2 (64GB RAM / 1TB SSD, AMD)** agency machine before it arrives — and to package our existing breakthroughs (including **Intel Arc B70 / XPU**) into sellable, white-label agency capabilities.

## Hardware & deployment intent
- **New machine:** GMKtec EVO-X2, 64GB unified memory, 1TB SSD (AMD APU platform), dedicated to agency work (scale later with clusters)
- **OS on arrival:** **Unknown** (user will confirm when it arrives). Windows-based expected; **Linux planned** (dual-boot or migration path TBD).
- **Access model:** primarily via **local web interface** and/or **local open-cloud setup** (self-hosted dashboard/services on LAN), so the box can act as a headless-capable agency engine.
- **Existing lab asset:** **Intel Arc B70 (XPU)** workstation with proven local-AI/TTS breakthroughs — a serviceable capability for clients with Intel/Arc or heterogeneous hardware issues (not just AMD).

## Strategic direction: Blend (A + B + C)
- **A) Privacy-first/local AI ops:** local inference, model setup/portability, doc processing, transcription/SOP workflows (AMD EVO-X2 + Intel Arc expertise).
- **B) Content & media repurposing studio:** research → scripts/assets/calendars, with heavy renders queued/slot-based.
- **C) Automation & agent workflow agency:** blueprints, SOPs, Agency OS, repeatable delivery systems.
- **Cross-cutting differentiator:** **multi-vendor local-AI & GPU troubleshooting** (AMD + Intel Arc/XPU). We can service clients who hit hardware/runtime issues (drivers, Vulkan/DirectML/ROCm/SYCL/XPU, CUDA-to-portable paths, local TTS/inference) — turning our own breakthroughs into audits, fixes, runbooks, and white-label templates.

## Goals
1. **Bring-up ready:** benchmark-driven setup checklists for Windows and Linux, with AMD acceleration paths validated on arrival (Vulkan/DirectML/ROCm as applicable). OS/runtime choices finalized once hardware ships.
2. **Agency OS:** build our internal delivery system as modular, reusable, white-label templates/boilerplates (dogfood every workflow).
3. **Capacity-aware delivery:** define 1-box parallel vs sequential lanes, queue/slot model, and realistic turnaround SLAs.
4. **Service catalog:** productized, quick-turnover offers (research, automation blueprints, content repurposing, local AI/hardware troubleshooting & setup) fulfillable within hardware constraints.
5. **Skills & tooling:** inventory what to migrate, what to install, and which Hermes catalog items to trial — while preserving and productizing proven Intel Arc B70/XPU skills.

## Folder structure
- `plans/` — bring-up checklists, migration phases, capacity/SLA model, marketplace evaluation, offers & dogfood plan
- `skills/` — skills inventory, migrate-vs-acquire matrix, AMD + Intel Arc/local stack notes, validation logs
- `templates/` — reusable Agency OS and offer templates (blank + configurable)
- `boilerplates/` — ready-to-fill deliverable boilerplates (briefs, blueprints, repurposing packs, troubleshooting runbooks, SOPs)
- `notes/` — decisions, benchmarks, open questions, experiment logs

## Operating principles
- **Validate before claiming:** record commands, versions, benchmarks, and outputs for every stack decision (especially acceleration paths and hardware-specific fixes).
- **One heavy lane at a time:** local inference/render/build jobs are queued; light knowledge work (research, docs, SOPs, proposals) can run in parallel.
- **Modular & white-label:** every internal system is designed as `README + blank template + filled sample + how-to + config/branding variables`.
- **Dogfood loop:** each job should yield (a) client deliverable, (b) reusable template/boilerplate, (c) sanitized sample/case study.
- **Secrets isolated:** configs/templates versionable; keys/tokens/client data kept out of templates and repos.
- **Evidence over claims:** especially for hardware troubleshooting — capture environment, symptoms, diagnostics, fix, and verification.

## Status
- [x] Workspace scaffold created
- [x] Strategic direction set: **Blend (A+B+C)** with multi-vendor local-AI/hardware troubleshooting differentiator
- [ ] Confirm OS shipped with EVO-X2 and finalize Windows/Linux plan (update on arrival)
- [ ] Confirm exact EVO-X2 APU/GPU model and run acceleration benchmarks on arrival
- [ ] Define access stack (local web UI / open-cloud components)
- [ ] Finalize initial 2–3 productized offers + SLAs and create filled samples
- [ ] Package Agency OS v1 (internal + white-label)
