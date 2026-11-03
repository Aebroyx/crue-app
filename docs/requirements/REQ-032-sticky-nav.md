# REQ-032: Sticky nav

- Status: done
- Date: 2026-11-03

## Problem

The announcement bar and the nav sit in one solid block above the banner. The photograph starts below them, so the top of the banner is cut off by the nav.

## Why

The banner should fill the top of the home page. The nav should sit on that photograph until the visitor scrolls, then stay reachable. The announcement is a separate line and should not travel with the nav. [REQ-007](REQ-007-navbar-footer.md) drew both as one static stack. [REQ-030](REQ-030-home-hero.md) fills the banner. This requirement changes only how those two bars sit on the page.

## Actors

Visitor.

## In scope

- On the home page, the nav overlays the top of the banner. Its background is transparent and its hairline is hidden, on a phone and on a wide screen, while the page is at the top. The banner photograph is dark, so that transparent nav uses the dark-theme ink and the white wordmark.
- The banner is visible through that nav, including the area the nav covers.
- The announcement bar stays in the page flow above the banner. It keeps its current `surface` fill, type, and copy. Scrolling moves it off the screen. It does not stick.
- Once the visitor scrolls and the nav meets the top of the viewport, the nav sticks there. Its background becomes `bg` for the current theme, and the hairline returns. Light and dark use the same tokens they already use.
- On every other page, the nav keeps the solid `bg` background and hairline. It also sticks to the top of the viewport after scroll. It is not transparent, because those pages have no banner behind it.
- The phone nav and the wide nav follow the same rule. When the nav sticks, or on a page that is not home, the ink and wordmark return to the current theme.

## Out of scope

- A new colour and a blur. The transparent nav reuses the dark-theme ink. It does not add a colour.
- Hiding the announcement, or making it stick.
- The banner photographs, the manifesto, and the bag, search, and menu panels.
- The background, hairline, ink, and wordmark ease over 300ms when the nav sticks or returns. No other scroll animation.

## Behavior

A visitor opens the home page on a phone or on a wide screen. The page is at the top.

- The announcement is the first line. The nav has no fill, and the banner shows through it.
- They scroll. The announcement leaves the screen. The nav stays at the top of the viewport with the theme background and the hairline.
- They scroll back to the top. The announcement returns. The nav is transparent over the banner again.
- They switch theme. The stuck nav uses that theme's `bg`.
- They open the catalog. The nav is solid from the start, and it sticks after scroll.

## Acceptance criteria

1. `REQ-032` shows the home nav transparent over the banner at the top of the page, on a phone and on a wide screen, and the announcement is not sticky.
2. `REQ-032` sticks the nav to the top of the viewport after scroll and gives it the current theme `bg` and hairline.
3. `REQ-032` keeps the nav solid on a page that is not the home page.

## Edge cases

- Scrolling back to the top returns the transparent nav on the home page.
- The announcement copy and the banner copy do not change.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-032 shows a transparent home nav over the banner and leaves the announcement in the page`
- `REQ-032 sticks the nav and fills it with the theme background after scroll`
- `REQ-032 keeps the nav solid off the home page`

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md).
- Which couriers fulfill orders?
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-007](REQ-007-navbar-footer.md). The nav and the announcement bar.
- [REQ-030](REQ-030-home-hero.md). The banner the nav overlays.
- [REQ-005](REQ-005-theme.md). Light and dark `bg`.
