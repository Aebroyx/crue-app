# ADR

Architecture decision records. One file per decision that would be expensive to reverse: `NNNN-short-name.md`.

A requirement says what a feature does. An ADR says which system owns it, and why that choice won. Feature behavior does not get an ADR.

## When to add one

- A new backend, database, CMS, admin, or payment integration.
- A change to ADR 0001.
- A replacement for the intro approach, the test runner, or the storefront framework.

Skip an ADR for copy, layout, a component, or an acceptance criterion. Those belong in a requirement.

## Status

`proposed`, `accepted`, `superseded`. Superseded files stay. The newer ADR links the one it replaces.

## Index

| ID | Title | Status |
| --- | --- | --- |
| [0001](0001-shopify-as-system-of-record.md) | Shopify is the system of record | Accepted |
