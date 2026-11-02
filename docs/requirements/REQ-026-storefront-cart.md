# REQ-026: Storefront cart

- Status: done
- Date: 2026-10-06

## Problem

The bag lives in `sessionStorage`. Checkout does not leave the page, so a visitor cannot pay.

## Why

[REQ-016](REQ-016-bag.md) built the drawer and left the Shopify handoff out. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) says the cart and checkout belong to Shopify, and storefront tests stop at the checkout URL. Business reason: Add to bag should be something the merchant can fulfill. Technical reason: the Storefront cart returns `checkoutUrl`. This repo does not build a checkout page and does not charge a card.

## Actors

Visitor.

## In scope

- Add to bag creates or updates a Storefront cart. The line uses the selected variant id from [REQ-025](REQ-025-storefront-products.md).
- The drawer from [REQ-016](REQ-016-bag.md) stays the UI: quantities, remove, empty state, `[THRESHOLD]` until a real threshold exists, and the subtotal taken from the cart. This requirement does not invent a money format.
- The cart id is kept in the browser so a refresh still shows the same lines. `open` is still not kept. A refresh does not pop the drawer open.
- `Checkout` assigns `window.location` to `cart.checkoutUrl`. It does not open a route in this repo.
- An empty bag does not request checkout. The Checkout button stays absent, as [REQ-016](REQ-016-bag.md) already specifies.
- A failed cart write leaves the drawer as it was and does not navigate.

## Out of scope

- A checkout page, a payment SDK, tax, shipping rates, or a gateway. The gateway question stays open. Shopify Checkout hosts payment.
- Discounts, gift cards, and buyer identity on the cart.
- Replacing the drawer layout.

## Behavior

A visitor on a product selects a colour and a size that can be sold, then activates Add to bag.

- The drawer opens with that line. A refresh shows the same line and the drawer stays closed until they open it.
- They change quantity and remove a line. The cart matches.
- They activate `Checkout`. The browser goes to the `checkoutUrl` Shopify returned.
- With an empty bag, there is no Checkout control and the address does not change.
- If the cart request fails, the lines on screen do not change and the address does not change.

## Acceptance criteria

1. `REQ-026` adds the selected variant to a Storefront cart and shows it in the existing drawer.
2. `REQ-026` keeps the cart across a refresh without opening the drawer.
3. `REQ-026` updates quantity and remove against that cart.
4. `REQ-026` sends Checkout to `checkoutUrl` and does not add a checkout route.
5. `REQ-026` does not navigate when the bag is empty or the cart request fails.

## Edge cases

- [REQ-025](REQ-025-storefront-products.md) is done. The paid plan, the production store handle, and the public domain stay in [open-questions.md](../open-questions.md). This requirement reads the env store and does not choose them.
- Two adds of the same variant increase quantity. A different size is another line. That rule from [REQ-016](REQ-016-bag.md) stays.
- The local `sessionStorage` bag is no longer the source of lines.

## Shopify boundary

Writes a cart through the Storefront API and reads `checkoutUrl`. Does not charge a card, create an order in this repo, or send mail. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision. Payment happens on Shopify Checkout.

## Tests

Jest, with the requirement id in the name:

- `REQ-026 adds a variant to the Storefront cart`
- `REQ-026 keeps the cart across refresh and leaves the drawer closed`
- `REQ-026 updates quantity and remove`
- `REQ-026 sends Checkout to checkoutUrl`
- `REQ-026 does not navigate when checkout is unavailable`

Jest mocks the cart. It does not open Shopify Checkout.

## Open questions

These stay open. This requirement does not answer them:

- What is the Shopify plan, store handle, and public domain? See [open-questions.md](../open-questions.md).
- Which gateway is connected in Shopify? Checkout still goes to `checkoutUrl`.

These stay open:

- Couriers, accounts, and Shopify Email.
- `[THRESHOLD]` until the store defines it.
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-016](REQ-016-bag.md). The drawer this requirement fills.
- [REQ-025](REQ-025-storefront-products.md). Variant ids.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
