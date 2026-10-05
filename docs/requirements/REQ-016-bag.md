# REQ-016: Bag

- Status: done
- Date: 2026-10-05

## Problem

Add to bag only changes a count on the product page. The header bag does not open. Leaving the page drops that count. A visitor cannot review what they added.

## Why

[design/DESIGN.md](../design/DESIGN.md) draws the bag as a drawer, in light and dark, on a phone and on a desktop. Checkout is not a screen in this repo. The Checkout control hands off to Shopify later. Business reason: the visitor should be able to gather a bag before that handoff exists. Technical reason: [REQ-008](REQ-008-product-page.md) kept the count on one page and left the bag closed.

## Actors

Visitor.

## In scope

- One bag, shared by every page that shows the navbar. It is not a route. The drawer component lives under `src/components/`, with its Jest file beside it.
- The bag starts empty. It is not seeded with the two sample lines in the bag screens. Those lines show the shape of a row.
- It survives moving between pages and a refresh in the same browser. It is stored in the browser. It is not a Shopify cart.
- Add to bag on the product page adds one of the product title, the selected colour, and the selected size. The line reads `{colour} / {size}`, as in `Void Black / M`. The same title, colour, and size already in the bag increases that line's quantity. A different colour or size is a new line. The add label from [REQ-008](REQ-008-product-page.md) still changes to `Added: ` plus the size, a comma, and the colour.
- Adding opens the bag. The header bag control also opens it, on the home page, the catalog, the product page, About, and the not-found page. The desktop label is `BAG (n)`. The phone control is named `Bag, n items`, and the round badge shows `n` when `n` is greater than 0. `n` is the sum of quantities.
- Light follows the light bag screens. Dark follows the dark pair. Reference widths are 390 and 1440. The page underneath stays put.
- Desktop: a dialog named `Bag`, 460px wide, full height, from the right, with a 1px `line` left border, on the scrim. The scrim is `rgba(28,28,26,0.38)` in light and `rgba(5,5,6,0.72)` in dark.
- Phone: the same dialog is full screen. There is no scrim to click. Header height is 60px on a phone and 72px on a desktop.
- The title is `Bag (n)`, Benzin 800, 18px, uppercase. The close control is 44×44px and is named `Close bag`.
- A `surface` band under the header reads `Free shipping over [THRESHOLD]`. IBM Plex Mono, 11px, `0.14em`, uppercase, colour `text-2`.
- Each line: a 96×128 `surface` image with the theme's mark at low opacity (black mark in light, white mark in dark), the product name in Benzin 700, 13px, uppercase, `0.04em`, the price `[PRICE]` in IBM Plex Mono, 13px, and the colour and size in 13px `muted`.
- Quantity is a group labelled `Quantity`. Minus and plus are 40×40px, named `Decrease quantity` and `Increase quantity`, inside a `control-border` outline. The number is IBM Plex Mono, 13px. Minus does not go below 1. Plus adds 1. `Remove` deletes the line. It is IBM Plex Mono, 11px, `0.14em`, uppercase, colour `muted`, underlined.
- The footer of a bag that has lines: `Subtotal` and `[SUBTOTAL]`, then `Shipping and taxes are calculated at checkout.`, then a full-width primary `Checkout` button, 60px tall, with the arrow. `[PRICE]` and `[SUBTOTAL]` stay those placeholders. This requirement does not add the prices up.
- `Checkout` does not open a page in this repo, does not change the address, and does not charge. The bag stays open. The Shopify handoff is out of scope below.
- Empty bag: the mark at 120px wide and opacity 0.25, `Your bag is empty`, `Nothing pulled in yet.`, and a primary `Shop all` that opens `/catalog` and closes the bag. No subtotal and no Checkout.
- `Close bag`, Escape, and a click on the desktop scrim each dismiss the bag and leave the visitor on the same page. Focus stays inside the dialog while it is open.
- The drawer opens and closes with the UI easing, on `transform` and `opacity`. `prefers-reduced-motion: reduce` shows it in place, with no open or close animation.

