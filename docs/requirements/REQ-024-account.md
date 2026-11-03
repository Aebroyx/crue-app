# REQ-024: Account control

- Status: done
- Date: 2026-10-06

## Problem

The header Account button and the menu Account row look like they open an account. Nothing in the docs says where they go.

## Why

The product screens and the policy screens draw an Account control. The menu screen links it to `#account`. [product-brief.md](../product-brief.md) leaves accounts out of v1 unless a later requirement adds them, and [open-questions.md](../open-questions.md) still asks whether launch needs customer accounts or guest checkout is enough. Business reason: a local login would invent that answer. Technical reason: [ADR 0001](../adr/0001-shopify-as-system-of-record.md) says accounts, if they exist, are Shopify customer accounts, not a user table in this repo.

## Actors

Visitor.

## In scope

- The desktop header control named `Account` stays visible.
- The phone menu row named `Account` from [REQ-020](REQ-020-mobile-menu.md) stays visible.
- Activating either one does not change the address, does not open a dialog, and does not create a customer.

## Out of scope

- A `/account` route, a login form, a password, or a Shopify customer account login.
- Choosing guest checkout or accounts. That question stays open.
- Hiding the control. The screens show it.

## Behavior

A visitor on a desktop activates `Account`.

- The address stays the same. No dialog opens.

A visitor on a phone opens the menu and activates `Account`.

- The menu stays open. The address stays the same.

## Acceptance criteria

1. `REQ-024` keeps the desktop Account control and does not navigate when it is activated.
2. `REQ-024` keeps the menu Account row and does not navigate when it is activated.
3. `REQ-024` does not add an account route or a customer record.

## Edge cases

- Account is not a link to `#account` that jumps the page.
- The bag and search do not open when Account is activated.

## Shopify boundary

None. This requirement does not call the Storefront customer APIs. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) still holds: a later requirement, after the account question is answered, may send the visitor to Shopify customer accounts. This one does not.

## Tests

Jest, with the requirement id in the name:

- `REQ-024 does not navigate from the header Account control`
- `REQ-024 does not navigate from the menu Account row`
- `REQ-024 does not add an account route`

[REQ-033](REQ-033-customer-account.md) replaces the two navigation cases. Those controls now hand the visitor to Shopify customer accounts. The route case still holds.

## Open questions

This blocks any later requirement that sends the visitor to an account:

- Does launch need customer accounts, or is guest checkout enough? See [open-questions.md](../open-questions.md).

These stay open and do not change this requirement:

- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [design/DESIGN.md](../design/DESIGN.md). Account is drawn on the header. Checkout and customer accounts are hosted by Shopify.
- [REQ-007](REQ-007-navbar-footer.md). The header control already exists and does not navigate.
- [REQ-020](REQ-020-mobile-menu.md). The menu row.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
