# REQ-008: Product page

- Status: done
- Date: 2026-10-01

## Problem

The home shows four draft products, and a visitor cannot open one or choose a size. A Shopify subscription is not chosen yet, so the page cannot call a store.

## Why

[design/DESIGN.md](../design/DESIGN.md) already draws the product page, including the size grid, for light and dark, on a phone and on a desktop. Business reason: the size choice should be testable before a store exists. Technical reason: [ADR 0001](../adr/0001-shopify-as-system-of-record.md) says Shopify owns the catalog. This requirement does not replace that. It adds a temporary JSON file in the same shape as a Storefront product, so the page can be built now and the file can be removed when a store is connected.

## Actors

Visitor.

## In scope

- A file at `src/data/catalog.json`. It is the only source for the product page. The page does not hardcode a product.
- The file lists the four draft products already on the home: Horizon Shell Jacket, Singularity Run Tee, Orbit Half Tight, and Accretion Split Short. Each record uses the Storefront product fields the page renders: `id`, `handle`, `title`, `description`, `options`, `variants`, and `images`.
- A variant has `id`, `availableForSale`, `selectedOptions` (`name` and `value`), and `price.amount`. Every `availableForSale` is true. Every `price.amount` is `[PRICE]`. No currency is stored.
- Horizon Shell Jacket carries the sample from the product screens. Colour values are Void Black, Photon White, and Nebula Grey. Size values are `XS`, `S`, `M`, `L`, `XL`, and `XXL`. Each colour and size pair is one variant. Description, accordion bodies, and image alts are the placeholders on the screen: the story line, Details, Fit, Shipping & returns, and the shots Front, Back, Detail, and On body.
- The other three products are records so their cards can open the same page. They reuse Horizon Shell Jacket's options, variants, description, accordion bodies, and image alts. That reuse is a stand-in for UI testing. It is not a claim about those products. Their home cards still show the colour line they show today.
- The route is `/products/[handle]`. Each home card links to its handle. An unknown handle has no designed page.
- The page uses the navbar and footer from [REQ-007](REQ-007-navbar-footer.md). Light follows the light product screens. Dark follows the dark pair. Reference widths are 390 and 1440. Build it fluid.
- Size starts on `M` when that value exists. Colour starts on the first colour value. A chosen size is pressed. A chosen colour shows its name and a ring on that swatch. On a desktop the sizes are six columns. On a phone they are three. Each size control is 48px tall.
- The add button reads `Add to bag, ` plus the chosen size. After it is pressed it reads `Added: ` plus the chosen size, a comma, and the chosen colour. Pressing it again keeps that form and adds one to the bag count shown in the navbar on this page.
- Desktop images are a 2 by 2 grid. The phone image area is a sideways rail with bar indicators, and the add button stays in a bar at the bottom of the screen. Photography slots stay empty stages.
- Details starts open. Fit and Shipping & returns start closed. Opening one closes the other. Opening the open one closes it.
- The visible link "Size guide" does not add a route.

## Out of scope

- A Shopify account, the Storefront API, Admin, checkout, payments, orders, customers, and a cart that survives leaving the page.
- Sold-out sizes. The screen does not draw one, and every variant in the file is available.
- A size guide page. The link is only the label on the product screen.
- Real prices, real stories, real details, photography, and a currency.
- Search, account, and a menu panel. Bag still does not open a cart.
- Treating the JSON file as the system of record. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) still stands. The file is deleted when a later requirement reads Shopify.

## Behavior

A visitor on the home activates Horizon Shell Jacket.

- `/products/horizon-shell-jacket` opens from `catalog.json`. The navbar and footer are the same chrome as the home.
- The size `M` is pressed. The add button reads `Add to bag, M`.
- They choose `L`. `M` is no longer pressed. The add button reads `Add to bag, L`.
- They choose Photon White. The colour line names Photon White.
- They press add. The button reads `Added: L, Photon White`. The navbar bag count on this page is 1. On a phone the round bag badge shows that count.
- They refresh. The count is 0 again, and the size is `M`.
- They open Singularity Run Tee from its card. The same template renders that record's title. The size and colour controls are the reused stand-in, not a separate design.
- An unknown handle does not render this product template.
- The same page in the dark theme follows the dark product screens.

## Acceptance criteria

1. `REQ-008` opens `/products/[handle]` from each home card, and the product on the page comes from `src/data/catalog.json`.
2. `REQ-008` starts Horizon Shell Jacket on size `M` and Void Black, and shows six size columns on a desktop and three on a phone.
3. `REQ-008` updates the pressed size and the add label when another size is chosen.
4. `REQ-008` shows `Added: ` with the chosen size and colour after add, and shows that count in the navbar on this page only.
5. `REQ-008` stores the four draft products as Storefront-shaped records, reuses the Horizon variant shape for the other three, and does not call Shopify.

## Edge cases

- Choosing the size that is already pressed leaves it pressed.
- The add label follows the size and colour chosen after the first add.
- Leaving the page drops the count. The home still shows `BAG (0)`.
- The size guide link does not navigate to another route.
- An unknown handle does not render the product template.
- Keyboard users can reach each size and the add button.

## Shopify boundary

None of this requirement runs against Shopify. `src/data/catalog.json` stands in for a Storefront product query and is not a second catalog. A later requirement deletes the file, reads products and variants from the Storefront API, and disables sizes that are out of stock. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-008 reads each home product from the catalog file`
- `REQ-008 starts Horizon Shell Jacket on size M and Void Black`
- `REQ-008 changes the pressed size and the add label`
- `REQ-008 confirms the size and colour and counts the bag on this page`
- `REQ-008 keeps the catalog in Storefront shape and does not call Shopify`

That the page matches the light and dark product screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Every item in [open-questions.md](../open-questions.md). The Shopify plan, store handle, and domain are what a later requirement needs before this file is removed.
- The real colour and size lists for Singularity Run Tee, Orbit Half Tight, and Accretion Split Short. Until Shopify has them, those three records reuse the Horizon Shell Jacket sample.

## Dependencies

- [product-desktop.html](../design/screens/light/product-desktop.html), [product-mobile.html](../design/screens/light/product-mobile.html), and the dark pair. The screen wins for layout.
- [design/DESIGN.md](../design/DESIGN.md). The product page section, including the size grid and the add confirmation.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md). Shopify remains the system of record. This file is temporary.
- [REQ-004](REQ-004-home.md). The four draft names and colour lines.
- [REQ-007](REQ-007-navbar-footer.md). This page uses that navbar and footer.
- [REQ-005](REQ-005-theme.md). Light and dark follow the theme already chosen.
