# Video Generation Prompts — Appy-UX Studio (Updated)

**Date:** 2026-11-26 (Amended)
**Purpose:** Detailed image + video prompts for generating sample videos for each video service type

---

## How to Use This Document

1. **Generate reference images FIRST** using the image prompts (via ComfyUI, Midjourney, DALL-E, etc.)
2. **Use reference images** as input to AI video generators (Runway, Kling, Pika, Sora)
3. **Multi-shot videos** require multiple reference images — one per shot/scene
4. **Single-shot videos** need only one reference image

---

## 1. BYOV Upscaling Sample

### 1a. 1080p Upscale Demo
**Service:** BYOV → 1080p Upscale ($49)
**Shots:** 1 (single continuous shot)
**Reference Images Needed:** 1

#### Image Prompt (Reference)
```
A modern smartphone on a matte black surface, shown from a 3/4 angle. The phone screen displays a vibrant blue-to-purple gradient wallpaper. Soft studio lighting from the left creates subtle reflections on the phone's glass back. The background is a clean gradient from dark gray to charcoal. Professional product photography, 4K quality, shallow depth of field, clean composition. No text, no watermarks. 16:9 aspect ratio.
```

#### Degraded "Before" Image Prompt
```
A modern smartphone on a matte black surface, shown from a 3/4 angle. The phone screen displays a vibrant blue-to-purple gradient wallpaper. Soft studio lighting from the left. Background is dark gray to charcoal. Low resolution, heavily compressed, pixelated, blurry details, blocky textures, JPEG artifacts, 480p quality, noisy. No text, no watermarks. 16:9 aspect ratio.
```

#### Video Prompt
```
A smooth tracking shot of a modern smartphone on a matte black surface, slowly rotating 360 degrees to show all angles. The phone screen displays a vibrant gradient wallpaper cycling through blue, purple, and teal. Soft studio lighting from the left creates subtle reflections on the phone's glass back. The background is a clean gradient from dark gray to charcoal. As the phone completes rotation, a subtle sparkle effect appears on the screen. 4K resolution, cinematic color grading, shallow depth of field, professional product photography style. No text, no watermarks.
```

---

### 1b. 4K + 60fps Combo Demo
**Service:** BYOV → 4K + 60fps Combo ($179)
**Shots:** 1 (single continuous shot)
**Reference Images Needed:** 1

#### Image Prompt (Reference)
```
Aerial view of a coastal cliffside at golden hour. Turquoise waves crash against jagged rocks below. A winding coastal road carved into the cliff face. Seabirds in flight. The sun sits low on the horizon casting long warm shadows. Ultra-sharp detail visible in every rock texture, wave crest, and blade of grass. Cinematic color grading with warm amber highlights and cool blue shadows. Professional aerial photography, 4K quality. 16:9 aspect ratio.
```

#### Video Prompt
```
A dynamic drone flythrough of a coastal cliffside at golden hour. The camera sweeps low over turquoise waves crashing against jagged rocks, then rises to reveal a winding coastal road carved into the cliff face. Seabirds scatter as the camera passes. The sun sits low on the horizon casting long warm shadows across the landscape. Ultra-sharp 4K detail visible in every rock texture, wave crest, and blade of grass. Smooth 60fps motion with no stutter. Cinematic color grading with warm amber highlights and cool blue shadows. Professional aerial cinematography.
```

---

## 2. Style Transfer Samples

### 2a. Anime Style Transfer
**Service:** Anime Style Transfer ($99)
**Shots:** 1 (single continuous shot)
**Reference Images Needed:** 2 (source + target style)

#### Image Prompt (Source - Photorealistic)
```
A young woman with flowing brown hair walks through a sunlit cherry blossom path. Pink petals drift in the wind around her. She wears a light blue dress and carries a small leather satchel. The background shows a traditional Japanese shrine gate (torii) in soft focus. Warm golden sunlight filters through the cherry trees creating dappled light patterns on the stone path. Photorealistic, cinematic lighting, 4K quality, natural colors. 16:9 aspect ratio.
```

#### Image Prompt (Target - Anime Style)
```
Anime style illustration: A young woman with flowing brown hair walks through a sunlit cherry blossom path. Pink petals drift in the wind around her. She wears a light blue dress and carries a small leather satchel. The background shows a traditional Japanese shrine gate (torii) in soft focus. Warm golden sunlight filters through the cherry trees creating dappled light patterns on the stone path. Studio Ghibli inspired art style, soft watercolor textures, vibrant but gentle color palette, detailed background art, smooth animation style. 16:9 aspect ratio.
```

