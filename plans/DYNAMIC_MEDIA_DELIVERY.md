# Dynamic Media Delivery — Order-Attached Media Players

## Overview
When an order is delivered, the deliverable files should be viewable/playable directly in the client portal and admin dashboard. Media players auto-detect file type and render the appropriate player (video, audio, 3D, image).

## Architecture

### Backend: Asset Preview Endpoint
- `GET /api/assets/{asset_id}/preview` — Returns file with proper content-type for inline viewing
- `GET /api/assets/{asset_id}/stream` — Streaming endpoint for large video files
- Asset metadata includes `file_type` (video, audio, 3d, image) for frontend to select player

### Frontend: Order-Attached Media Players
- `OrderMediaViewer` component — Auto-detects file type and renders appropriate player
- Integrated into client portal Order Detail page
- Integrated into admin dashboard Order Detail view
- Supports: video (MP4/WebM), audio (MP3/WAV), 3D (GLB/GLTF), image (PNG/JPG/WebP)

### File Type Detection
| Extension | Type | Player |
|-----------|------|--------|
| .mp4, .webm, .mov | video | VideoPlayer |
| .mp3, .wav, .ogg, .flac | audio | AudioPlayer |
| .glb, .gltf | 3d | Viewer3D |
| .png, .jpg, .jpeg, .webp, .gif | image | ImageLightbox |

## Implementation Plan

### Phase 1: Backend
- [ ] Add `GET /api/assets/{id}/preview` endpoint (inline content-type)
- [ ] Add `GET /api/assets/{id}/stream` endpoint (range requests for video)
- [ ] Add `file_type` detection on upload (auto-detect from extension)
- [ ] Add `preview_url` to asset response

### Phase 2: Client Portal
- [ ] Create `OrderMediaViewer` component
- [ ] Integrate into Order Detail page
- [ ] Show media players for delivered assets
- [ ] Add "Preview" button for each deliverable

### Phase 3: Admin Dashboard
- [ ] Create `OrderMediaViewer` component (same as client)
- [ ] Integrate into order detail view
- [ ] Allow admin to preview before marking delivered

### Phase 4: Polish
- [ ] Add download button alongside preview
- [ ] Add fullscreen mode for video/3D
- [ ] Add thumbnail generation for video files
- [ ] Add waveform generation for audio files
