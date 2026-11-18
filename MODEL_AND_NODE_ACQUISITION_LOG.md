# Model & Node Acquisition Log — EVO-X2 Migration

**Date:** 2026-11-15
**Status:** Downloads in progress (ComfyUI is running — no interference)

---

## Custom Nodes Obtained

| Node | Source | Status | Directory |
|------|--------|--------|-----------|
| ComfyUI-DDColor | github.com/kijai/ComfyUI-DDColor | ✅ Cloned | `custom_nodes/ComfyUI-DDColor/` |
| ComfyUI-GFPGAN (comfyorg) | github.com/comfyorg/comfyui_gfpgan | ✅ Cloned | `custom_nodes/comfyui_gfpgan/` |
| ComfyUI-LivePortraitKJ | github.com/kijai/ComfyUI-LivePortraitKJ | ✅ Cloned | `custom_nodes/ComfyUI-LivePortraitKJ/` |

## Model Weights Obtained

| Model | Source | Status | Location | Size |
|-------|--------|--------|----------|------|
| GFPGAN v1.4 | github.com/TencentARC/GFPGAN (release v1.3.4) | ✅ Downloaded | `models/face_restoration/GFPGANv1.4.pth` | 333 MB |
| DDColor (artistic) | huggingface.co/piddnad/DDColor-models | ✅ Downloaded | `custom_nodes/ComfyUI-DDColor/checkpoints/ddcolor_artistic.pth` | 308 MB |
| DDColor (modelscope) | huggingface.co/piddnad/DDColor-models | ✅ Downloaded | `custom_nodes/ComfyUI-DDColor/checkpoints/ddcolor_modelscope.pth` | Downloaded |
| LivePortrait models | huggingface.co/Kijai/LivePortrait_safetensors | ✅ Downloaded (13/13 files) | `models/liveportrait/` | Complete |
| SD 1.5 Inpainting | huggingface.co/runwayml/stable-diffusion-inpainting | ✅ Downloaded | `models/inpaint/sd-v1-5-inpainting.ckpt` | 4.0 GB |
| rembg (u2net) | github.com/danielgatis/rembg (releases) | ✅ Downloaded | `models/rembg/u2net.onnx` | Downloaded |

## Additional Downloads Needed

| Model | Source | Priority | Notes |
|-------|--------|----------|-------|
| DDColor (paper) | huggingface.co/piddnad/DDColor-models | Medium | Additional colorization model |
| DDColor (paper tiny) | huggingface.co/piddnad/DDColor-models | Medium | Lightweight colorization model |
| GFPGAN v1.3 | github.com/TencentARC/GFPGAN | Low | Older version, v1.4 preferred |
| CodeFormer | github.com/sczhou/CodeFormer | Medium | Alternative face restoration |
| buffalo_l (insightface) | github.com/deepinsight/insightface | Low | Face detection for LivePortrait (non-commercial license) |

## Notes
- ComfyUI is running a generation — all downloads are file operations only, no ComfyUI processes were started/stopped
- Model weights are being downloaded via huggingface_hub and curl
- Downloads are running in background to avoid blocking
- Testing will begin when GPU frees up
- All custom nodes are portable and will migrate to EVO-X2
