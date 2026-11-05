# REQ-035: Size chart

- Status: done
- Date: 2026-11-05

## Problem

The size guide always shows the same placeholder table: Tops or Bottoms, XS through XXL, and `[cm]` or `[in]` in every cell. The only real chart is the tee, shared by the short sleeve and the long sleeve. Other products have no chart. A code change is the only way to add a column, a size, or a second chart.

## Why

[REQ-015](REQ-015-size-guide.md) built the overlay and left the numbers out. [design/DESIGN.md](../design/DESIGN.md) says the real chart is a Shopify metaobject. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) says the merchant edits content in Shopify and this repo keeps the layout. Business reason: the tee chart should be on the site, and a later garment should get its own chart without a deploy. Technical reason: the columns, the sizes, and which product uses a chart are content. The dialog, the table, and the controls that open it already exist.

## Actors

Visitor and merchant.

## In scope

- A Storefront metaobject type `size_chart`. Fields: `name` (single line), `position` (integer), `unit_label` (single line), `fit_note` (multi-line), `columns` (list of single lines), `notes` (list of multi-line text, one note per column), and `rows` (list of references to `size_chart_row`).
- A Storefront metaobject type `size_chart_row`. Fields: `size` (single line) and `values` (list of single lines, in the same order as `columns`).
- A product metafield `custom.size_chart`, a reference to one `size_chart`, exposed to the Storefront API. Two products may reference the same entry. A product with no reference has no chart.
- The product-page `Size guide` control opens the chart that product references. The dialog is the one from [REQ-015](REQ-015-size-guide.md). The table columns are `columns`, in that order, after a `Size` column. Each row shows `size` and then `values`. Cells show the text Shopify returned. This requirement does not add a unit, a rounding rule, or a conversion.
- `unit_label` is one line under the table. `fit_note` is the next line. A `notes` entry that is not empty is a how-to-measure block under that, headed by the matching column name. The heading `How to measure` is shown only when at least one note is non-empty.
- On a phone and on a desktop the dialog keeps the [REQ-015](REQ-015-size-guide.md) size, scrim, title, and close behaviour. The table scrolls sideways inside the dialog when the columns do not fit. The sheet body still scrolls vertically.
- The footer `Size guide` link and the phone-menu `Size guide` row open the same dialog and list every `size_chart`, ordered by `position`, then by the order Shopify returned. One chart shows that table and no chart switcher. More than one chart shows a control of each `name`, and the first chart is selected.
- A product with no chart does not show the product-page `Size guide` control. When no `size_chart` exists, or the query fails, the footer link and the menu row are absent. The placeholder table, the `Tops` and `Bottoms` tabs, and the `cm` and `in` control are not shown.

## Out of scope

- The tee drawing. The dialog does not gain an illustration.
- Inch values, a centimetre-to-inch conversion, and a rounding rule. The merchant writes the cell text.
- How-to-measure sentences for the tee. `notes` stays empty until the merchant writes them.
- Charts for the jacket, the tight, the short, and the cap. Those products have no reference until the merchant adds one.
- A size-guide route, a new dialog, and an admin screen in this repo. The merchant creates the metaobject entries in Shopify Admin.
- Hard-coding the tee numbers in this repo. Jest mocks the entry. The live numbers are the Shopify entry.

## Behavior

The merchant saves one `size_chart`. `columns` are `Chest` and `Length`. `unit_label` is `All measurements in centimeters`. `fit_note` is `If you're between sizes, choose your preferred fit. Size up for a more relaxed fit or size down for a closer fit.` The rows are `S` with `47` and `47`, `M` with `49` and `49`, `L` with `53` and `53`, and `XL` with `56` and `56`. `notes` is empty. The short-sleeve tee and the long-sleeve tee both reference that entry. No other product references a chart.

A visitor opens the short-sleeve tee, on a phone or on a desktop, and activates `Size guide`.

- The dialog shows those four rows and the two measurement columns. It does not show Waist, XS, or XXL.
- Under the table they see the unit label and the fit note. They do not see `How to measure`.
- They open the long-sleeve tee. `Size guide` shows the same rows and the same numbers.
- They open a product with no chart. There is no `Size guide` control on that page.
- They activate `Size guide` in the footer or in the phone menu. The dialog shows that same tee chart. There is no `Tops` or `Bottoms` control and no `cm` or `in` control.
- The merchant later adds a second chart and references it from another product. The product page opens that product's chart. The footer and the menu show both names, in `position` order, and the first is selected until the visitor chooses the other.
- No chart is published, or the query fails. The footer link, the menu row, and every product-page control are absent.

## Acceptance criteria

1. `REQ-035` reads `size_chart` columns, rows, `unit_label`, and `fit_note` from the Storefront API, and reads each row from `size_chart_row`.
2. `REQ-035` shows the chart referenced by `custom.size_chart` on that product, and hides the product-page control when the reference is missing.
3. `REQ-035` shows one shared chart on two products that reference the same entry.
4. `REQ-035` opens every published chart from the footer and the phone menu, in `position` order, and hides those controls when no chart exists or the query fails.
5. `REQ-035` does not show the placeholder cells, the `Tops` and `Bottoms` tabs, or the `cm` and `in` control.

## Edge cases

- A row with fewer `values` than `columns` leaves the extra cells empty. Extra values beyond `columns` are not shown.
- An empty `unit_label`, `fit_note`, or note is omitted. The other fields still show.
- A missing `position` sorts after charts that have one. The relative order of those unnumbered charts is the order Shopify returned.
- Opening the dialog does not change the selected product size or colour. That rule is [REQ-015](REQ-015-size-guide.md).
- Close, Escape, and the scrim still dismiss the dialog and leave the page underneath in place. That rule is [REQ-015](REQ-015-size-guide.md).

## Shopify boundary

Reads `size_chart` and `size_chart_row` metaobjects, and the product metafield `custom.size_chart`, from the Storefront API. Does not write a chart, a cart, a checkout URL, a customer, or an order. [ADR 0001](../adr/0001-shopify-as-system-of-record.md) stays the decision. The merchant creates the entries in Shopify Admin.

## Tests

Jest, with the requirement id in the name:

- `REQ-035 reads the size chart columns and rows from Shopify`
- `REQ-035 shows the product chart and hides the control when a product has none`
- `REQ-035 shares one chart across two products`
- `REQ-035 lists charts from the footer and the menu and hides them when none exist`
- `REQ-035 does not show the placeholder chart`

Jest mocks the metaobjects and the product metafield. It does not call the live store. The dialog chrome at 390 and at 1440 stays the browser check from [REQ-015](REQ-015-size-guide.md).

## Open questions

These stay open. This requirement does not answer them:

- What is the live Shopify store handle? See [open-questions.md](../open-questions.md). The query uses the store named by `SHOPIFY_STORE_DOMAIN`.
- Which couriers fulfill orders?

## Dependencies

- [REQ-015](REQ-015-size-guide.md). The dialog this requirement fills. The placeholder cells and the category and unit controls are replaced here.
- [REQ-020](REQ-020-mobile-menu.md). The phone-menu row.
- [design/DESIGN.md](../design/DESIGN.md). The size guide section. The table tokens stay. The column set and the row set come from Shopify.
- [ADR 0001](../adr/0001-shopify-as-system-of-record.md).
