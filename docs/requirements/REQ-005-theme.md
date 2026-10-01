# REQ-005: Theme switch

- Status: done
- Date: 2026-09-30

## Problem

The home can render light or dark, and a visitor cannot choose. The page stays dark, which is no longer the theme a first visit should meet.

## Why

[design/DESIGN.md](../design/DESIGN.md) ships both themes and puts the switch in the header. The light home is where the glow photograph sits behind the hero. Business reason: a visitor should be able to read the page on a light ground. Technical reason: [REQ-004](REQ-004-home.md) left the switch out because the home screens do not draw it.

## Actors

Visitor.

## In scope

- One theme switch in the footer, on a phone and on a desktop, beside the copyright line. It is not in the header. Light is the default. The switch is a 44px circle.
- The circle shows one black-hole mark cut in half on a diagonal from the upper right to the lower left. One side of that diagonal is the white mark on the dark ground. The other side is the black mark on the light ground. A click spins that cut half a turn around the circle while the mark stays still. `prefers-reduced-motion: reduce` does not play that spin. The accessible name is `Dark` on a light page and `Light` on a dark page. There is no visible word.
- Activating it swaps the document theme immediately. The home uses the light screens when the theme is light, and the dark screens when the theme is dark.
- A cookie remembers the choice. The server renders that theme on the next load, including the first paint. There is no flash of the other theme.
- The intro stays dark in both themes.

## Out of scope

- Matching the operating system theme.
- A second switch, a menu panel, or a settings page.
- Changing the home sections, the intro sequence, or the favicon.
- Shopify, the Storefront API, and environment variables.

## Behavior

A visitor opens `/` with no theme cookie.

- The page is light. The footer switch is named `Dark`. Its circle is the mark cut in half on a diagonal.
- They activate it. The page becomes the dark home. The switch is named `Light`.
- They refresh. The page is still dark.
- They activate `Light`. The page is light again, and a refresh stays light.
- The header has no theme switch. The same circle is in the footer on a phone and on a desktop.
- If the intro is showing, its ground stays the intro ground. The page underneath still follows the chosen theme.

## Acceptance criteria

1. `REQ-005` shows one footer switch named `Light` when the theme is dark, and `Dark` when the theme is light. The switch is a circle with the white mark on one half and the black mark on the other.
2. `REQ-005` does not put that switch in the header. A click spins the cut half a turn around the circle, and reduced motion does not.
3. `REQ-005` changes the document theme when the switch is activated, and keeps that theme on the next load.
4. `REQ-005` renders light when no theme cookie is set.
5. `REQ-005` keeps the intro on the intro ground in both themes.

## Edge cases

- An unknown cookie value is treated as light.
- The switch is a button. It does not navigate.
- Keyboard users can reach it and activate it.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-005 names the switch for the theme it will turn on`
- `REQ-005 places the circle switch in the footer`
- `REQ-005 switches theme and keeps it on the next load`
- `REQ-005 defaults to light`
- `REQ-005 keeps the intro dark in both themes`

That the light and dark homes match their screens at 390 and at 1440, with no flash on reload, is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-004](REQ-004-home.md). The home already has both themes. This requirement adds the switch.
- [design/DESIGN.md](../design/DESIGN.md). Light by default, header switch, cookie, no flash. The intro stays dark.
- [design-language.md](../design-language.md). The tokens the switch swaps.