#### Video Prompt (Source)
```
A young woman with flowing brown hair walks through a sunlit cherry blossom path. Pink petals drift in the wind around her. She wears a light blue dress and carries a small leather satchel. The background shows a traditional Japanese shrine gate (torii) in soft focus. Warm golden sunlight filters through the cherry trees creating dappled light patterns on the stone path. Photorealistic, cinematic lighting, 4K quality, natural colors. Smooth walking motion, petals falling.
```

#### Video Prompt (Target - Anime)
```
Anime style: A young woman with flowing brown hair walks through a sunlit cherry blossom path. Pink petals drift in the wind around her. She wears a light blue dress and carries a small leather satchel. The background shows a traditional Japanese shrine gate (torii) in soft focus. Warm golden sunlight filters through the cherry trees creating dappled light patterns on the stone path. Studio Ghibli inspired art style, soft watercolor textures, vibrant but gentle color palette, detailed background art, smooth animation, cinematic composition. Smooth walking motion, petals falling.
```

---

### 2b. Artistic Style Transfer (Oil Painting)
**Service:** Artistic Style Transfer ($119)
**Shots:** 1
**Reference Images Needed:** 2 (source + target style)

#### Image Prompt (Source - Photorealistic)
```
A lone fisherman in a small wooden boat on a calm lake at dusk. The water reflects the orange and purple sky like a mirror. Distant mountains silhouetted against the horizon. The fisherman's lantern casts a warm golden glow on the water around the boat. Photorealistic, cinematic lighting, 4K quality, natural colors. 16:9 aspect ratio.
```

#### Image Prompt (Target - Oil Painting)
```
Oil painting style: A lone fisherman in a small wooden boat on a calm lake at dusk. The water reflects the orange and purple sky like a mirror. Distant mountains silhouetted against the horizon. The fisherman's lantern casts a warm golden glow on the water around the boat. Thick impasto brushstrokes visible, rich earth tones, deep shadows, warm highlights. Rembrandt lighting, classical oil painting technique, textured canvas, museum quality artwork. 16:9 aspect ratio.
```

#### Video Prompt (Target - Oil Painting)
```
Oil painting style: A lone fisherman in a small wooden boat on a calm lake at dusk. The water reflects the orange and purple sky like a mirror. Distant mountains silhouetted against the horizon. The fisherman's lantern casts a warm golden glow on the water around the boat. Thick impasto brushstrokes visible, rich earth tones, deep shadows, warm highlights. Rembrandt lighting, classical oil painting technique, textured canvas, museum quality artwork. Gentle water ripples, boat rocking slightly, lantern flickering.
```

---

### 2c. Cinematic Style Transfer
**Service:** Cinematic Style Transfer ($139)
**Shots:** 1
**Reference Images Needed:** 2 (source + target style)

#### Image Prompt (Source - Photorealistic)
```
A lone figure in a long coat walks through a rain-soaked neon-lit street at night. Holographic advertisements flicker on building facades. Steam rises from street vents. The figure's silhouette is backlit by a massive holographic billboard showing a woman's face in blue and pink. Photorealistic, natural lighting, 4K quality. 16:9 aspect ratio.
```

#### Image Prompt (Target - Cinematic)
```
Cinematic film style: A lone figure in a long coat walks through a rain-soaked neon-lit street at night. Holographic advertisements flicker on building facades. Steam rises from street vents. The figure's silhouette is backlit by a massive holographic billboard showing a woman's face in blue and pink. Anamorphic lens flares, film grain, teal and orange color grading, deep shadows, high contrast. Blade Runner 2049 aesthetic, 35mm film look, cinematic widescreen, moody atmospheric lighting. 16:9 aspect ratio (2.39:1 crop).
```

#### Video Prompt (Target - Cinematic)
```
Cinematic film style: A lone figure in a long coat walks through a rain-soaked neon-lit street at night. Holographic advertisements flicker on building facades. Steam rises from street vents. The figure's silhouette is backlit by a massive holographic billboard showing a woman's face in blue and pink. Anamorphic lens flares, film grain, teal and orange color grading, deep shadows, high contrast. Blade Runner 2049 aesthetic, 35mm film look, cinematic widescreen, moody atmospheric lighting. Rain falling, neon reflections on wet pavement, figure walking slowly.
```

---

### 2d. Cyberpunk / Neon Transfer
**Service:** Cyberpunk / Neon Transfer ($109)
**Shots:** 1
**Reference Images Needed:** 2 (source + target style)

#### Image Prompt (Source - Photorealistic)
```
A motorcycle rider speeds through a futuristic city street at night. Neon signs glow in pink, cyan, and electric blue. Rain-slicked road reflects the neon lights. The rider wears a glowing visor and leather jacket with LED trim. Holographic billboards tower above. Photorealistic, 4K quality, natural colors. 16:9 aspect ratio.
```

