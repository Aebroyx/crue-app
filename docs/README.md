# Crue docs

These files are the source of truth for what Crue is and why it is built this way. When a doc and the code disagree, the doc wins until you change the doc.

## Read in this order

1. [product-brief.md](product-brief.md) — business context, audience, and v1 boundary.
2. [architecture.md](architecture.md) — what this repo owns and what Shopify owns.
3. [design-language.md](design-language.md) — how the brand should feel. Visual tokens stay open until design locks them.
4. [open-questions.md](open-questions.md) — facts we do not have. Do not invent answers.
5. [adr/](adr/) — architecture decision records. Few, and only for hard-to-reverse choices.
6. [requirements/](requirements/) — feature specs. Only an accepted requirement may be implemented.

## How a feature moves

1. Draft with `/req`. Status stays `draft`.
2. Review with `/audit` when the draft needs a gap check.
3. You accept it. Status becomes `accepted`.
4. `/build` implements that requirement and its Jest tests, and nothing past its out-of-scope line.
5. If the what or why changes, update the requirement or an ADR first, then change the code.

## What does not belong here

- Step-by-step implementation notes. Those live in the code.
- A second copy of a decision. Link the ADR instead of restating it.
