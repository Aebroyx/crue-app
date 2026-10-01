# CRUE Design System

CRUE is a premium running and hybrid-training apparel brand. The logo is a black hole, and the idea behind the brand is "get pulled in": becoming a hybrid athlete who runs and lifts. The site is a Shopify storefront, built headless on Next.js.

This file is the source of truth for **how the site looks and behaves**. Every screen under [`screens/`](screens/) shows the exact layout; this file explains the rules behind it. When the two disagree, the screen file wins for layout and this file wins for tokens. [design-language.md](../design-language.md) records the same tokens for the storefront.

---

## 1. What to build

One design in **two themes: dark and light**. Both ship, with a theme toggle in the header.

| Folder | What it is |
|---|---|
| `screens/light/` | Home and Product (desktop + mobile), light theme. **Default theme.** |
| `screens/dark/` | Intro, Home, and Product (desktop + mobile), dark theme. |

The intro is dark in both themes (a black hole reads best on black), so there is only a dark intro screen.

Theme behaviour: default to light. A toggle in the header switches to dark; remember the choice in a cookie so the server renders the right theme with no flash. Both themes use the same components and semantic tokens (section 3).

Desktop screens are drawn at **1440px** wide, mobile at **390px**. Build them fluid: the screens are the two reference widths, not fixed layouts.

## 2. How to read a screen file

Screen files are HTML exported from the design canvas. They are a **visual reference, not code to copy**.

- All exact values (sizes, colours, gaps, radii, font settings) are in the inline `style="..."` attributes. Use these numbers.
- `{{name}}` is a template hole filled from the `<script>` block at the bottom (`renderVals()`), e.g. product lists and selected states.
- `<sc-for list="{{items}}" as="item">` = map over a list. `<sc-if value="{{x}}">` = conditional render.
- `class Component extends DCLogic { ... }` at the bottom holds sample data and interaction state (selected colour, size, open accordion, bag count, filters). Recreate the behaviour with React state; do not port the class.
- `<helmet><style>` holds hover states and keyframe animations.
- `<!-- TODO: ... -->` comments mark where real photography goes, with the intended crop.
- Image paths point at `/brand/...` (see section 7).

## 3. Colour tokens

### Dark (default)

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0B0B0C` | Page background |
| `bg-intro` | `#050506` | Intro screen background |
| `surface` | `#141416` | Announcement bar, manifesto band, product image stage |
| `surface-2` | `#1C1C1F` | Card hover, secondary tiles |
| `line` | `#1F1F22` | Header / footer hairlines |
| `line-strong` | `#2A2A2D` | Accordion dividers |
| `control-border` | `#3A3A3E` | Input and size-button borders, swatch outlines |
| `text` | `#EDECE8` | Primary text; also the primary button fill |
| `text-2` | `#C4C3C0` | Body copy, secondary text |
| `muted` | `#A1A1A6` | Meta text, labels |
| `dim` | `#8A8A8F` | Footer fine print |
| `hole` | `#030304` | Black hole centre (never use pure `#000`) |
| `disk` | `#F4E9DA` | Accretion disk tint on the intro |

### Light

| Token | Hex |
|---|---|
| `bg` | `#F3F3F1` |
| `surface` | `#E8E8E5` |
| `surface-2` | `#DCDCD8` |
| `line` | `#D2D2CE` |
| `line-strong` | `#CFCFCB` |
| `control-border` | `#B5B5B0` |
| `text` | `#0B0B0C` (also the primary button fill) |
| `text-2` | `#3A3A3E` |
| `muted` | `#55555A` |
| `dim` | `#6B6B70` |

Implement both as the same semantic tokens swapped under `[data-theme="light"]` on `<html>`, so every component works in both. The primary button is always the `text` colour filled, with `bg` coloured text. In light, the one inverted Layers tile becomes dark, and the hero and Run tile use `glow-dark.jpg` with a light fade (see `screens/light/`).

Product colourway swatches: Void Black `#0B0B0C`, Photon White `#EDECE8`, Nebula Grey `#7C7C81`.

**No accent colour.** Black, white, greys and the photography do all the work.

## 4. Typography

Load with `next/font/google`, self-hosted, `display: 'swap'`.

| Family | Weights / axes | Role |
|---|---|---|
| **Archivo** | variable, `wght 100–900`, `wdth 62–125` | Display + all UI text |
| **IBM Plex Mono** | 400, 500 | Labels, prices, announcement bar |

### Type scale

| Role | Desktop | Mobile | Settings |
|---|---|---|---|
| Hero H1 | 148px / 0.86 | 50px / 0.88 | Archivo 800, `font-stretch: 125%`, uppercase, `-0.02em` |
| Manifesto H2 | 64px / 1.02 | 34px / 1.04 | Archivo 800, stretch 125%, uppercase, balanced wrap |
| Section H2 | 44px / 1 | 30px / 1 | Archivo 800, stretch 125%, uppercase |
| Category tile | 72px (big) / 44px | 48px / 24px | Archivo 800, stretch 125%, uppercase, line-height 0.9 |
| Product title (PDP) | 36px / 1 | 26px / 1.02 | Archivo 800, stretch 125%, uppercase |
| Nav / button label | 12–13px | 12–13px | Archivo 600–700, stretch 112–125%, uppercase, `0.12–0.14em` |
| Body | 15–17px / 1.55–1.6 | 14–15px | Archivo 400, colour `text-2` |
| Card name | 14px | 12px | Archivo 700, stretch 112%, uppercase, `0.04em` |
| Mono label / price | 11–13px | 10–12px | IBM Plex Mono, uppercase, `0.16–0.2em` |

