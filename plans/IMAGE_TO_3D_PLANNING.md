# Image-to-3D Service Planning — Appy-UX Studio

**Date:** 2026-11-26
**Status:** PLANNING PHASE
**Hardware:** Intel Arc B70 (XPU) now, AMD EVO-X2 (64GB) later

---

## 1. Available 3D Generation Pipelines

### 1a. Image-to-3D (Mesh Generation)

| Model | Type | Resolution | Quality | VRAM | Texture | Best For | Price Tier |
|-------|------|-----------|---------|------|---------|----------|------------|
| **TRELLIS.2-4B** | Sparse voxel (O-Voxel) | Up to 1536³ | ⭐⭐⭐⭐⭐ Best overall | ~24 GB (16 GB low-res) | ✅ PBR (basecolor/rough/metal/alpha) | General 3D, props, characters | Premium ($149+) |
| **Hunyuan3D-2.1** | Diffusion | 384³ | ⭐⭐⭐⭐ Good | 10 GB shape / 21 GB paint | ✅ PBR (best-in-class painting) | Texture specialist, painted models | Mid ($99) |
| **Hunyuan3D-2mv** | Multi-view | Labeled F/B/L/R | ⭐⭐⭐⭐ Good | ~12 GB | ✅ via Hunyuan paint | Multi-view labeled input | Mid ($99) |
| **TripoSG** | Diffusion | 512³ | ⭐⭐⭐ Good | 8-12 GB | ❌ Shape only | Low-VRAM fallback, simple props | Budget ($49) |
| **Hi3D v1.0** | Refiner (2-pass) | 512-1536³ | ⭐⭐⭐⭐⭐ Best geometry | 4.3-12.6 GB | ❌ Shape only (no textures) | High-detail geometry, 3D printing | Premium ($149+) |
| **Pixal3D** | Diffusion | 1536³ | ⭐⭐⭐⭐ Good detail | ~12 GB | ❌ Shape only | High-resolution detail | Mid ($99) |
| **InstantMesh** | MV diffusion | 512³ | ⭐⭐⭐ Good | 12-16 GB | ✅ Basic | Fast generation, basic quality | Budget ($49) |

### 1b. Image-to-Splat (Gaussian Splatting)

| Pipeline | Tool | Quality | VRAM | Output | Best For |
|----------|------|---------|------|--------|----------|
| **Mix-Studio (MiniMax-h3 + tools)** | Mix-Studio | ⭐⭐⭐⭐ Good | Varies | PLY (Gaussian Splat) | Real-time 3D visualization, web viewing |
| **Brush** | Brush software | ⭐⭐⭐⭐ Good | Varies | PLY (Gaussian Splat) | 3D splat export |

**Note:** Gaussian Splats are NOT traditional 3D meshes. They're point-cloud-based representations optimized for real-time viewing in web browsers (via Three.js, Luma, etc.) but cannot be used directly in game engines without conversion.

### 1c. Mesh Refinement (Hi3D)

Hi3D v1.0 is a **refiner**, not a generator. It takes a coarse mesh + reference image and produces high-resolution geometry.

| Pass | Structural Grid | Extraction Grid | Transformer | Time | VRAM |
|------|----------------|-----------------|-------------|------|------|
| Pass 1 | 64³ | 512³ | transformer_512 | ~40s | 4.3-5.4 GB |
| Pass 2 | 128³ | 1024³ | transformer_1024 | ~255s | 9.2-12.6 GB |
| Pass 3 | 192³ | 1536³ | transformer_1024 | ~570s | 11.2 GB |

**Key limitation:** Hi3D produces geometry only (no textures/materials). Output is recentered and normalized to unit maximum radius.

---

## 2. Model Selection Guide

### By Use Case

| Use Case | Recommended Model | Why | Quality |
|----------|-------------------|-----|---------|
| **Game props/assets** | TRELLIS.2-4B | Best overall quality, PBR textures, clean topology | ⭐⭐⭐⭐⭐ |
| **Textured characters** | Hunyuan3D-2.1 | Best-in-class painting, PBR textures | ⭐⭐⭐⭐ |
| **High-detail geometry (3D print)** | Hi3D v1.0 (refine) | Best multi-view fidelity (0.75), detail richness (0.841) | ⭐⭐⭐⭐⭐ |
| **Low-VRAM/simple props** | TripoSG | Good quality, low VRAM (8-12 GB), MIT license | ⭐⭐⭐ |
| **Fast prototyping** | InstantMesh | Speed-optimized, quick turnaround | ⭐⭐⭐ |
| **Multi-view labeled input** | Hunyuan3D-2mv | Uses F/B/L/R labeled views for better accuracy | ⭐⭐⭐⭐ |
| **Web viewing/visualization** | Gaussian Splat (Mix-Studio) | Real-time browser viewing, no mesh conversion needed | ⭐⭐⭐⭐ |
| **High-res detail (1536³)** | Pixal3D or Hi3D v1.0 | Highest resolution output | ⭐⭐⭐⭐ |

### By Hardware Capability

