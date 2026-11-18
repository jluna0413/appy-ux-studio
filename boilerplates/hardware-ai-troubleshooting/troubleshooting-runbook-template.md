# Local AI & GPU Troubleshooting / Setup Runbook — [Client/Case] (Template)

> **Boilerplate:** Hardware/Local-AI Troubleshooting & Setup (AMD / Intel Arc / CPU, Windows/Linux)  
> **Version:** v0.1 | **Date:** ____ | **Author:** ____ | **Status:** Draft/Final  
> **Use:** white-label, evidence-backed diagnostic/fix/handover. Record what was *observed and verified* — never claim untested results.

## 1) Engagement summary
- **Client/context:** 
- **Goal (desired outcome):** 
- **Scope:** audit/diagnosis only / diagnosis + fix plan / guided fix or pilot implementation
- **SLA/slot:** ____  **Environment access provided:** remote-guided / logs-only / hands-on (details: ____)
- **Constraints & safety:** data sensitivity, no-prod-change windows, backup/rollback requirements

## 2) Environment snapshot (capture before changes)
| Item | Observed value | How captured (command/tool/screenshot) |
|---|---|---|
| OS & build |  |  |
| CPU / RAM |  |  |
| GPU(s) (vendor/model/VRAM or unified mem) |  |  |
| Driver/runtime versions (GPU, Vulkan/DirectML/ROCm/SYCL/oneAPI/IPEX/CUDA if relevant) |  |  |
| Python/conda/venv & key packages (torch, transformers, etc.) |  |  |
| Target app/model/tool versions (llama.cpp, ComfyUI, s2.cpp, etc.) |  |  |
| Relevant env vars / PATH notes |  |  |
| Storage/thermal/power notes (if relevant) |  |  |

## 3) Problem statement & symptoms
- **Reported issue:** 
- **Expected behavior:** 
- **Actual behavior:** 
- **Reproduction steps (minimal):** 
- **Error messages/log excerpts:** 
- **When it started / recent changes:** 

## 4) Diagnostics performed
| # | Hypothesis | Check/command | Result (evidence) | Conclusion |
|---|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## 5) Root cause analysis
- **Primary cause (evidence-backed):** 
- **Contributing factors:** 
- **What was ruled out:** 
- **Confidence level:** High / Medium / Low (why: ____)

## 6) Remediation plan / changes made
> Apply least-risk fixes first; document every change for rollback.

| # | Action (planned or executed) | Rationale | Risk/rollback | Status |
|---|---|---|---|---|
| 1 |  |  |  | Planned/Done |
| 2 |  |  |  |  |

## 7) Verification & results
| Test | Command/procedure | Expected | Observed (evidence: output/log/metric/file) | Pass? |
|---|---|---|---|---|
|  |  |  |  |  |

**Outcome summary:** resolved / partially resolved / not resolved (blocked) — details: ____

## 8) Performance/quality notes (if applicable)
- **Model/workload:**  **Quant/precision/backend:**  **Settings:** 
- **Metrics:** tokens/s, latency, RTF, render time, memory use, quality notes (with measurement method)
- **Hardware-specific notes:** (e.g. AMD Vulkan/DirectML/ROCm, Intel Arc XPU/SYCL/Vulkan, CPU fallback)

## 9) Handover, runbook & maintenance
- **How to run/start:** 
- **Known-good config/commands:** 
- **Update/upgrade cautions (drivers, runtimes, packages):** 
- **Monitoring/health checks:** 
- **Backup/rollback steps:** 

## 10) Recommendations & next steps
| Priority | Recommendation | Impact | Effort | Notes |
|---|---|---|---|---|
| 1 |  |  |  |  |

## 11) Open issues / follow-ups
- **Blockers (access, hardware limits, vendor bugs):** 
- **Questions for client:** 
- **Suggested follow-on package:** setup hardening / pilot implementation / benchmark & sizing / template handover

---
*QA checklist: environment captured, evidence attached, changes & rollback documented, verification explicit, secrets/PII redacted.*
