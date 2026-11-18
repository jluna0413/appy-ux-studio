# 05 — Initial Offers & Dogfood Plan (Draft, Blend)

**Goal:** launch a **blend (A+B+C)** of hardware-aware, quick-turnover offers we can deliver on one EVO-X2 (plus existing Intel Arc B70 lab expertise), and build each as a dogfooded, white-label module.

## Blend strategy
- **C (Automation & Agent Workflow / Agency OS):** light-lane, spec-first, fastest to productize and white-label.
- **A (Privacy-first/Local AI ops):** local inference, model setup, portability, and **multi-vendor GPU troubleshooting (AMD + Intel Arc/XPU)** — a key differentiator backed by proven breakthroughs.
- **B (Content & media repurposing):** template-driven production; heavy renders/large batches queued and slot-based.

## Candidate offers (1-box friendly, slot-based)
| Offer | Lane | Typical SLA | Why it fits now | Core deliverables | Reusable module assets |
|---|---|---|---|---|---|
| **Research Brief (cited)** | Light (2–3 parallel) | 24–48h | Low compute, high demand, easy to QA | Scoping, sourced findings, gaps/opportunities, recommendations, source list | Intake prompts, brief template, citation/evidence checklist, QA checklist |
| **Automation / Workflow Blueprint** | Light (spec-first) | 48–72h | Sells expertise without heavy runtime; upsell to pilot | Current/future-state map, tool/data spec, phased plan, ROI/effort, risks/runbook notes | Process-mapping template, blueprint doc, ROI matrix, handover SOP |
| **Local AI & GPU Troubleshooting / Setup (AMD + Intel Arc)** | Light (audit/diagnosis/plan) → Medium (guided fix/pilot) | 24–72h audit/plan; 3–7d pilot | Leverages proven Intel Arc B70/XPU breakthroughs + EVO-X2 AMD prep; clients often stuck on drivers/runtime/portability | Environment diagnosis, root-cause analysis, fix/portability plan or guided remediation, verified runbook, benchmark/next steps | Diagnostics intake, troubleshooting runbook template, env-capture checklist, verification report, sanitized case study |
| **Content Repurposing Pack** | Light–Medium (text/light assets); renders queued | 48–72h | Template-driven, repeatable, bundles well | Source summary, scripts/hooks/captions/posts, plan/calendar, optional visual notes | Repurposing matrix, voice/tone brief, content templates, QA checklist |
| **Local AI / Knowledge Ops Setup Plan** (spec + runbook) | Light (plan) / Medium (pilot later) | 72h plan; 5–7d pilot | Leverages 64GB unified mem & local stack interest; privacy angle | Stack recommendation, architecture, model/workflow plan, install/runbook, risk notes | AMD/Intel-aware setup checklist, model selection guide, runbook template |

**Recommended launch trio (blend):** 
1. **Research Brief (cited)** — fast cash/reviews, pure light lane.  
2. **Automation / Workflow Blueprint** — high-value spec product, white-label core.  
3. **Local AI & GPU Troubleshooting / Setup (AMD + Intel Arc)** — differentiator using proven breakthroughs (llama.cpp, PyTorch portability, Intel Arc/XPU TTS learnings) and EVO-X2 learnings as they mature.  
*Add Content Repurposing Pack as 4th once templates/samples are smooth; keep heavy media renders slot-based.*

## Dogfood workflow (for every offer)
1. **Scope:** use `templates/agency-os/intake-questionnaire.md` + `scope-and-sla.md`
2. **Produce:** follow the offer’s boilerplate in `boilerplates/`
3. **QA & handover:** use `templates/agency-os/qa-and-handover-checklist.md`
4. **Capture reuse:** save a blank template, a filled sanitized sample, and a short how-to/config notes
5. **Measure:** log cycle time, lane used, revisions, blockers to refine SLAs/capacity

## Package spec (fill in when chosen)
### Offer 1: ____________________
- **Promise/outcome:** 
- **Inputs required:** 
- **Deliverables:** 
- **SLA/slot:**  **Revision rounds:** 
- **Price hypothesis:** 
- **Template/boilerplate path:** 

### Offer 2: ____________________
- (same fields)

### Offer 3: ____________________
- (same fields)

## 2-week prep sprint (before EVO-X2 arrives)
- [ ] Lock launch trio package boundaries, SLAs, and revision limits
- [ ] Create 1 filled sample + 1 blank white-label version per offer (sanitize Intel Arc case studies where used)
- [ ] Draft Fiverr/Upwork/PPH listing copy in `templates/offers/`
- [ ] Define local web/open-cloud access checklist for delivery/handover
- [ ] Prepare benchmark + diagnostics matrix (AMD arrival tests + Intel Arc repro/test cases) to validate claims and SLAs
- [ ] Capture “what ships with EVO-X2” and OS/access decisions on arrival (update plans/notes)
