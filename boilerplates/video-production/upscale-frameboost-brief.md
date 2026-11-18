# Video Upscale & Frame Boost Brief — [Project/Client] (Template)

> **Boilerplate:** Video Enhancement (upscaling and/or frame-rate interpolation)  
> **Version:** v0.1 | **Date:** ____ | **Owner:** ____ | **SLA slot:** ____  
> **Note:** heavy, queued job — quote from benchmarked per-minute times; results depend on source quality.

## 1) Project basics
- **Client/brand:** 
- **Goal:** sharper (upscale) / smoother (frame boost) / both
- **Use case:** social/web/presentation/archive/other: ____

## 2) Source file details (required)
- **File(s) & location:** 
- **Duration:** ____  **Size/codec:** ____
- **Current resolution:** ____  **Current FPS:** ____
- **Audio:** keep original / replace / none
- **Known issues:** noise, blur, compression artifacts, interlacing, judder: ____

## 3) Requested output (set realistic caps per benchmarks)
| Option | Request | Validated cap/notes |
|---|---|---|
| Upscale | target resolution (e.g. 1080p / 4K): ____ |  |
| Frame interpolation | target FPS (e.g. 30 / 60fps): ____ |  |
| Format/codec | mp4/h264/h265, bitrate/quality: ____ |  |
| Audio handling | passthrough / re-encode: ____ |  |
| Length limit this slot | ____ minutes/seconds |  |

## 4) Pre-production checks (light lane)
- [ ] Source playable and complete; backup copy made
- [ ] Rights/permission to modify footage confirmed
- [ ] Target spec agreed and within validated capacity/slot
- [ ] Expected limitations explained (can’t invent missing detail; artifacts possible on hard cases)

## 5) Production (heavy lane = queued, 1 at a time)
- **Tool/workflow:** (ComfyUI workflow / catalog tool / other): ____  **Backend:** ____
- [ ] Test sample/preview on short segment approved (if in scope)
- [ ] Full job run with logged settings/preset: ____
- [ ] Processing time: ____ (log for benchmarks/SLA)

## 6) QA (before/after)
- [ ] Visual: sharpness/detail gain vs artifacts (halos, shimmer, distortion)
- [ ] Motion (if interpolated): smoothness vs warping/ghosting on fast motion
- [ ] Sync & integrity: duration correct, audio in sync, no dropped frames/glitches
- [ ] Output specs verified: resolution __ / fps __ / codec __ / plays correctly
- [ ] Before/after comparison exported for client (if helpful): [ ]

## 7) Handover
- **Delivered file(s) & location:** 
- **Settings summary/preset saved:** [ ]
- **Notes/limitations observed:** 
- **Reusable preset/workflow saved (sanitized):** [ ]
- **Portfolio sample candidate (with permission):** [ ]
