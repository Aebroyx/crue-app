# REQ-025: Storefront products

- Status: done
- Date: 2026-10-06

## Problem

Home, catalog, product, search, and the recommendation row still read `src/data/catalog.json`. Prices stay `[PRICE]` and photos stay the settled mark.

## Why

[architecture.md](../architecture.md) says this repo queries the Storefront API and does not keep a second catalog. [REQ-008](REQ-008-product-page.md) and [REQ-011](REQ-011-catalog.md) kept the JSON file until a store existed. Business reason: the shop the visitor sees should be the shop the merchant edits. Technical reason: [REQ-017](REQ-017-env.md) already names `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, and the app does not read them yet.

## Actors

Visitor and merchant.

## In scope

- The app reads `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` from the environment. The token stays the Storefront public token. No Admin API token.
- Home cards, the catalog, the product page, search, and [REQ-023](REQ-023-you-may-also-like.md) read products from the Storefront API instead of `src/data/catalog.json`. That file is removed.
- Fields the pages already render: `id`, `handle`, `title`, `description`, `options`, `variants` (`availableForSale`, `selectedOptions`, `price.amount`), and `images` (`url`, `altText`).
- A variant price uses `price.amount` as Shopify returns it. This requirement does not invent a currency format.
- An image `url` is passed as `src` to the product-image component from [REQ-019](REQ-019-image-skeleton.md). A product with no image keeps the settled mark.
- A size with `availableForSale: false` uses [REQ-022](REQ-022-sold-out.md).
- An empty product list uses the catalog empty state that already exists. A failed query uses that same empty state. It does not fall back to a local product list.
- An unknown `/products/[handle]` still uses the not-found page.

## Out of scope

- `cartCreate`, `checkoutUrl`, and `predictiveSearch`. Those are [REQ-026](REQ-026-storefront-cart.md) and [REQ-027](REQ-027-predictive-search.md).
- `productRecommendations`. [REQ-023](REQ-023-you-may-also-like.md) stays a local list of the other products this query returned.
- Choosing the store handle, the public domain, or the API version. The version is not named in the docs.
- Collections as their own routes. Run and Train stay links to `/catalog`.
- `next/image`. [REQ-019](REQ-019-image-skeleton.md) left that out.

## Behavior

A visitor opens the catalog after the store credentials are set.

- The grid is the store's products, with each price taken from the variant and each photo URL passed into the product image.
- They open a product. The title, options, and images are that Storefront product. An unavailable size follows [REQ-022](REQ-022-sold-out.md).
- Search filters that same list, still locally, until [REQ-027](REQ-027-predictive-search.md).
- A product with no image shows the settled mark.
- If the query returns nothing, or the query fails, the catalog shows the existing empty state. The JSON file is not there as a backup.

## Acceptance criteria

1. `REQ-025` reads the two environment variables and requests Storefront products with the fields listed above.
2. `REQ-025` removes `src/data/catalog.json` and renders home, catalog, and product from that query.
3. `REQ-025` shows `price.amount` and passes an image URL into the product image, or the settled mark when there is no URL.
4. `REQ-025` uses the catalog empty state when the query is empty or fails, and not-found for an unknown handle.

## Edge cases

- The dev store domain and public token are read from the environment. The public domain, the paid plan, and the production store handle stay in [open-questions.md](../open-questions.md). This requirement does not choose them.
- A fast image still skips the pulse. A slow one pulses. That behaviour is [REQ-019](REQ-019-image-skeleton.md), not a new delay.

## Shopify boundary

Reads products, variants, and image URLs from the Storefront API. Does not write a cart, a checkout URL, a customer, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision. The JSON file stops being a stand-in catalog.

## Tests

Jest, with the requirement id in the name:

- `REQ-025 reads products from the Storefront fields and not from catalog.json`
- `REQ-025 renders price and image URL on the catalog and the product page`
- `REQ-025 keeps the settled mark when a product has no image`
- `REQ-025 shows the empty catalog when the query fails and not-found for a missing handle`

The live store, in light and dark at 390 and at 1440, is a browser check after credentials exist. Jest mocks the query. Jest does not prove the pixels.

## Open questions

These stay open. This requirement reads `SHOPIFY_STORE_DOMAIN` and does not answer them:

- What is the Shopify plan, store handle, and public domain? See [open-questions.md](../open-questions.md).

These stay open and do not get answered here:

- The gateway, couriers, accounts, and Shopify Email.
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-017](REQ-017-env.md). The two variable names.
- [REQ-008](REQ-008-product-page.md), [REQ-011](REQ-011-catalog.md), and [REQ-004](REQ-004-home.md). Those pages swap their source.
- [REQ-019](REQ-019-image-skeleton.md). Image URLs go into that component.
- [REQ-022](REQ-022-sold-out.md). Unavailable sizes.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
- Storefront GraphQL `2026-10`. The requirement left the version unnamed, and the request URL needs one, so the client uses that stable version.
