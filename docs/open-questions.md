# Open questions

Unresolved on purpose. Agents and design must not fill these in. When you answer one, move the decision into the relevant doc or an ADR and delete it here.

Remaining questions do not block [REQ-001](requirements/REQ-001-storefront-shell.md). Answer each one before the requirement that needs it.

## Market

- Are first customers in Indonesia, abroad, or both?
- What is the Shopify plan, store handle, and public domain?

## Money and delivery

- Which gateway is connected in Shopify: Midtrans, Xendit, PayPal, or a combination?
- Which couriers fulfill orders, and is that a Shopify shipping app or manual fulfillment?
- Does launch need customer accounts, or is guest checkout enough?

## Brand assets

- The intro video and its poster frame do not exist in the repo yet.
- The final brand type family is not chosen. Until then, the storefront uses the Next.js 16 default font. That default is not the brand type family. See [design-language.md](design-language.md).
- Final color tokens are not chosen. [design-language.md](design-language.md) only records direction. They do not block REQ-001.

## Marketing mail

- Shopify Email is the v1 assumption in the architecture. Confirm that before the newsletter requirement is accepted.
