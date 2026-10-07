# REQ-020: Mobile menu

- Status: done
- Date: 2026-10-06

## Problem

On a phone the header Menu button is visible and does nothing. The design draws a full-screen menu for Shop, Run, Train, Drops, About, help links, theme, and the social labels.

## Why

[design/screens/light/menu-mobile.html](../design/screens/light/menu-mobile.html) and the dark pair are the only screen for that button. [REQ-015](REQ-015-size-guide.md) left the menu unbuilt on purpose. Business reason: a phone visitor cannot reach Shop or About from the header without it. Technical reason: the desktop nav is hidden below the `md` breakpoint, so the button is the only main nav on a phone.

## Actors

Visitor.

## In scope

- The phone Menu button opens a full-screen menu. Desktop has no menu and the button stays hidden there.
- Header row: the wordmark, and a close control named `Close menu`. The main links, in order, each with an arrow: `Shop`, `Run`, `Train`, `Drops`, `About`. Benzin 800, 32px, uppercase, 64px rows.
- Help links, in order: `Account`, `Shipping & returns`, `Size guide`, `Contact`. 15px, colour `text-2`, 40px rows.
- `Shop`, `Run`, and `Train` go to `/catalog`. `Drops` goes to `/`. `About` goes to `/about`. Each of those closes the menu, then navigates.
- `Shipping & returns` goes to `/policies/shipping`. `Contact` goes to `/policies/shipping`, which is the policy file the screen links. `Size guide` closes the menu and opens the existing size-guide overlay from [REQ-015](REQ-015-size-guide.md).
- `Account` is visible and does not change the address. Its destination is [REQ-024](REQ-024-account.md).
- A `Theme` label, then a two-part control named `Theme` with `Dark` and `Light`. The current theme is filled. Choosing the other one uses the same theme cookie as [REQ-005](REQ-005-theme.md). The footer switch stays as it is.
- Social labels, in order: `Instagram`, `Strava`, `TikTok`. They are text. They do not navigate. No profile URL is in the docs.
- `Close menu` and Escape close it and leave the visitor on the same page. Focus stays inside while it is open. The phone menu is full screen, so there is no scrim click.
- Open and close use the UI easing, on `transform` and `opacity`. `prefers-reduced-motion: reduce` shows it in place.

## Out of scope

- A desktop menu.
- Inventing Instagram, Strava, or TikTok URLs.
- An account page, a contact form, or a support email. `[SUPPORT EMAIL]` stays on the policy page.
- Collection routes for Run and Train. The screen sends those links to the catalog file.
- Changing search, the bag, or the desktop header links.

## Behavior

A visitor on a phone, in light or in dark, activates `Menu`.

- The menu covers the page. `Shop` through `About` are the large links. Help, theme, and the three social labels sit below.
- They activate `Shop`. The menu closes and the address is `/catalog`. `Run` and `Train` do the same. `Drops` closes the menu and the address is `/`. `About` closes the menu and the address is `/about`.
- They activate `Shipping & returns` or `Contact`. The address is `/policies/shipping`.
- They activate `Size guide`. The menu closes and the size guide opens on `Tops` and `cm`.
- They activate `Account`, `Instagram`, `Strava`, or `TikTok`. The address does not change.
- They activate the other theme. The page theme changes and the menu stays open with that side filled.
- They activate `Close menu`, or press Escape. The menu closes. The address is unchanged.

A visitor on a desktop does not see `Menu`.

## Acceptance criteria

1. `REQ-020` opens the full-screen menu from the phone Menu button and does not show that button on a desktop.
2. `REQ-020` links Shop, Run, and Train to `/catalog`, Drops to `/`, and About to `/about`, and closes the menu first.
3. `REQ-020` links Shipping & returns and Contact to `/policies/shipping`, and opens the size guide from the menu.
4. `REQ-020` leaves the address unchanged for Account and for Instagram, Strava, and TikTok.
5. `REQ-020` switches theme from the menu with the existing cookie, and closes on `Close menu` and Escape.

## Edge cases

- Opening the menu does not change the bag count or the search query.
- The size guide opened from the menu is the same overlay as the footer and the product page. It is not a new route.
- Social labels have no `href` to a guessed profile.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-020 opens the phone menu and hides it on desktop`
- `REQ-020 navigates Shop, Run, Train, Drops, and About`
- `REQ-020 opens policies and the size guide`
- `REQ-020 does not navigate for Account or the social labels`
- `REQ-020 switches theme and closes the menu`

That the menu matches the light and dark menu screens at 390 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Instagram, Strava, and TikTok profile URLs. This requirement does not invent them.
- Whether launch needs customer accounts. [REQ-024](REQ-024-account.md) holds that.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [menu-mobile.html](../design/screens/light/menu-mobile.html) and the dark pair. The screen wins for layout.
- [design/DESIGN.md](../design/DESIGN.md). The menu drawer section.
- [REQ-005](REQ-005-theme.md). The theme cookie.
- [REQ-015](REQ-015-size-guide.md). The overlay this menu opens.
- [REQ-021](REQ-021-policies.md). The `/policies/shipping` route.
- [REQ-024](REQ-024-account.md). The Account control.