| Hardware | Available Models | Max Quality |
|----------|-----------------|-------------|
| **Intel Arc B70 (XPU)** | TripoSG, InstantMesh, Hunyuan3D-2.1 (shape only) | ⭐⭐⭐ |
| **AMD EVO-X2 (64GB, integrated)** | All models (with CPU offload) | ⭐⭐⭐⭐ |
| **64GB+ with dedicated GPU** | TRELLIS.2-4B, Hi3D v1.0 (all passes) | ⭐⭐⭐⭐⭐ |

---

## 3. Proposed Service Tiers

### Tier 1: Quick 3D ($49)
- **Model:** TripoSG or InstantMesh
- **Quality:** Good for prototyping, simple props
- **Texture:** Basic or none
- **Turnaround:** 24-48 hours
- **Best for:** Game jam assets, concept models, simple props

### Tier 2: Standard 3D ($99)
- **Model:** Hunyuan3D-2.1 or Pixal3D
- **Quality:** Good geometry + PBR textures
- **Texture:** PBR (basecolor, roughness, metallic)
- **Turnaround:** 48-72 hours
- **Best for:** Game-ready assets, product visualization, props

### Tier 3: Premium 3D ($149)
- **Model:** TRELLIS.2-4B
- **Quality:** Best overall, highest resolution
- **Texture:** PBR (best-in-class)
- **Turnaround:** 48-96 hours
- **Best for:** Hero assets, characters, detailed props, showcase models

### Tier 4: Ultra 3D ($199+)
- **Model:** Hi3D v1.0 refinement (3-pass) on TRELLIS.2 output
- **Quality:** Maximum geometry detail (1536³)
- **Texture:** Requires separate texturing pass
- **Turnaround:** 3-5 days
- **Best for:** 3D printing, high-detail showcase, film/animation assets

### Tier 5: 3D Splat Visualization ($79)
- **Model:** Gaussian Splat (Mix-Studio/Brush)
- **Quality:** Real-time 3D visualization
- **Texture:** View-dependent color (SH degree 3)
- **Turnaround:** 24-48 hours
- **Best for:** Web viewing, presentations, portfolio showcase
- **Note:** Not usable in game engines without conversion

### Tier 6: Rigging Add-on ($59)
- **Applies to:** Any tier
- **Service:** Add skeleton/rig for animation-ready use
- **Turnaround:** 48-72 hours (additional)

---

## 4. Quality Comparison Summary

| Metric | Hi3D v1.0 | TRELLIS.2 | Hunyuan3D-2.1 | TripoSG | Pixal3D |
|--------|-----------|-----------|---------------|---------|---------|
| **Resolution** | 1536³ | 1536³ | 384³ | 512³ | 1536³ |
| **Multi-View Fidelity** | 0.75 (best) | 0.74 | 0.74 | 0.72 | 0.70 |
| **Detail Richness** | 0.841 (best) | 0.677 | 0.431 | 0.366 | 0.732 |
| **Slicing Success (3D print)** | 90% | 17% | 97% | 100% | 7% |
| **Texture Output** | ❌ None | ✅ PBR | ✅ PBR (best) | ❌ None | ❌ None |
| **VRAM Required** | 4.3-12.6 GB | ~24 GB | 10-21 GB | 8-12 GB | ~12 GB |
| **Speed** | Slow (3 passes) | Medium | Medium | Fast | Medium |
| **License** | Commercial (200K users/$1M rev) | MIT | Hunyuan Community | MIT | TBD |

---

## 5. Key Insights for Pricing

1. **Hi3D v1.0** has the best geometry quality but NO textures and low slicing success (90% vs 97-100% for lower-res models). Best for high-detail geometry showcase, not for 3D printing.

2. **TRELLIS.2-4B** is the best all-rounder: PBR textures, high resolution, MIT license. But requires ~24 GB VRAM (16 GB for low-res). Best for game-ready assets.

3. **Hunyuan3D-2.1** has the best texture painting but lower resolution (384³). Best for textured characters and painted models.

4. **TripoSG** is the best budget option: MIT license, low VRAM, fast, but shape-only (no textures).

5. **Gaussian Splats** (Mix-Studio) are great for web viewing but can't be used in game engines directly. Good for visualization/portfolio.

6. **Hi3D v1.0** is a REFINDER, not a generator. It needs a coarse mesh from another model (TRELLIS.2, Hunyuan3D, etc.) as input. This means it's an add-on service, not a standalone product.

---

## 6. Recommended Service Structure

### Standalone 3D Generation
| Tier | Model | Price | Texture | VRAM | Turnaround |
|------|-------|-------|---------|------|------------|
| Budget | TripoSG | $49 | None | 8-12 GB | 24-48h |
| Standard | Hunyuan3D-2.1 | $99 | PBR | 10-21 GB | 48-72h |
| Premium | TRELLIS.2-4B | $149 | PBR (best) | 16-24 GB | 48-96h |

