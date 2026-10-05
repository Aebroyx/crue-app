# REQ-015: Size guide

- Status: done
- Date: 2026-10-05

## Problem

`Size guide` on the product page jumps to `#guide`, and the footer link jumps to `#drop`. Neither opens a chart. A visitor cannot compare a size.

## Why

[design/DESIGN.md](../design/DESIGN.md) draws a size guide overlay, in light and dark, on a phone and on a desktop. It opens over the page the visitor is already on. Business reason: the size choice on a product should have a chart behind it. Technical reason: the two links exist and do not show the chart in the screens.

## Actors

Visitor.

## In scope

- One overlay, not a route. The screen component lives under `src/components/`, with its Jest file beside it.
- It opens from the existing `Size guide` control on the product page. That control no longer points at `#guide`.
- It opens from the existing footer link `Size guide` on the home page, the catalog, and the product page. That link no longer points at `#drop`. About and the not-found page have no footer, so they do not gain this link.
- Light follows the light size guide screens. Dark follows the dark pair. Reference widths are 390 and 1440. The page underneath stays put.
- Desktop: a dialog named `Size guide`, centred, 760px wide and 760px tall, with a 1px `line-strong` border, on the scrim. The scrim is `rgba(28,28,26,0.38)` in light and `rgba(5,5,6,0.72)` in dark.
- Phone: the same dialog is a bottom sheet, full width, 780px tall, with a 1px `line-strong` top border, on the same scrim. The body scrolls. The sheet does not grow past the viewport.
- The header is 68px. The title is `Size guide`, Benzin 800, 20px, uppercase. The close control is 44×44px and is named `Close size guide`.
- Two square segmented controls. `Tops` and `Bottoms` are tabs, labelled `Category`. `cm` and `in` are a group, labelled `Units`. The first state is `Tops` and `cm`. The selected segment is filled with `text` and labelled in `bg`. The other segment is transparent, labelled in `text`, with a `control-border` outline on the group. Each segment is 40px tall. The label is IBM Plex Mono, 11px, `0.14em`, uppercase.
- The table has a `Size` column and three measurement columns. Rows are `XS`, `S`, `M`, `L`, `XL`, `XXL`. Tops columns are `Chest`, `Waist`, `Length`. Bottoms columns are `Waist`, `Hip`, `Inseam`. Header text is IBM Plex Mono, 11px, `0.14em`, uppercase, colour `muted`. Each row is divided by a 1px `line` border. The size name is Benzin 700. Each measurement cell is IBM Plex Mono, colour `text-2`.
- Every measurement cell is the placeholder `[cm]` when `cm` is selected, and `[in]` when `in` is selected. These are the values in the screens. They are not real body measurements.
- `How to measure` sits under the table. Benzin 800, 14px, uppercase, `0.04em`. Three notes, in a row of three on a desktop and in one column on a phone.
- Tops notes, in order: `Chest`, `Measure around the fullest part of your chest, keeping the tape level under your arms.` `Waist`, `Measure around your natural waist, the narrowest part of your torso.` `Length`, `Measured on the garment, from the highest point of the shoulder to the hem.`
- Bottoms notes, in order: `Waist`, `Measure around your natural waist, the narrowest part of your torso.` `Hip`, `Stand with feet together and measure around the fullest part of your hips.` `Inseam`, `Measure from the top of your inner thigh down to your ankle.`
- Under the notes, the screen placeholder: `[Fit note: for example, true to size; size up for a relaxed fit.]` Colour `muted`, 13px.
- `Close size guide`, Escape, and a click on the scrim each dismiss the overlay and leave the visitor on the same page. Focus stays inside the dialog while it is open.
- The overlay opens and closes with the UI easing, on `transform` and `opacity`. `prefers-reduced-motion: reduce` shows it in place, with no open or close animation.

## Out of scope

- A Shopify metaobject, a Storefront query, and real centimetre or inch numbers. The design says the chart will live in a metaobject once the numbers exist. This requirement renders the placeholder chart from the screens.
- The mobile menu. The design also lists a `Size guide` row there. That menu is not built. This requirement does not open it.
- Search, the bag drawer, sold-out notify, and "You may also like".
- A size guide route.

## Behavior

A visitor on a product activates `Size guide`, on a phone or on a desktop.

- The overlay opens over that product. `Tops` and `cm` are selected. The cells read `[cm]`. The tops notes are shown.
- They activate `Bottoms`. The columns become `Waist`, `Hip`, `Inseam`, and the bottoms notes replace the tops notes. The cells stay `[cm]`.
- They activate `in`. Every measurement cell reads `[in]`. The size names do not change.
- They activate `Close size guide`. The overlay is gone. The product page is still there.
- A visitor on the home page or the catalog activates `Size guide` in the footer. The same overlay opens over that page.
- With reduced motion, the overlay appears in its open state. It does not animate in.

## Acceptance criteria

1. `REQ-015` opens the size guide from the product page control, and that control does not point at `#guide`.
2. `REQ-015` opens the same size guide from the footer link on the home page, the catalog, and the product page, and that link does not point at `#drop`.
3. `REQ-015` starts on `Tops` and `cm`, lists `XS` through `XXL`, and shows `[cm]` in every measurement cell.
4. `REQ-015` switches the columns and the how-to-measure notes when `Bottoms` is selected, and switches every cell to `[in]` when `in` is selected.
5. `REQ-015` dismisses the overlay with `Close size guide`, with Escape, and with a scrim click, and leaves the page underneath in place.
6. `REQ-015` shows the dialog centred at 760px on a desktop and as a 780px bottom sheet on a phone, and skips the open animation when reduced motion is set.

## Edge cases

- Opening the overlay does not change the selected product size or colour.
- `About` and the not-found page do not show a footer `Size guide` link.
- The phone menu control still does not open this overlay.
- The fit note stays the bracketed placeholder from the screens.

## Shopify boundary

None. This requirement does not read or write Shopify. The chart on screen is the placeholder from the size guide screens. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) still holds: when the real numbers exist, they belong in a Shopify metaobject, not in a new store. A later requirement can read that metaobject. This one does not define its type or fields.

## Tests

Jest, with the requirement id in the name:

- `REQ-015 opens the size guide from the product page`
- `REQ-015 opens the size guide from the footer`
- `REQ-015 starts on Tops in centimetres`
- `REQ-015 switches category and units`
- `REQ-015 closes on the control, Escape, and the scrim`
- `REQ-015 uses the desktop dialog and the phone sheet`

That the overlay matches the light and dark size guide screens at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- The metaobject type and fields for the real chart are not drawn. The store handle is still open. Until both exist, the cells stay `[cm]` and `[in]`.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [size-guide-desktop.html](../design/screens/light/size-guide-desktop.html), [size-guide-mobile.html](../design/screens/light/size-guide-mobile.html), and the dark pair. The screen wins for layout. The script block in those files is the chart, the notes, and the first state.
- [design/DESIGN.md](../design/DESIGN.md). The size guide section, and the scrim values.
- [REQ-007](REQ-007-navbar-footer.md). The footer link is shared.
- [REQ-008](REQ-008-product-page.md). The product page control is already on the size row.