#### Image Prompt (Target - Cyberpunk)
```
Cyberpunk neon style: A motorcycle rider speeds through a futuristic city street at night. Neon signs in Japanese and English glow in pink, cyan, and electric blue. Rain-slicked road reflects the neon lights. The rider wears a glowing visor and leather jacket with LED trim. Holographic billboards tower above. High contrast, saturated neon colors, glowing edges, futuristic atmosphere, anime-influenced cyberpunk aesthetic. Glitch effects on neon signs. 16:9 aspect ratio.
```

#### Video Prompt (Target - Cyberpunk)
```
Cyberpunk neon style: A motorcycle rider speeds through a futuristic city street at night. Neon signs in Japanese and English glow in pink, cyan, and electric blue. Rain-slicked road reflects the neon lights. The rider wears a glowing visor and leather jacket with LED trim. Holographic billboards tower above. Sparks fly from the motorcycle's exhaust. High contrast, saturated neon colors, glowing edges, futuristic atmosphere, anime-influenced cyberpunk aesthetic. Glitch effects on neon signs. Motorcycle speeding, rain falling, neon flickering.
```

---

## 3. Content Creation — Short-form (9:16 Vertical)

### 3a. Product Ad Spot
**Service:** Product Ad Spot ($149)
**Shots:** 5 (multi-shot sequence)
**Reference Images Needed:** 5

#### Shot 1: Hero Product (Earbud Case)
**Image Prompt:**
```
A sleek wireless earbud case on a reflective dark surface, shown from a 3/4 angle. The case is matte black with a subtle silver logo. The lid is slightly open revealing glowing blue earbuds inside. Soft studio lighting from above creates a halo effect. Dark gradient background from charcoal to black. Professional product photography, 4K, shallow depth of field. 9:16 vertical aspect ratio.
```

#### Shot 2: Jogging Scene
**Image Prompt:**
```
A young woman jogging through a city park at golden hour. She wears wireless earbuds and athletic wear. Her hair flows behind her. Warm sunlight filters through trees. Motion blur on background. Energetic, dynamic pose. Golden hour lighting, warm tones. 9:16 vertical aspect ratio.
```

#### Shot 3: Cafe Work Scene
**Image Prompt:**
```
A person sitting at a cafe table working on a laptop, wearing wireless earbuds. Warm ambient lighting, coffee cup on table, blurred background of cafe patrons. Focused, productive expression. Cozy atmosphere. 9:16 vertical aspect ratio.
```

#### Shot 4: Meditation Scene
**Image Prompt:**
```
A person sitting cross-legged on a yoga mat in a bright room, eyes closed, wearing wireless earbuds. Soft natural light from a window. Peaceful, calm expression. Minimalist room with plants. Serene atmosphere. 9:16 vertical aspect ratio.
```

#### Shot 5: Final CTA
**Image Prompt:**
```
A wireless earbud case on a dark reflective surface, lid closed. A subtle blue glow emanates from the seam. Clean dark background. The case is the hero of the frame. Professional product photography, dramatic lighting. 9:16 vertical aspect ratio.
```

#### Video Prompt
```
Vertical 9:16 video: Shot 1 — A sleek wireless earbud case opens in slow motion on a reflective dark surface, revealing glowing blue earbuds. Camera pushes in dramatically. Shot 2 — Quick cut to a woman jogging through a city park at golden hour, wearing earbuds. Shot 3 — Cut to a person working at a laptop in a cafe, wearing earbuds. Shot 4 — Cut to a person meditating, wearing earbuds. Each scene has warm golden hour lighting. Text overlays appear: "CRYSTAL CLEAR AUDIO" then "ALL-DAY BATTERY" then "YOUR SOUND. YOUR WORLD." Final shot: earbuds case closing with a satisfying click, logo appears. Modern, energetic, commercial quality. 9:16 vertical, optimized for TikTok/Reels/Shorts. Smooth transitions between shots. No watermarks.
```

---

### 3b. Infomercial Spot
**Service:** Infomercial Spot ($169)
**Shots:** 4 (multi-shot sequence)
**Reference Images Needed:** 4

#### Shot 1: Problem (Messy Desk)
**Image Prompt:**
```
A cluttered desk covered in scattered papers, sticky notes, tangled cables, and coffee cups. A frustrated person sits behind it, hands on head. Overhead fluorescent lighting, chaotic composition. Papers falling off edges. Red "X" marks implied by messy arrangement. 9:16 vertical aspect ratio.
```

#### Shot 2: Solution (Clean Desk)
**Image Prompt:**
```
The same desk now clean and organized. A single elegant device sits in the center. The person smiles, looking relieved. Green plants on desk. Warm natural lighting from window. Clean, minimalist, organized workspace. 9:16 vertical aspect ratio.
```