## Out of scope

- A checkout page in this storefront. [design/DESIGN.md](../design/DESIGN.md) does not draw one. Checkout is Shopify's hosted page, per [ADR 0001](../adr/0001-shopify-as-system-of-record.md). The Checkout button is the control that will later use `cart.checkoutUrl`.
- The Storefront cart API, `cartCreate`, inventory, discounts, shipping rates, tax, and payment. No payment SDK and no order database.
- A numeric subtotal, a real `[THRESHOLD]`, and a real `[PRICE]`.
- Search, account, and the mobile menu.

## Behavior

A visitor on a product chooses a size and a colour and presses add, on a phone or on a desktop.

- The bag opens over that product. It has one line for that title, colour, and size, quantity 1. The header count is 1.
- They press add again for the same colour and size. That line's quantity is 2. The header count is 2.
- They press plus, then minus. The quantity follows, and does not fall below 1.
- They press `Remove`. The bag is empty. It shows `Your bag is empty` and `Shop all`.
- They go to the home page. The header still shows that bag. Opening it there shows the same lines.
- They press `Checkout` while a line is in the bag. The address does not change. The bag stays open.
- They press `Close bag`. The bag is gone. The page underneath is the one they opened it from.
- With reduced motion, the bag appears in its open state. It does not animate in.

## Acceptance criteria

1. `REQ-016` adds the selected product, colour, and size from the product page, opens the bag, and keeps that bag on the home page after navigation.
2. `REQ-016` merges a repeated add into the same line, and keeps a different size as a second line.
3. `REQ-016` increases and decreases quantity, does not go below 1, and removes a line.
4. `REQ-016` shows `Bag (n)` and `BAG (n)` from the quantity sum, `[PRICE]` on each line, and `[SUBTOTAL]` for a bag that has lines.
5. `REQ-016` shows the empty state with `Shop all` to `/catalog`, and shows `Checkout` only when a line is present.
6. `REQ-016` leaves the address unchanged when `Checkout` is pressed, and dismisses the bag with `Close bag`, Escape, and the desktop scrim.

## Edge cases

- A refresh in the same browser keeps the bag.
- About and the not-found page can open the same bag from the header. They have no add button.
- The phone bag is full screen, so it has no scrim click. `Close bag` and Escape still dismiss it.
- Opening the bag does not change the selected size or colour on the product.

## Shopify boundary

None. This requirement does not read or write Shopify. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) still holds: the cart and checkout belong to Shopify. A later requirement replaces this browser bag with a Storefront cart and points `Checkout` at `cart.checkoutUrl`. This one does not call that API and does not build a checkout page.

## Tests

Jest, with the requirement id in the name:

- `REQ-016 adds a line and keeps it on the home page`
- `REQ-016 merges the same variant and splits a different size`
- `REQ-016 changes quantity and removes a line`
- `REQ-016 counts the bag and keeps the price placeholders`
- `REQ-016 shows the empty state and Checkout only with a line`
- `REQ-016 does not navigate on Checkout and closes the bag`

That the drawer matches the light and dark bag screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- `[PRICE]`, `[SUBTOTAL]`, and `[THRESHOLD]` stay the placeholders from the screens and [design/DESIGN.md](../design/DESIGN.md).
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [bag-desktop.html](../design/screens/light/bag-desktop.html), [bag-mobile.html](../design/screens/light/bag-mobile.html), and the dark pair. The screen wins for layout. The script block shows quantity, remove, and the empty state. It does not supply the starting bag.
- [design/DESIGN.md](../design/DESIGN.md). The bag section. Checkout is the Shopify handoff named there, not a new page.
- [REQ-007](REQ-007-navbar-footer.md). The header bag control is shared.
- [REQ-008](REQ-008-product-page.md). Add still confirms size and colour. This file replaces the count that lived only on that page, and it opens the bag [REQ-008](REQ-008-product-page.md) left closed.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
