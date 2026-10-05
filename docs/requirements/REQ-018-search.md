# REQ-018: Search

- Status: done
- Date: 2026-10-05

## Problem

The header Search control does nothing. A visitor cannot look through the catalog without leaving the page they are on.

## Why

[design/DESIGN.md](../design/DESIGN.md) draws search as an overlay, in light and dark, on a phone and on a desktop. The screen script already filters the six draft products by name and category. Business reason: the visitor should be able to find a product from the header. Technical reason: [REQ-007](REQ-007-navbar-footer.md) drew the Search control and left it closed.

## Actors

Visitor.

## In scope

- One search overlay, shared by every page that shows the navbar. It is not a route. The component lives under `src/components/search/`, with its Jest file beside it.
- The header Search control opens it, on the home page, the catalog, the product page, About, and the not-found page.
- It searches the local catalog already in this repo: product title and category, case insensitive, after trimming the query. The same six draft products. It does not call Shopify.
- Light follows the light search screens. Dark follows the dark pair. Reference widths are 390 and 1440. The page underneath stays put.
- Desktop: a dialog named `Search`, full width, 620px tall, from the top, with a 1px `line` bottom border, on the scrim. The scrim is `rgba(28,28,26,0.38)` in light and `rgba(5,5,6,0.72)` in dark.
- Phone: the same dialog is full screen. There is no scrim to click.
- The field row is 96px tall on a desktop and 60px on a phone. It holds a search icon, an input named `Search` with placeholder `Search`, and a 44×44px close control named `Close search`. The input is Benzin 800, uppercase, 40px on a desktop and 24px on a phone.
- An empty field shows `Popular searches` and four chips: `Shell jacket`, `Run tee`, `Tight`, `Short`. A chip writes its label into the field. The label is IBM Plex Mono, 11px, `0.16em`, uppercase, colour `muted`. Each chip is 44px tall, `control-border` outline, Benzin 700, 12px, `0.12em`, uppercase.
- A field with matches shows `{n} result` or `{n} results`, then a grid of those products. Six columns on a desktop, two on a phone. Each result is a link to `/products/{handle}`: a 3:4 `surface` image with the theme's mark at opacity 0.1 (black mark in light, white mark in dark), the product name in Benzin 700, 12px, uppercase, `0.04em`, and `[PRICE]` in IBM Plex Mono, 12px.
- Under the grid, `View all in shop` goes to `/catalog` and closes the search. It is IBM Plex Mono, 12px, `0.14em`, uppercase.
- No match: `No results for “{query}”`, then `Check the spelling or try one of these.`, then the same four chips. The heading is Benzin 800, 22px, uppercase. The sentence is 14px, colour `text-2`.
- `Close search`, Escape, and a click on the desktop scrim each dismiss the search and leave the visitor on the same page. Focus stays inside the dialog while it is open. Opening it does not change the address.
- The overlay opens and closes with the UI easing, on `transform` and `opacity`. `prefers-reduced-motion: reduce` shows it in place, with no open or close animation.

## Out of scope

- Shopify `predictiveSearch`. [design/DESIGN.md](../design/DESIGN.md) names it as the later source. This requirement uses the local catalog, the same way the search screen script does. The store handle and public domain are still open.
- Search & Discovery, collections, and a query on the catalog URL. `View all in shop` opens `/catalog` with no query.
- A pulsing image skeleton. Result images use the static mark on `surface`, as the search screens draw them.
- Account, the theme switch, and the mobile menu.

## Behavior

A visitor presses Search in the header, on a phone or on a desktop.

- The overlay opens on that page. The field is empty. They see `Popular searches` and the four chips. They do not see a result count.
- They press `Run tee`. The field becomes `Run tee`. Singularity Run Tee is a result. The count reads `1 result`. The link goes to that product.
- They type `run`. Every title or category that contains `run` is listed. The count uses `results` when there is more than one.
- They type a word that matches nothing. They see `No results for “{that word}”`, the spelling sentence, and the four chips. There is no grid and no `View all in shop`.
- They press `View all in shop` while results are showing. The address becomes `/catalog`. The overlay is gone.
- They press `Close search`. The overlay is gone. The page underneath is the one they opened it from.
- With reduced motion, the overlay appears in its open state. It does not animate in.

## Acceptance criteria

1. `REQ-018` opens Search from the header on the home page, the catalog, the product page, About, and the not-found page, and starts on Popular searches.
2. `REQ-018` fills the field from a popular chip and lists local-catalog matches for title and category.
3. `REQ-018` shows `{n} result` or `{n} results`, `[PRICE]`, and a product link, and shows the empty-field state with no result count.
4. `REQ-018` shows the no-match copy and the chips, and hides the result grid.
5. `REQ-018` sends `View all in shop` to `/catalog` and closes the overlay.
6. `REQ-018` leaves the address unchanged until that link, and dismisses the overlay with `Close search`, Escape, and the desktop scrim.

## Edge cases

- A query of only spaces is the empty field. It shows Popular searches.
- Matching is case insensitive.
- About and the not-found page can open the same search. They have no catalog of their own.
- The phone overlay is full screen, so it has no scrim click. `Close search` and Escape still dismiss it.

## Shopify boundary

None. This requirement does not read or write Shopify. A later requirement replaces this local filter with Storefront `predictiveSearch`. This one does not call that API.

## Tests

Jest, with the requirement id in the name:

- `REQ-018 opens search on Popular searches`
- `REQ-018 searches the local catalog from a chip and from typing`
- `REQ-018 counts results and keeps the price placeholder`
- `REQ-018 shows the no-match state`
- `REQ-018 links View all in shop to the catalog`
- `REQ-018 does not navigate on open and closes the overlay`

That the overlay matches the light and dark search screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- The Shopify plan, store handle, and public domain in [open-questions.md](../open-questions.md). They block `predictiveSearch`, not this local filter.
- `[PRICE]` stays the placeholder from the screens.
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [search-desktop.html](../design/screens/light/search-desktop.html), [search-mobile.html](../design/screens/light/search-mobile.html), and the dark pair. The screen wins for layout. The script block shows the filter, the chips, the count, and the no-match copy.
- [design/DESIGN.md](../design/DESIGN.md). The search section. `predictiveSearch` is the later source named there, not this requirement.
- [REQ-007](REQ-007-navbar-footer.md). The header Search control is shared.
- [REQ-011](REQ-011-catalog.md). The catalog file is the list being searched. `View all in shop` opens that page.