#### Shot 3: Device in Action
**Image Prompt:**
```
Close-up of a sleek device screen showing an organized dashboard with file icons neatly arranged. A finger taps the screen. Clean UI with blue and white color scheme. Soft lighting. Professional product shot. 9:16 vertical aspect ratio.
```

#### Shot 4: Happy Customer
**Image Prompt:**
```
A person giving a thumbs up, smiling at camera. Clean background, bright lighting. Casual but professional attire. Genuine, happy expression. 9:16 vertical aspect ratio.
```

#### Video Prompt
```
Vertical 9:16 video: Shot 1 — A frustrated person stares at a messy desk covered in papers, sticky notes, and tangled cables. Red "X" marks appear on screen. Shot 2 — Quick transition to the same person now organized and smiling at a clean desk with a single elegant device. Green checkmarks appear. Shot 3 — Shows the device in action: organizing files, syncing across devices, one-tap access. Shot 4 — Happy customer testimonial style with thumbs up. Text: "Tired of clutter?" → "Meet DeskFlow" → "One device. Total control." → "Get DeskFlow today — link in bio." Professional infomercial style, bright lighting, clean aesthetic. Smooth transitions. 9:16 vertical.
```

---

### 3c. Music Video Clip
**Service:** Music Video Clip ($179)
**Shots:** 6 (multi-shot sequence)
**Reference Images Needed:** 6

#### Shot 1: DJ Silhouette
**Image Prompt:**
```
A DJ in silhouette behind a glowing mixing console in an underground club. Neon lights in purple and blue. Fog machine creating atmospheric haze. The DJ's hands on the mixer. Dramatic backlighting. 9:16 vertical aspect ratio.
```

#### Shot 2: Dancers
**Image Prompt:**
```
Dancers in slow motion in a neon-lit club. Motion blur on fast movements. Purple and blue lighting. Silhouettes and partial lighting on faces. Energetic, dynamic poses. 9:16 vertical aspect ratio.
```

#### Shot 3: Vinyl Close-up
**Image Prompt:**
```
Extreme close-up of a spinning vinyl record on a turntable. Neon light reflects off the vinyl surface. The needle is on the groove. Shallow depth of field. Dramatic lighting. 9:16 vertical aspect ratio.
```

#### Shot 4: Laser Beams
**Image Prompt:**
```
Laser beams cutting through fog in a dark club. Green and blue lasers create geometric patterns. Atmospheric, moody. No people visible, just light and fog. 9:16 vertical aspect ratio.
```

#### Shot 5: Crowd Hands
**Image Prompt:**
```
Crowd with hands in the air at a concert. Silhouettes against stage lighting. Colorful lights (purple, blue, pink) illuminate from behind. Energy and excitement. 9:16 vertical aspect ratio.
```

#### Shot 6: DJ Finale
**Image Prompt:**
```
A DJ raising both hands in triumph behind the mixing console. Crowd visible in background with hands up. Confetti falling. Bright stage lighting. Peak energy moment. 9:16 vertical aspect ratio.
```

#### Video Prompt
```
Vertical 9:16 music video: Shot 1 — A neon-lit underground club scene. A DJ in silhouette behind a glowing mixing console. Shot 2 — Beat drops, camera shakes, lights strobe in sync with bass. Quick cuts between dancers in slow motion (Shot 2), close-up of spinning vinyl (Shot 3), laser beams cutting through fog (Shot 4), crowd hands in the air (Shot 5). Color palette: deep purple, electric blue, hot pink. Each cut is beat-synced. Motion blur on fast movements. Final shot (Shot 6): DJ raises hands, crowd erupts, confetti falls. High energy, rave aesthetic, cinematic color grading. 9:16 vertical, optimized for music platforms. Smooth beat-synced transitions.
```

---

### 3d. Social Media Spot
**Service:** Social Media Spot ($129)
**Shots:** 4 (multi-shot sequence)
**Reference Images Needed:** 4

#### Shot 1: Person with Phone
**Image Prompt:**
```
A cheerful person walking into frame holding a smartphone showing a new app interface. Bright, clean background. Casual but professional attire. Smiling, excited expression. 9:16 vertical aspect ratio.
```

#### Shot 2: App on Devices
**Image Prompt:**
```
Multiple devices (phone, tablet, laptop) arranged on a clean white surface, all showing the same app interface. Clean, minimalist composition. Soft lighting. 9:16 vertical aspect ratio.
```

#### Shot 3: Notification Badges
**Image Prompt:**
```
Close-up of a smartphone screen showing notification badges appearing one by one. Clean app interface with blue and white color scheme. Soft lighting. 9:16 vertical aspect ratio.
```

