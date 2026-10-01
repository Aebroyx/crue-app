# REQ-011: Catalog

- Status: done
- Date: 2026-10-01

## Problem

Shop has nowhere to show every piece. The home and the product page exist, and the catalog screens are not a route.

## Why

[design/DESIGN.md](../design/DESIGN.md) now draws a catalog, in light and dark, on a phone and on a desktop. Business reason: Shop should open the full list, with filters, before a Shopify store exists. Technical reason: [REQ-008](REQ-008-product-page.md) already keeps the sample products in `src/data/catalog.json`. This page reads that file. It does not call Shopify.

## Actors

Visitor.

## In scope

- One route, `/catalog`. The header link `Shop` opens it, from the home page and from a product page, and does not play the intro. On `/catalog`, `Shop` is underlined. The CRUE wordmark still replays the intro, as [REQ-009](REQ-009-home-and-intro-links.md) says.
- The navbar and footer from [REQ-007](REQ-007-navbar-footer.md). No newsletter band.
- The layout of [catalog-desktop.html](../design/screens/light/catalog-desktop.html) and [catalog-mobile.html](../design/screens/light/catalog-mobile.html) when the theme is light, and the dark pair when the theme is dark. Reference widths are 390 and 1440. Build it fluid.
- The six products named on those screens, in `src/data/catalog.json`: Horizon Shell Jacket, Singularity Run Tee, Orbit Half Tight, Accretion Split Short, Event Horizon Long Sleeve, and Photon Run Cap. Each record keeps the Storefront fields from [REQ-008](REQ-008-product-page.md) and adds the screen's category, colour list, and size list. Price stays `[PRICE]`. Photography stays an empty stage. A card links to `/products/[handle]`.
- The title is `Shop all` when no category is chosen, and the category name when one is. The count beside it is the number of cards shown, in parentheses.
- Breadcrumb: `Home` goes to `/`, then `Shop`.
- Desktop: a 240px filter column. Categories are All, Tops, Bottoms, Layers, and Accessories, each with a live count. Sizes are `XS` `S` `M` `L` `XL` `XXL`, in three columns, 44px tall. Colours are Void Black, Photon White, and Nebula Grey. `Hide filters` closes the column and the grid becomes four columns. `Show filters` opens it and the grid is three columns. `Clear all` shows only when a filter is set.
- A chosen category, size, and colour combine. Choosing a pressed size or colour clears it. Photon Run Cap has no sizes, so a size filter hides it. The empty state reads `Nothing in this orbit`, `No pieces match these filters.`, and `Clear filters`.
- The choices are kept in the query string: `category`, `size`, and `colour`. A refresh keeps them.
- On a phone: a `Filter` button, category chips in a row, and a two-column grid. `Filter` opens a full-screen sheet titled `Filters`, with Size and Colour, and a footer with `Clear` and `Show N results`. The button reads `Filter (N)` when a size or colour is set.
- `Sort: Featured` is visible and does not open a menu or reorder the cards. The screen does not draw other sort orders.
- Filter and sort marks come from `lucide-react`.

## Out of scope

- Shopify collection filters, a real collection handle, and `/collections/[handle]`. The route is `/catalog`.
- A sort menu.
- Changing the home tiles, the newsletter, or the product page layout.
- Real prices and photography.
- Switching the icon library to Phosphor. [REQ-007](REQ-007-navbar-footer.md) already chose Lucide.

## Behavior

A visitor activates `Shop`.

- `/catalog` opens. The heading is `Shop all` and the count is `(6)`. `Shop` is underlined.
- They choose Layers. The heading is `Layers`. Only Horizon Shell Jacket remains. Its card opens `/products/horizon-shell-jacket`.
- They choose size `M` and colour Void Black. The count and the category counts update. The address keeps `category`, `size`, and `colour`. A refresh shows the same list.
- They hide the filters. The grid is four columns. They show the filters. The grid is three columns.
- They clear all. The heading is `Shop all` and the count is `(6)`.
- On a phone they open `Filter`, choose a colour, and activate `Show N results`. The sheet closes and the grid matches that colour.
- A filter with no matches shows `Nothing in this orbit`.

## Acceptance criteria

1. `REQ-011` opens `/catalog` from the header `Shop` link, with `Shop` underlined, and does not play the intro.
2. `REQ-011` lists the six screen products from `src/data/catalog.json`, titled `Shop all` with the count `(6)`.
3. `REQ-011` filters by category, size, and colour together, updates the counts, and keeps those choices in the query string.
4. `REQ-011` uses three grid columns with filters open and four with filters hidden on a desktop, and two columns on a phone.
5. `REQ-011` shows `Nothing in this orbit` when nothing matches, and does not reorder the list from `Sort: Featured`.

## Edge cases

- Choosing the pressed size or colour clears that choice.
- Photon Run Cap is hidden when any size is selected.
- `Clear all` is absent when no filter is set.
- The wordmark still replays the intro.
- Keyboard users can reach each filter and each product card.

## Shopify boundary

None. This requirement does not read or write Shopify. `src/data/catalog.json` remains the temporary stand-in from [REQ-008](REQ-008-product-page.md). A later requirement replaces it with Storefront collection filters. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-011 opens the catalog from Shop`
- `REQ-011 lists six products from the catalog file`
- `REQ-011 filters by category, size, and colour`
- `REQ-011 changes the grid when filters are hidden`
- `REQ-011 shows the empty state and does not sort`

That the page matches the light and dark catalog screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Every item in [open-questions.md](../open-questions.md).
- Which sort orders exist besides Featured. The screen only draws `Sort: Featured`.

## Dependencies

- [catalog-desktop.html](../design/screens/light/catalog-desktop.html), [catalog-mobile.html](../design/screens/light/catalog-mobile.html), and the dark pair. The screen wins for layout.
- [design/DESIGN.md](../design/DESIGN.md). The catalog section.
- [REQ-008](REQ-008-product-page.md). The same catalog file, extended with the listing fields.
- [REQ-009](REQ-009-home-and-intro-links.md). Shop now opens `/catalog`. The wordmark still replays the intro.
- [REQ-007](REQ-007-navbar-footer.md). This page uses that navbar and footer. Icons stay Lucide.
