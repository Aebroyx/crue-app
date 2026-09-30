# REQ-003: Favicon

- Status: done
- Date: 2026-09-30

## Problem

The tab icon is one wide mark PNG. A phone home screen, a small tab, and an installed icon each need the sized files from the favicon pack, and the document does not link them.

## Why

The pack in `favicon_io` is the mark already cut for those slots. Business reason: the tab and the home-screen icon should be the black hole, at the size each surface expects. Technical reason: [REQ-002](REQ-002-intro-sequence.md) points the document icon at `/brand/crue-mark-white.png` and leaves the apple touch icon, the sized PNGs, and the manifest out of scope.

## Actors

Visitor.

## In scope

- Serve the files from `favicon_io` at these paths, unchanged:
  - `/apple-touch-icon.png`
  - `/favicon-32x32.png`
  - `/favicon-16x16.png`
  - `/favicon.ico`
  - `/android-chrome-192x192.png`
  - `/android-chrome-512x512.png`
  - `/site.webmanifest`
- On every route, on a phone and on a desktop, the document head includes these tags and no other icon or manifest tags:

```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
```

- Remove the REQ-002 document icon that points at `/brand/crue-mark-white.png`. That PNG stays the intro mark. The document title stays `Crue`.
- After the files are served from the storefront, delete the `favicon_io` folder. The storefront holds the only copy.

## Out of scope

- Regenerating, recoloring, cropping, or replacing any file in the pack.
- Filling `name` or `short_name`, or changing `theme_color` and `background_color`, in `site.webmanifest`.
- A social preview image.
- Changing the intro, the shell, or any page layout.
- Shopify, the Storefront API, and environment variables.

## Behavior

A visitor opens the app.

- The document links the apple touch icon, the 32px icon, the 16px icon, and the manifest, at the paths above.
- The same tags are present at phone width and at desktop width. The page itself does not change.
- `/favicon.ico` and the two android chrome PNGs are available at their paths. They do not get extra link tags. The manifest already points at the android chrome PNGs.
- The document title stays `Crue`. The intro still uses `/brand/crue-mark-white.png` as the on-page mark.
- The `favicon_io` folder is gone.

## Acceptance criteria

1. `REQ-003` includes the four link tags in **In scope**, with those `rel`, `sizes`, `type`, and `href` values.
2. `REQ-003` serves each file from the pack at the path named above.
3. `REQ-003` does not link `/brand/crue-mark-white.png` as a document icon, and keeps the document title `Crue`.
4. `REQ-003` serves `site.webmanifest` with the same contents as the pack, including the empty `name` and `short_name`.

## Edge cases

- Every file in the pack is required. If one is missing, the requirement is blocked. Do not draw a substitute from the intro mark.
- The manifest's `theme_color` and `background_color` stay `#ffffff`, as in the pack.
- Do not add a link tag for `favicon.ico` or for the android chrome PNGs.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-003 links the apple touch icon, the sized icons, and the manifest`
- `REQ-003 serves the favicon pack at the root paths`
- `REQ-003 does not use the intro mark as the document icon`
- `REQ-003 keeps the manifest contents from the pack`

That the painted tab and the home-screen icon match the pack, at a phone width and a desktop width, is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- The pack leaves `name` and `short_name` empty, and sets `theme_color` and `background_color` to `#ffffff`. This requirement does not change them.
- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- The `favicon_io` pack: `apple-touch-icon.png`, `favicon-32x32.png`, `favicon-16x16.png`, `favicon.ico`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `site.webmanifest`.
- [REQ-002](REQ-002-intro-sequence.md). This requirement replaces that requirement's document icon. The intro mark stays.