#### Shot 4: Calendar Filling
**Image Prompt:**
```
A digital calendar on a screen filling up with scheduled posts. Color-coded entries in blue, green, and orange. Clean, organized interface. 9:16 vertical aspect ratio.
```

#### Video Prompt
```
Vertical 9:16 video: Shot 1 — A person walks into frame holding a smartphone showing a new app interface, swiping through features with delight. Shot 2 — Quick cuts: app on different devices (phone, tablet, laptop). Shot 3 — Notification badges appearing. Shot 4 — A calendar filling with scheduled posts. Text animations: "NEW FEATURE" → "Schedule posts across all platforms" → "One tap. Every platform." → "Try it free today." Upbeat background music implied by visual rhythm. Clean white and blue color scheme. Modern, friendly, accessible. 9:16 vertical. Smooth transitions.
```

---

### 3e. Teaser / Hype Clip
**Service:** Teaser / Hype Clip ($119)
**Shots:** 6 (multi-shot sequence)
**Reference Images Needed:** 6

#### Shot 1: Abstract Glow
**Image Prompt:**
```
A dark screen with a single glowing blue line on black background. Minimalist, mysterious. The line curves slightly. Subtle light rays emanating. 9:16 vertical aspect ratio.
```

#### Shot 2: Eye Close-up
**Image Prompt:**
```
Extreme close-up of a human eye, iris reflecting blue light. Dark surroundings. Intense, mysterious gaze. High contrast. 9:16 vertical aspect ratio.
```

#### Shot 3: Hand Reaching
**Image Prompt:**
```
A hand reaching out toward camera in dark environment. Fingertips glowing with soft blue light. Dramatic shadows. Mysterious, sci-fi aesthetic. 9:16 vertical aspect ratio.
```

#### Shot 4: City Skyline
**Image Prompt:**
```
A futuristic city skyline at night, viewed from above. Neon lights in blue and purple. Dark sky with stars. Holographic buildings. Cyberpunk aesthetic. 9:16 vertical aspect ratio.
```

#### Shot 5: Door Opening
**Image Prompt:**
```
A door slightly ajar, bright white light pouring through the gap. Dark room around it. Dramatic contrast between dark and light. Mysterious, inviting. 9:16 vertical aspect ratio.
```

#### Shot 6: Logo Reveal
**Image Prompt:**
```
An abstract geometric shape resolving into a logo mark, glowing intensely with blue light on a dark background. Clean, minimal, powerful. 9:16 vertical aspect ratio.
```

#### Video Prompt
```
Vertical 9:16 teaser: Shot 1 — Dark screen. A single glowing line appears, then another, forming an abstract shape. Shot 2 — Quick flash: close-up of an eye. Shot 3 — Quick flash: a hand reaching out. Shot 4 — Quick flash: city skyline at night. Shot 5 — Quick flash: a door opening to bright light. Each flash is 0.5 seconds. Glitch effects between transitions. Text appears word by word: "SOMETHING" (pause) "IS" (pause) "COMING." (pause) "03.15.2027" Final frame (Shot 6): the abstract shape resolves into a logo mark, glowing intensely. Dark, mysterious, high-contrast. Cinematic. 9:16 vertical. No other text. Smooth glitch transitions.
```

---

## 4. Content Creation — Long-form (16:9 Horizontal)

### 4a. Horizontal Edit - 1080p Base
**Service:** Horizontal Edit - 1080p Base ($199)
**Shots:** 5 (multi-shot sequence)
**Reference Images Needed:** 5

#### Shot 1: Wide Workspace
**Image Prompt:**
```
A modern tech workspace with dual monitors, mechanical keyboard, and ambient LED lighting. Clean desk, organized. Professional environment. Warm and cool lighting mix. 16:9 horizontal aspect ratio.
```

#### Shot 2: Hands Typing
**Image Prompt:**
```
Close-up of hands typing on a mechanical keyboard. Shallow depth of field. Warm lighting. Professional, focused. 16:9 horizontal aspect ratio.
```

#### Shot 3: Dashboard Screen
**Image Prompt:**
```
A computer screen showing a dashboard interface with charts, graphs, and data visualizations. Clean UI design. Blue and white color scheme. Professional. 16:9 horizontal aspect ratio.
```

#### Shot 4: Product Unboxing
**Image Prompt:**
```
Hands opening a product box on a clean surface. The product is partially visible inside. Professional unboxing photography. Clean background. 16:9 horizontal aspect ratio.
```

#### Shot 5: Product Detail
**Image Prompt:**
```
Close-up detail shot of a tech product showing ports, buttons, and texture. Professional macro photography. Clean lighting. 16:9 horizontal aspect ratio.
```

