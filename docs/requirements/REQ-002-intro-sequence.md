# REQ-002: Intro sequence

- Status: done
- Date: 2026-09-30

## Problem

`/` is the still shell from [REQ-001](REQ-001-storefront-shell.md). A first-time visitor never sees the black-hole sequence the brand is built around.

## Why

The intro is the door into Crue: get pulled in, then the shop. The sequence is the CSS timeline in [design/DESIGN.md](../design/DESIGN.md), drawn in [intro-desktop.html](../design/screens/dark/intro-desktop.html) and [intro-mobile.html](../design/screens/dark/intro-mobile.html). Business reason: the first visit should feel like the brand, not a static mark. Technical reason: [ADR 0001](../adr/0001-shopify-as-system-of-record.md) now specifies this CSS sequence, not a video and not a 3D scene.

## Actors

Visitor.

## In scope

- A fullscreen intro on `/` for a visitor who has not seen it. Dark in every theme. Ground is `bg-intro` (`#050506`). It covers the viewport on a phone and on a desktop. Reference widths are 390 and 1440. Build it fluid.
- The CSS sequence from the two intro screens and from the timeline in [design/DESIGN.md](../design/DESIGN.md). Stars, then the black hole (disk tint `disk`, centre `hole`), then the hole collapses, then the white mark and wordmark arrive, then the line "Get pulled in" and the Enter and Skip controls. The progress line fills across the sequence. The sequence is about 4.3 seconds and then waits. It does not dismiss itself.
- Assets: [`crue-mark-white.png`](../design/brand/crue-mark-white.png) and [`crue-wordmark-white.png`](../design/brand/crue-wordmark-white.png). The mark's accessible name is `CRUE mark`. The wordmark's accessible name is `CRUE`.
- Copy and controls from the screens, except the sound control. Desktop shows "Drop 001 / Event Horizon", "Crossing the event horizon", "Skip", and "Enter". Mobile shows "Drop 001", "Enter", and "Skip intro". Mobile does not show "Crossing the event horizon".
- Skip and Enter dismiss the intro and leave the visitor on `/`. Both are keyboard accessible. After either one, a cookie remembers the visit. Refresh and later visits in that browser do not show the intro again.
- `prefers-reduced-motion: reduce` skips to the final still state: mark, wordmark, "Get pulled in", the progress line full, and Enter and Skip. The black hole is not shown. Nothing in the intro autoplays.
- Archivo and IBM Plex Mono for this screen, loaded with `next/font/google` as in [design-language.md](../design-language.md). Square corners. Tailwind utilities for layout. Keyframes live in the Tailwind entry, not in a CSS module.
- The page under the intro stays the REQ-001 shell.
- The on-page intro mark stays [`crue-mark-white.png`](../design/brand/crue-mark-white.png). The document icon is [REQ-003](REQ-003-favicon.md). The document title stays `Crue`.

## Out of scope

- The home, product, collection, header, announcement bar, theme toggle, bag, and newsletter. Enter and Skip do not navigate to those screens. The screen files link to `home-desktop.html` and `home-mobile.html`. Those files are the design's next screen, not a route this requirement builds.
- Sound. The screens draw a sound control. No audio file exists. Do not invent one, and do not ship a control that does nothing.
- A video element, a video file, a poster frame, and a WebGL or 3D scene.
- The light theme, and any intro other than the dark one.
- Shopify, the Storefront API, and environment variables.
- Replacing the REQ-001 shell with the designed home page.
- Changing the disk colour or the spin duration away from the screen defaults (`#F4E9DA`, 14 seconds).
- An apple touch icon, a web app manifest, a theme color, and a social preview image.

## Behavior

A visitor opens `/` with no intro cookie.

- The intro covers the viewport. The ground is `#050506`.
- The sequence runs, then holds on the mark, the wordmark, "Get pulled in", Enter, and Skip. The visitor has to choose. Nothing sends them onward by itself.
- Skip or Enter removes the intro and shows the REQ-001 shell on `/`. The next load in that browser does not show the intro.
- A visitor who prefers reduced motion sees the final still state immediately, including Enter and Skip, and does not see the black hole animation.
- Phone and desktop show the same sequence. The words differ as in **In scope**. A wide screen has more air. A phone still fits without a horizontal scrollbar.
- The document language stays English. There is no Indonesian string.
- The document title stays `Crue`. The tab icon is [REQ-003](REQ-003-favicon.md).

## Acceptance criteria

1. `REQ-002` shows the intro on `/` when no intro cookie is set, and the intro includes the white mark and the white wordmark from `design/brand/`.
2. `REQ-002` shows "Get pulled in", Enter, and a skip control. Desktop shows "Skip" and "Crossing the event horizon". Mobile shows "Skip intro" and does not show "Crossing the event horizon".
3. `REQ-002` does not render a video element, and does not play or link to a video file.
4. `REQ-002` removes the intro when Skip or Enter is activated, sets a cookie, and does not show the intro on the next load. The page underneath is the REQ-001 shell.
5. `REQ-002` under `prefers-reduced-motion: reduce` shows the mark, the wordmark, "Get pulled in", and Enter without the black-hole animation.
6. `REQ-002` does not render the home, a product, a nav, or a sound control.

## Edge cases

- The mark and wordmark files are required. If either PNG is missing, the requirement is blocked. Do not substitute the SVG symbol or the wordmark SVG.
- A visitor who has the cookie never sees the sequence, including when they prefer reduced motion.
- The intro does not auto-dismiss when the progress line finishes.
- Keyboard users can reach Skip and Enter and activate them.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-002 renders the intro mark and wordmark on the first visit`
- `REQ-002 uses the desktop and mobile intro copy`
- `REQ-002 does not render a video`
- `REQ-002 dismisses the intro and keeps it dismissed`
- `REQ-002 shows the final still state when motion is reduced`
- `REQ-002 does not render the home, a product, or a sound control`

The keyframe timeline (star layers, collapse at 2.4s, mark at 2.8s, hold after 4.3s) is a browser check at a phone width and a desktop width. Jest in this requirement does not prove frame timing.

## Open questions

- The screens include a sound control, and the repo has no audio file. This requirement leaves that control out. Whether a later requirement adds sound is open.

These stay open and do not block this requirement:

- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [ADR 0001](../adr/0001-shopify-as-system-of-record.md). The intro is the CSS sequence.
- [architecture.md](../architecture.md). First visit, skip, reduced motion, cookie.
- [design-language.md](../design-language.md). Tokens `bg-intro`, `hole`, and `disk`. Archivo and IBM Plex Mono.
- [design/DESIGN.md](../design/DESIGN.md). The timeline.
- [intro-desktop.html](../design/screens/dark/intro-desktop.html) and [intro-mobile.html](../design/screens/dark/intro-mobile.html). Layout reference, not code to copy.
- [REQ-001](REQ-001-storefront-shell.md). The page underneath.
