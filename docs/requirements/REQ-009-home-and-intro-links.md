# REQ-009: Home and intro links

- Status: done
- Date: 2026-10-01

## Problem

From a product page, Shop and the CRUE wordmark point at `#drop`. That section is on the home page, so neither control leaves the product. The wordmark also cannot play the intro again, because [REQ-002](REQ-002-intro-sequence.md) keeps the intro off after the first visit.

## Why

A visitor who opens a product needs a way back to the home page, and a way to see the intro again. Business reason: Shop is the way back to the shop, and the logo is the way to replay the brand sequence. Technical reason: the navbar links were written for the home page only. The product screens link the wordmark to the home file. This requirement changes that: the wordmark replays the intro.

## Actors

Visitor.

## In scope

- The header link named `Shop` goes to `/`. On the home page and on a product page, on a phone and on a desktop, it shows the home and does not play the intro.
- The CRUE wordmark in the navbar, on a phone and on a desktop, clears the intro cookie and opens `/`. The intro plays. Enter or Skip then shows the home, as [REQ-002](REQ-002-intro-sequence.md) already does.
- The wordmark's accessible name stays `CRUE home`.

## Out of scope

- Run, Train, Drops, Journal, and the footer links. They stay as they are.
- The footer wordmark. It is not a link.
- A new intro, a new route, or a change to Enter and Skip.
- Shopify, the Storefront API, and the catalog file.

## Behavior

A visitor is on `/products/horizon-shell-jacket` and has already seen the intro.

- They activate `Shop`. The address is `/`. The home is visible. The intro is not.
- They activate the CRUE wordmark. The address is `/`. The intro is visible.
- They activate Enter. The intro is gone. The home is visible.
- They activate the wordmark again. The intro plays again.

## Acceptance criteria

1. `REQ-009` sends the header `Shop` link to `/` from the home page and from a product page, without showing the intro.
2. `REQ-009` sends the navbar CRUE wordmark to `/` and shows the intro, on a phone and on a desktop.
3. `REQ-009` lets Enter dismiss that replay and show the home.
4. `REQ-009` does not change Run, Train, Drops, Journal, or the footer wordmark.

## Edge cases

- Activating the wordmark while the intro is already showing leaves the intro showing.
- A visitor with no intro cookie who activates `Shop` still sees the intro, because that is the first visit. `Shop` does not clear the cookie.
- The wordmark does not add a second route.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-009 sends Shop to the home page`
- `REQ-009 sends the wordmark to the intro`
- `REQ-009 dismisses the replay with Enter`
- `REQ-009 leaves the other nav links and the footer wordmark unchanged`

That Shop and the wordmark do this at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-002](REQ-002-intro-sequence.md). The intro still plays once per cookie. This requirement clears that cookie from the wordmark only.
- [REQ-007](REQ-007-navbar-footer.md). Shop and the wordmark live in the navbar.
- [REQ-008](REQ-008-product-page.md). The product page is where Shop has to leave for the home page.