#### Video Prompt
```
Horizontal 16:9 video: Shot 1 — Wide shot of a modern workspace with dual monitors and ambient LED lighting. Shot 2 — Cut to close-up of hands typing on mechanical keyboard. Shot 3 — Cut to screen recording showing a dashboard interface with charts and data. Shot 4 — B-roll: product unboxing. Shot 5 — Detail shots of ports and buttons. Lower third text: "Performance: 9/10". Clean color grading — neutral whites, slight blue tint. Professional, informative, YouTube-ready. 1080p. Smooth cuts between shots. No watermarks.
```

---

### 4b. 2K Quality Upgrade Demo
**Service:** 2K Quality Upgrade ($79 add-on)
**Shots:** 1 (comparison slider)
**Reference Images Needed:** 2 (1080p + 2K versions)

#### Image Prompt (1080p version)
```
A landscape photo of a mountain range with snow-capped peaks. Slightly soft details, some texture loss in distant rocks. Natural colors. Professional photography. 16:9 horizontal aspect ratio.
```

#### Image Prompt (2K version)
```
The same mountain range landscape but with noticeably sharper rock textures, clearer snow patches, and more defined tree lines. Finer detail in every element. Professional photography. 16:9 horizontal aspect ratio.
```

#### Video Prompt
```
Horizontal 16:9 split-screen comparison: Left side labeled "1080p" shows a landscape photo of a mountain range with slightly soft details. Right side labeled "2K" shows the same landscape with noticeably sharper rock textures, clearer snow patches, and more defined tree lines. A vertical slider divider moves left and right. Both sides have identical color grading. The 2K side shows finer detail in every element. Clean, educational, comparison-style. 16:9 horizontal.
```

---

### 4c. 4K Quality Upgrade Demo
**Service:** 4K Quality Upgrade ($129 add-on)
**Shots:** 1 (comparison slider)
**Reference Images Needed:** 2 (2K + 4K versions)

#### Image Prompt (2K version)
```
A cityscape at night with building lights and street traffic. Building windows are slightly soft. Street signs somewhat readable. Neon lights have slight bloom. 16:9 horizontal aspect ratio.
```

#### Image Prompt (4K version)
```
The same cityscape at night with ultra-sharp details. Individual windows lit in buildings are crisp. Street signs are clearly readable. Neon lights are sharp and distinct. Car headlights are distinct points of light. Deep blacks, vibrant colors. 16:9 horizontal aspect ratio.
```

#### Video Prompt
```
Horizontal 16:9 split-screen comparison: Left side labeled "2K" shows a cityscape at night with building lights and street traffic. Right side labeled "4K" shows the same cityscape with ultra-sharp details — individual windows lit in buildings, readable street signs, car headlights as distinct points of light, texture on brick facades. A vertical slider divider moves. The 4K side reveals details invisible at 2K. Neon signs are crisp and readable. Deep blacks, vibrant colors. Premium quality comparison. 16:9 horizontal.
```

---

### 4d. Extended Clip / Episode Edit
**Service:** Extended Clip / Episode Edit ($349)
**Shots:** 4 (multi-shot sequence)
**Reference Images Needed:** 4

#### Shot 1: Factory Floor
**Image Prompt:**
```
A factory floor with workers assembling electronic components. Close-up of circuit boards being soldered. Industrial lighting. Professional documentary photography. 16:9 horizontal aspect ratio.
```

#### Shot 2: Design Studio
**Image Prompt:**
```
A design studio with sketches on a whiteboard, a 3D model rotating on a computer screen, and a designer adjusting curves with a stylus. Creative, professional environment. 16:9 horizontal aspect ratio.
```

#### Shot 3: Testing Lab
**Image Prompt:**
```
A testing lab with a product being dropped onto a surface, submerged in water, and placed in a temperature chamber. Scientific, professional environment. 16:9 horizontal aspect ratio.
```

#### Shot 4: Product Reveal
**Image Prompt:**
```
A hero shot of a finished product on a clean white background. All angles visible. Professional product photography. Clean, premium lighting. 16:9 horizontal aspect ratio.
```

#### Video Prompt
```
Horizontal 16:9 mini-documentary style: Opens with a title card "The Making of: [Product Name]". Segment 1 (Shot 1): Factory floor — workers assembling components, close-ups of circuit boards being soldered, quality inspection. Segment 2 (Shot 2): Design studio — sketches on whiteboard, 3D model rotating on screen, designer adjusting curves. Segment 3 (Shot 3): Testing lab — product being dropped, submerged in water, temperature chamber. Segment 4 (Shot 4): Final product reveal — hero shot on clean background, all angles. Transitions: smooth cross-dissolves between segments. Lower thirds identify each location. Professional documentary pacing, 1080p. No watermarks.
```

