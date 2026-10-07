# REQ-023: You may also like

- Status: done
- Date: 2026-10-06

## Problem

A product page ends at the accordion. The design places four other pieces under it.

## Why

[design/DESIGN.md](../design/DESIGN.md) names the row "You may also like" and says it uses Shopify `productRecommendations`. The product screen files do not draw the row, so this requirement follows that section for the heading and the card counts. Business reason: the page should offer another piece without a new search. Technical reason: the store is still open, so this requirement uses the local catalog the way [REQ-018](REQ-018-search.md) does, and does not call `productRecommendations`.

## Actors

Visitor.

## In scope

- A heading `You may also like` below the product accordion and above the footer, on the product page only.
- Up to four other products from `src/data/catalog.json`, in file order, excluding the product on screen.
- Each card matches the home card: the product-image placeholder from [REQ-019](REQ-019-image-skeleton.md), the uppercase name, and `[PRICE]`. The name links to `/products/[handle]`.
- Desktop: four cards in a row. Phone: a horizontal row of cards, each 160px wide, that can be swiped.
- No photo URL is passed. The stage stays the settled mark.

## Out of scope

- Shopify `productRecommendations`.
- A fifth card, a badge, or a price other than `[PRICE]`.
- Changing the accordion, the size grid, or the bag.
- The sold-out button. That is [REQ-022](REQ-022-sold-out.md).

## Behavior

A visitor opens Horizon Shell Jacket on a phone or on a desktop, in light or in dark.

- Under the accordion they see `You may also like` and the next four catalog products, not Horizon.
- They activate one name. The address is that product's `/products/[handle]`.
- On that next product, Horizon can appear in the four, and the product they are on does not.
- A product that is the only one in the list shows the heading and no card. The live catalog has six products, so the live pages show four.

## Acceptance criteria

1. `REQ-023` shows `You may also like` under the accordion with four other catalog products.
2. `REQ-023` excludes the product on screen and keeps `[PRICE]` and the settled image mark.
3. `REQ-023` links each card to that product and does not call Shopify.

## Edge cases

- Fewer than four other products shows only those that exist. It does not repeat the current product to fill the row.
- The phone row scrolls sideways. The desktop row does not become a swipe row.

## Shopify boundary

None. This requirement does not call `productRecommendations`. A later requirement replaces this local list with that query. This one does not.

## Tests

Jest, with the requirement id in the name:

- `REQ-023 shows four other products under Horizon`
- `REQ-023 excludes the product on screen and keeps the price placeholder`
- `REQ-023 links a card to its product page`

That the row matches the design note in light and dark at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- The Shopify plan, store handle, and public domain. They block `productRecommendations`, not this local row.
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [design/DESIGN.md](../design/DESIGN.md). The "You may also like" note. The product screen files do not draw this row.
- [REQ-008](REQ-008-product-page.md). The page this row is added to.
- [REQ-011](REQ-011-catalog.md). The catalog file is the list.
- [REQ-019](REQ-019-image-skeleton.md). The card image is that component with no `src`.
