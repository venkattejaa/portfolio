# Portfolio PRD — Venkat Teja
**Version:** 1.0  
**For:** LAXCODE Agent  
**Output:** Single `index.html` file, self-contained, deployable to GitHub Pages

---

## 1. Overview

Build a cinematic, scroll-driven personal portfolio for Venkat Teja — AI Engineer from Guntakal, Andhra Pradesh. The site must feel like an AAA game intro or a film title sequence, not a developer template. Inspiration: Active Theory, Bruno Simon, Stripe's landing pages.

Single HTML file. No frameworks. No build tools. Vanilla JS + Three.js via CDN. Must work offline after first load.

---

## 2. Real Data (use exactly as written)

```
Name:        Sugali Venkata Teja Naik
Display:     Venkat Teja
Email:       venkattejanaik@zohomail.in
Phone:       +91 81425 79498
WhatsApp:    https://wa.me/918142579498
GitHub:      https://github.com/venkattejaa
LinkedIn:    https://linkedin.com/in/sugali-venkata-teja-naik
Location:    Guntakal, Andhra Pradesh, India
Education:   DCME — Dr. YC James Yen Govt. Polytechnic, Kuppam
Status:      Available for freelance
```

### Projects (real, use only these)

| Name | Description | Stack | Status | Link |
|---|---|---|---|---|
| LAXMANA | 768M parameter multilingual LLM built from scratch. GQA, RoPE, SwiGLU, BPE tokenizer. No fine-tuning. | PyTorch, CUDA, Transformers | Training | github.com/venkattejaa |
| Ghost Messenger | Stealth Android messenger disguised as a calculator app. E2E encryption, WebRTC calls, Firebase backend. No server required. | Android, WebRTC, Firebase, E2E Encryption | Complete | github.com/venkattejaa |
| LAXCODE | Agentic AI coding assistant for the terminal. Multi-provider (NVIDIA NIM, OpenAI, Anthropic). Reads files, writes code, runs shell commands. | Python, FastAPI, LangGraph, NVIDIA NIM | Live | github.com/venkattejaa/LAXCODE |

### Stats (hardcoded, no counters)
- 768M Parameters
- 3 Live Projects
- 24hr Response Time

### Skills
AI/ML: PyTorch, LangChain, LangGraph, QLoRA, Ollama, FAISS, NVIDIA NIM  
Backend: Python, FastAPI, Node.js, Firebase  
Frontend: React, Three.js, HTML/CSS, JavaScript  
Android: Android SDK, WebRTC, E2E Encryption  
Specialties: LLM Training from scratch, RAG Systems, Autonomous Agents

---

## 3. Visual Design

### Aesthetic
- **Dark cinematic** — deep blacks, not flat #000000 but rich dark blues/purples (#02020f, #050510)
- **Color palette:** Background #02020f · Accent gold #c9a84c · Accent cyan #00d4ff · Text white #f0f0f0 · Dim text rgba(255,255,255,0.35)
- **Typography:** Headings — "Cormorant Garamond" (serif, elegant, cinematic). Body — "Inter" (clean, readable). Mono — "JetBrains Mono" (code blocks)
- **Motion:** Everything animate on scroll. Nothing is static. Particles, floating elements, parallax.
- NO gradients that look like Bootstrap. NO blue buttons. NO card shadows with border-radius:8px. NO generic dev portfolio look.

### Three.js Background (required)
Implement a full-viewport Three.js canvas fixed behind all content with:

