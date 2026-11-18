# ComfyUI Architecture & Migration Plan — EVO-X2

**Date:** 2026-11-15
**Source:** `E:\AI Playground\resources\ComfyUI\` (Intel Arc B70 / XPU workstation)
**Target:** GMKtec EVO-X2 (64GB RAM, 1TB SSD, AMD) — OS TBD on arrival
**Purpose:** Complete inventory of ComfyUI installation, models, custom nodes, workflows, and migration plan for EVO-X2

---

## 1. ComfyUI Installation Overview

| Item | Detail |
|------|--------|
| **Location** | `E:\AI Playground\resources\ComfyUI\` |
| **Version** | ComfyUI (latest as of Oct 2026) |
| **Python** | `.venv\` (Python 3.10+ with PyTorch XPU) |
| **Backend** | Intel XPU (Arc B70) via `comfyui-xpu-guard`, `comfyui-xpu-cache-clean` |
| **Frontend** | Web UI (port 8188/8189/49000/49001/49002) |
| **Manager** | ComfyUI-Manager installed (for custom node/model management) |
| **Workflows** | 20+ user workflows in `user/default/workflows/` |
| **Models total size** | ~180+ GB across all model directories |

---

## 2. Model Inventory (by category)

### 2.1 Upscale Models
| Model | File | Size | Type | Used for |
|-------|------|------|------|----------|
| RealESRGAN x4plus | `models/upscale_models/RealESRGAN_x4plus.pth` | 64 MB | ESRGAN 4x | Fast upscaling, good quality |
| 4xLexicaDAT2 | `models/upscale_models/4xLexicaDAT2_otf.pth` | 134 MB | DAT 4x | High-quality upscaling |
| SeedVR2 EMA 7B Sharp | `models/SEEDVR2/seedvr2_ema_7b_sharp_fp8_e4m3fn_mixed_block35_fp16.safetensors` | 8.1 GB | Diffusion-based | Best quality upscaling (sharp) |
| LTX-2.3 Spatial Upscaler | `models/latent_upscale_models/ltx-2.3-spatial-upscaler-x2-1.1.safetensors` | 950 MB | Latent 2x | Video/image latent upscaling |
| LTX-2.5 Latent Spatial Upscaler | `models/latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors` | 950 MB | Latent 2x | Video/image latent upscaling |

### 2.2 Diffusion Models (Image Generation/Editing)
| Model | File | Size | Capability |
|-------|------|------|------------|
| Qwen Image Edit 2.1 | `models/diffusion_models/qwen_image_edit_2509_fp8_e4m3fn.safetensors` | 19.5 GB | Text-prompted image editing |
| Qwen Image 2.1 | `models/diffusion_models/qwen_image_2.1_bf16.safetensors` | 13.6 GB | Image generation |
| Qwen Image 2.1 (GGUF F16) | `models/diffusion_models/qwen-image-2.1-F16.gguf` | 13.6 GB | Image generation (GGUF) |
| Qwen Image 2.5 (GGUF Q4) | `models/diffusion_models/qwen-image-2512-Q4_K_M.gguf` | 12.6 GB | Image generation (quantized) |
| FLUX.2 Klein 4B (fp8) | `models/diffusion_models/black-forest-labs---FLUX.2-klein-4b-fp8/` | ~4 GB | Image gen/edit (FLUX) |
| FLUX.2 Klein 9B (int8) | `models/diffusion_models/flux-2-klein-9b-int8-convrot.safetensors` | 8.8 GB | Image gen/edit (FLUX) |
| FLUX.2 Klein 9B (int4) | `models/diffusion_models/flux3_image_klein_sd_int4_convrot.safetensors` | 3.0 GB | Image gen (quantized) |
| FLUX Kontext Dev | `models/diffusion_models/Comfy-Org---flux1-kontext-dev_ComfyUI/` | ~12 GB | In-context image editing |
| Krea2 (turbo/int8) | `models/diffusion_models/krea2_turbo_int8_convrot.safetensors` | 12.6 GB | Image generation |
| Krea2 (raw/int8) | `models/diffusion_models/krea2_raw_int8_convrot.safetensors` | 12.6 GB | Image generation |
| Boogu Edit (GGUF Q8) | `models/diffusion_models/boogu-edit-dit-Q8_0.gguf` | 10.9 GB | Image editing |
| Boogu Turbo V2 (GGUF Q8) | `models/diffusion_models/Boogu-Turbo-V2_dit-Q8_0.gguf` | 10.8 GB | Image editing (turbo) |
| SDXL (10Eros v1.2) | `models/checkpoints/10Eros_v1.2_fp8mixed_learned.safetensors` | 32 GB | SDXL image generation |
| Pixal3D | `models/diffusion_models/pixal3d_bf16.safetensors` | 10.3 GB | 3D generation |

### 2.3 3D Generation Models
| Model | File | Size | Capability |
|-------|------|------|------------|
| Hunyuan3D-2.1 | `models/diffusion_models/hunyuan_3d_v2.1.safetensors` | 6.9 GB | Image-to-3D |
| Trellis2 | `models/diffusion_models/trellis_2_bf16.safetensors` | 9.6 GB | Image-to-3D |
| Hunyuan3D-2 (checkpoint) | `models/checkpoints/tencent---Hunyuan3D-2/` | - | Image-to-3D |

### 2.4 Video/Image-to-Video Models
| Model | File | Size | Capability |
|-------|------|------|------------|
| Wan2.2 I2V (high noise) | `models/diffusion_models/wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors` | 13.3 GB | Image-to-video |
| Wan2.2 I2V (low noise) | `models/diffusion_models/wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors` | 13.3 GB | Image-to-video |
| Wan2.2 TI2V 5B Turbo | `models/diffusion_models/wan2.2_ti2v_5b_turbo_*.safetensors` | 2.5-4.8 GB | Text+Image-to-video |
| Wan Animate 2 | `models/diffusion_models/wan_animate_2_int8_convrot.safetensors` | 15.5 GB | Animate images |
| LTX-2.3 22B (distilled) | `models/checkpoints/ltx-2.3-22b-distilled-fused-fp8.safetensors` | 27.1 GB | Text-to-video |
| MiniMax H3 FL2VA | `models/diffusion_models/minimax_h3_*_fl2va_*.safetensors` | 10-21 GB | Video generation |

### 2.5 Other Models
| Model | Location | Size | Capability |
|-------|----------|------|------------|
| SAM3.1 | `models/checkpoints/sam3.1_multiplex_fp16.safetensors` | 1.6 GB | Segmentation |
| CLIP Vision H | `models/clip_vision/clip_vision_h.safetensors` | 1.2 GB | Vision encoding |
| DINOv3 ViT-L | `models/clip_vision/dino_v3_vit_l.safetensors` | 1.2 GB | Vision features |
| Trellis2 Shape VAE | `models/vae/trellis_2_shape_vae_bf16.safetensors` | 1.0 GB | 3D shape VAE |
| Trellis2 Texture VAE | `models/vae/trellis_2_texture_vae_bf16.safetensors` | 905 MB | 3D texture VAE |

### 2.6 VAE Models
| VAE | File | Size |
|-----|------|------|
| FLUX VAE | `models/vae/flux2-vae.safetensors` | 321 MB |
| Wan VAE | `models/vae/wan_2.1_vae.safetensors` | 242 MB |
| Qwen VAE | `models/vae/qwen_image_vae.safetensors` | 242 MB |
| MiniMax H3 Video VAE | `models/vae/minimax_h3_video_vae_int8_convrot.safetensors` | 3.0 GB |
| MiniMax H3 Audio VAE | `models/vae/minimax_h3_audio_vae_fp32.safetensors` | 578 MB |
| LTX VAE | `models/vae/ltx-2.5-video-vae-bf16.safetensors` | 1.4 GB |
| LTX Audio VAE | `models/vae/ltx-2.5-audio-vae-bf16.safetensors` | 349 MB |

### 2.7 Text Encoders
| Encoder | File | Size |
|---------|------|------|
| Qwen 3 VL 8B | `models/text_encoders/qwen3vl_8b_bf16.safetensors` | 16.5 GB |
| Qwen 3 VL 4B | `models/text_encoders/qwen3vl_4b_int4_convrot.safetensors` | 2.6 GB |
| Qwen 2.5 VL 7B | `models/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors` | 8.8 GB |
| Gemma 3 12B | `models/text_encoders/gemma_3_12B_it_fp4_mixed.safetensors` | 8.8 GB |
| Gemma 4 12B (LTX) | `models/text_encoders/gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors` | 14.3 GB |
| T5-XXL | `models/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors` | 6.3 GB |
| Gemma 4 E2B | `models/text_encoders/gemma4_e2b_it_bf16.safetensors` | 9.5 GB |

---

## 3. Custom Nodes (40+ installed)

### Image Processing
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI_UltimateSDUpscale | `custom_nodes/ComfyUI_UltimateSDUpscale/` | Tiled upscaling with SD refinement |
| ComfyUI-H3-Latent-Upscaler-Mamad8 | `custom_nodes/ComfyUI-H3-Latent-Upscaler-Mamad8/` | Latent upscaling (H3) |
| ComfyUI-SeedVR2_VideoUpscaler | `custom_nodes/ComfyUI-SeedVR2_VideoUpscaler/` | Video upscaling (SeedVR2) |
| OpenVINOImageUpscale | `custom_nodes/OpenVINOImageUpscale/` | OpenVINO image upscaling |
| ComfyUI-Frame-Interpolation | `custom_nodes/ComfyUI-Frame-Interpolation/` | Frame interpolation |
| comfyui-krea2edit | `custom_nodes/comfyui-krea2edit/` | Krea2 image editing |
| ComfyUI-Krea2-StyleTransfer | `custom_nodes/ComfyUI-Krea2-StyleTransfer/` | Style transfer |
| ComfyUI-Conditioning-Rebalance | `custom_nodes/ComfyUI-Conditioning-Rebalance/` | Conditioning rebalance |
| OpenAICompatibleImageGen | `custom_nodes/OpenAICompatibleImageGen/` | OpenAI-compatible image gen |

### 3D Generation
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI-GeometryPack | `custom_nodes/ComfyUI-GeometryPack/` | Geometry processing |
| ComfyUI-DepthAnythingV3 | `custom_nodes/ComfyUI-DepthAnythingV3/` | Depth estimation |
| ComfyUI-3D-Pack (disabled) | `custom_nodes/ComfyUI-3D-Pack.disabled/` | 3D generation (disabled) |

### Video/Animation
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI-VideoHelperSuite | `custom_nodes/ComfyUI-VideoHelperSuite/` | Video I/O |
| ComfyUI-LTXVideo | `custom_nodes/ComfyUI-LTXVideo/` | LTX video generation |
| ComfyUI-MiniMaxH3 | `custom_nodes/ComfyUI-MiniMaxH3/` | MiniMax H3 video |
| ComfyUI-H3-Motion-Context | `custom_nodes/ComfyUI-H3-Motion-Context/` | Motion context |
| ComfyUI-AudioLoopHelper | `custom_nodes/ComfyUI-AudioLoopHelper/` | Audio looping |

### Segmentation/Utility
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI-SAM3 | `custom_nodes/ComfyUI-SAM3/` | Segmentation (SAM3) |
| ComfyUI-Pixaroma | `custom_nodes/ComfyUI-Pixaroma/` | Image editing tools |
| ComfyUI-BFSNodes | `custom_nodes/ComfyUI-BFSNodes/` | Utility nodes |
| ComfyUI-KJNodes | `custom_nodes/ComfyUI-KJNodes/` | Utility nodes |
| ComfyUI-UniversalIO | `custom_nodes/ComfyUI-UniversalIO/` | I/O utilities |
| ComfyUI-PlagueKind-Nodes | `custom_nodes/ComfyUI-PlagueKind-Nodes/` | Utility nodes |
| ComfyUI-Multiband | `custom_nodes/ComfyUI-Multiband/` | Multi-band processing |
| ComfyUI-TINT4 | `custom_nodes/ComfyUI-TINT4/` | Color tinting |
| SafetyChecker | `custom_nodes/SafetyChecker/` | Safety checking |

### Infrastructure
| Node | Directory | Capability |
|------|-----------|------------|
| ComfyUI-Manager | `custom_nodes/ComfyUI-Manager/` | Node/model management |
| ComfyUI-GGUF | `custom_nodes/ComfyUI-GGUF/` | GGUF model loading |
| comfyui-gguf-loader | `custom_nodes/comfyui-gguf-loader/` | GGUF loading |
| ComfyUI-AIMDO-XPU | `custom_nodes/ComfyUI-AIMDO-XPU/` | XPU optimization |
| ComfyUI-OmniXPU | `custom_nodes/ComfyUI-OmniXPU/` | XPU optimization |
| ComfyUI-XPU-CacheClean | `custom_nodes/ComfyUI-XPU-CacheClean/` | Cache cleaning |
| comfyui-xpu-guard | `custom_nodes/comfyui-xpu-guard/` | XPU guard |
| ComfyUI-XPUSYS-Monitor | `custom_nodes/ComfyUI-XPUSYS-Monitor/` | System monitoring |
| aipg-auth | `custom_nodes/aipg-auth/` | Auth (AI Playground) |
| hqh-xpu | `custom_nodes/hqh-xpu/` | XPU utilities |
| qwen-h3-prompt | `custom_nodes/qwen-h3-prompt/` | Qwen H3 prompting |
| minimax-h3-chunk-star7 | `custom_nodes/minimax-h3-chunk-star7/` | MiniMax H3 chunking |
| muse-minimax-director | `custom_nodes/muse-minimax-director/` | MiniMax director |
| muse-minimax-h3-unified-loader | `custom_nodes/muse-minimax-h3-unified-loader/` | MiniMax H3 loader |
| ComfyUI-MiniMaxH3-AdaptiveCache | `custom_nodes/ComfyUI-MiniMaxH3-AdaptiveCache/` | Adaptive cache |
| ComfyUI-MiniMax-H3-GGUF | `custom_nodes/ComfyUI-MiniMax-H3-GGUF/` | MiniMax H3 GGUF |
| ComfyUI-MiniMaxH3TextEncoders | `custom_nodes/ComfyUI-MiniMaxH3TextEncoders/` | Text encoders |
| ComfyUI-MiniMax-H3-Turbo | `custom_nodes/ComfyUI-MiniMax-H3-Turbo/` | Turbo mode |
| ComfyUI-MiniMax-Remover | `custom_nodes/ComfyUI-MiniMax-Remover/` | Object removal |
| comfyui-scail2-infinity | `custom_nodes/comfyui-scail2-infinity/` | SCAIL infinity |
| Krea2-Multi-Character-Lora-Node-w-bounding-box-By-Fedor | `custom_nodes/Krea2-Multi-Character-Lora-Node-w-bounding-box-By-Fedor/` | Krea2 multi-char LoRA |
| comfyui-krea2-controlnet | `custom_nodes/comfyui-krea2-controlnet/` | Krea2 controlnet |
| ComfyUI-Kitchen-nvfp4-converter | `custom_nodes/ComfyUI-Kitchen-nvfp4-converter/` | NVFP4 converter |
| ComfyMath | `custom_nodes/ComfyMath/` | Math utilities |
| 10S-Comfy-nodes | `custom_nodes/10S-Comfy-nodes/` | Utility nodes |
| WhatDreamsCost-ComfyUI | `custom_nodes/WhatDreamsCost-ComfyUI/` | Utility nodes |
| execution-inversion-demo-comfyui | `custom_nodes/execution-inversion-demo-comfyui/` | Demo |

### Python Packages (relevant)
| Package | Version | Capability |
|---------|---------|------------|
| gfpgan | 1.3.8 | Face restoration (no weights installed) |
| basicsr | 1.4.2 | Basic SR framework |
| facexlib | 0.3.0 | Face detection/extraction |
| realesrgan | 0.3.0 | Real-ESRGAN upscaling |
| spandrel | 0.4.2 | Model architecture support |

---

## 4. Workflows (user/default/workflows/)

| Workflow | File | Purpose |
|----------|------|---------|
| Trellis 2 - Image to 3D (Low VRAM) | `1. Trellis 2 - Image to 3D Model - Low VRAM.json` | Image → 3D (low VRAM) |
| Trellis 2 - Image to 3D (High VRAM) | `1.2 Trellis 2 - Image to 3D Model - High VRAM.json` | Image → 3D (high VRAM) |
| Trellis 2 - Image to 3D (HQ + PBR) | `2. Trellis 2 - Image to 3D Model - HQ + PBR Textures.json` | Image → 3D (high quality) |
| Pixal3D - Image to 3D (Low VRAM) | `3. Pixal3D - Image to 3D Model - Low VRAM.json` | Image → 3D (Pixal3D) |
| Pixal3D - Image to 3D (HQ + PBR) | `4. Pixal3D - Image to 3D Model - HQ + PBR Textures.json` | Image → 3D (high quality) |
| Flux Klein 9b - 3D Model to Image | `5. Flux Klein 9b - 3D Model to Image.json` | 3D → Image |
| Flux Klein 9b - 3D Model to Image (Keep Angle) | `6. Flux Klein 9b - 3D Model to Image - Keep the Angle.json` | 3D → Image (angle preserved) |
| 3D Builder (Pixaroma) | `3D Builder Pixaroma Workflow.json` | 3D building |
| 3D Hunyuan3D Multiview | `3d_hunyuan3d_multiview_to_model.json` | Multiview → 3D |
| AudioReact | `AudioReact Workflow.json` | Audio-reactive visuals |
| Crop (Pixaroma) | `Crop Pixaroma Workflow.json` | Image cropping |
| Image Compare (Pixaroma) | `Image Compare Pixaroma Workflow.json` | Image comparison |
| Image Composer (Pixaroma) | `Image Composer Pixaroma Workflow.json` | Image composition |
| Labels (Pixaroma) | `Labels Pixaroma Workflow.json` | Labeling |
| Note (Pixaroma) | `Note Pixaroma Workflow.json` | Notes |
| Paint (Pixaroma) | `Paint Pixaroma Workflow.json` | Painting |
| Scene1 Shot2 FL2VA | `scene1_shot2_fl2va/` | Video generation |

---

## 5. Capability Matrix for Agency Services

| Service | Available? | Tool/Model | Quality | Notes |
|---------|-----------|------------|---------|-------|
| **Vintage Restoration** | ⚠️ Partial | Qwen Image Edit 2.1 | Medium | Can attempt via text prompts, but no dedicated restoration model |
| **Colorization** | ❌ No | None | - | Need ComfyUI-DDColor + DDColor weights |
| **Overall Enhancement** | ✅ Yes | Qwen Image Edit 2.1, FLUX Kontext | Good | Text-prompted enhancement works |
| **Upscaling** | ✅ Yes | RealESRGAN, 4xLexicaDAT2, SeedVR2 | Excellent | SeedVR2 gives best quality (diffusion-based) |
| **Image Animation** | ✅ Partial | Wan2.2 I2V, LTX-2.3 | Medium | Full image-to-video, not subtle portrait animation |
| **Background Removal** | ⚠️ Partial | rembg (no models) | - | Package installed, need model weights |
| **Image-to-3D** | ✅ Yes | Hunyuan3D-2.1, Trellis2, Pixal3D | Good | Workflows exist |
| **Video Upscaling** | ✅ Yes | SeedVR2_VideoUpscaler | Good | Available |
| **Frame Interpolation** | ✅ Yes | ComfyUI-Frame-Interpolation | Good | Available |
| **Segmentation** | ✅ Yes | SAM3 | Good | Available |
| **Face Restoration** | ❌ No | GFPGAN installed, no weights | - | Need model files + ComfyUI wrapper node |

---

## 6. Missing Components to Obtain

### Priority 1: Face Restoration
- **Model:** GFPGAN v1.3 or CodeFormer weights
- **Custom node:** ComfyUI-GFPGAN or ComfyUI-CodeFormer
- **Placement:** `models/facerestore_models/`
- **Source:** HuggingFace / GitHub releases

### Priority 2: Colorization
- **Model:** DDColor (best quality for old photos)
- **Custom node:** ComfyUI-DDColor (github.com/kijai/ComfyUI-DDColor)
- **Placement:** `models/ddcolor/`
- **Alternative:** Use Qwen Image Edit with colorization prompts (lower quality, works now)

### Priority 3: Scratch/Damage Repair (Inpainting)
- **Model:** SD 1.5 Inpaint or SDXL Inpaint checkpoint
- **Placement:** `models/checkpoints/` or `models/inpaint/`
- **Alternative:** Bria Restore Photo API (requires API key, costs per use)
- **Alternative 2:** Use Qwen Image Edit with repair prompts

### Priority 4: Subtle Image Animation (LivePortrait)
- **Model:** LivePortrait or AnimateAnyone
- **Custom node:** ComfyUI-LivePortrait (github.com/kijai/ComfyUI-LivePortrait)
- **Placement:** `models/liveportrait/`
- **Alternative:** Use Wan2.2 I2V for full image-to-video (less subtle but works now)

### Priority 5: Background Removal
- **Model:** rembg model weights (u2net, etc.)
- **Placement:** `models/rembg/`
- **Alternative:** Use SAM3 for segmentation-based removal

---

## 7. Skills to Obtain/Create

### Existing Skills (already installed)
- `comfyui` — General ComfyUI workflow skill
- `hyperframes` — Motion graphics/video rendering
- `songwriting-and-ai-music` — Soundtrack planning
- `claude-design` — Design process
- `popular-web-designs` — Design systems
- `sketch` — Mockup variants
- `tangible-creative-agency` — Agency packaging

### Skills to Obtain (from GitHub/ComfyUI Manager)
| Skill/Node | Purpose | Source |
|-----------|---------|--------|
| ComfyUI-DDColor | Colorization workflows | github.com/kijai/ComfyUI-DDColor |
| ComfyUI-GFPGAN | Face restoration | github.com/.../ComfyUI-GFPGAN |
| ComfyUI-LivePortrait | Image animation (subtle) | github.com/kijai/ComfyUI-LivePortrait |
| ComfyUI-Inpaint | Damage/scratch repair | Built-in + model |

### Hermes Skills to Create (for agency use)
| Skill | Purpose |
|-------|---------|
| `comfyui-image-restoration` | Workflow for vintage photo restoration |
| `comfyui-colorization` | Workflow for B&W → color |
| `comfyui-image-animation` | Workflow for subtle portrait animation |
| `comfyui-upscale-pipeline` | Multi-model upscaling workflow |
| `comfyui-image-to-3d` | Workflow for BYO image → 3D model |

---

## 8. Migration Plan for EVO-X2

### What to migrate (copy from Arc B70 to EVO-X2)
1. **ComfyUI installation** — entire `E:\AI Playground\resources\ComfyUI\` directory
2. **Models** — all model files (~180+ GB) — need 1TB SSD minimum
3. **Custom nodes** — all 40+ custom node directories
4. **Workflows** — `user/default/workflows/` (20+ workflows)
5. **Python venv** — `.venv/` (or recreate on EVO-X2 with same packages)
6. **Config** — `extra_model_paths.yaml`, `comfy.settings.json`

### What to obtain BEFORE migration (on current machine)
1. Download GFPGAN v1.3 weights → `models/facerestore_models/`
2. Install ComfyUI-DDColor + download DDColor weights
3. Download SD inpainting checkpoint → `models/inpaint/` or `models/checkpoints/`
4. Install ComfyUI-LivePortrait + download LivePortrait weights
5. Download rembg model weights → `models/rembg/`

### What to obtain AFTER migration (on EVO-X2)
1. AMD-specific ComfyUI backend (DirectML/Vulkan for Windows, or ROCm for Linux)
2. Validate all models work on AMD
3. Benchmark performance on EVO-X2
4. Install any AMD-specific optimizations

### Migration checklist
- [ ] Download all missing models/weights (Priority 1-5 above)
- [ ] Install all missing custom nodes
- [ ] Test all workflows on current machine (Arc B70)
- [ ] Create workflow templates for each agency service
- [ ] Document VRAM requirements per workflow
- [ ] Create migration script (robocopy/rsync)
- [ ] Verify EVO-X2 OS and hardware on arrival
- [ ] Install ComfyUI on EVO-X2
- [ ] Copy models and custom nodes
- [ ] Validate all workflows on EVO-X2
- [ ] Benchmark performance
- [ ] Update website showcase with real before/after results

---

## 9. Hardware/OS Considerations

### Current (Arc B70 / XPU)
- Backend: Intel XPU via `comfyui-xpu-guard`, `comfyui-xpu-cache-clean`
- Python: `.venv` with PyTorch XPU
- Performance: XPU-optimized, 64GB+ unified memory

### Target (EVO-X2, 64GB RAM, 1TB SSD, AMD)
- OS: **TBD on arrival** (Windows expected, Linux planned)
- Backend: If Windows → DirectML or Vulkan; If Linux → ROCm
- Performance: Need to benchmark AMD acceleration
- Storage: 1TB SSD — models total ~180+ GB, need careful space management
- RAM: 64GB — sufficient for most models, but large ones (MiniMax H3 21GB) will need optimization

### Key risk: AMD acceleration
- Not all ComfyUI custom nodes support AMD/DirectML
- Some models (especially XPU-optimized ones) may not work on AMD
- Need to test and validate each workflow on EVO-X2
- Fallback: CPU inference (slow but works)

---

## 10. Summary

**ComfyUI is well-equipped for:**
- ✅ Upscaling (3 models, excellent quality)
- ✅ Image-to-video animation (Wan2.2, LTX, MiniMax H3)
- ✅ Image-to-3D (Hunyuan3D, Trellis2, Pixal3D)
- ✅ Basic image editing (Qwen, FLUX Kontext, Krea2)
- ✅ Frame interpolation, segmentation, video upscaling

**Gaps to fill (download/install needed):**
- ❌ Face restoration (weights + node)
- ❌ Colorization (node + weights)
- ❌ Scratch/damage repair (inpaint model)
- ❌ Subtle portrait animation (LivePortrait node)
- ❌ Background removal (model weights)

**Total model storage needed:** ~180+ GB (current) + ~5-10 GB (new models) = ~190 GB
**Target storage:** 1TB SSD (sufficient with room to spare)

**Migration complexity:** Medium — need to validate AMD compatibility, but all models and nodes are portable. Main risk is XPU-specific optimizations not working on AMD.
