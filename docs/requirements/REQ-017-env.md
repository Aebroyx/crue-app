# REQ-017: Environment files

- Status: done
- Date: 2026-10-05

## Problem

The storefront has no place to put the Shopify names [architecture.md](../architecture.md) already expects. A developer cannot tell which file to fill, and a real token has nowhere safe to live.

## Why

[architecture.md](../architecture.md) names `.env.local` for `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, and says those files are not created yet. Business reason: the later Storefront API work needs a store to point at. Technical reason: tokens never go in git, per [ADR 0001](../adr/0001-shopify-as-system-of-record.md) and the architecture secrets rule. This requirement only adds the files. It does not call Shopify.

## Actors

Merchant, as the person who holds the store credentials.

## In scope

- `.env.example` at the repo root, committed. It lists `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` with empty values. A short comment says to copy it to `.env.local` and fill the values there. It does not contain a store domain, a token, or a placeholder that looks like a real secret.
- `.env.local` at the repo root, with the same two names and empty values. This is the file the developer fills. Next.js reads it. It is not committed.
- No `.env` file. `.gitignore` already ignores `.env` and `.env.*`, and it already un-ignores `.env.example`. This requirement leaves that ignore list as it is.
- The Environments section in [architecture.md](../architecture.md) stops saying these files are not created yet, and points at `.env.example` and `.env.local`.

## Out of scope

- Reading the variables in app code, calling the Storefront API, or changing the bag, catalog, or product page.
- A `NEXT_PUBLIC_` prefix. The names stay the ones in [architecture.md](../architecture.md). Nothing in this requirement sends them to the browser.
- An Admin API token. [architecture.md](../architecture.md) keeps that out of v1 unless a requirement needs it.
- Gateway keys for Midtrans, Xendit, or PayPal. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) keeps payment in Shopify Admin.
- `.env.development`, `.env.production`, `.env.test`, and their `.local` variants.
- A Shopify development store, a store handle, or a public domain. Those stay open.

## Behavior

A developer clones the repo.

- They see `.env.example` with the two empty names.
- They copy it to `.env.local` if that file is not already there, and they fill the two values on their machine.
- `git status` does not offer `.env.local` or a `.env` file.
- The running storefront does not change. These files are not read yet.

## Acceptance criteria

1. `REQ-017` commits `.env.example` with `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` set to empty values, and with no other names.
2. `REQ-017` keeps `.env.local` off git, and does not add a `.env` file.
3. `REQ-017` leaves `.gitignore` ignoring `.env` and `.env.*` while still allowing `.env.example`.

## Edge cases

- A fresh clone has `.env.example` and does not have `.env.local` until the developer creates it. The Jest cases prove the example and the ignore rule, not that every machine already has `.env.local`.
- Empty values are valid for this requirement. The app does not fail startup because they are empty, because it does not read them yet.

## Shopify boundary

None. The two names are the ones a later requirement will send to the Storefront API. This requirement does not request that API and does not write a cart, a checkout URL, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) still holds.

## Tests

Jest, with the requirement id in the name. The cases read files. They do not need a browser.

- `REQ-017 commits the example with the two empty Shopify names`
- `REQ-017 does not commit .env.local or a .env file`
- `REQ-017 keeps the example allow-list in gitignore`

## Open questions

These stay open and do not block this requirement:

- The Shopify plan, store handle, and public domain in [open-questions.md](../open-questions.md). `SHOPIFY_STORE_DOMAIN` stays empty until that is answered.
- Which gateway is connected in Shopify. This requirement adds no gateway variable.
- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- [architecture.md](../architecture.md). The Environments section and the secrets rule.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
- `.gitignore` at the repo root. The env lines are already correct.
