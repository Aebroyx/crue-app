# REQ-019: Product image skeleton

- Status: draft
- Date: 2026-10-05

## Problem

Product photography is still the mark on a `surface` stage. When a real image arrives later, a slow connection would pop the photo in with no waiting state, and a fast one should not flash a loader.

## Why

The catalog, home, product page, and bag already use that stage as the stand-in for a photo. Business reason: the stage should stay the Crue placeholder, and only pulse when a photo is actually on its way. Technical reason: there is no Shopify image yet, and a loader that ignores the visitor's connection would show on every fast response.

## Actors

Visitor.

## In scope

- One product-image component under `src/components/product-image/`, with its Jest file beside it. Home product cards, catalog cards, the product-page image stages, and bag line images use it. Wordmarks, the intro, the About panels, the footer mark, and the empty-bag mark stay as they are.
- No `src`: the settled placeholder. A `surface` stage, the theme's mark centred at low opacity (black mark in light, white mark in dark). It does not pulse. Nothing is loading.
- A `src` that has not loaded: wait 200ms. If the image has loaded before 200ms, show the image and never show the pulse. If it is still loading at 200ms, show the same placeholder with a pulse on `opacity` until the image loads, then show the image.
- The pulse uses the UI easing. `prefers-reduced-motion: reduce` keeps the settled placeholder, with no pulse, until the image loads.
- A `src` that fails to load stays on the settled placeholder. It stops pulsing. There is no error sentence.
- The component does not choose a Shopify image, a crop, or a URL. Callers pass `src` only when they already have one. Today's catalog has no photo URL, so the live pages stay on the settled placeholder.

## Out of scope

- The Storefront image API, `next/image`, and replacing the mark with photography.
- A skeleton on search results. [REQ-018](REQ-018-search.md) keeps the static mark from the search screens.
- A delay other than 200ms, and a shimmer that is not the existing mark on `surface`.
- Skeletons for text, prices, or buttons.

## Behavior

A product card, a product stage, or a bag line renders the component.

- With no `src`, the visitor sees the mark on `surface`. It does not pulse.
- With a `src` that loads in under 200ms, they see the image. They never see the pulse.
- With a `src` that is still loading after 200ms, they see the mark pulse, then the image when it loads.
- With a `src` that errors after the pulse has started, the pulse stops and the mark stays.
- With reduced motion, a slow `src` shows the still mark, then the image. It does not pulse.

## Acceptance criteria

1. `REQ-019` renders the settled mark placeholder when no `src` is passed, and does not pulse it.
2. `REQ-019` skips the pulse when the image loads before 200ms.
3. `REQ-019` pulses the placeholder after 200ms while the image is still loading, then shows the image.
4. `REQ-019` stops on the settled placeholder when the image fails.
5. `REQ-019` does not pulse under reduced motion.
6. `REQ-019` uses the component for the home cards, the catalog cards, the product stages, and the bag line image.

## Edge cases

- The 200ms wait is the only hold-off. A slow server still shows the pulse. A fast one does not.
- An empty string `src` is the same as no `src`: the settled placeholder, no pulse.
- Today's pages have no photo URL, so a browser check of those pages shows the settled mark, not the pulse. The pulse is proven in Jest with a delayed image.

## Shopify boundary

None. This requirement does not read Shopify images. A later requirement passes Storefront image URLs into this component.

## Tests

Jest, with the requirement id in the name:

- `REQ-019 shows the settled placeholder with no src`
- `REQ-019 skips the pulse when the image loads quickly`
- `REQ-019 pulses after 200ms and then shows the image`
- `REQ-019 settles when the image fails`
- `REQ-019 does not pulse under reduced motion`
- `REQ-019 uses the product image on home, catalog, product, and bag`

The live pages staying on the settled mark, in light and dark at 390 and at 1440, is a browser check. Jest does not prove those pixels. Jest does prove the pulse.

## Open questions

These stay open and do not block this requirement:

- Product photography, crops, and the Shopify image fields. This requirement does not invent them.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- The existing `surface` stages and mark opacities on the home cards, catalog cards, product stages, and bag lines. The skeleton is that stage, pulsing, not a new graphic.
- [design-language.md](../design-language.md). `surface`, and motion on `opacity` only. Reduced motion skips the pulse.
- [design/DESIGN.md](../design/DESIGN.md). Product images are 3:4 where the screen already says so. This requirement does not redraw those frames.
