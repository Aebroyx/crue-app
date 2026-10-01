# REQ-010: Newsletter band

- Status: done
- Date: 2026-10-01

## Problem

The home stops at the category tiles. The designed newsletter band, which sits before the footer, is not on the page.

## Why

[design/DESIGN.md](../design/DESIGN.md) draws that band on the home, in light and dark, on a phone and on a desktop. [REQ-004](REQ-004-home.md) left it out because [open-questions.md](../open-questions.md) says to confirm Shopify Email before a newsletter requirement is accepted. Business reason: the band is part of the home the visitor should see. Technical reason: confirming Shopify Email is still open, so this requirement shows the band and does not send the address anywhere.

## Actors

Visitor.

## In scope

- The newsletter band on the home, after the category tiles and before the footer. It is not on the product page. Those screens do not draw it.
- The light and dark home screens. Reference widths are 390 and 1440. Build it fluid.
- The heading `Enter the orbit`. The visible label `Get early access to every drop.` An email field with placeholder `you@email.com`. A button named `Join`.
- `glow-light.jpg` behind the band at low opacity. The band ground is `surface`. The field is 56px tall, with a `control-border` outline and the page ground inside.
- On a desktop the heading is 40px and the form is centred, 520px wide, toward the bottom of a 480px band. On a phone the heading is 28px and the form is inset from the sides, toward the bottom of a 460px band.

## Out of scope

- Sending the address to Shopify Email, or to any other tool. Join does not create a customer, show a success line, or store the address. [open-questions.md](../open-questions.md) still has to confirm Shopify Email before a later requirement does that.
- A second newsletter on the product page.
- Changing the footer, the category tiles, or the intro.

## Behavior

A visitor opens the home on a phone or on a desktop, in light or in dark.

- Below the category tiles and above the footer, they see `Enter the orbit`, the label, the email field, and `Join`.
- They type an address and activate `Join`. The band stays as it is. No message is added. The address is not kept.
- The product page has no newsletter band.

## Acceptance criteria

1. `REQ-010` renders the newsletter band on the home after the category tiles and before the footer, on a phone and on a desktop.
2. `REQ-010` shows `Enter the orbit`, `Get early access to every drop.`, the email field, and `Join`.
3. `REQ-010` does not show that band on a product page.
4. `REQ-010` does not send or store the address when `Join` is activated.

## Edge cases

- An empty field and `Join` does the same as a filled field: nothing is sent.
- The label is tied to the email field.
- Keyboard users can reach the field and `Join`.

## Shopify boundary

None. This requirement does not read or write Shopify. A later requirement, after Shopify Email is confirmed, is what captures the address into Shopify customers. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision.

## Tests

Jest, with the requirement id in the name:

- `REQ-010 places the newsletter band before the footer`
- `REQ-010 shows the orbit heading, the label, the field, and Join`
- `REQ-010 keeps the band off the product page`
- `REQ-010 does not send the address`

That the band matches the light and dark home screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

This stays open and blocks any later requirement that sends the address:

- Shopify Email is the v1 assumption in the architecture. Confirm that before a signup requirement is accepted.

These stay open and do not block this requirement:

- Every other item in [open-questions.md](../open-questions.md).

## Dependencies

- The newsletter section of the light and dark home screens, desktop and mobile. The screen wins for layout.
- [design/DESIGN.md](../design/DESIGN.md). The newsletter band uses `surface` and `glow-light.jpg`.
- [REQ-004](REQ-004-home.md). This requirement adds the band that file left out.
- [REQ-007](REQ-007-navbar-footer.md). The band sits before that footer.
