# REQ-030: Top banner carousel

- Status: done
- Date: 2026-11-02

## Problem

The large band under the menu still shows the glow and the faint mark. The merchant cannot put campaign photographs there, or rotate them.

## Why

The top banner is an image carousel. The manifesto lower on the page is a different metaobject, specified in [REQ-031](REQ-031-home-story.md). [REQ-004](REQ-004-home.md) already draws the frame at 700px on a phone and 820px on a wide screen. This requirement fills that frame from one `home_banner` entry: the photograph and the words on top of it.

## Actors

Visitor and merchant.

## In scope

- Storefront metaobjects of type `home_banner`. Each entry is one slide, with fields `position`, `image`, `eyebrow`, `heading`, `body`, `body_wide`, `button_label`, and `button_href`. `image` is one file.
- The storefront reads up to 10 published entries and orders them by `position`, lowest first. An entry with no `position` comes after the numbered ones.
- The image fills the existing hero frame and is cropped to it. The phone frame stays 700px tall. The wide frame stays 820px tall. The image alt text is the alt text saved on that file. An empty alt leaves the image decorative.
- The slide that is showing renders its own words. `body_wide` is the extra sentence shown only on a wide screen. `heading` may contain a line break. The type and the button shape stay as they are. `button_href` is a path on this site.
- An empty text field is left off the slide. The eyebrow, heading, body, wide sentence, and button each render only when that field has text. The button also needs `button_href`. A blank body does not block the slide.
- Two or more slides advance every 3 seconds, then the first slide shows again. The photograph and the words advance together.
- The timer pauses while the pointer is over the frame or keyboard focus is inside it. It resumes when the pointer leaves and focus is outside.
- One image does not advance. No entries, or a failed query, shows the glow and the logo from [REQ-004](REQ-004-home.md) and does not advance. The light theme uses the glow file, which already contains the logo. The white logo shows in the dark theme.
- A slide whose `image` is missing, or whose file is not an image, shows the glow and the logo for that slide. The other slides still show their images.
- `prefers-reduced-motion: reduce` shows the first image and does not start the timer.

## Out of scope

- The manifesto. That band is [REQ-031](REQ-031-home-story.md).
- The thin announcement bar. That bar is [REQ-029](REQ-029-announcement.md).
- A second image for the phone, a focal point, and a crop the merchant draws.
- A video, dots, previous and next arrows, swipe, and drag.
- Changing the 3 second interval from Shopify Admin.

## Behavior

A visitor opens the home page on a phone or on a wide screen. Two banners are published, and each has an image.

- They see the first photograph filling the frame, with that slide's eyebrow, heading, and body. A wide screen also shows `body_wide`.
- Three seconds pass. The next photograph appears with the next slide's words.
- They hold the pointer over the frame. The photograph stays. They move the pointer away. The 3 second count starts again.
- A slide has no image. That turn shows the glow and the logo.
- Their browser asks for reduced motion. The first photograph stays in place.
- They activate the button. The address is that slide's `button_href`.
- A field is empty. That piece is not on the slide. The photograph stays, and the fields that have text stay.
- No `home_banner` entry exists. The frame shows the glow and the mark, with no eyebrow, heading, body, or button, and it does not advance.

## Acceptance criteria

1. `REQ-030` reads `home_banner.position`, `home_banner.image`, `home_banner.eyebrow`, `home_banner.heading`, `home_banner.body`, `home_banner.body_wide`, `home_banner.button_label`, and `home_banner.button_href` from the Storefront API, and orders slides by `position`.
2. `REQ-030` fills the hero frame with one image and that slide's words, replaces both after 3 seconds, and returns to the first. `body_wide` shows only on a wide screen. The button goes to that slide's `button_href`.
3. `REQ-030` pauses the timer while the pointer is over the frame or focus is inside it.
4. `REQ-030` does not advance when only one image exists, the query fails, or `prefers-reduced-motion: reduce` is set.
5. `REQ-030` shows the glow and the logo when a slide has no image.
6. `REQ-030` omits a text field when it is empty, including the button, and still shows the fields that have text.

## Edge cases

- An empty alt text renders an empty alt.
- An empty string omits that piece. A button with a label and no `button_href` is omitted.
- A heading line break is kept.
- More than 10 published entries: the storefront shows the 10 with the lowest `position`.

## Shopify boundary

Reads `home_banner` metaobjects, the `image` file, and the text fields on each one from the Storefront API. Does not write a cart, a checkout URL, a customer, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name. Timer tests use fake timers.

- `REQ-030 reads the banner image in position order`
- `REQ-030 advances the image and that slide's words every 3 seconds`
- `REQ-030 pauses while the frame is hovered or focused`
- `REQ-030 does not advance for one image, a failed query, or reduced motion`
- `REQ-030 shows the glow and the mark when the image is missing`
- `REQ-030 omits an empty field and keeps the fields that have text`

Jest mocks the metaobjects. It does not call the live store.

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md). The query uses the store named by `SHOPIFY_STORE_DOMAIN`.
- Which couriers fulfill orders?
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-004](REQ-004-home.md). The frame, the words on top, and the glow used when an image is missing.
- [REQ-031](REQ-031-home-story.md). The manifesto, which this requirement does not render.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
