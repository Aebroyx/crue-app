# Design language

Locked by the design in [`design/DESIGN.md`](design/DESIGN.md). Screen files in [`design/screens/`](design/screens/) are the layout reference. They are HTML exported from the canvas, not code to copy. When a screen and this file disagree, the screen wins for layout and this file wins for tokens.

[REQ-001](requirements/REQ-001-storefront-shell.md) shipped before these tokens. That page still uses Tailwind `bg-black` and the Next.js default font as stand-ins. Later requirements use the tokens below.

## Feeling

Minimal, heavy, and quiet. A hype sportswear store, not a fitness landing page. Large type, large product, large empty fields. One idea on screen at a time.

The black hole is the brand's gravity: the intro, the mark, and the named glow assets. After the intro, stars stay off the shop. The glow files in [`design/brand/`](design/brand/) are used only where a screen places them. No accent colour. Black, white, greys, and the photography do the work.

## Themes

One design, two themes. Light is the default. A header toggle switches to dark. Remember the choice in a cookie so the server renders the right theme with no flash. Both themes use the same components and the same token names. Dark is `[data-theme="dark"]` on `<html>`.

The intro is dark in both themes. There is only a dark intro screen.

Desktop screens are drawn at 1440px. Mobile screens are drawn at 390px. Build them fluid. Those widths are references, not fixed layouts.

## Color

### Dark (default)

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#0B0B0C` | Page background |
| `bg-intro` | `#050506` | Intro screen background |
| `surface` | `#141416` | Announcement bar, manifesto band, product image stage |
| `surface-2` | `#1C1C1F` | Card hover, secondary tiles |
| `line` | `#1F1F22` | Header and footer hairlines |
| `line-strong` | `#2A2A2D` | Accordion dividers |
| `control-border` | `#3A3A3E` | Input and size-button borders, swatch outlines |
| `text` | `#EDECE8` | Primary text, and the primary button fill |
| `text-2` | `#C4C3C0` | Body copy, secondary text |
| `muted` | `#A1A1A6` | Meta text, labels |
| `dim` | `#8A8A8F` | Footer fine print |
| `hole` | `#030304` | Black hole centre. Never use pure `#000` |
| `disk` | `#F4E9DA` | Accretion disk tint on the intro |

### Light

| Token | Hex |
| --- | --- |
| `bg` | `#F3F3F1` |
| `surface` | `#E8E8E5` |
| `surface-2` | `#DCDCD8` |
| `line` | `#D2D2CE` |
| `line-strong` | `#CFCFCB` |
| `control-border` | `#B5B5B0` |
| `text` | `#0B0B0C` |
| `text-2` | `#3A3A3E` |
| `muted` | `#55555A` |
| `dim` | `#6B6B70` |

The primary button is the `text` colour filled, with `text` in the `bg` colour. In light, the inverted Layers tile becomes dark, and the hero and Run tile use `glow-dark.jpg` with a light fade. See [`design/screens/light/`](design/screens/light/).

Product colourway swatches: Void Black `#0B0B0C`, Photon White `#EDECE8`, Nebula Grey `#7C7C81`.

Declare these as Tailwind v4 theme colours in the Tailwind entry. Do not add a second palette in a component.

## Type

Load with `next/font/google`, self-hosted, `display: 'swap'`.

| Family | Weights / axes | Role |
| --- | --- | --- |
| Archivo | variable, `wght` 100–900, `wdth` 62–125 | Display and all UI text |
| IBM Plex Mono | 400, 500 | Labels, prices, announcement bar |

