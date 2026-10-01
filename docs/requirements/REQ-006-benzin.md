# REQ-006: Benzin

- Status: done
- Date: 2026-10-01

## Problem

The storefront sets display and UI text in Archivo. The brand type family is Benzin, and the shipped pages still do not use it.

## Why

[design-language.md](../design-language.md) locks Archivo for display and all UI text, loaded from Google Fonts. The chosen family is Benzin, shown at [Behance gallery 104522553](https://www.behance.net/gallery/104522553/Benzin-Typeface). Business reason: the product brief asks for strong type, and that type is now named. Technical reason: Benzin is not a Google font, so the current `next/font/google` load cannot serve it.

## Actors

Visitor.

## In scope

- Benzin replaces Archivo for every role in the type scale: hero, manifesto, section titles, category tiles, product titles, nav and button labels, body, and card names.
- The files are the five cuts in [`assets/fonts/`](../../assets/fonts/). They stay there. The storefront loads them. It does not copy a second set into `public/`, and it does not load them from `docs/`.
- Each file reports CSS weight 400 and has no width axis. The storefront assigns the weight from the file name: `Benzin-Regular.ttf` is 400, `Benzin-Medium.ttf` is 500, `Benzin-Semibold.ttf` is 600, `Benzin-Bold.ttf` is 700, `Benzin-ExtraBold.ttf` is 800.
- The intro and the home use Benzin for those roles, on a phone and on a desktop. Sizes, line heights, tracking, and uppercase rules stay as written in [design-language.md](../design-language.md). Roles that ask for 400, 600, 700, and 800 use Regular, Semibold, Bold, and ExtraBold. No current role asks for 500. `font-stretch` is not applied.
- `display` is `swap`. The storefront does not request Benzin from Google Fonts.
- [design-language.md](../design-language.md) and [design/DESIGN.md](../design/DESIGN.md) name Benzin in Archivo's place for those roles, with this file map, and without `font-stretch` on Benzin. Archivo is removed from the storefront.

## Out of scope

- IBM Plex Mono. Labels, prices, and the announcement bar stay on Plex.
- New sizes, new tracking, or a redraw of the HTML screen files under `docs/design/screens/`.
- A width axis. These files do not have one.
- A public license for Benzin. This requirement is the personal prototype only, so the type can be seen locally. A later requirement records the license before a public deploy. [`readme.html`](../../assets/fonts/readme.html) is a FontsPad download note, not that license.
- Shopify, the Storefront API, and environment variables.
- Indonesian copy.

## Behavior

A visitor opens `/` on a phone or on a desktop, with or without the intro.

- Headings, navigation, buttons, body, and card names render in Benzin.
- Labels, prices, and the announcement bar still render in IBM Plex Mono.
- The page does not request Archivo or a Google Fonts stylesheet for Benzin.
- A reload uses the same family. Light and dark use the same family.

## Acceptance criteria

1. `REQ-006` renders the home headings, navigation, buttons, body, and card names in Benzin on a phone and on a desktop.
2. `REQ-006` renders the intro text in Benzin.
3. `REQ-006` still renders labels, prices, and the announcement bar in IBM Plex Mono.
4. `REQ-006` does not load Archivo, and does not load Benzin from Google Fonts.
5. `REQ-006` names Benzin, in Archivo's place, in `design-language.md` and `design/DESIGN.md`.

## Edge cases

- If a font file fails to load, the browser falls back to a generic sans-serif. The page does not swap back to Archivo.
- `prefers-reduced-motion` does not change the family.
- The same files are used in light and in dark.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-006 sets display and UI text in Benzin`
- `REQ-006 sets intro text in Benzin`
- `REQ-006 keeps IBM Plex Mono for labels, prices, and the announcement`
- `REQ-006 does not load Archivo or Google Fonts for Benzin`
- `REQ-006 names Benzin in the design docs`

That the glyphs match the supplied files at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Does Benzin also replace IBM Plex Mono? Until that is answered, Plex stays.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- The five files in [`assets/fonts/`](../../assets/fonts/). The public license is a later requirement.
- [design-language.md](../design-language.md) and [design/DESIGN.md](../design/DESIGN.md). The type scale stays. The family name changes from Archivo to Benzin.
- [REQ-002](REQ-002-intro-sequence.md) and [REQ-004](REQ-004-home.md). Those pages are where Benzin has to show.
