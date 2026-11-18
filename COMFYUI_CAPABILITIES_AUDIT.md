# ComfyUI Environment Audit — Image Editing Capabilities

**Date:** 2026-11-15
**Location:** `E:\AI Playground\resources\ComfyUI\`
**Status:** ComfyUI is running (generation in progress — do NOT interfere)

---

## 1. Available Models (relevant to image editing)

### Upscale Models
| Model | File | Size | Type |
|-------|------|------|------|
| RealESRGAN x4plus | `models/upscale_models/RealESRGAN_x4plus.pth` | 64 MB | ESRGAN-based 4x upscaler |
| 4xLexicaDAT2 | `models/upscale_models/4xLexicaDAT2_otf.pth` | 134 MB | DAT-based 4x upscaler |
| SeedVR2 EMA 7B Sharp | `models/SEEDVR2/seedvr2_ema_7b_sharp_fp8_e4m3fn_mixed_block35_fp16.safetensors` | 8.1 GB | Diffusion-based sharp upscaler (SeedVR2) |
| LTX-2.3 Spatial Upscaler | `models/latent_upscale_models/ltx-2.3-spatial-upscaler-x2-1.1.safetensors` | 950 MB | Latent spatial upscaler (2x) |
| LTX-2.5 Latent Spatial Upscaler | `models/latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors` | 950 MB | Latent spatial upscaler (2x) |

### Diffusion Models (image editing / generation)
| Model | File | Size | Capability |
|-------|------|------|------------|
| Qwen Image Edit 2.1 | `models/diffusion_models/qwen_image_edit_2509_fp8_e4m3fn.safetensors` | 19.5 GB | Image editing via text prompts (Qwen) |
| Qwen Image 2.1 | `models/diffusion_models/qwen_image_2.1_bf16.safetensors` | 13.6 GB | Image generation (Qwen) |
| FLUX.2 Klein 4B (fp8) | `models/diffusion_models/black-forest-labs---FLUX.2-klein-4b-fp8/` | ~4 GB | Image generation/editing (FLUX) |
| FLUX.2 Klein 9B (int8) | `models/diffusion_models/flux-2-klein-9b-int8-convrot.safetensors` | 8.8 GB | Image generation/editing (FLUX) |
| FLUX kontext dev | `models/diffusion_models/Comfy-Org---flux1-kontext-dev_ComfyUI/` | ~12 GB | In-context image editing (FLUX Kontext) |
| Krea2 (turbo/int8) | `models/diffusion_models/krea2_*_int8_convrot.safetensors` | 12.6 GB | Image generation (Krea) |
| Boogu Edit (GGUF) | `models/diffusion_models/boogu-edit-dit-Q8_0.gguf` | 10.9 GB | Image editing (Boogu) |
| Boogu Turbo V2 (GGUF) | `models/diffusion_models/Boogu-Turbo-V2_dit-Q8_0.gguf` | 10.8 GB | Image editing (Boogu Turbo) |

### 3D Generation Models
| Model | File | Size | Capability |
|-------|------|------|------------|
| Hunyuan3D-2.1 | `models/diffusion_models/hunyuan_3d_v2.1.safetensors` | 6.9 GB | Image-to-3D model generation |
| Trellis2 | `models/diffusion_models/trellis_2_bf16.safetensors` | 9.6 GB | Image-to-3D (Trellis2) |
| Pixal3D | `models/diffusion_models/pixal3d_bf16.safetensors` | 10.3 GB | Image-to-3D (Pixal3D) |
| Hunyuan3D-2 (checkpoint) | `models/checkpoints/tencent---Hunyuan3D-2/` | - | Image-to-3D (Hunyuan3D) |

### Video/Image-to-Video Models
| Model | File | Size | Capability |
|-------|------|------|------------|
| Wan2.2 I2V (high/low noise) | `models/diffusion_models/wan2.2_i2v_*_14B_*.safetensors` | 13.3 GB each | Image-to-video (Wan2.2) |
| Wan2.2 TI2V 5B Turbo | `models/diffusion_models/wan2.2_ti2v_5b_turbo_*.safetensors` | 2.5-4.8 GB | Text+Image-to-video (Wan2.2) |
| Wan Animate 2 | `models/diffusion_models/wan_animate_2_int8_convrot.safetensors` | 15.5 GB | Animate images (Wan) |
| LTX-2.3 22B (distilled) | `models/checkpoints/ltx-2.3-22b-distilled-fused-fp8.safetensors` | 27.1 GB | Text-to-video (LTX) |
| MiniMax H3 FL2VA | `models/diffusion_models/minimax_h3_*_fl2va_*.safetensors` | 10-21 GB | Video generation (MiniMax H3) |

### Other Relevant Models
| Model | Location | Capability |
|-------|----------|------------|
| SAM3.1 | `models/checkpoints/sam3.1_multiplex_fp16.safetensors` | Segmentation (SAM3) |
| CLIP Vision H | `models/clip_vision/clip_vision_h.safetensors` | Vision encoding |
| DINOv3 | `models/clip_vision/dino_v3_*.safetensors` | Vision features |
| SDXL (10Eros) | `models/checkpoints/10Eros_v1.2_fp8mixed_learned.safetensors` | 32 GB | SDXL checkpoint (image gen) |

### VAE Models
- FLUX VAE, Wan VAE, Qwen VAE, MiniMax H3 VAE, LTX VAE, etc.

### Text Encoders
- Qwen 2.5/3 VL, Gemma 3/4, T5-XXL, UMT5-XXL, etc.

---

## 2. Available Custom Nodes (relevant)

### Upscaling
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI_UltimateSDUpscale | `custom_nodes/ComfyUI_UltimateSDUpscale/` | Tiled upscaling with SD refinement |
| ComfyUI-H3-Latent-Upscaler-Mamad8 | `custom_nodes/ComfyUI-H3-Latent-Upscaler-Mamad8/` | Latent upscaling (H3) |
| ComfyUI-SeedVR2_VideoUpscaler | `custom_nodes/ComfyUI-SeedVR2_VideoUpscaler/` | Video upscaling (SeedVR2) |
| OpenVINOImageUpscale | `custom_nodes/OpenVINOImageUpscale/` | OpenVINO-based image upscaling |

### Image Editing
| Node | Directory | Capability |
|------|-----------|------------|
| comfyui-krea2edit | `custom_nodes/comfyui-krea2edit/` | Krea2 image editing |
| ComfyUI-Krea2-StyleTransfer | `custom_nodes/ComfyUI-Krea2-StyleTransfer/` | Style transfer |
| ComfyUI-Conditioning-Rebalance | `custom_nodes/ComfyUI-Conditioning-Rebalance/` | Conditioning rebalance |
| OpenAICompatibleImageGen | `custom_nodes/OpenAICompatibleImageGen/` | OpenAI-compatible image gen |

### 3D Generation
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI-3D-Pack (disabled) | `custom_nodes/ComfyUI-3D-Pack.disabled/` | 3D generation (disabled) |
| ComfyUI-GeometryPack | `custom_nodes/ComfyUI-GeometryPack/` | Geometry processing |
| ComfyUI-DepthAnythingV3 | `custom_nodes/ComfyUI-DepthAnythingV3/` | Depth estimation |

### Video/Animation
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI-Frame-Interpolation | `custom_nodes/ComfyUI-Frame-Interpolation/` | Frame interpolation (smoother video) |
| ComfyUI-VideoHelperSuite | `custom_nodes/ComfyUI-VideoHelperSuite/` | Video loading/saving/processing |
| ComfyUI-LTXVideo | `custom_nodes/ComfyUI-LTXVideo/` | LTX video generation |
| ComfyUI-MiniMaxH3 | `custom_nodes/ComfyUI-MiniMaxH3/` | MiniMax H3 video generation |
| ComfyUI-H3-Motion-Context | `custom_nodes/ComfyUI-H3-Motion-Context/` | Motion context (H3) |

### Other Useful Nodes
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI-SAM3 | `custom_nodes/ComfyUI-SAM3/` | Segmentation (SAM3) |
| ComfyUI-Pixaroma | `custom_nodes/ComfyUI-Pixaroma/` | Image editing tools |
| ComfyUI-BFSNodes | `custom_nodes/ComfyUI-BFSNodes/` | Utility nodes |
| ComfyUI-KJNodes | `custom_nodes/ComfyUI-KJNodes/` | Utility nodes |
| ComfyUI-UniversalIO | `custom_nodes/ComfyUI-UniversalIO/` | I/O utilities |
| ComfyUI-PlagueKind-Nodes | `custom_nodes/ComfyUI-PlagueKind-Nodes/` | Utility nodes |

### Python Packages in venv (relevant)
| Package | Version | Capability |
|---------|---------|------------|
| gfpgan | 1.3.8 | Face restoration (GFPGAN) |
| basicsr | 1.4.2 | Basic SR framework |
| facexlib | 0.3.0 | Face detection/extraction |
| realesrgan | 0.3.0 | Real-ESRGAN upscaling |
| spandrel | 0.4.2 | Model architecture support |
| basicsr | 1.4.2 | Basic super-resolution |

---

## 3. What's MISSING (gaps for image editing services)

### ❌ No Face Restoration Model Files
- GFPGAN, CodeFormer, RestoreFormer are installed as Python packages but **no model weight files** exist in `models/facerestore_models/` (directory is empty)
- Need to download: GFPGAN v1.3, CodeFormer, or RestoreFormer weights

### ❌ No Colorization Models/Nodes
- No DDColor, DeOldify, or any colorization custom nodes installed
- No colorization model files anywhere in the ComfyUI directory
- Need to: install a colorization custom node (e.g., ComfyUI-DDColor) and download model weights

### ❌ No Dedicated Restoration/Inpainting Models
- `models/inpaint/` is empty
- No scratch removal, damage repair, or inpainting models available
- BriaRestorePhoto exists as embedded docs (API-based, requires Bria API key)

### ❌ No Image Animation Workflow
- While I2V models exist (Wan2.2, LTX), there's no specific "image animation" workflow for subtle portrait animation (like LivePortrait, AnimateAnyone, etc.)
- Need to: create or obtain an image animation workflow

---

## 4. What CAN Be Done Now (with existing tools)

| Service | Available? | Tool/Model | Notes |
|---------|-----------|------------|-------|
| **Upscaling** | ✅ Yes | RealESRGAN x4plus, 4xLexicaDAT2, SeedVR2 | Ready to use. SeedVR2 gives best quality (diffusion-based). |
| **Overall Enhancement** | ✅ Partial | Qwen Image Edit 2.1, FLUX Kontext | Can enhance via text-prompted editing. Quality depends on prompt. |
| **Image-to-3D** | ✅ Yes | Hunyuan3D-2.1, Trellis2, Pixal3D | Workflows exist in user/default/workflows/ |
| **Image-to-Video** | ✅ Yes | Wan2.2 I2V, LTX-2.3, MiniMax H3 | Can animate still images into video clips |
| **Background Removal** | ✅ Partial | rembg (empty dir) | Package installed but no models |
| **Segmentation** | ✅ Yes | SAM3 | Available for masking |
| **Face Restoration** | ❌ No | GFPGAN installed but no weights | Need model files |
| **Colorization** | ❌ No | No nodes or models | Need custom node + weights |
| **Scratch/Damage Repair** | ❌ No | No inpainting models | Need inpaint models or Bria API |
| **Frame Interpolation** | ✅ Yes | ComfyUI-Frame-Interpolation | Available for smoother video |

---

## 5. What Needs to Be Obtained

### Priority 1: Face Restoration
- **Model:** GFPGAN v1.3 or CodeFormer weights
- **Source:** Download from HuggingFace or GitHub releases
- **Placement:** `models/facerestore_models/`
- **Custom node:** None needed (GFPGAN is in venv, but need a ComfyUI wrapper node)
- **Alternative:** Install `ComfyUI-GFPGAN` or `ComfyUI-CodeFormer` custom node

### Priority 2: Colorization
- **Model:** DDColor (best quality) or DeOldify
- **Custom node:** `ComfyUI-DDColor` (https://github.com/kijai/ComfyUI-DDColor)
- **Placement:** `models/ddcolor/` or `models/colorization/`
- **Alternative:** Use Qwen Image Edit with colorization prompts (lower quality but works now)

### Priority 3: Scratch/Damage Repair (Inpainting)
- **Model:** Stable Diffusion inpainting checkpoint or specialized restoration model
- **Custom node:** Built-in ComfyUI inpaint nodes (need model)
- **Alternative:** Bria Restore Photo API (requires API key, costs per use)
- **Alternative 2:** Use Qwen Image Edit with repair prompts

### Priority 4: Image Animation (subtle portrait animation)
- **Model:** LivePortrait or AnimateAnyone
- **Custom node:** Need to find/install ComfyUI wrapper
- **Alternative:** Use Wan2.2 I2V for full image-to-video (less subtle but works now)

---

## 6. Skills Needed

### Existing Skills (already installed)
- `comfyui` — General ComfyUI workflow skill
- `hyperframes` — Motion graphics/video rendering
- `songwriting-and-ai-music` — Soundtrack planning
- `claude-design` — Design process
- `popular-web-designs` — Design systems
- `sketch` — Mockup variants
- `tangible-creative-agency` — Agency packaging

### Skills to Obtain/Acquire
| Skill | Purpose | Source |
|-------|---------|--------|
| ComfyUI-DDColor | Colorization workflows | GitHub (kijai/ComfyUI-DDColor) |
| ComfyUI-GFPGAN or CodeFormer | Face restoration | GitHub |
| ComfyUI-LivePortrait | Image animation (subtle) | GitHub (kijai/ComfyUI-LivePortrait) |
| ComfyUI-Inpaint | Damage/scratch repair | Built-in + model |
| ComfyUI-Upscale (advanced) | Better upscaling workflows | Already have UltimateSDUpscale |
| ComfyUI-ImageEdit | Advanced image editing | Already have Qwen edit model |

### Hermes Skills to Create
- `comfyui-image-restoration` — Workflow for vintage photo restoration
- `comfyui-colorization` — Workflow for B&W → color
- `comfyui-image-animation` — Workflow for subtle portrait animation
- `comfyui-upscale-pipeline` — Multi-model upscaling workflow

---

## 7. Recommended Action Plan

### Immediate (can do now with existing tools)
1. **Test upscaling pipeline** with RealESRGAN + SeedVR2 on sample images
2. **Test Qwen Image Edit** for basic enhancement/colorization
3. **Test Wan2.2 I2V** for image-to-video animation
4. **Test Hunyuan3D/Trellis2** for 3D model generation from images
5. **Create before/after comparisons** using existing upscale/enhance workflows

### Short-term (need to download/install)
1. Download GFPGAN v1.3 weights → `models/facerestore_models/`
2. Install ComfyUI-DDColor + download DDColor weights
3. Download an inpainting checkpoint (SD 1.5 inpaint or SDXL inpaint)
4. Install ComfyUI-LivePortrait for subtle animation
5. Create workflow templates for each service

### Medium-term (need EVO-X2 for heavy processing)
1. Process all 6 sample images through full pipelines
2. Generate real before/after comparisons
3. Create animated clips for image-animation demos
4. Generate 3D models from BYO images
5. Update website showcase with real results

---

## 8. Hardware Notes
- **Current machine:** Intel Arc B70 (XPU) — can run ComfyUI with XPU backend
- **ComfyUI location:** `E:\AI Playground\resources\ComfyUI\`
- **Python venv:** `E:\AI Playground\resources\ComfyUI\.venv\`
- **Models directory:** `E:\AI Playground\resources\ComfyUI\models\`
- **Custom nodes:** 40+ installed, including upscaling, video, 3D, and editing nodes
- **ComfyUI is currently running** — do not interfere with active generation

---

## 9. Key Findings Summary

**What we HAVE:**
- ✅ Upscaling: RealESRGAN, 4xLexicaDAT2, SeedVR2 (excellent quality)
- ✅ Image editing: Qwen Image Edit 2.1, FLUX Kontext, Krea2 edit
- ✅ Image-to-Video: Wan2.2 I2V, LTX-2.3, MiniMax H3
- ✅ Image-to-3D: Hunyuan3D-2.1, Trellis2, Pixal3D
- ✅ Frame interpolation: ComfyUI-Frame-Interpolation
- ✅ Segmentation: SAM3
- ✅ Video upscaling: SeedVR2_VideoUpscaler
- ✅ UltimateSDUpscale for tiled upscaling

**What we DON'T HAVE:**
- ❌ Face restoration model weights (GFPGAN/CodeFormer installed but no weights)
- ❌ Colorization models or nodes (DDColor, DeOldify)
- ❌ Inpainting/scratch repair models
- ❌ Subtle image animation (LivePortrait, AnimateAnyone)
- ❌ Background removal models (rembg installed but no models)

**Immediate capability:**
- Can do upscaling, basic enhancement via Qwen edit, image-to-video, and 3D generation NOW
- Cannot do face restoration, colorization, or scratch repair without downloading models
- Cannot do subtle portrait animation without additional nodes/models

**Bottom line:** We have strong upscaling and video generation capabilities. The gaps are in restoration, colorization, and subtle animation — all addressable by downloading models and installing 2-3 custom nodes.
