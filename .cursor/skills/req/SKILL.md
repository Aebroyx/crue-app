---
name: req
description: Drafts a Crue requirement under docs/requirements without writing product code. Use when the user types /req, asks to draft a requirement, write a feature spec, or add a spec for the storefront.
disable-model-invocation: true
---

# Draft a requirement

Write the what and why. Do not implement it.

## Steps

1. Read `docs/README.md`, `docs/product-brief.md`, `docs/architecture.md`, `docs/design-language.md`, `docs/open-questions.md`, `docs/adr/`, and `docs/requirements/README.md`.
2. Read `docs/requirements/_template.md` and the latest `REQ-*.md` files so the new id is the next number.
3. If the user named a feature, draft that. If they did not, ask which feature before writing a file.
4. Check open questions. Anything still listed there stays in **Open questions** on the requirement. Do not resolve it yourself.
5. If the feature needs a custom backend, a second CMS, an admin app, or a payment SDK, stop and say an ADR is required. Do not draft those as in-scope.
6. Write `docs/requirements/REQ-NNN-short-name.md` from the template. Status is `draft`.
7. Add a row to the index in `docs/requirements/README.md`.
8. Tell the user the path, what you refused to guess, and that code waits until they set status to `accepted`.

## Quality bar

- In scope and out of scope are both specific.
- Behavior covers mobile and desktop when the UI differs.
- Acceptance criteria are observable. Each one can become a Jest test named with the requirement id.
- Shopify boundary names the Storefront API fields or the checkout handoff when commerce is involved.
- Prefer a smaller requirement over a hidden second feature.

## Do not

- Set status to `accepted`.
- Add app code, dependencies, or tests.
- Invent copy, prices, colors, fonts, gateways, or languages.
- Duplicate an ADR. Link it.
