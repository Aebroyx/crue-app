# Brand assets

Use the SVG files in the storefront. The PNGs are the same artwork without the wrapper.

`crue` is the wordmark. `cruebh` is the black-hole symbol. Black artwork goes on light grounds. White artwork goes on black grounds. Do not recolor either file in code.

These SVGs are not outline paths. Each one embeds the transparent PNG, so `fill` in CSS does not change the ink. A true vector master is not in the repo.

| File | Use |
| --- | --- |
| `crue-black.svg` | Wordmark on light grounds |
| `crue-white.svg` | Wordmark on black grounds |
| `cruebh-black.svg` | Symbol on light grounds |
| `cruebh-white.svg` | Symbol on black grounds |

| PNG | Same artwork as |
| --- | --- |
| `wordmark-black.png` | `crue-black.svg` |
| `wordmark-white.png` | `crue-white.svg` |
| `logo-mark-black.png` | `cruebh-black.svg` |
| `logo-mark-white.png` | `cruebh-white.svg` |

Every file keeps a large transparent margin around the artwork. Cropping for a layout belongs in a requirement, not in these source files.

The black files look empty on a black preview, because the field is transparent and the ink is black.

Intro video and poster do not go here. They belong with the intro requirement once you choose the files.
