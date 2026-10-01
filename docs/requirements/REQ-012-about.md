# REQ-012: About

- Status: done
- Date: 2026-10-01

## Problem

The header still has Journal, and there is no About page. Journal does not open a page. It only jumps to the manifesto on the home page.

## Why

[design/DESIGN.md](../design/DESIGN.md) now draws an About page, in light and dark, on a phone and on a desktop. The screens replace Journal with About in the header. Business reason: the brand line should have its own page. Technical reason: Journal was never a route. This requirement removes that link and adds `/about`.

## Actors

Visitor.

## In scope

- One route, `/about`. The desktop header link `Journal` is removed. `About` takes its place, after Drops. `About` opens `/about`. On that page it is underlined. Run, Train, and Drops stay as they are. `Shop` still opens `/catalog`. The CRUE wordmark still replays the intro.
- The phone header stays Menu, the wordmark, Search, and the bag. It does not gain a text link. The About screens draw that same phone header.
- The page is one viewport tall, `100dvh`, and does not scroll. It uses the navbar. It does not use the footer or the newsletter band. The screens do not draw them.
- Light follows the light About screens. Dark follows the dark pair. Reference widths are 390 and 1440.
- The centre is the black-hole mark, 84px wide on a desktop and 72px on a phone. Its accessible name is `About CRUE`. White artwork on the dark theme, black artwork on the light theme. Under it, one paragraph, centred, max width 500px. Desktop type is 15px with line height 1.75. Phone type is 14px with line height 1.7. The colour is `text-2`.
- The paragraph is the one in the About screens: `CRUE is built for the hybrid athlete: the one who runs at first light and lifts after dark. We make technical running wear for both worlds, cut for the long run and the heavy set. Like the black hole in our mark, it pulls you in. Once you are in, there is no going back.`
- Four panels sit at the corners and bleed off the edges, rotated -12°, 8°, 10°, and -8°, so the centre column stays clear. They are the placeholder panels from the screens. They are not product photographs.
- On load, the panels fade up in order at 0s, 0.1s, 0.2s, and 0.3s. The mark and paragraph fade in at 0.5s. `prefers-reduced-motion: reduce` skips those fades.

## Out of scope

- Cut-out product photos. The design says those replace the panels later.
- A journal page, a manifesto route, and a mobile menu panel.
- Shopify, the Storefront API, and the catalog file.
- Changing the home sections.

## Behavior

A visitor on the home activates `About`.

- `/about` opens. The page does not scroll. `About` is underlined. `Journal` is not in the header.
- The mark and the paragraph are centred. Four panels sit at the corners.
- They activate `Shop`. `/catalog` opens. `About` is not underlined there.
- They activate the wordmark. The intro plays, as it does from the other pages.
- With reduced motion, the About page appears in its final state. Nothing fades in.

## Acceptance criteria

1. `REQ-012` opens `/about` from a header link named `About`, and does not show a link named `Journal`.
2. `REQ-012` underlines `About` on `/about`, and does not underline it on the home page or the catalog.
3. `REQ-012` centres the mark named `About CRUE` and the screen paragraph, in one viewport that does not scroll.
4. `REQ-012` places four corner panels at the screen rotations, and skips their fade when reduced motion is set.
5. `REQ-012` does not render the footer or the newsletter band on `/about`.

## Edge cases

- The phone header still has no `About` text link. The desktop header does.
- The page has no vertical scrollbar at 390 or at 1440.
- `Read the story` on the home still goes to the manifesto. This requirement does not remove that link.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-012 replaces Journal with About`
- `REQ-012 underlines About only on its page`
- `REQ-012 centres the mark and the paragraph`
- `REQ-012 keeps four corner panels and skips motion when reduced`
- `REQ-012 leaves the footer and the newsletter off the page`

That the page matches the light and dark About screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- The design calls the paragraph draft copy for the owner to confirm. Until that changes, the page uses the paragraph in the About screens.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [about-desktop.html](../design/screens/light/about-desktop.html), [about-mobile.html](../design/screens/light/about-mobile.html), and the dark pair. The screen wins for layout.
- [design/DESIGN.md](../design/DESIGN.md). The About section.
- [REQ-007](REQ-007-navbar-footer.md). The navbar is shared. Journal is removed from it.
- [REQ-009](REQ-009-home-and-intro-links.md). The wordmark still replays the intro.
- [REQ-011](REQ-011-catalog.md). Shop still opens `/catalog`.
