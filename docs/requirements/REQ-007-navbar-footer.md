# REQ-007: Navbar and footer

- Status: done
- Date: 2026-10-01

## Problem

The announcement bar, header, and footer are written inside the home screen. The next page cannot use them without copying that markup.

## Why

[REQ-004](REQ-004-home.md) built the home as one screen, including its chrome. Business reason: every later page should meet the same bar, header, and footer. Technical reason: [architecture.md](../architecture.md) keeps a screen in `src/components/<screen>/`. Shared chrome is not a screen and does not belong inside `home`.

## Actors

Visitor.

## In scope

- The home's announcement bar, desktop header, and mobile header move into `src/components/navbar/`. The home's footer moves into `src/components/footer/`. Home renders those components. It does not keep their markup.
- What a visitor sees stays the same, on a phone and on a desktop. Announcement copy, header controls, footer links, the wordmark, the theme switch, and the copyright line do not change.
- Every inline icon is a `lucide-react` icon. Search, Account, Bag, and Menu use `Search`, `User`, `ShoppingBag`, and `Menu`. The arrows in the hero, the category tiles, and the intro Enter button use `ArrowRight`. Stroke width stays `1.5`. Size and colour stay as they are, through Tailwind classes. No hand-drawn `svg` remains in the storefront.
- [architecture.md](../architecture.md) says shared chrome lives in `src/components/navbar/` and `src/components/footer/`, not inside a screen folder. The dependency is `lucide-react`.

## Out of scope

- A new page that uses the components. This requirement only makes the home's chrome reusable.
- New links, a new route, an open menu panel, search results, a cart, or an account page. Search, Account, Bag, and Menu stay visible and still do not open those flows. Bag count stays 0.
- A second icon set, or icons that are not on the screen today.
- Changing type, colour, spacing, or the theme switch.
- Shopify, the Storefront API, and environment variables.

## Behavior

A visitor opens `/` on a phone or on a desktop, with the intro dismissed.

- The announcement bar, header, and footer look and read as they do now.
- On a desktop, the header shows Shop, Run, Train, Drops, Journal, the wordmark, Search, Account, and "BAG (0)".
- On a phone, the header shows Menu, the wordmark, Search, and a bag button named "Bag, 0 items". The desktop header is not shown.
- The footer shows Shop and Help, the wordmark, the theme switch, and "© CRUE [YEAR]". The theme switch still changes the theme.
- The hero, The Drop, the manifesto, and the category tiles stay in the home. Their arrows are `ArrowRight` from `lucide-react`.

## Acceptance criteria

1. `REQ-007` renders the announcement bar and the desktop header from the navbar component, and the phone header from the same component.
2. `REQ-007` renders the footer, including the theme switch, from the footer component.
3. `REQ-007` does not define the announcement bar, the header, or the footer inside the home screen.
4. `REQ-007` renders Search, Account, Bag, Menu, and every arrow from `lucide-react`, and does not leave a hand-drawn `svg` in the storefront.
5. `REQ-007` records `src/components/navbar/` and `src/components/footer/` in `architecture.md`.

## Edge cases

- The phone header and the desktop header are not both visible at once.
- Footer links still stay on `/`. They do not add a route.
- The theme switch in the footer still follows [REQ-005](REQ-005-theme.md).

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-007 renders the navbar on a phone and on a desktop`
- `REQ-007 renders the footer from its own component`
- `REQ-007 keeps chrome out of the home screen`
- `REQ-007 uses Lucide for every icon`
- `REQ-007 records the shared chrome folders`

That the chrome matches the current home at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-004](REQ-004-home.md). The chrome already exists on the home. This requirement moves it.
- [REQ-005](REQ-005-theme.md). The footer keeps the theme switch.
- `lucide-react`. Search, account, bag, menu, and arrows come from that package.
- [architecture.md](../architecture.md). Shared chrome is the exception to `components/<screen>/`.
