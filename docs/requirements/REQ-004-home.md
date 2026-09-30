# REQ-004: Home

- Status: done
- Date: 2026-09-30

## Problem

After the intro, `/` is still the black shell from [REQ-001](REQ-001-storefront-shell.md). A visitor never reaches the landing page the brand is designed around.

## Why

This is a temporary shell of the home, not the live shop. Business reason: the intro should open onto the page a buyer can read, not a lone symbol. Technical reason: [REQ-002](REQ-002-intro-sequence.md) keeps the shell underneath the intro and leaves the home screens out of scope. A later requirement replaces the draft cards with Shopify.

## Actors

Visitor.

## In scope

- `/` shows the home from [home-desktop.html](../design/screens/dark/home-desktop.html) and [home-mobile.html](../design/screens/dark/home-mobile.html). Reference widths are 390 and 1440. Build it fluid. The same layout in the light screens applies when `data-theme="light"` is set on the document. Dark is the default.
- The first visit still plays the [REQ-002](REQ-002-intro-sequence.md) intro over this page. Skip and Enter reveal the home. They do not reveal the shell.
- Sections, in order: announcement bar, header, hero, The Drop, manifesto, category bento, footer.
- Copy from those screens, including the visible placeholders `[PRICE]`, `[THRESHOLD]`, and `[YEAR]`. Desktop announcement is "Drop 001: Event Horizon, out now" and "Free shipping over [THRESHOLD]". Mobile announcement is "Drop 001, out now". Hero eyebrow "Drop 001", heading "Event Horizon", the hybrid-athlete sentence, and "Shop Drop 001". Manifesto heading "Gravity is your training partner." and the link "Read the story". Bento labels "Run", "Train", and "Layers".
- The Drop shows the four draft cards from the screen script: Horizon Shell Jacket, Singularity Run Tee, Orbit Half Tight, Accretion Split Short, each with the screen's colour line and `[PRICE]`. These are placeholders, not the catalog.
- Desktop header: Shop, Run, Train, Drops, Journal, the wordmark, Search, Account, and "BAG (0)". Mobile header: Menu, the wordmark, Search, and a bag button named "Bag, 0 items". The wordmark's accessible name is `CRUE`.
- "Shop Drop 001", Shop, Run, Train, and Drops move to The Drop on the same page. Journal and "Read the story" move to the manifesto. Footer links stay on `/`. No new route is added.
- Brand files the screens use: white and black mark, white and black wordmark, `glow-dark.jpg`, and `glow-light.jpg`. Photography slots marked `TODO` stay empty stages, as the screens draw them.
- Tokens, type, and square corners from [design-language.md](../design-language.md).

## Out of scope

- A Shopify query, a metaobject, and any product, price, or collection that is not the four draft cards above.
- The product page, collection pages, search results, a cart, checkout, and customer accounts. Search, Account, and Bag are visible and do not open those flows. Bag count stays 0.
- An open mobile menu. The Menu button is on the screen. The screen does not draw the panel it opens.
- A theme toggle. [design/DESIGN.md](../design/DESIGN.md) names one. The home screens do not draw it. This requirement does not place one.
- The newsletter band, including "Enter the orbit", the email field, and Join. [open-questions.md](../open-questions.md) says to confirm Shopify Email before a newsletter requirement is accepted.
- Social profile URLs. The screen's Instagram, Strava club, and TikTok labels have no real destinations.
- A campaign film, a video element, and invented photography.
- Replaying the intro from the wordmark.

## Behavior

A visitor opens `/`.

- With no intro cookie, the intro covers the home, then Skip or Enter shows the home.
- With the intro cookie, the home is the first thing they see.
- A wide screen shows the desktop announcement, the word nav, and "BAG (0)". A phone shows "Drop 001, out now", the Menu button, and the icon bag. Neither width scrolls sideways.
- "Shop Drop 001" brings The Drop into view. The four placeholder cards are there, each priced `[PRICE]`.
- The document language stays English. The title stays `Crue`.
- With `data-theme="light"`, the page uses the light home screens. The default document has no light theme.

## Acceptance criteria

1. `REQ-004` shows the home on `/` after the intro is dismissed, and does not show the shell as the page.
2. `REQ-004` shows "Event Horizon", "Shop Drop 001", "The Drop", "Gravity is your training partner.", "Run", "Train", and "Layers".
3. `REQ-004` shows the four draft product names and `[PRICE]`, and shows `[THRESHOLD]` on desktop and `[YEAR]` in the footer.
4. `REQ-004` uses "Drop 001: Event Horizon, out now" on a wide screen and "Drop 001, out now" on a phone.
5. `REQ-004` does not add a route besides `/`, and does not render a video.
6. `REQ-004` does not render the newsletter band, a cart, or a product page.

## Edge cases

- `[PRICE]`, `[THRESHOLD]`, and `[YEAR]` stay as those characters. Do not invent a price, a shipping number, or a year.
- The four names are draft names from the screens. Do not add a fifth card.
- Search, Account, Bag, and Menu do not navigate away from `/`.
- A missing brand PNG blocks the requirement. Do not substitute the shell SVG for the wordmark or the mark.

## Shopify boundary

None. This requirement does not read or write Shopify. A later requirement replaces the draft cards with Storefront API products.

## Tests

Jest, with the requirement id in the name:

- `REQ-004 shows the home after the intro is dismissed`
- `REQ-004 renders the hero, the drop, the manifesto, and the bento`
- `REQ-004 keeps the draft products and the placeholder tokens`
- `REQ-004 uses the desktop and mobile announcement copy`
- `REQ-004 does not add a route or a video`
- `REQ-004 does not render the newsletter, a cart, or a product page`

That the home matches the screens at 390 and at 1440, in dark and in light, is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- The Menu button has no drawn panel.
- The theme toggle is named in the design system and is not drawn on the home screens.
- Real products, prices, the shipping threshold, and the copyright year wait on the Shopify store.
- Every item in [open-questions.md](../open-questions.md). The newsletter waits on the Shopify Email confirmation there.

## Dependencies

- [REQ-002](REQ-002-intro-sequence.md). The intro still runs first. The page underneath becomes this home.
- [home-desktop.html](../design/screens/dark/home-desktop.html), [home-mobile.html](../design/screens/dark/home-mobile.html), and the light pair in [design/screens/light/](../design/screens/light/). Layout reference, not code to copy.
- [design-language.md](../design-language.md) and [design/DESIGN.md](../design/DESIGN.md).
- Brand files in [design/brand/](../design/brand/).
