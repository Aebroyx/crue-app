# REQ-034: Nav links

- Status: done
- Date: 2026-11-03

## Problem

The header, the phone menu, and the footer still offer Run, Train, and Drops. The shop does not have separate products for those links. The CRUE wordmark in the top nav also clears the intro cookie, so a returning visitor who wants home is sent through the intro again.

## Why

[REQ-007](REQ-007-navbar-footer.md) and [REQ-020](REQ-020-mobile-menu.md) drew Run, Train, and Drops as main links. [REQ-025](REQ-025-storefront-products.md) left Run and Train as links to the catalog because collection routes were out of scope. [REQ-009](REQ-009-home-and-intro-links.md) made the wordmark replay the intro. [REQ-002](REQ-002-intro-sequence.md) already shows that sequence once, then remembers the browser for a year. This requirement shortens that memory to the browser session, and to seven days when the session stays open. Business reason: Run, Train, and Drops have no range yet, and the logo should bring someone home. The intro is the first door in, not a step on every return. Technical reason: the unused labels live in the navbar, the phone menu, and the footer shop column, and both wordmarks call `replayIntro`. This requirement removes those labels and stops the wordmark from clearing the intro cookie.

## Actors

Visitor.

## In scope

- The desktop header main links are `Shop` and `About`, in that order. `Run`, `Train`, and `Drops` are not shown.
- The phone menu main links are `Shop` and `About`, in that order, each with the existing arrow. `Run`, `Train`, and `Drops` are not shown.
- The footer shop column does not show `Run` or `Train`. `New arrivals` and `Accessories` stay.
- `Shop` still goes to `/catalog`. `About` still goes to `/about`. The phone menu still closes before those two navigate.
- The desktop wordmark and the phone wordmark, both named `CRUE home`, go to `/`. Neither clears `crue_intro`.
- A visitor with no `crue_intro` cookie who opens `/` still sees the intro. Enter remembers that browser for the rest of the session, and for seven days at most. A later visit in that same session, including from the wordmark, shows the home while the memory is under seven days old. Closing the browser ends the session, so the next open of `/` shows the intro. A session that is still open after seven days shows the intro again.
- On a development server, `/` with the query `intro` shows the intro for that load even when `crue_intro` is set. That query does not clear the cookie. A production build ignores `intro`.

## Out of scope

- The home Run tile, the home Train tile, and the home Drop section. They stay.
- The product breadcrumb. It stays.
- A Shopify menu, a collection route, and a new link.
- Search, Account, Bag, the theme switch, help links, and the social labels.
- A public replay control, and showing the intro on any page other than `/`.

## Behavior

A visitor opens any page with the navbar, on a phone or on a desktop.

- On a desktop the header shows `Shop` and `About`. It does not show `Run`, `Train`, or `Drops`.
- On a phone they open the menu. The large links are `Shop` and `About`. They activate `Shop`. The menu closes and the address is `/catalog`. They activate `About`. The menu closes and the address is `/about`.
- The footer shop column shows `New arrivals` and `Accessories`. It does not show `Run` or `Train`.
- They activate the CRUE wordmark on a phone or on a desktop. The address is `/`. The intro cookie stays. The home is visible.
- A browser with no intro cookie opens `/`. The intro is visible. Enter dismisses it. The next open of `/` in that same session shows the home. After the browser is closed, or after seven days, `/` shows the intro again.
- On the development server, a browser that already has the cookie opens `/?intro`. The intro is visible. Enter dismisses it. The cookie is still set, so the next open of `/` shows the home.

## Acceptance criteria

1. `REQ-034` shows `Shop` and `About` in the desktop header and does not show `Run`, `Train`, or `Drops`.
2. `REQ-034` shows `Shop` and `About` in the phone menu, links them to `/catalog` and `/about`, and does not show `Run`, `Train`, or `Drops`.
3. `REQ-034` leaves `Run` and `Train` out of the footer shop column and keeps `New arrivals` and `Accessories`.
4. `REQ-034` sends both CRUE wordmarks to `/` and does not clear `crue_intro`.
5. `REQ-034` shows the intro on `/` when `crue_intro` is absent, when the browser session has ended, or when the memory is seven days old. It also shows the intro on a development server when the query is `intro`.

## Edge cases

- The home Run and Train tiles remain. This requirement does not remove them.
- [REQ-020](REQ-020-mobile-menu.md) said the phone menu links Shop, Run, and Train to `/catalog` and Drops to `/`. This requirement replaces that list with Shop and About.
- [REQ-009](REQ-009-home-and-intro-links.md) left Run, Train, and Drops as they were, and sent the wordmark through the intro. This requirement removes those links and sends the wordmark home.
- A production visitor who opens `/?intro` does not see the intro when the cookie is already set.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-034 shows Shop and About in the header and leaves out Run, Train, and Drops`
- `REQ-034 shows Shop and About in the phone menu`
- `REQ-034 leaves Run and Train out of the footer`
- `REQ-034 sends the wordmark home and keeps the intro cookie`
- `REQ-034 shows the intro for a first visit, after the session or seven days, and for ?intro on a development server`

[REQ-020](REQ-020-mobile-menu.md) names `REQ-020 navigates Shop, Run, Train, Drops, and About`. That case is updated so it no longer requires Run, Train, and Drops. [REQ-009](REQ-009-home-and-intro-links.md) names `REQ-009 sends the wordmark to the intro`. That case is updated so the wordmark no longer clears the cookie. Jest does not prove the pixels.

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md).
- Which couriers fulfill orders?

## Dependencies

- [REQ-007](REQ-007-navbar-footer.md). The header and the footer.
- [REQ-020](REQ-020-mobile-menu.md). The phone menu.
- [REQ-009](REQ-009-home-and-intro-links.md). Shop, About, and the wordmark.
- [REQ-002](REQ-002-intro-sequence.md). The intro and `crue_intro`.
