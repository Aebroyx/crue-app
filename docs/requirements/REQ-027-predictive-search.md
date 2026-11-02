# REQ-027: Predictive search

- Status: done
- Date: 2026-10-06

## Problem

Search filters the local catalog. The design names Shopify `predictiveSearch` as the source.

## Why

[REQ-018](REQ-018-search.md) built the overlay and left the API out because the store was open. Business reason: search should find what the merchant has published, including products that are not in an old JSON file. Technical reason: the overlay, the chips, the count, and the no-match copy already exist and should stay.

## Actors

Visitor.

## In scope

- The open overlay from [REQ-018](REQ-018-search.md) stays: placeholder `Search`, the result count, `View all in shop` to `/catalog`, and the no-match copy.
- Popular-search chips are the store's product titles, up to four. They are not the placeholder labels `Shell jacket`, `Run tee`, `Tight`, and `Short`.
- A query that is not only spaces calls Storefront `predictiveSearch` and lists the product results. Each result still shows the product-image stage, the uppercase title, and the variant price as returned. An image URL is passed through. No image keeps the settled mark. The same response's query suggestions replace those chips when Shopify returns any.
- A chip writes its label into the field and runs that query.
- No product results uses the existing no-match state, including the chips without the Popular searches label.
- `View all in shop` still goes to `/catalog` with no query string. The design does not add one.

## Out of scope

- Changing the overlay layout, the placeholder colour, or the close control.
- Pages and collections as search results. Query suggestions from `predictiveSearch` are chips only.
- A new search route.

## Behavior

A visitor opens Search and types `run`.

- The overlay stays on the same page. Results are the `predictiveSearch` products for that query. The count matches how many are shown.
- They activate a result. The address is `/products/[handle]` and the overlay closes.
- They type a query with no products. The no-match copy from [REQ-018](REQ-018-search.md) shows.
- They activate `View all in shop`. The overlay closes and the address is `/catalog`.
- A query of only spaces shows Popular searches and does not call the API.

## Acceptance criteria

1. `REQ-027` fills search results from `predictiveSearch` products.
2. `REQ-027` shows up to four product titles as the popular chips, uses `predictiveSearch` query suggestions when Shopify returns them, keeps the count and the no-match copy, and links `View all in shop` to `/catalog`.
3. `REQ-027` passes an image URL into the result image, or keeps the settled mark when there is none.
4. `REQ-027` does not call the API for a blank or spaces-only query.

## Edge cases

- [REQ-025](REQ-025-storefront-products.md) supplies the store connection. The paid plan, the production store handle, and the public domain stay in [open-questions.md](../open-questions.md). This requirement does not choose them.
- The local title-and-category filter from [REQ-018](REQ-018-search.md) is no longer the source.

## Shopify boundary

Reads `predictiveSearch` product results from the Storefront API. Does not write a cart or a customer. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-027 shows predictiveSearch products for a query`
- `REQ-027 keeps the no-match copy and the chips`
- `REQ-027 links View all in shop to the catalog`
- `REQ-027 does not query a blank search`

Jest mocks `predictiveSearch`.

## Open questions

These stay open. This requirement does not answer them:

- What is the Shopify plan, store handle, and public domain? See [open-questions.md](../open-questions.md).

These stay open:

- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-018](REQ-018-search.md). The overlay this requirement fills.
- [REQ-019](REQ-019-image-skeleton.md). Result images use that component once a URL exists. [REQ-018](REQ-018-search.md) kept the static mark. This requirement is the one that passes a URL.
- [REQ-025](REQ-025-storefront-products.md). The store connection.
- [design/DESIGN.md](../design/DESIGN.md). The search section.