## 5. Shape, spacing, layout

- **All corners square (radius 0).** Buttons, inputs, cards, tiles, swatches. Only the mobile bag count badge is round.
- Page gutters: **48px** desktop, **16–20px** mobile.
- Section vertical padding: **96px** desktop (manifesto 120px), **64px** mobile.
- Product grid: 4 columns, `16px` gap desktop; 2 columns, `24px 10px` gap mobile. Product images 3:4.
- Header height 72px desktop, 60px mobile.
- Touch targets are at least 44×44px everywhere.
- Hero uses `min-h-[100dvh]`-style sizing on mobile, never `100vh`.

## 6. Components

- **Announcement bar**: 36px, `surface`, mono caps, centred: "Drop 001: Event Horizon, out now" plus shipping threshold.
- **Header**: 3-column grid. Left: nav (Shop, Run, Train, Drops, Journal). Centre: wordmark. Right: search, account, theme toggle, bag with count. Mobile: menu, wordmark, search, bag.
- **Hero**: full-width, 820px desktop / 700px mobile, campaign film slot, faint mark top-right, eyebrow "Drop 001", 2-line H1, short subtext (max 20 words), one primary button "Shop Drop 001".
- **Product card**: image stage (`surface`) → name → colour meta → mono price. Hover lightens the stage. No badges on the image.
- **Manifesto band**: `surface`, offset to columns 4–12, H2 + body + text link.
- **Category bento**: asymmetric grid `7fr 5fr`, one tall "Run" tile with image and gradient, "Train" and "Layers" stacked. Layers is the single inverted tile (light in the dark theme, dark in the light theme). Arrow nudges right on hover.
- **Newsletter**: `surface` band with the glow image at low opacity, visible label, email input + "Join" button.
- **PDP**: 2×2 image grid (840px) + 440px info column: breadcrumb, title, price, story, colour swatches (square, ring on select), size grid (6 columns desktop, 3 mobile), full-width add-to-bag button that confirms "Added: M, Void Black", accordion (Details, Fit, Shipping & returns). Mobile: swipeable image rail with bar indicators and a sticky bottom add-to-bag bar.


## 7. Brand assets

Transparent PNGs cut from the original logo files, in [`brand/`](brand/). Copy them to `public/brand/` in the Next.js app when a requirement builds a screen; the screen files reference `/brand/<file>`.

| File | Use |
|---|---|
| `crue-mark-white.png` / `crue-mark-black.png` | Black-hole mark (849×284 ratio ≈ 3:1) |
| `crue-wordmark-white.png` / `crue-wordmark-black.png` | CRUE wordmark (830×176 ratio ≈ 4.7:1) |
| `glow-dark.jpg` | Black mark on grey radial glow (Run tile, light hero) |
| `glow-light.jpg` | White mark on grey glow (newsletter band) |

Never recolour, stretch or add effects to the logo.

## 8. Motion

Easing for UI: `cubic-bezier(.16, 1, .3, 1)`. Buttons press to `scale(.98)`. Animate only `transform` and `opacity`.

**Intro timeline** (total ~4.3s, then waits for Enter):

| Time | Event |
|---|---|
| 0–2s | Three star layers fade in and slowly pull toward the centre (18s / 26s / 40s loops); middle layer twinkles |
| 0.3s | Black hole (spinning accretion disk, photon ring, black centre) scales in |
| 2.4s | Black hole collapses (scale .3, fade out) |
| 2.8s | Logo mark pulls in from scale 2.2 with blur to sharp |
| 3.6–4.3s | Wordmark, "Get pulled in" and Enter / Skip rise in; progress line fills to 100% |

The disk is a `conic-gradient` masked into a ring, flattened with `scaleY(.13)`, rotating 14s linear. Show the intro on first visit only (cookie), always with a Skip link, and make it keyboard-accessible.

**Reduced motion is mandatory**: under `prefers-reduced-motion: reduce`, skip straight to the final state (logo, wordmark, Enter).


## 9. Copy and content rules

- **No em dashes or en dashes** anywhere in visible copy. Use a colon, comma or full stop.
- No labels or badges overlaid on product photos. Put "Just in" etc. in the text below.
- At most one small uppercase eyebrow per three sections.
- No section numbering ("001 /", "01") and no image counters ("01 / 04").
- One CTA label per intent across a page.
- No invented stats, specs, prices or reviews. Unknown facts stay as visible placeholders.

**Placeholders still to fill**: `[PRICE]`, `[THRESHOLD]` (free shipping), `[YEAR]`, product stories, Details / Fit / Shipping copy, and all photography. Product names (Horizon Shell Jacket, Singularity Run Tee, Orbit Half Tight, Accretion Split Short) and colour names are draft names: pull real ones from Shopify.

## 10. Next.js implementation notes

- App Router, TypeScript, Tailwind v4 with the tokens above declared in `@theme` in `globals.css`.
- Data from the **Shopify Storefront API** (products, collections, variants, cart). Never hardcode products; the screens' sample data only shows the shape.
- Suggested routes: `/` (intro overlay on first visit, then home), `/collections/[handle]` (product grid), `/products/[handle]` (PDP), cart as a drawer.
- Use `next/image` for all photography with the crops noted in the TODO comments; mark the hero image `priority`.
- Colour and size selection map to Shopify variants; disable sizes that are out of stock.
- Icons: use one library (Phosphor recommended) at stroke weight 1.5, matching the outline icons in the screens.
