# REQ-031: Home story

- Status: draft
- Date: 2026-11-02

## Problem

The home story still says "Gravity is your training partner.", the hybrid-athlete paragraph, and "Read the story". Changing that copy means a code change.

## Why

[architecture.md](../architecture.md) says content values live in Shopify metaobjects and the layout lives in this repo. [REQ-004](REQ-004-home.md) hard-coded the manifesto. Business reason: the merchant should edit the story without a deploy. Technical reason: the band, the type, and the link already exist. This requirement fills those slots from Shopify.

## Actors

Visitor and merchant.

## In scope

- One Storefront metaobject, type `home_story`, with fields `heading`, `body`, `body_wide`, `link_label`, and `link_href`.
- The existing story band renders those fields. `body_wide` is the extra sentence shown only on a wide screen, the way [REQ-004](REQ-004-home.md) hides "Every piece is cut to move between both." on a phone.
- `link_href` is a path on this site. The link keeps its current style. "Read the story" today points at `#manifesto`. The merchant can point it at `/about` or another path on this site.
- A missing entry, an empty field, or a failed query uses the matching [REQ-004](REQ-004-home.md) copy for that slot: heading "Gravity is your training partner.", body "CRUE is built for the hybrid athlete: the one who runs at first light and lifts after dark.", `body_wide` "Every piece is cut to move between both.", link "Read the story" to `#manifesto`. This requirement does not invent a new line.

## Out of scope

- A new story layout, a second story, or an image slot.
- The announcement bar, the hero, The Drop, and the category tiles.
- Moving the About page copy into this metaobject. About stays as [REQ-012](REQ-012-about.md) left it.
- A separate CMS.

## Behavior

A visitor opens the home page on a phone or on a wide screen and reaches the story band.

- They see `heading` and `body`. A wide screen also shows `body_wide`.
- They activate the link. The address is `link_href`.
- The merchant changes `body` in Shopify Admin. The next load shows that body. The heading stays as it was.
- The metaobject is missing. The band shows the [REQ-004](REQ-004-home.md) story.

## Acceptance criteria

1. `REQ-031` reads `home_story.heading`, `home_story.body`, `home_story.body_wide`, `home_story.link_label`, and `home_story.link_href` from the Storefront API.
2. `REQ-031` shows `body_wide` only on a wide screen and sends the link to `link_href`.
3. `REQ-031` uses the [REQ-004](REQ-004-home.md) story when the entry or a field is missing, or the query fails.

## Edge cases

- An empty string is missing. That slot uses the [REQ-004](REQ-004-home.md) copy. The other slots still use Shopify.
- The band stays one column of type. It does not gain a picture.

## Shopify boundary

Reads one `home_story` metaobject from the Storefront API. Does not write a cart, a checkout URL, a customer, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-031 reads the story fields from the metaobject`
- `REQ-031 shows the wide sentence only on a wide screen and links the story`
- `REQ-031 falls back to the REQ-004 story when the metaobject is missing`

Jest mocks the metaobject. It does not call the live store.

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md). The query uses the store named by `SHOPIFY_STORE_DOMAIN`.
- Which couriers fulfill orders?
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-004](REQ-004-home.md). The story band and the fallback copy.
- [REQ-012](REQ-012-about.md). About stays a separate page.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
