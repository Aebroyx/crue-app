# Requirements

Each feature is one file: `REQ-NNN-short-name.md`. The template is [`_template.md`](_template.md).

## Status

| Status | Meaning |
| --- | --- |
| `draft` | Written, not approved. No production code. |
| `accepted` | You approved it. Code may implement this file and nothing beyond it. |
| `done` | Shipped and covered by the Jest cases named in the file. |
| `rejected` | Will not be built. Kept so the reason is not rediscovered. |

## Rules

- Number the next file from the highest existing `REQ-NNN`, including rejected ones.
- Acceptance criteria are testable. Each one should be able to become a Jest case.
- In scope and out of scope are both required.
- If the work needs a new system (database, CMS, admin, payment SDK), it needs an ADR before the requirement can be accepted.
- Edge cases that are still unknown stay as questions. They are not guessed inside the criteria.
- Implement an accepted requirement with `/build`.

## Index

| ID | Title | Status |
| --- | --- | --- |
| [REQ-001](REQ-001-storefront-shell.md) | Storefront shell | done |
| [REQ-002](REQ-002-intro-sequence.md) | Intro sequence | done |
| [REQ-003](REQ-003-favicon.md) | Favicon | done |
| [REQ-004](REQ-004-home.md) | Home | done |
| [REQ-005](REQ-005-theme.md) | Theme switch | done |
| [REQ-006](REQ-006-benzin.md) | Benzin | done |
| [REQ-007](REQ-007-navbar-footer.md) | Navbar and footer | done |
| [REQ-008](REQ-008-product-page.md) | Product page | done |
| [REQ-009](REQ-009-home-and-intro-links.md) | Home and intro links | done |
| [REQ-010](REQ-010-newsletter.md) | Newsletter band | done |
| [REQ-011](REQ-011-catalog.md) | Catalog | done |
| [REQ-012](REQ-012-about.md) | About | done |
| [REQ-013](REQ-013-intro-logo.md) | Intro logo | done |
| [REQ-014](REQ-014-not-found.md) | Not found | done |
| [REQ-015](REQ-015-size-guide.md) | Size guide | done |
| [REQ-016](REQ-016-bag.md) | Bag | done |
| [REQ-017](REQ-017-env.md) | Environment files | done |
