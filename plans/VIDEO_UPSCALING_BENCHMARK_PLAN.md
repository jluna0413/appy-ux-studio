# Video Upscaling Benchmark & Pricing Plan

**Date:** 2026-11-26
**Status:** PLANNING PHASE (GPU busy — benchmarks to run when GPU frees up)
**Context:** Current pricing is unclear about duration coverage. Need to establish turnaround benchmarks and charge by 60-second intervals.

---

## 1. The Problem

Current BYOV pricing says "Up to 60 seconds" for $49-$179 but doesn't clarify:
- What happens if the video is 90 seconds? 5 minutes? 1 hour?
- Is the price the same for 5 seconds vs 60 seconds?
- How long does each resolution take to process on our hardware?
- What's the actual turnaround time the customer can expect?

**User's concern:** "Does it cost the same price to upscale a 5 second clip vs a 1 hour video?"

**Answer:** No. We need duration-based pricing tiers.

---

## 2. Proposed Pricing Structure: 60-Second Intervals

### 2.1 Base Price per 60-Second Interval

| Resolution | Price per 60s | Turnaround (est.) | Notes |
|------------|---------------|-------------------|-------|
| 1080p | $49 | TBD (benchmark) | Base upscaling |
| 2K | $79 | TBD (benchmark) | Higher resolution |
| 4K | $129 | TBD (benchmark) | Premium resolution |
| 60fps Boost | $59 | TBD (benchmark) | Frame interpolation |
| 4K + 60fps Combo | $179 | TBD (benchmark) | Best value combo |

### 2.2 Duration Tiers

| Tier | Duration | Multiplier | Example (1080p) |
|------|----------|------------|-----------------|
| **Tier 1** | 0-60 seconds | 1x | $49 |
| **Tier 2** | 61-120 seconds | 1.5x | $73.50 |
| **Tier 3** | 121-180 seconds | 2x | $98 |
| **Tier 4** | 181-300 seconds | 2.5x | $122.50 |
| **Tier 5** | 301-600 seconds | 3.5x | $171.50 |
| **Tier 6** | 601+ seconds | Custom quote | Contact us |

### 2.3 Pricing Formula

```
Total Price = Base Price × Duration Multiplier

Where:
  Base Price = Resolution base price (from table above)
  Duration Multiplier = ceil(duration / 60) × 0.8 (volume discount)

Examples:
  30s video at 1080p: $49 × 0.8 = $39.20 (round to $39)
  90s video at 1080p: $49 × 1.5 = $73.50
  300s video at 4K: $129 × 2.5 = $322.50
  600s video at 4K: $129 × 3.5 = $451.50
```

### 2.4 Volume Discount (Longer Videos)

For videos over 5 minutes, apply a volume discount:
- 5-10 minutes: 10% discount
- 10-30 minutes: 15% discount
- 30+ minutes: 20% discount (custom quote required)

---

## 3. Benchmark Plan (Run When GPU Frees Up)

### 3.1 What to Benchmark

| Metric | Description | How to Measure |
|--------|-------------|----------------|
| **Processing time per 60s** | How long to upscale 60s of video | Time from start to finish |
| **VRAM usage** | Peak GPU memory during processing | nvidia-smi / rocm-smi |
| **CPU usage** | Peak CPU during processing | Task Manager / htop |
| **RAM usage** | Peak system RAM during processing | Task Manager / free |
| **Output quality** | Visual quality of upscaled output | Side-by-side comparison |
| **Frames per second** | Processing speed in fps | Total frames / processing time |

### 3.2 Test Videos

| Test Video | Duration | Resolution | Content Type | Purpose |
|------------|----------|------------|--------------|---------|
| Test A | 30s | 480p | Talking head | Low motion, simple |
| Test B | 60s | 720p | Nature documentary | Medium motion, detailed |
| Test C | 60s | 1080p | Action/sports | High motion, complex |
| Test D | 120s | 480p | Mixed content | Long duration test |
| Test E | 30s | 720p | Animation | Stylized content |

### 3.3 Benchmark Matrix

For each test video, benchmark:
- 1080p upscaling (from source to 1080p)
- 2K upscaling (from source to 2K)
- 4K upscaling (from source to 4K)
- 60fps boost (frame interpolation only)
- 4K + 60fps combo (upscale + interpolate)

### 3.4 Hardware to Benchmark