---

### 4e. Caption & Graphics Pass
**Service:** Caption & Graphics Pass ($69 add-on)
**Shots:** 2 (before/after)
**Reference Images Needed:** 2

#### Shot 1: Raw Video (Before)
**Image Prompt:**
```
A raw talking-head video frame of a person speaking. No captions, no graphics, no lower thirds. Plain background. Natural lighting. 16:9 horizontal aspect ratio.
```

#### Shot 2: With Captions (After)
**Image Prompt:**
```
The same talking-head video frame but now with: animated subtitles at the bottom (white text on dark pill), a lower third showing "John Smith — CEO, TechCorp", a progress bar at the top, and a subtle logo watermark in the corner. Professional broadcast style. 16:9 horizontal aspect ratio.
```

#### Video Prompt
```
Horizontal 16:9 split or sequential: First 5 seconds show a raw talking-head video of a person speaking with no captions or graphics. Then transition to the same video with: animated subtitles appearing word-by-word at the bottom, a lower third showing "John Smith — CEO, TechCorp", a progress bar at the top, and a subtle logo watermark in the corner. The captions are clean, white text with a dark background pill. Professional broadcast style. 16:9 horizontal. Shows the value of the caption and graphics pass.
```

---

## 5. Music Video (Long-format, Planned)

### 5a. Long-format Music Video
**Service:** Long-format Music Video (Planned)
**Shots:** 5 (multi-shot sequence)
**Reference Images Needed:** 5

#### Shot 1: Guitarist on Rooftop
**Image Prompt:**
```
A lone guitarist on a rooftop at sunset, city skyline behind. Golden hour light. Intimate, emotional. The guitarist is in silhouette with warm backlight. 16:9 horizontal aspect ratio (2.39:1 crop).
```

#### Shot 2: Full Band
**Image Prompt:**
```
A full band playing on a rooftop — guitarist, drummer, bassist, vocalist. Golden hour light intensifies. Energy and passion. Wide shot showing all members. 16:9 horizontal aspect ratio (2.39:1 crop).
```

#### Shot 3: Abstract Visuals
**Image Prompt:**
```
Abstract visual: guitar strings transforming into city lights. Sound waves becoming buildings. Surreal, artistic. Blue and gold color palette. 16:9 horizontal aspect ratio (2.39:1 crop).
```

#### Shot 4: Close-up Performance
**Image Prompt:**
```
Extreme close-up of fingers on guitar strings. Breath visible in cold air. Intimate, detailed. Warm lighting. 16:9 horizontal aspect ratio (2.39:1 crop).
```

#### Shot 5: Grand Finale
**Image Prompt:**
```
Wide shot of the band on the rooftop with city lights twinkling. Fireworks in the background. Full energy. Cinematic. 16:9 horizontal aspect ratio (2.39:1 crop).
```

#### Video Prompt
```
Horizontal 16:9 music video (2.39:1): Shot 1 — A lone guitarist on a rooftop at sunset, city skyline behind. Verse: intimate close-ups of fingers on strings, breath visible in cold air. Shot 2 — Chorus: camera pulls back to reveal full band playing on the rooftop as golden hour light intensifies. Shot 3 — Bridge: abstract visual sequence — guitar strings transforming into city lights, sound waves becoming buildings. Shot 4 — Close-up performance details. Final chorus (Shot 5): full energy, wide shot of band with city lights twinkling, fireworks in background. Cinematic color grading — warm sunset tones transitioning to cool night blues. 4K quality, professional music video production. Smooth transitions between shots. No text.
```

---

## 7. Image-to-3D Model Sample

### 7a. Ultimate Warrior Action Figure → 3D Gaussian Splat
**Service:** Image-to-3D Model ($79/model)
**Shots:** 1 (single 3D capture)
**Reference Images Needed:** 1 (input image) + 1 (3D output for showcase)

#### Input Image Prompt (Reference Photo)
```
A highly detailed action figure of a professional wrestler, recognizable by his long blonde mullet and intense facial expression. He is wearing black wrestling trunks with a distinctive yellow and pink lightning bolt logo, along with black knee pads, wristbands, and lace-up boots. The figure is posed with clenched fists against a plain grey background, showcasing the muscular sculpting typical of 1990s wrestling merchandise. Professional product photography, 4K quality, even lighting, neutral background. 16:9 aspect ratio.
```

