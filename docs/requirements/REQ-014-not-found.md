# REQ-014: Not found

- Status: done
- Date: 2026-10-02

## Problem

An unknown address, and a product handle that is not in the catalog, have no Crue page. Next.js would show its own not-found screen.

## Why

[design/DESIGN.md](../design/DESIGN.md) draws a 404, in light and dark, on a phone and on a desktop. The screens put a spinning black hole behind the message. That hole is the graphic this requirement does not build. The visitor should see the black-hole mark that already ships, coming in the way the intro mark comes in. Business reason: a dead link should still feel like Crue. Technical reason: `notFound()` is already called for a missing product, and there is no `not-found` screen to render.

## Actors

Visitor.

## In scope

- One screen, rendered from `src/app/not-found.tsx`. The screen component lives under `src/components/`, with its Jest file beside it. `src/app/` stays a route map.
- It is the page for an unknown URL, and the page `notFound()` already opens when a product handle is missing.
- Light follows the light 404 screens for the message, the type, and the two actions. Dark follows the dark pair. Reference widths are 390 and 1440. The page fills the viewport and does not scroll.
- The graphic is the black-hole mark, not a built hole. White artwork on the dark theme, black artwork on the light theme: `crue-mark-white.png` and `crue-mark-black.png`. It is not recolored. Its settled state is not stretched and has no effect on it. Its accessible name is empty. The heading carries the page name.
- The mark uses the same width as the intro mark: `min(72vw, 28.75rem)`, height from the file. The 404 screens do not give a mark width. They draw the hole instead.
- On load the mark plays the existing `intro-mark` keyframe: from opacity 0, scale 2.2, and blur 18px, to opacity 1, scale 1, and blur 0. Duration 1.6s. Easing `cubic-bezier(.16, 1, .3, 1)`. Delay 0. It does not wait on the intro timeline. The blur is only while that entrance plays.
- The copy does not animate. It is the copy in the screens: mono label `Error 404`, heading `Lost past the event horizon`, sentence `This page was pulled in and never came back.`
- Label: IBM Plex Mono, 11px, `0.2em`, uppercase, colour `muted`, on a phone and on a desktop.
- Heading: Benzin 800, uppercase, line height 0.98, balanced wrap. 52px on a desktop, 30px on a phone.
- Sentence: Benzin 400, 15px, line height 1.6, colour `text-2`, on a phone and on a desktop.
- Two actions, in this order. `Back to home` is the primary button and opens `/`. `Shop all` is the outline button and opens `/catalog`. Both are 52px tall, Benzin 700, 12px, uppercase, `0.12em`. They press to `scale(.98)`. On a desktop they sit in a row with a 10px gap. On a phone they stack, full width of the copy column, same gap. The copy column is centred. On a desktop its side inset matches the screen (320px on a 1440 frame). On a phone the inset is 24px. Items in the column gap 18px. The button row has 10px of space above it.
- The page uses the shared navbar, including its announcement bar. No nav item is underlined. The wordmark still replays the intro. It does not use the footer or the newsletter band. The screens do not draw them.
- `prefers-reduced-motion: reduce` shows the mark in its settled state immediately. Nothing spins.
- The two 404 sentences in [design/DESIGN.md](../design/DESIGN.md) that describe a spinning hole, including the 16s loop, are updated to this mark. The screen files stay as drawn. This file supersedes their hole.

## Out of scope

- A spinning disk, a photon ring, a hole centre, stars, or either glow file. The intro's hidden black-hole markup and its keyframes stay where [REQ-013](REQ-013-intro-logo.md) left them. They are not copied onto this page and they are not deleted.
- A new keyframe. The entrance is `intro-mark`.
- Search, account, the bag, and the menu. Those controls stay as the navbar already implements them. This requirement does not open their panels.
- Moving the theme switch into the header. The 404 screens draw one there. The switch stays in the footer, so this page does not show it. The theme still follows the cookie.
- A footer, a newsletter band, and Shopify.

## Behavior

A visitor opens an address that has no page, on a phone or on a desktop.

- The navbar is there. The footer is not.
- The mark for the current theme comes in. Then it sits still. There is no spinning hole.
- The label, the heading, and the sentence are visible the whole time.
- They activate `Back to home`. `/` opens.
- They activate `Shop all`. `/catalog` opens.
- A visitor who prefers reduced motion sees the mark settled as soon as the page is shown.
- A missing product handle opens this same screen.

## Acceptance criteria

1. `REQ-014` renders this screen from `src/app/not-found.tsx` for an unknown route and for a missing product handle.
2. `REQ-014` shows the theme's black-hole mark and does not show a spinning hole, a disk, or a photon ring.
3. `REQ-014` plays `intro-mark` on that mark at 1.6s with no delay, and shows the settled mark immediately when reduced motion is set.
4. `REQ-014` shows `Error 404`, `Lost past the event horizon`, and `This page was pulled in and never came back.`
5. `REQ-014` links `Back to home` to `/` and `Shop all` to `/catalog`, in a row on a desktop and stacked on a phone.
6. `REQ-014` renders the navbar and does not render the footer or the newsletter band.

## Edge cases

- The phone navbar stays Menu, the wordmark, Search, and the bag. The desktop navbar stays Shop, Run, Train, Drops, About, and the wordmark.
- No nav item is current on this page.
- The wordmark still replays the intro.
- Light uses the black mark. Dark uses the white mark.
- The page does not scroll at 390 or at 1440.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-014 renders the not-found screen for a missing route and a missing product`
- `REQ-014 shows the mark and not a spinning hole`
- `REQ-014 brings the mark in and skips that motion when reduced`
- `REQ-014 shows the 404 copy`
- `REQ-014 links home and the catalog`
- `REQ-014 keeps the navbar and leaves the footer off`

That the page matches the light and dark 404 screens at 390 and at 1440, with the mark in place of the hole, is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- The 404 screens never size the mark. This draft uses the intro mark width. Change that width before accept if it should be smaller.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [404-desktop.html](../design/screens/light/404-desktop.html), [404-mobile.html](../design/screens/light/404-mobile.html), and the dark pair. The screens win for the message, the type, and the actions. This file replaces their hole.
- [design/DESIGN.md](../design/DESIGN.md). The 404 section. This file supersedes the spinning hole.
- [REQ-007](REQ-007-navbar-footer.md). The navbar is shared. The footer stays off this page.
- [REQ-008](REQ-008-product-page.md). A missing product already calls `notFound()`.
- [REQ-011](REQ-011-catalog.md). `Shop all` opens `/catalog`.
- [REQ-013](REQ-013-intro-logo.md). The `intro-mark` keyframe. The intro's hidden hole stays in the intro.
