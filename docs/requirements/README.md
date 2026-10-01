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
