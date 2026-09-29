---
name: audit
description: Audits a Crue requirement for missing edge cases, conflicts with docs, and untestable criteria. Use when the user types /audit, asks to audit a spec, or asks what edge cases a requirement is missing.
disable-model-invocation: true
---

# Audit a requirement

Find gaps. Do not widen the product, and do not write code.

## Steps

1. Read `docs/architecture.md`, `docs/design-language.md`, `docs/open-questions.md`, `docs/adr/`, and every file in `docs/requirements/` except the template.
2. Audit the requirement the user names. If they do not name one, audit every file whose status is `draft` and say which files those are.
3. Compare the draft to accepted decisions. A conflict with an ADR is a blocker, not a suggestion.
4. Reply with the format below. Then stop, unless the user asks you to apply edits.

## Reply format

```markdown
# Audit: REQ-NNN

## Blockers
Conflicts with an ADR, architecture, or another requirement. Empty section if none.

## Missing edge cases
Only cases the requirement's own behavior can hit. Mark any that depend on an open question.

## Untestable criteria
Criteria a Jest test cannot prove, and what evidence would be enough instead.

## Scope leaks
Behavior that belongs in a different requirement.

## Edits to apply only if you ask
Concrete wording changes. Not applied in this pass.
```

## Check these when relevant

- Empty catalog, sold-out variant, missing image, missing metaobject.
- Storefront API failure and slow network.
- Mobile and desktop, and `prefers-reduced-motion`.
- Repeat visit in the same session, and a new session.
- Checkout handoff only. Do not specify gateway screens.
- Guest versus account, if the requirement mentions a buyer identity.
- Copy that would be hardcoded even though a merchant should edit it in Shopify.

## Do not

- Invent answers to `docs/open-questions.md`.
- Add features in the audit reply as if they were approved.
- Change requirement status.
- Implement or "fix" the app.
