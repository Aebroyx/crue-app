# REQ-021: Policy pages

- Status: done
- Date: 2026-10-06

## Problem

Shipping, Returns, and Contact in the footer go to `#drop`. The design has one help page for Shipping, Returns, Privacy, and Terms, and the storefront has no `/policies/[handle]` route.

## Why

[design/screens/light/policy-desktop.html](../design/screens/light/policy-desktop.html), the mobile file, and the dark pair are that template. Business reason: a visitor looking for shipping or returns currently lands on the home drop. Technical reason: [design/DESIGN.md](../design/DESIGN.md) names `/policies/[handle]`. The legal paragraphs are still placeholders, and the store that will own the real policies is still open, so this requirement renders the screen template and does not invent policy text.

## Actors

Visitor.

## In scope

- One route, `/policies/[handle]`, for four handles: `shipping`, `returns`, `privacy`, `terms`.
- Titles: `Shipping policy`, `Returns policy`, `Privacy policy`, `Terms of service`. Breadcrumb `Home / Help`, with Home linking to `/`. The line `Last updated [DATE]`.
- Desktop: a 240px topic list. Topics, in order: `Shipping`, `Returns`, `Privacy`, `Terms`. The active topic has an 8px mark and full text colour. The others are `muted`. The article is at most 680px wide. The title is 64px.
- Phone: the same topics as sideways chips, 44px tall, filled when active. The title is 34px, from the mobile screen.
- Section headings, in order:
  - Shipping: `Processing time`, `Delivery regions and times`, `Shipping costs`, `Tracking your order`.
  - Returns: `Return window`, `Condition of items`, `How to start a return`, `Refunds and exchanges`.
  - Privacy: `What we collect`, `How we use it`, `Cookies`, `Your rights`.
  - Terms: `Orders and payment`, `Pricing and availability`, `Intellectual property`, `Governing law`.
- Each section body is the screen placeholder: `[Your shipping policy text for “processing time” goes here. Keep it short and plain.]`, with the topic name and the heading lowercased the same way for the other sections. The quotes in that sentence are the curly quotes from the screen script.
- A `surface` box: `Still need help?` and `Email [SUPPORT EMAIL] and we will reply within [RESPONSE TIME].`
- Choosing a topic goes to that handle. Footer `Shipping` goes to `/policies/shipping`. Footer `Returns` goes to `/policies/returns`. Footer `Contact` goes to `/policies/shipping`, matching the menu screen, which points Contact at the policy file.
- An unknown handle uses the existing not-found page.

## Out of scope

- Writing real policy, privacy, or terms text. The placeholders above are the copy.
- Filling `[DATE]`, `[SUPPORT EMAIL]`, `[RESPONSE TIME]`, or `[YEAR]`.
- Reading `shop.shippingPolicy`, `shop.refundPolicy`, `shop.privacyPolicy`, or `shop.termsOfService`. That waits on the store question.
- A contact form, a support inbox, or a new footer layout.
- The mobile menu. [REQ-020](REQ-020-mobile-menu.md) is what links into these routes from the phone.

## Behavior

A visitor opens `/policies/shipping` on a phone or on a desktop, in light or in dark.

- The title is `Shipping policy`. The four shipping headings are shown with the placeholder sentences. `Still need help?` is shown. `Shipping` is the active topic.
- They activate `Returns`. The address is `/policies/returns`, the title is `Returns policy`, and the returns headings replace the shipping ones.
- `/policies/privacy` shows `Privacy policy`. `/policies/terms` shows `Terms of service`.
- They activate `Home` in the breadcrumb. The address is `/`.
- From the footer, `Shipping` and `Returns` open those two routes. `Contact` opens `/policies/shipping`.
- `/policies/missing` shows the existing not-found page.

## Acceptance criteria

1. `REQ-021` renders the four policy routes with the screen titles, headings, and placeholder sentences.
2. `REQ-021` keeps `Last updated [DATE]` and the `Still need help?` placeholders.
3. `REQ-021` switches topic by route, with the active topic marked on desktop and filled on a phone.
4. `REQ-021` points footer Shipping, Returns, and Contact at the policy routes, and uses not-found for an unknown handle.

## Edge cases

- The body sentences are not replaced with drafted legal copy.
- Refreshing `/policies/returns` stays on Returns. The topic is the route, not memory that disappears on refresh.
- Light and dark use the same page. The theme cookie does not change the handle.

## Shopify boundary

None. This requirement does not read Shopify policy fields. A later requirement, after the store exists, replaces the placeholder sentences with `shop.shippingPolicy`, `shop.refundPolicy`, `shop.privacyPolicy`, and `shop.termsOfService`. This one does not call that API.

## Tests

Jest, with the requirement id in the name:

- `REQ-021 renders the four policy pages from the screen headings`
- `REQ-021 keeps the date and support placeholders`
- `REQ-021 changes topic by route`
- `REQ-021 links the footer and shows not-found for an unknown handle`

That the page matches the light and dark policy screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- `[DATE]`, `[SUPPORT EMAIL]`, `[RESPONSE TIME]`, and `[YEAR]`.
- The Shopify plan, store handle, and public domain. They block reading the live policies, not this template.
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [policy-desktop.html](../design/screens/light/policy-desktop.html), [policy-mobile.html](../design/screens/light/policy-mobile.html), and the dark pair. The screen wins for layout, including the 34px phone title.
- [design/DESIGN.md](../design/DESIGN.md). The policy section. The Shopify policy fields are the later source named there, not this requirement.
- [REQ-014](REQ-014-not-found.md). An unknown handle uses that page.
