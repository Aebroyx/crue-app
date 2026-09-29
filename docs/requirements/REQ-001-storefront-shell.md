# REQ-001: Storefront shell

- Status: done
- Date: 2026-09-29

## Problem

The repo has a spec and brand files, and no page a visitor can open. There is nothing to judge on a phone or a desktop.

## Why

This is the prototype's first slice, and it is the intro's stand-in. The video does not exist yet, so `/` is one black viewport with the white black-hole symbol, edited with the same austerity as the SpaceX reference in [design-language.md](../design-language.md). It is not the shop. The shop, when it is specified, takes its editing from the Nike reference in that same file: the product image carries the page, and the interface stays quiet. Business reason: the symbol is the first thing the brand can show. Technical reason: [architecture.md](../architecture.md) says the first accepted requirement is what adds the Next.js app and Jest.

## Actors

Visitor.

## In scope

- A Next.js 16 app (App Router, TypeScript) and Jest. Install the latest stable 16.3 patch. On 2026-09-29 that patch is 16.3.6. If a newer 16.3 stable patch exists when this is built, use that patch. Do not install Next.js 15 or a canary.
- Tailwind CSS 4 for every visual style on the page. Install the latest stable 4.3 patch. On 2026-09-29 that patch is 4.3.3. Utility classes do the layout. The ground is Tailwind's built-in `bg-black`, because the white symbol is the file for black grounds. `bg-black` is not a brand token. The only handwritten CSS file is the Tailwind entry. No CSS module, no styled-components, and no per-component stylesheet.
- One route, `/`, and it fills the viewport. The white black-hole symbol, `assets/brand/cruebh-white.svg`, is the only thing on it, centered on `bg-black`.
- No navigation, button, headline, footer, or second mark. The SpaceX reference is this emptiness. Its type, pill buttons, navigation, video, and photography are not used.
- The SVG's transparent margin is cropped for this layout. The symbol is what the visitor sees. The empty canvas does not make the page taller than the viewport.
- The same screen on a phone-width viewport and a desktop-width viewport. On both, the symbol fits without a horizontal scrollbar.
- A document title of `Crue`. The image's accessible name is `Crue`. The document language is English (`lang="en"`).
- The Next.js 16 default font. It is the stand-in until a brand type family is chosen. Do not add a second font.

## Out of scope

- The intro video, skip control, poster frame, and session behavior. Those wait for the intro requirement. The video file is still missing. This shell does not play footage in their place.
- The shop. A later requirement specifies it and uses the Nike reference for editing only: product imagery carries the page, chrome stays quiet. This requirement does not build a product grid, a price, or a Nike layout.
- The wordmark, the black symbol, navigation, footer, cart, and checkout.
- Shopify, the Storefront API, environment variables, and a development store.
- A second route, a custom 404, and any sentence of marketing copy.
- A final brand type family, and any Indonesian copy. Indonesian is a separate requirement.
- Naming final color tokens. See **Open questions**.
- Motion. This screen does not autoplay anything.

## Behavior

A visitor opens `/`.

- The only brand artwork is the white black-hole symbol, centered in the viewport.
- The ground is Tailwind `bg-black` and it covers the viewport. That class is the screen ground, not a brand token, and not a copied SpaceX palette.
- The document language is English. There is no Indonesian string on this screen.
- Phone and desktop show the same task: the symbol alone. A wide screen has more empty black around it. A phone still fits the symbol without a horizontal scrollbar.
- Nothing on the screen is a link, a button, a nav item, or a footer.
- No video element is present.

## Acceptance criteria

1. `REQ-001` serves `/` and the response includes the white black-hole symbol from `cruebh-white.svg`.
2. `REQ-001` gives that image the accessible name `Crue`, the document title is `Crue`, and the document language is English.
3. `REQ-001` does not render `crue-black.svg`, `crue-white.svg`, or `cruebh-black.svg`.
4. `REQ-001` does not render a video element, a link, a button, a nav, a footer, or a second route.
5. `REQ-001` fills the viewport with `bg-black`, centers the symbol, and does not scroll because of the SVG's empty margin. The symbol fits without a horizontal scrollbar at a phone width and at a desktop width.
6. `REQ-001` depends on Next.js 16.3 at the latest stable patch, and on Tailwind CSS 4.3 at the latest stable patch.
7. `REQ-001` styles `/` with Tailwind utility classes. No component imports a CSS module.

## Edge cases

- The symbol file is required. If `cruebh-white.svg` is missing, the requirement is blocked. Do not substitute the PNG or the wordmark.
- A visitor who prefers reduced motion still sees the same still symbol. There is no animation to disable.
- The document language is English. No string is translated. Indonesian waits for its own requirement.
- The font is the Next.js 16 default. A missing brand type family does not block the page, and the default is not written into the design language as the final family.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-001 renders the white black-hole symbol on the only route`
- `REQ-001 names the document and the image Crue in English`
- `REQ-001 does not render the other brand files, a video, a link, or a button`
- `REQ-001 depends on the latest stable Next.js 16.3 and Tailwind CSS 4.3`
- `REQ-001 does not import a CSS module for the page`

Criterion 5 is a browser check at a phone width and a desktop width. Jest in this requirement does not prove viewport fill, centering, or crop behavior.

## Open questions

These stay open and do not block this requirement.

- The final brand type family. The Next.js 16 default is only the stand-in.
- Final color tokens. `bg-black` on this screen is not that token.
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [ADR 0001](../adr/0001-shopify-as-system-of-record.md). The storefront is Next.js. This requirement does not add a backend.
- [architecture.md](../architecture.md). Next.js 16.3 and Tailwind CSS 4.3, latest stable patches.
- [design-language.md](../design-language.md). White artwork on black. SpaceX austerity for this shell. Nike editing for the later shop. The Next.js 16 default font is the stand-in, not the brand type family.
- [assets/brand/cruebh-white.svg](../../assets/brand/cruebh-white.svg).
- Package manager: npm. Installed patches: Next.js 16.3.7, Tailwind CSS 4.3.3, `@tailwindcss/postcss` 4.3.3.