### 3D Enhancement (Add-on)
| Service | Model | Price | Adds | Turnaround |
|---------|-------|-------|------|------------|
| Geometry Refinement | Hi3D v1.0 | +$50 | High-res geometry (512-1536³) | +2-3 days |
| Texture Painting | Hunyuan3D paint | +$40 | PBR textures on existing mesh | +1-2 days |
| Rigging | Manual | +$59 | Animation-ready skeleton | +2-3 days |

### 3D Visualization
| Service | Model | Price | Output | Turnaround |
|---------|-------|-------|--------|------------|
| Gaussian Splat | Mix-Studio/Brush | $79 | PLY (web-viewable 3D) | 24-48h |

### Bundles
| Bundle | Components | Price | Savings |
|--------|-----------|-------|---------|
| 3D Starter | TripoSG + Basic rigging | $99 | 10% |
| 3D Pro | TRELLIS.2 + Rigging | $199 | 10% |
| 3D Ultra | TRELLIS.2 + Hi3D refine + Rigging | $279 | 15% |
| 3D + Texture | TRELLIS.2 + Hunyuan3D paint | $229 | 10% |

---

## 7. Implementation Plan

### Phase 1: Model Setup (When GPU Frees Up)
- [ ] Download TRELLIS.2-4B weights (~4-8 GB)
- [ ] Download Hunyuan3D-2.1 weights (if not already present)
- [ ] Install ComfyUI-Hi3D (Rizzlord's node) for Hi3D refinement
- [ ] Download Hi3D v1.0 weights (~3.6B params, ~7.2 GB fp16)
- [ ] Test each model on sample images
- [ ] Benchmark VRAM usage and processing time

### Phase 2: Workflow Creation
- [ ] Create ComfyUI workflow: TripoSG (budget tier)
- [ ] Create ComfyUI workflow: Hunyuan3D-2.1 (standard tier)
- [ ] Create ComfyUI workflow: TRELLIS.2-4B (premium tier)
- [ ] Create ComfyUI workflow: Hi3D refinement (ultra tier)
- [ ] Create ComfyUI workflow: Gaussian Splat (visualization tier)
- [ ] Test all workflows end-to-end

### Phase 3: Website Integration
- [ ] Update games page with new tier structure
- [ ] Update pricing to match quality tiers
- [ ] Add sample showcase (Ultimate Warrior → 3D model)
- [ ] Add quality comparison guide for clients
- [ ] Update 3D viewer to support GLB/GLTF (not just PLY splats)

### Phase 4: EVO-X2 Validation
- [ ] Test all models on AMD EVO-X2
- [ ] Validate VRAM requirements on integrated GPU
- [ ] Adjust pricing based on actual processing times
- [ ] Finalize SLA commitments

---

## 8. Key Decisions Needed

1. **Should we offer Hi3D refinement as a standalone service or only as an add-on?**
   - Recommendation: Add-on only (requires coarse mesh from another model)

2. **Should we support Gaussian Splats on the website?**
   - Recommendation: Yes, as a separate "3D Visualization" tier (web-viewable only)

3. **Should we offer 3D printing-ready output?**
   - Recommendation: Yes, as a premium option (Hi3D has 90% slicing success at 1536³)

4. **What's the minimum VRAM for each tier?**
   - Budget (TripoSG): 8-12 GB
   - Standard (Hunyuan3D): 10-21 GB
   - Premium (TRELLIS.2): 16-24 GB
   - Ultra (Hi3D refine): 4.3-12.6 GB (on top of base model)

5. **Should we use a two-stage pipeline (generate + refine) for all tiers?**
   - Recommendation: Only for Premium/Ultra tiers (adds cost and time)

---

## 9. Mix-Studio Integration

The user mentioned that Mix-Studio has an image-to-splat pipeline using MiniMax-h3 + additional tools. This is separate from the ComfyUI-based mesh generation pipeline.

**Mix-Studio Pipeline:**
- Input: Reference image
- Process: MiniMax-h3 + additional tools
- Output: Gaussian Splat (PLY file)
- Use case: Real-time 3D visualization, web viewing, portfolio showcase

**This should be offered as a separate "3D Visualization" service tier**, not as a replacement for mesh-based 3D generation.

---

## 10. Summary

### What We Have Now
- ✅ Hunyuan3D-2.1 (image-to-3D with PBR textures)
- ✅ Trellis2 (image-to-3D)
- ✅ Pixal3D (image-to-3D)
- ✅ Gaussian Splat pipeline (Mix-Studio, MiniMax-h3)
- ✅ Sample: Ultimate Warrior action figure → 3D Gaussian Splat (16,666 points)

### What We Need to Add
- [ ] TRELLIS.2-4B weights (best overall quality)
- [ ] Hi3D v1.0 node + weights (geometry refinement)
- [ ] Hunyuan3D paint model (best texture painting)
- [ ] ComfyUI workflows for each tier

### What We Need to Plan
- [ ] Quality-based pricing tiers
- [ ] Which model for which use case
- [ ] Hardware requirements per tier
- [ ] Turnaround times per tier
- [ ] Client-facing quality comparison guide
