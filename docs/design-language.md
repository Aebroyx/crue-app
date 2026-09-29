# Design language

Direction for the storefront. Exact type families, color tokens, spacing, and components are locked by design work, then recorded here. Until that happens, do not invent a palette or a font in code and treat it as final.

## Feeling

Minimal, heavy, and quiet. A hype sportswear store, not a fitness landing page. Large type, large product, large empty fields. One idea on screen at a time.

The black hole is the brand's gravity: the intro, the mark, and rare full-bleed moments. After the intro, pages do not repeat stars, nebulae, or glow effects. The clothing sits on a void that is simply black or paper.

References for restraint: Nike, Supreme, and Yeezy, as a standard of editing. Do not imitate a specific campaign, logo, or layout.

Two catalog files are editing references only. They are not Crue's tokens.

- The intro, and this prototype's shell, follows the SpaceX file's austerity: one black viewport, one mark, no chrome. [design-md/spacex/DESIGN.md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/spacex/DESIGN.md).
- The shop, when a later requirement specifies it, follows the Nike file's rule that photography carries the page and the interface stays quiet. [design-md/nike/DESIGN.md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/nike/DESIGN.md).

Do not copy either file's type, colors, logos, buttons, or layout. This document wins when they disagree.

## Mark

Two assets, each in black and in white:

- The symbol: the black hole.
- The wordmark: the Crue name.

Black artwork on light grounds. White artwork on black grounds. Do not recolor, outline, or place the mark on a busy photograph. Use the SVGs in [`assets/brand/`](../assets/brand/README.md). They wrap the transparent PNGs, so they are not path artwork and CSS `fill` does not recolor them.

## Color and type

Working direction, not tokens:

- Grounds are near-black and off-white. A single accent is allowed only if design names it.
- UI type is a neutral grotesque. The wordmark may differ if design specifies it.
- The final type family is not chosen. Until it is, use the Next.js 16 default font. Do not record that default as the brand type family.
- No gradients used as decoration, no neon, no sporty italic headlines, no stock "athlete in golden hour" treatment as the default.

## Motion

Motion is rare and physical, like mass moving, not like a UI kit.

- The intro is one fullscreen video, then stillness. See architecture for skip, reduced motion, and session behavior.
- Inside the shop, motion is limited to hover, image swaps, and the cart. Nothing autoplays on product or home sections.
- Mobile and desktop share the sequence. The video must have a poster so the first frame is instant on a slow connection.

## Layout

- Mobile and desktop are both first-class. Same tasks, different measure: stacked on a phone, more air and a stricter grid on a wide screen.
- Product imagery is the content. UI chrome stays thin: navigation, price, size, add.
- Homepage sections are few. Each section maps to one metaobject type the merchant can edit.

## Voice

Short. Concrete. Product language names the run use, the fabric, and the fit. Campaign language can be colder and more abstract. No exclamation marks, no "unlock your potential."

## Claude Design handoff

When design explores screens, it should be able to assume:

- Intro, then home, collection, product, cart, then Shopify Checkout (checkout itself is not a custom screen).
- Black and white mark, space used only as specified above.
- Responsive mobile and desktop.
- Tokens in this file win over a mock if they ever conflict. If a mock needs a new token, add it here first.
