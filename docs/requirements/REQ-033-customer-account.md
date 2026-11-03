# REQ-033: Customer account

- Status: done
- Date: 2026-11-03

## Problem

The Account control is visible and does nothing. A buyer who wants past orders or a saved shipping address has nowhere to go.

## Why

[product-brief.md](../product-brief.md) keeps guest checkout and lets a buyer create a Shopify customer account to save details. [architecture.md](../architecture.md) says customer records live in Shopify and this repo does not keep a user table. [REQ-024](REQ-024-account.md) left both Account controls inert until that choice was made. Business reason: order history and shipping addresses are Shopify's job. Technical reason: the header button and the phone menu row already exist. This requirement sends those controls to Shopify customer accounts.

## Actors

Visitor and merchant.

## In scope

- The desktop header control named `Account` and the phone menu row named `Account` hand the visitor to Shopify customer accounts.
- Shopify shows sign-in when the visitor is signed out. Shopify shows the account when the visitor is signed in.
- On that Shopify account the buyer can see past orders and the items on them, and can save one or more shipping addresses. Checkout on Shopify can offer those saved addresses.
- Guest checkout stays available. An account is not required to buy.
- This repo does not add a `/account` route, a login form, a password field, an order list, or an address form.

## Out of scope

- A custom account screen in this repo.
- A local user table, and storing orders or addresses in this app.
- Requiring an account before checkout.
- The newsletter. How signup works is not decided.
- Loyalty, store credit, and a wishlist.

## Behavior

A visitor on a wide screen activates `Account`.

- The browser goes to Shopify customer accounts. The address is not a route in this app.
- They are signed out. Shopify asks them to sign in.
- They are signed in. Shopify shows their orders and saved addresses.

A visitor on a phone opens the menu and activates `Account`.

- The same handoff happens.

A visitor checks out without an account.

- Checkout still completes on Shopify. No account is required.

## Acceptance criteria

1. `REQ-033` sends the header `Account` control to Shopify customer accounts, not to a route in this app.
2. `REQ-033` sends the phone menu `Account` row to the same Shopify customer accounts destination.
3. `REQ-033` does not add a local account page, a password field, an order list, or an address form.

## Edge cases

- The visitor is already signed in. The control still opens Shopify customer accounts.
- The dev store may show Shopify's sign-in or password page before the account. This requirement does not replace that Shopify screen.

## Shopify boundary

Hands the visitor to Shopify customer accounts. Shopify keeps the customer, the orders, and the addresses. This repo does not write a customer, a cart, or an order for this requirement. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-033 sends the header Account control to Shopify customer accounts`
- `REQ-033 sends the menu Account row to Shopify customer accounts`
- `REQ-033 does not add a local account page`

Jest does not call the live store. It checks the handoff. [REQ-024](REQ-024-account.md) said these controls do not navigate. This requirement replaces that for the two Account controls.

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md). The handoff uses the store named by `SHOPIFY_STORE_DOMAIN`.
- Which couriers fulfill orders?
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-024](REQ-024-account.md). The Account controls this requirement activates.
- [REQ-020](REQ-020-mobile-menu.md). The phone menu row.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
- [product-brief.md](../product-brief.md). Guest checkout, and an optional Shopify customer account.
