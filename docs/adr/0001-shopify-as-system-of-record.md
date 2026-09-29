# ADR 0001: Shopify is the system of record

- Status: Accepted
- Date: 2026-09-29

## Context

Crue needs a responsive brand site, a CMS, checkout, Indonesian-capable payments, shipment email, and a merchant admin. The team is indie. The site's job is the brand experience, especially a fullscreen intro, not a new commerce platform.

Building a backend would mean owning catalog, inventory, orders, payments, and an admin that Shopify already provides. A Liquid theme would fight the custom intro and the design process. Shopify Payments does not cover an Indonesian merchant, but Shopify Checkout can still host a local gateway.

## Decision

1. The storefront is a Next.js app in this repo. It uses the Shopify Storefront API.
2. Shopify remains the CMS (pages and metaobjects), the cart and checkout host, the order system, and the only admin in v1.
3. Payment gateways are installed in Shopify Admin. This codebase does not integrate them.
4. Transactional email stays on Shopify notifications. Newsletter v1 is Shopify Email.
5. The intro is a one-shot fullscreen video with a skip control and a still frame when the visitor prefers reduced motion. A live 3D black hole is not part of v1.

## Consequences

- Checkout look is Shopify's branded checkout, not a fully custom page.
- Indonesian local payment methods depend on the gateway app and on Shopify's extra transaction fee.
- Editors can change content fields, not invent new page structures, without a code change.
- A custom admin, a second CMS, or an application API requires a new ADR.
- Storefront tests stop at the checkout handoff.

## Alternatives considered

- Shopify Hydrogen on Oxygen. Rejected for v1 so the intro, design system, and Jest specs live in one Next.js codebase.
- A Liquid theme. Rejected because the landing sequence and visual system need a freer frontend.
- A custom API plus a custom admin. Rejected for v1 as duplicate operations software.
- Sanity (or similar) beside Shopify. Rejected for v1. Metaobjects are enough while editing stays occasional.
- A real-time 3D black hole as the first intro. Rejected for v1 in favor of a video that holds up on phones. 3D can be a later requirement.
