# REQ-022: Sold-out size

- Status: done
- Date: 2026-10-06

## Problem

A size that cannot be bought still looks the same as a size that can, and Add to bag still confirms it.

## Why

[design/DESIGN.md](../design/DESIGN.md) describes this state on the product page. The product screen files do not draw it, so this requirement follows that section for the control and the copy. Business reason: a visitor should see that a size is gone before they try to add it. Technical reason: variants already have `availableForSale`. The live catalog has none set to false, and no back-in-stock tool is chosen, so this requirement shows the state and does not send mail.

## Actors

Visitor.

## In scope

- On the product page, a size whose variant for the selected colour has `availableForSale: false` is struck through and coloured `dim`. It can still be selected.
- Selecting it replaces the filled Add to bag button with an outline button named `Notify me when XL is back`, using that size's label in place of `XL`.
- Activating it once changes the label to `We will email you when XL is back`, again with that size's label. It does not add a bag line, does not change the address, and does not send email.
- Selecting an available size again restores `Add to bag, M` for that size, and the bag behaviour from [REQ-016](REQ-016-bag.md).
- The phone sticky Add to bag bar uses the same sold-out label and the same confirmation.
- The current `src/data/catalog.json` is unchanged. Every variant there stays available. Jest proves the sold-out state with a product whose one size is unavailable.

## Out of scope

- A back-in-stock app, a customer tag, or any email. No tool is named in the docs.
- Marking a real draft product sold out so the live page shows the state.
- Hiding the size, or refusing to select it.
- "You may also like". That is [REQ-023](REQ-023-you-may-also-like.md).

## Behavior

A visitor is on a product whose selected colour has XL unavailable and M available.

- XL is struck through and `dim`. M looks as it does today.
- They select XL. The button reads `Notify me when XL is back`. The bag count does not change.
- They activate that button. The label becomes `We will email you when XL is back`. The address is unchanged. The bag stays as it was.
- They select M. The button reads `Add to bag, M`. Activating it adds the line, as [REQ-016](REQ-016-bag.md) already does.
- On the live Horizon Shell Jacket page, every size stays available, because the catalog file is unchanged.

## Acceptance criteria

1. `REQ-022` strikes through an unavailable size and still lets the visitor select it.
2. `REQ-022` shows `Notify me when XL is back` for that size and does not add a bag line.
3. `REQ-022` confirms `We will email you when XL is back` without sending mail or changing the address.
4. `REQ-022` restores Add to bag when an available size is selected, and leaves the live catalog all available.

## Edge cases

- The size label in both sentences is the selected size, not always XL. XL is the example from the design.
- Activating the confirmation again does not add a second message.
- A colour whose XL is available does not show the notify button when that colour is selected.

## Shopify boundary

None. This requirement reads `availableForSale` on the local catalog record. It does not call Shopify and does not write a customer. A later requirement can send the notify request after a tool is chosen.

## Tests

Jest, with the requirement id in the name:

- `REQ-022 shows a sold-out size as struck through and selectable`
- `REQ-022 swaps Add to bag for the notify label`
- `REQ-022 confirms without emailing or adding a line`
- `REQ-022 returns to Add to bag for an available size`

That the control matches the design note in light and dark at 390 and at 1440 is a browser check only when a fixture product is on screen. The live catalog does not show it. Jest does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Which back-in-stock tool, if any, receives the notify request.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [design/DESIGN.md](../design/DESIGN.md). The product page states. The screen files stop at the accordion, so they are not the layout source for this control.
- [REQ-008](REQ-008-product-page.md). Size selection stays on this page.
- [REQ-016](REQ-016-bag.md). An available size still adds a line.
