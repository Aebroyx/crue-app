# REQ-030: Home hero

- Status: draft
- Date: 2026-11-02

## Problem

The home hero still says "Drop 001", "Event Horizon", the hybrid-athlete sentence, and "Shop Drop 001". Changing the campaign means a code change.

## Why

[architecture.md](../architecture.md) says a home section is a metaobject the storefront already knows how to render. [REQ-004](REQ-004-home.md) hard-coded this hero. Business reason: the merchant should change the campaign words and the button without a deploy. Technical reason: the hero layout, type, and height already exist. This requirement fills the existing slots from Shopify.

## Actors

Visitor and merchant.

## In scope

- One Storefront metaobject, type `home_hero`, with fields `eyebrow`, `heading`, `body`, `body_wide`, `button_label`, and `button_href`.
- The existing hero renders those fields. `body_wide` is the extra sentence shown only on a wide screen, the way [REQ-004](REQ-004-home.md) hides "Built for the long run and the heavy set." on a phone.
- `heading` may contain a line break. The component keeps the current hero type. It does not restyle the heading.
- `button_href` is a path on this site, such as `#drop` or `/catalog`. The button keeps its current shape.
- A missing entry, an empty field, or a failed query uses the matching [REQ-004](REQ-004-home.md) copy for that slot: eyebrow "Drop 001", heading "Event Horizon", body "Technical running wear for the hybrid athlete.", `body_wide` "Built for the long run and the heavy set.", button "Shop Drop 001" to `#drop`. This requirement does not invent a new line.

## Out of scope

- A second hero, a slider, or a video.
- The announcement bar, the story, The Drop title, and the category tiles.
- A new image treatment. The glow and the faint mark stay the brand files already placed by [REQ-004](REQ-004-home.md). This requirement does not add a merchant image slot.
- A separate CMS.

## Behavior

A visitor opens the home page on a phone or on a wide screen.

- They see `eyebrow`, `heading`, and `body`. A wide screen also shows `body_wide`.
- They activate the button. The address is `button_href`.
- The merchant changes `heading` in Shopify Admin. The next load shows that heading. The button label stays as it was.
- The metaobject is missing. The hero shows the [REQ-004](REQ-004-home.md) copy.

## Acceptance criteria

1. `REQ-030` reads `home_hero.eyebrow`, `home_hero.heading`, `home_hero.body`, `home_hero.body_wide`, `home_hero.button_label`, and `home_hero.button_href` from the Storefront API.
2. `REQ-030` shows `body_wide` only on a wide screen and sends the button to `button_href`.
3. `REQ-030` uses the [REQ-004](REQ-004-home.md) hero copy when the entry or a field is missing, or the query fails.

## Edge cases

- An empty string is missing. That slot uses the [REQ-004](REQ-004-home.md) copy. The other slots still use Shopify.
- A heading line break is kept. The hero does not become one forced line.

## Shopify boundary

Reads one `home_hero` metaobject from the Storefront API. Does not write a cart, a checkout URL, a customer, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-030 reads the hero fields from the metaobject`
- `REQ-030 shows the wide sentence only on a wide screen and links the button`
- `REQ-030 falls back to the REQ-004 hero when the metaobject is missing`

Jest mocks the metaobject. It does not call the live store.

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md). The query uses the store named by `SHOPIFY_STORE_DOMAIN`.
- Which couriers fulfill orders?
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-004](REQ-004-home.md). The hero layout and the fallback copy.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