1. **Particle field** — 6000+ particles drifting slowly. Mix of sizes. Clusters near center, sparse at edges. Color: mostly white at 20-40% opacity, occasional gold (#c9a84c) particles.
2. **Central 3D object** — IcosahedronGeometry, wireframe + solid layers. Rotates slowly, reacts to mouse (subtle tilt). Emits soft glow. Positioned in hero, fades as user scrolls.
3. **God rays** — 8-12 light ray meshes radiating from center object. Additive blending, very low opacity (0.03-0.06). Slow rotation.
4. **Mouse parallax** — entire particle field shifts subtly opposite to mouse direction (max 2deg tilt).
5. **Scroll-driven camera** — camera z position animates from 5 → 2 as user scrolls from top to bottom. Smooth lerp.

### Custom Cursor
- Small circle (8px), white, mix-blend-mode: difference
- Expands to 40px hollow ring when hovering links/buttons
- Slight trail delay (60ms)
- Hide default cursor on all elements

---

## 4. Page Sections

### 4.1 Loader
- Full screen black overlay
- Centered: "VT" in Cormorant Garamond, large, gold color, subtle flicker animation
- Thin horizontal line grows from 0% to 100% width over 2 seconds
- Percentage counter bottom right: 0 → 100
- Fades out completely, `display:none` after done
- Must complete before any scroll works

### 4.2 Navigation
- Fixed top. Height 60px. Fully transparent background with `backdrop-filter: blur(8px)`.
- Left: "VT" logo in Cormorant Garamond bold
- Right: Work · About · Contact links in Inter 11px uppercase, letter-spacing 0.2em
- Links: dim white by default, full white on hover, no underlines
- Thin 1px gold bottom border that appears only after scrolling 100px

### 4.3 Hero Section
- Full viewport height
- Left side (bottom third): 
  - Small label: "AVAILABLE FOR NEW PROJECTS" in gold, 10px, 0.25em letter-spacing
  - Name: "VENKAT TEJA" in Cormorant Garamond, 100px+, white, line-height 0.9
  - Subtitle: "AI Engineer · Full-Stack Developer · Guntakal, AP" in Inter 13px dim white
  - CTA button: "View Work →" — outlined gold, clip-path polygon shape (not border-radius)
- Right side (bottom):
  - 3 stat blocks stacked vertically: 768M PARAMETERS · 3 LIVE PROJECTS · 24HR RESPONSE
  - Numbers in Cormorant Garamond 3rem gold, labels in Inter 10px dim white uppercase
- Scroll indicator bottom center: "SCROLL" vertical text + animated line

### 4.4 Work Section
- Section label: "SELECTED WORK" gold 10px uppercase
- Large heading: "Projects" in Cormorant Garamond 5rem white
- 3 project rows (not cards) — each row is a full-width horizontal strip:
  ```
  [01] · LAXMANA ————————————————— [PyTorch] [CUDA] [Training] →
  [02] · Ghost Messenger ——————————— [Android] [WebRTC] [Complete] →
  [03] · LAXCODE ——————————————————— [Python] [NVIDIA NIM] [Live] →
  ```
- On hover: row background lifts to rgba(201,168,76,0.05), project name color shifts to gold
- Each row links to GitHub
- Below rows: brief 1-line description appears on hover using CSS/JS

### 4.5 About Section
- Split layout: left text, right terminal card
- Left:
  - "WHO I AM" label gold
  - Body text in Inter 14px: real bio (use the overview text below)
  - Bio: "I'm a DCME student and self-taught AI engineer from Guntakal. While most people my age follow tutorials, I build real systems. LAXMANA is a 768M parameter multilingual LLM I built entirely from scratch — no team, no lab, no funding. GQA, RoPE, SwiGLU. Real architecture."
- Right: Terminal card (macOS style, dark bg)
  ```
  profile.json
  {
    "name": "Venkat Teja",
    "role": "AI Engineer",
    "location": "Guntakal, AP",
    "education": "DCME — Kuppam Polytechnic",
    "flagship": "LAXMANA — 768M param LLM",
    "building": "LLMs from scratch",
    "open_to": "freelance",
    "status": "available"
  }
  ```

### 4.6 Skills Ticker
- Full width horizontal scrolling ticker (infinite loop, CSS animation)
- Content: PYTORCH · LANGCHAIN · LANGGRAPH · PYTHON · FASTAPI · ANDROID · WEBRTC · REACT · NVIDIA NIM · QLORA · OLLAMA · FAISS
- Gold dots as separators
- Speed: 30s loop, linear, infinite
- No duplicates

### 4.7 Contact Section
- Large centered heading: "Let's build" on line 1, "something great." on line 2
- Cormorant Garamond, 8rem, white
- Below: 4 links in a row — Email · WhatsApp · GitHub · LinkedIn
  - Each: label in dim uppercase, value below in white
  - Hover: gold color
- Footer line: "© 2026 Venkat Teja · Guntakal, India · Built with intention"

---

## 5. Animations

### Scroll Animations (IntersectionObserver)
Every section element starts: `opacity: 0; transform: translateY(40px)`  
On enter viewport: transition to `opacity: 1; transform: translateY(0)` over 0.8s ease  
Stagger child elements by 100ms each

### Text Animations
- Hero name: fade up, character by character, 50ms stagger per character
- Section headings: slide up from 60px below, fade in

### Hover States
- All interactive elements: transition duration 0.25s
- Project rows: background lift + text color shift
- Contact links: color shift to gold
- Nav links: opacity 0.4 → 1.0

---

## 6. Technical Requirements

### Performance
- Single HTML file, all CSS inline in `<style>`, all JS inline in `<script>`
- Fonts loaded from Google Fonts CDN
- Three.js from cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))` — cap pixel ratio
- Particle count: 6000 desktop, reduce to 2000 if `window.innerWidth < 768`
- `requestAnimationFrame` loop — no setInterval for animation

### Compatibility
- Chrome, Firefox, Safari, Edge latest
- Mobile: hide Three.js canvas on screens < 480px (too slow), show static dark gradient instead
- All text must be readable without Three.js rendering

### Scroll
- Native scroll, no custom scroll libraries
- `scroll-behavior: smooth` on html
- Parallax via `window.addEventListener('scroll', ...)` with passive: true

### No broken elements
- No placeholder emails, URLs, or project names
- Every link must have a real href
- No `href="#"` on links that should go somewhere real
- Contact form: if included, use Formspree endpoint OR remove entirely (no fake submit)

---

## 7. File Output

Single file: `index.html`  
No external CSS files. No external JS files (except CDN links).  
Must open correctly by double-clicking the file locally (no server needed).

---

## 8. What NOT to do

- No Bootstrap, Tailwind, or any CSS framework
- No React, Vue, or any JS framework
- No lorem ipsum or placeholder text
- No fake projects (SANTOSHA, KALPANA, RASTRA do not exist — never include them)
- No `venkatteja@example.com` — this is a fake email, never use it
- No `linkedin.com/in/venkatteja` — wrong URL
- No counter animations that show 0 on page load
- No generic hero text like "Hi, I'm a developer"
- No card grids with equal-height boxes and drop shadows
- No blue hyperlink colors on project titles
- Do not split "build something" into "buildsomething" — it must be two words
- Do not add a contact form unless connected to a real backend