#### 3D Output Description
```
3D Gaussian Splat model generated from the input image. 16,666 splat points, SH degree 3. The model captures the full 3D geometry of the action figure including:
- Muscular body sculpting and pose
- Facial features and blonde mullet hairstyle
- Wrestling trunks with yellow/pink lightning bolt logo
- Black knee pads, wristbands, and lace-up boots
- Clenched fist pose
Output format: PLY (Gaussian Splat). Viewable in Brush, SuperSplat, Luma AI, or any Gaussian Splat viewer.
```

#### Showcase Video Prompt (Before/After)
```
Horizontal 16:9 video: Split-screen comparison. Left side: "Input Image" — a photo of an Ultimate Warrior action figure on a grey background. Right side: "3D Output" — the same figure as a 3D Gaussian Splat, slowly rotating 360 degrees to show all angles. The 3D version shows the figure from multiple angles with realistic depth and lighting. A vertical slider divider moves left/right. Left label: "2D Reference Image". Right label: "3D Gaussian Splat (16,666 points)". Clean, educational, comparison-style. Shows the transformation from 2D photo to 3D model. 16:9 horizontal, 10-15 seconds.
```

#### Standalone 3D Showcase Video Prompt
```
Horizontal 16:9 video: A 3D Gaussian Splat model of an Ultimate Warrior action figure slowly rotating on a turntable. The figure shows all angles — front, side, back, and 3/4 views. As it rotates, the viewer can see the muscular sculpting, the yellow and pink lightning bolt logo on the trunks, the black knee pads and wristbands, and the blonde mullet. The background is a clean gradient from dark gray to charcoal. Subtle studio lighting highlights the 3D depth. Text overlay at the bottom: "Image-to-3D: From a single photo to a 3D model." Smooth 30fps rotation. 10-15 seconds. 16:9 horizontal.
```

---

## 6. Generation Notes

### Multi-Shot vs Single-Shot Summary

| Video Type | Shots | Ref Images | Complexity |
|------------|-------|------------|------------|
| BYOV 1080p | 1 | 1 | Low |
| BYOV 4K+60fps | 1 | 1 | Low |
| Anime Style Transfer | 1 | 2 (source+target) | Medium |
| Artistic Style Transfer | 1 | 2 (source+target) | Medium |
| Cinematic Style Transfer | 1 | 2 (source+target) | Medium |
| Cyberpunk Transfer | 1 | 2 (source+target) | Medium |
| Product Ad Spot | 5 | 5 | High |
| Infomercial Spot | 4 | 4 | High |
| Music Video Clip | 6 | 6 | High |
| Social Media Spot | 4 | 4 | Medium |
| Teaser / Hype Clip | 6 | 6 | High |
| Horizontal Edit 1080p | 5 | 5 | High |
| 2K Upgrade Demo | 1 | 2 (comparison) | Low |
| 4K Upgrade Demo | 1 | 2 (comparison) | Low |
| Extended Clip/Episode | 4 | 4 | High |
| Caption & Graphics | 2 | 2 (before/after) | Low |
| Long-format Music Video | 5 | 5 | High |

### Generation Workflow
1. **Generate reference images** using image prompts (via ComfyUI, Midjourney, DALL-E, etc.)
2. **For multi-shot videos**, generate ALL reference images first, then generate video clips
3. **For style transfer**, generate both source AND target style images
4. **For before/after demos**, generate matching pairs with identical composition
5. **Use reference images** as input to AI video generators (Runway, Kling, Pika, Sora)
6. **Assemble final video** from generated clips

### Recommended Tools
| Tool | Best For | Notes |
|------|----------|-------|
| Runway Gen-3 | High quality, cinematic | Best for style transfer demos |
| Kling 1.6 | Long duration, motion | Good for content creation samples |
| Pika 2.0 | Quick iterations | Good for teasers and social spots |
| Sora | Photorealistic | Best for product ads and showcases |
| Stable Video Diffusion | Local generation | Good for BYOV upscaling demos |
| ComfyUI + AnimateDiff | Local generation | Full control, free |

### Output Specifications
| Video Type | Resolution | Framerate | Duration | Format |
|------------|-----------|-----------|----------|--------|
| BYOV 1080p | 1920x1080 | 30fps | 10-15s | MP4 (H.264) |
| BYOV 4K | 3840x2160 | 30fps | 10-15s | MP4 (H.264) |
| BYOV 60fps | 1920x1080 | 60fps | 10-15s | MP4 (H.264) |
| Style Transfer | 1920x1080 | 24-30fps | 10-15s | MP4 (H.264) |
| Short-form (9:16) | 1080x1920 | 30fps | 30-60s | MP4 (H.264) |
| Long-form (16:9) | 1920x1080 | 30fps | 60-180s | MP4 (H.264) |
| Music Video | 1920x1080 | 24-30fps | 180-300s | MP4 (H.264) |