| Hardware | Status | Notes |
|----------|--------|-------|
| Intel Arc B70 (XPU) | Available now | Current machine |
| AMD EVO-X2 (integrated) | Arriving later | Need OS info first |

### 3.5 Benchmark Script (To Create When GPU Frees Up)

```bash
#!/bin/bash
# video_upscale_benchmark.sh
# Run when GPU is free

SOURCE_VIDEO="$1"  # Input video path
OUTPUT_DIR="./benchmark_results"

mkdir -p "$OUTPUT_DIR"

for resolution in 1080p 2K 4K; do
    for mode in upscale fps_boost combo; do
        echo "=== Benchmarking: $resolution / $mode ==="
        start_time=$(date +%s.%N)
        
        # Run upscaling (placeholder — actual command depends on tool)
        # python upscale.py --input "$SOURCE_VIDEO" --output "$OUTPUT_DIR/${resolution}_${mode}.mp4" --resolution $resolution --mode $mode
        
        end_time=$(date +%s.%N)
        elapsed=$(echo "$end_time - $start_time" | bc)
        
        echo "Processing time: ${elapsed}s"
        echo "$resolution,$mode,$elapsed" >> "$OUTPUT_DIR/results.csv"
    done
done

echo "Benchmark complete. Results in $OUTPUT_DIR/results.csv"
```

---

## 4. Pricing Display Updates Needed

### 4.1 Website Changes

Each BYOV package card needs:
- **Duration covered** (e.g., "Up to 60 seconds")
- **Per-minute rate** for longer videos (e.g., "+$0.82/min beyond 60s")
- **Clear disclaimer** that pricing is per 60-second interval

### 4.2 Updated Package Card Format

```
┌─────────────────────────────────────┐
│ BYOV → 1080p Upscale                │
│ Starting at $49                     │
│                                     │
│ • Up to 60 seconds included         │
│ • +$0.82/min beyond 60s             │
│ • AI upscaling with artifact removal│
│ • Color correction and sharpening   │
│ • Noise reduction                   │
│ • Delivered as 1080p MP4            │
│                                     │
│ [Choose 1080p Upscale]              │
└─────────────────────────────────────┘
```

### 4.3 Per-Minute Rates (Derived from Base Price)

| Resolution | Base (60s) | Per-Minute Rate | 5-Min Video | 10-Min Video |
|------------|-----------|-----------------|-------------|--------------|
| 1080p | $49 | $0.82/min | $245 | $441 (10% disc.) |
| 2K | $79 | $1.32/min | $395 | $711 (10% disc.) |
| 4K | $129 | $2.15/min | $645 | $1,161 (10% disc.) |
| 60fps Boost | $59 | $0.98/min | $295 | $531 (10% disc.) |
| 4K + 60fps | $179 | $2.98/min | $895 | $1,611 (10% disc.) |

---

## 5. Implementation Plan

### Phase 1: Planning (NOW)
- [x] Create benchmark plan document
- [x] Define pricing structure (60-second intervals)
- [x] Create duration tiers
- [ ] Update video page with duration disclaimers
- [ ] Update package cards with per-minute rates

### Phase 2: Benchmarking (When GPU Frees Up)
- [ ] Create benchmark script
- [ ] Run benchmarks on Intel Arc B70 (XPU)
- [ ] Record turnaround times for 1080p, 2K, 4K
- [ ] Validate pricing against actual turnaround
- [ ] Update pricing if needed

### Phase 3: EVO-X2 Benchmarking (When Hardware Arrives)
- [ ] Run benchmarks on AMD EVO-X2
- [ ] Compare with Intel Arc B70 results
- [ ] Update pricing/turnaround estimates
- [ ] Finalize SLA commitments

### Phase 4: Website Update
- [ ] Update all BYOV package cards with duration info
- [ ] Add per-minute rates
- [ ] Add duration disclaimer
- [ ] Add "quoted on brief" for longer videos

---

## 6. Open Questions

1. **What tools will we use for upscaling?** (Topaz Video AI, Real-ESRGAN, RIFE for fps, etc.)
2. **What's the actual processing speed on Intel Arc B70?** (Need to benchmark)
3. **What's the actual processing speed on AMD EVO-X2?** (Need hardware + benchmark)
4. **Should we offer rush processing** for an additional fee?
5. **Should we offer batch discounts** for multiple videos?
6. **What's the maximum video length** we can handle? (Memory constraints)
