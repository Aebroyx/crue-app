# REQ-028: Product recommendations

- Status: done
- Date: 2026-11-02

## Problem

You may also like still lists other products from the same catalog response, in that response's order. The merchant cannot change what the row offers.

## Why

[design/DESIGN.md](../design/DESIGN.md) says the row uses Shopify `productRecommendations`. [REQ-023](REQ-023-you-may-also-like.md) drew the row and left that query out. [REQ-025](REQ-025-storefront-products.md) kept the row as the other products already loaded. Business reason: the row should offer pieces Shopify relates to the one on screen. Technical reason: the heading, the four-card desktop row, and the 160px phone row already exist. This requirement only changes where the four cards come from.

## Actors

Visitor and merchant.

## In scope

- On the product page, the existing `You may also like` row reads Storefront `productRecommendations` for the product on screen. The product id is the one [REQ-025](REQ-025-storefront-products.md) already stores.
- Up to four products, in the order Shopify returns. The product on screen is left out if it appears in that response.
- Each card stays a home card: the product image from [REQ-019](REQ-019-image-skeleton.md), the uppercase title, and the variant price `amount` as Shopify returns it. The title links to `/products/[handle]`. An image URL is passed through. No image keeps the settled mark.
- Desktop stays four cards in a row. Phone stays a horizontal row of 160px cards.
- No recommendations, or a failed query, shows the heading and no card. The row does not fill itself from the other products on the page.

## Out of scope

- A complementary recommendations row. The query uses Shopify's default related recommendations and does not set another intent.
- A fifth card, a badge, or a currency format this requirement invents.
- Changing the accordion, the size grid, the bag, or search.
- A new route.

## Behavior

A visitor opens a product on a phone or on a desktop, in light or in dark.

- Under the accordion they see `You may also like` and up to four products from `productRecommendations`, not the product they are on.
- They activate one title. The address is that product's `/products/[handle]`.
- Shopify returns fewer than four. Only those cards show. The current product is not repeated to fill the row.
- Shopify returns nothing, or the query fails. The heading stays and there is no card.

## Acceptance criteria

1. `REQ-028` fills You may also like from `productRecommendations` for the product on screen, up to four, excluding that product.
2. `REQ-028` shows the variant price amount and passes an image URL into the card, or the settled mark when there is no URL.
3. `REQ-028` links each card to `/products/[handle]`.
4. `REQ-028` shows the heading and no card when the query is empty or fails, and does not fall back to the other loaded products.

## Edge cases

- The phone row scrolls sideways. The desktop row does not become a swipe row. That layout is [REQ-023](REQ-023-you-may-also-like.md).
- A recommendation whose handle is the product on screen is not shown, even when Shopify includes it.

## Shopify boundary

Reads `productRecommendations` for one product id from the Storefront API. Does not write a cart, a checkout URL, a customer, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-028 shows up to four productRecommendations and leaves out the product on screen`
- `REQ-028 renders the price amount and the image URL`
- `REQ-028 links a card to its product page`
- `REQ-028 shows no card when recommendations are empty or the query fails`

Jest mocks `productRecommendations`. It does not call the live store. The row in light and dark at 390 and at 1440 is a browser check. Jest does not prove the pixels.

## Open questions

These stay open. This requirement does not answer them:

- What is the Shopify plan, store handle, and public domain? See [open-questions.md](../open-questions.md). The query uses the store named by `SHOPIFY_STORE_DOMAIN`.
- Which gateway is connected in Shopify?
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-023](REQ-023-you-may-also-like.md). The row this requirement fills.
- [REQ-025](REQ-025-storefront-products.md). The product id and the card fields.
- [REQ-019](REQ-019-image-skeleton.md). The card image.
- [design/DESIGN.md](../design/DESIGN.md). The You may also like note.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
