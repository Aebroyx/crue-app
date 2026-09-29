---
name: build
description: Implements one accepted Crue requirement and its Jest tests, and nothing beyond that spec. Use when the user types /build, asks to implement an accepted requirement, or build a REQ.
disable-model-invocation: true
---

# Build a requirement

Code the how. The requirement stays the what and why.

## Steps

1. Read the requirement the user names. If they name none, and exactly one file in `docs/requirements/` has status `accepted`, build that one. Otherwise ask which id.
2. Read `docs/architecture.md`, `docs/design-language.md`, `docs/open-questions.md`, and `docs/adr/0001-shopify-as-system-of-record.md`.
3. If status is `draft`, stop. Implement only after the user explicitly accepts it in this conversation. When they do, set status to `accepted` first, then code.
4. If status is `rejected` or `done`, stop and say so.
5. Implement only **In scope**. Leave **Out of scope** untouched.
6. Add a Jest test for each acceptance criterion. Put the requirement id in the test name.
7. Run the tests. Fix the code when a test fails. If a criterion cannot be tested, record the reason under **Tests** in the requirement. Do not delete the criterion.
8. Set status to `done` only when every criterion is implemented and the tests pass. If an asset or an open question blocks part of the work, leave status `accepted` and name the blocker.
9. Tell the user the requirement id, what changed, which tests ran, and anything you refused to guess.

## While coding

- Follow `docs/design-language.md` for any UI. Missing color, type, or motion tokens get added to that doc only when the user chooses them. Do not invent stand-in brand tokens.
- Mobile and desktop both work. Honor `prefers-reduced-motion` when the requirement mentions motion.
- Shopify owns catalog, cart, checkout, orders, and admin. Hand off with the checkout URL. Do not add a payment SDK, an order database, or admin screens.
- A fact in `docs/open-questions.md` stays unanswered. Stop that part of the work and ask.
- The first accepted requirement may add the Next.js app and Jest. Add the smallest scaffold that requirement needs. Record the framework choice in the requirement's **Dependencies**, not in a new ADR, unless the framework contradicts ADR 0001.
- When the change is visible in the browser, verify the affected flow on a phone-width viewport and a desktop viewport before calling it done.

## Do not

- Build the next requirement because it would be convenient.
- Expand scope to "finish the page."
- Mark `done` with a failing or missing test.
- Weaken an acceptance criterion to make a test pass. Ask first.
- Commit unless the user asks.