| Role | Desktop | Mobile | Settings |
| --- | --- | --- | --- |
| Hero H1 | 148px / 0.86 | 50px / 0.88 | Archivo 800, `font-stretch: 125%`, uppercase, `-0.02em` |
| Manifesto H2 | 64px / 1.02 | 34px / 1.04 | Archivo 800, stretch 125%, uppercase, balanced wrap |
| Section H2 | 44px / 1 | 30px / 1 | Archivo 800, stretch 125%, uppercase |
| Category tile | 72px (big) / 44px | 48px / 24px | Archivo 800, stretch 125%, uppercase, line-height 0.9 |
| Product title | 36px / 1 | 26px / 1.02 | Archivo 800, stretch 125%, uppercase |
| Nav / button label | 12–13px | 12–13px | Archivo 600–700, stretch 112–125%, uppercase, `0.12–0.14em` |
| Body | 15–17px / 1.55–1.6 | 14–15px | Archivo 400, colour `text-2` |
| Card name | 14px | 12px | Archivo 700, stretch 112%, uppercase, `0.04em` |
| Mono label / price | 11–13px | 10–12px | IBM Plex Mono, uppercase, `0.16–0.2em` |

## Shape

- All corners are square (radius 0). Buttons, inputs, cards, tiles, and swatches. Only the mobile bag count badge is round.
- Page gutters: 48px desktop, 16–20px mobile.
- Section vertical padding: 96px desktop (manifesto 120px), 64px mobile.
- Product grid: 4 columns, 16px gap on desktop. 2 columns, 24px by 10px gap on mobile. Product images are 3:4.
- Header height: 72px desktop, 60px mobile.
- Touch targets are at least 44×44px.
- The hero uses `min-h-[100dvh]` on mobile, never `100vh`.

## Mark

Black artwork on light grounds. White artwork on black grounds. Do not recolor, stretch, or add effects.

Files in [`design/brand/`](design/brand/). Screen files reference `/brand/<file>`. Copy them to `public/brand/` when a requirement builds a screen that uses them.

| File | Use |
| --- | --- |
| `crue-mark-white.png` / `crue-mark-black.png` | Black-hole mark (849×284, about 3:1) |
| `crue-wordmark-white.png` / `crue-wordmark-black.png` | CRUE wordmark (830×176, about 4.7:1) |
| `glow-dark.jpg` | Black mark on a grey radial glow. Run tile, and the light-theme hero |
| `glow-light.jpg` | White mark on a grey glow. Newsletter band |

The older SVGs in [`assets/brand/`](../assets/brand/README.md) are the same artwork with a large transparent margin. Prefer the cut PNGs above for screens in `design/screens/`.

## Motion

UI easing is `cubic-bezier(.16, 1, .3, 1)`. Buttons press to `scale(.98)`. Animate only `transform` and `opacity`.

The intro is a sequence of about 4.3 seconds, then it waits for Enter. It plays on the first visit only, remembered with a cookie. It always has a Skip link and is keyboard-accessible. The full timeline, including the star layers and the spinning disk, is in [`design/DESIGN.md`](design/DESIGN.md).

Under `prefers-reduced-motion: reduce`, skip straight to the final state: the mark, the wordmark, and Enter.

## Voice

Short. Concrete. Product language names the run use, the fabric, and the fit. No exclamation marks.

- No em dashes or en dashes in visible copy. Use a colon, a comma, or a full stop.
- No labels or badges on product photos.
- At most one small uppercase eyebrow per three sections.
- No section numbering and no image counters.
- One call-to-action label per intent on a page.
- Do not invent stats, specs, prices, or reviews. Unknown facts stay as visible placeholders.

Prices, the shipping threshold, the year, product stories, details, fit, shipping copy, and photography are still placeholders. Draft product names in the screens are not the catalog. Real names come from Shopify.

## Screens

| Folder | What it is |
| --- | --- |
| [`design/screens/light/`](design/screens/light/) | Home and product, desktop and mobile. Default theme |
| [`design/screens/dark/`](design/screens/dark/) | Intro, home, and product, desktop and mobile. Chosen with the theme switch |

Read a screen for sizes, gaps, and hover states in its inline styles and `<helmet><style>`. Recreate interaction with React state. Do not port the canvas component class. `<!-- TODO: ... -->` marks the photography crop.

Component rules (announcement bar, header, hero, product card, manifesto, category bento, newsletter, product page) are in [`design/DESIGN.md`](design/DESIGN.md).
