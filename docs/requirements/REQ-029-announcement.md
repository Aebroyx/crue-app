# REQ-029: Announcement bar

- Status: done
- Date: 2026-11-02

## Problem

The top bar still says "Drop 001, out now", "Drop 001: Event Horizon, out now", and "Free shipping over [THRESHOLD]". Changing a campaign or the shipping line means a code change.

## Why

[architecture.md](../architecture.md) says Shopify pages and metaobjects hold content values, and this repo holds the layout. [REQ-004](REQ-004-home.md) and [REQ-007](REQ-007-navbar-footer.md) put the announcement copy in the navbar component. Business reason: the merchant should change the top line without a deploy. Technical reason: the bar already has a phone line, a desktop line, and a shipping line. This requirement fills those three fields from Shopify. It does not draw a new bar.

## Actors

Visitor and merchant.

## In scope

- One Storefront metaobject, type `announcement`, with fields `mobile_text`, `desktop_text`, and `shipping_text`.
- The existing announcement bar renders those fields. Phone shows `mobile_text`. A wide screen shows `desktop_text` and `shipping_text`. The bar keeps its current size, colour, and type.
- The merchant edits the entry in Shopify Admin. A saved change shows on the next load. No code deploy is required to change the words.
- A missing entry, an empty field, or a failed query leaves that slot as the copy already named in [REQ-004](REQ-004-home.md): "Drop 001, out now", "Drop 001: Event Horizon, out now", and "Free shipping over [THRESHOLD]". This requirement does not invent a new line.

## Out of scope

- A second bar, a carousel, or a dismiss control.
- The hero, the story, the nav labels, and the footer. Those stay as they are.
- Choosing the shipping amount. `[THRESHOLD]` stays until the merchant writes the real line in `shipping_text`.
- A separate CMS. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) keeps content in Shopify.

## Behavior

A visitor opens any page that shows the navbar, on a phone or on a wide screen.

- The phone bar reads `mobile_text`.
- The wide bar reads `desktop_text` and `shipping_text`.
- The merchant changes one field in Shopify Admin. The next load shows that field. The other two stay as they were.
- The metaobject is missing. The bar shows the three lines from [REQ-004](REQ-004-home.md).

## Acceptance criteria

1. `REQ-029` reads `announcement.mobile_text`, `announcement.desktop_text`, and `announcement.shipping_text` from the Storefront API.
2. `REQ-029` shows `mobile_text` on a phone and `desktop_text` plus `shipping_text` on a wide screen.
3. `REQ-029` uses the [REQ-004](REQ-004-home.md) lines when the entry or a field is missing, or the query fails.

## Edge cases

- An empty string is missing. That slot uses the [REQ-004](REQ-004-home.md) line. The other slots still use Shopify.
- The bar does not scroll sideways on either width. That rule is [REQ-004](REQ-004-home.md).

## Shopify boundary

Reads one `announcement` metaobject from the Storefront API. Does not write a cart, a checkout URL, a customer, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-029 reads the announcement fields from the metaobject`
- `REQ-029 shows the phone line and the wide lines`
- `REQ-029 falls back to the REQ-004 lines when the metaobject is missing`

Jest mocks the metaobject. It does not call the live store.

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md). The query uses the store named by `SHOPIFY_STORE_DOMAIN`.
- Which couriers fulfill orders?
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-004](REQ-004-home.md). The three lines and the bar.
- [REQ-007](REQ-007-navbar-footer.md). The navbar that renders the bar.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
