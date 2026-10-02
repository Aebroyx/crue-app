# REQ-013: Intro logo

- Status: done
- Date: 2026-10-02

## Problem

The intro opens with the black hole: the disk spins, then the hole collapses, and only then the logo arrives. That opening is no longer what a first visit should play. The intro also shows two ways out. Enter and Skip do the same thing.

## Why

The logo coming in is enough, and one control is enough. The black hole sequence can return later, so the markup and the keyframes stay in the repo and are not deleted. Business reason: the first visit should land on the mark, not wait through the hole, and the visitor should have a single way off the intro. Technical reason: [REQ-002](REQ-002-intro-sequence.md) timed the mark to start at 2.8 seconds, after the collapse, and it required both Skip and Enter. Hiding the hole without moving that delay would leave a blank wait.

## Actors

Visitor.

## In scope

- The intro still covers the viewport on `/` for a visitor who has not seen it, and when the CRUE wordmark replays it. Dark in every theme. Enter dismisses it. The cookie behaviour from [REQ-002](REQ-002-intro-sequence.md) and [REQ-009](REQ-009-home-and-intro-links.md) stays.
- The black-hole group is not shown. Its markup stays in the intro component. Its keyframes stay in the Tailwind entry, including the disk spin and the collapse. Nothing in that group is deleted.
- The animation a visitor sees is the mark coming in. It uses the existing mark keyframe and starts without waiting for the collapse.
- The wordmark, "Get pulled in", Enter, and the progress line still arrive after the mark. Their delays move earlier so they follow the mark. The copy does not change.
- The intro no longer shows Skip. Desktop does not show the "Skip" control. Mobile does not show "Skip intro". Enter is the only dismiss control, on a phone and on a desktop. It stays keyboard accessible.
- The star layers stay. They are not the entrance.
- `prefers-reduced-motion: reduce` still shows the final still state immediately: mark, wordmark, "Get pulled in", the progress line full, and Enter. The black hole stays hidden. Skip is not in that still state.
- Docs that still require a Skip control on the intro match this requirement. [REQ-002](REQ-002-intro-sequence.md) is not rewritten. This file supersedes its Skip control. [design/DESIGN.md](../design/DESIGN.md) and [design-language.md](../design-language.md) drop the line that the intro always has a Skip link.

## Out of scope

- Deleting the black-hole markup or its CSS.
- A new logo animation, a video, or a 3D scene.
- Changing what Enter does, the cookie, or the page under the intro.
- Shopify.

## Behavior

A visitor opens `/` with no intro cookie, on a phone or on a desktop.

- The intro is full screen. The black hole is not visible.
- The mark comes in. The wordmark, "Get pulled in", and Enter follow it. The sequence does not sit blank until 2.8 seconds.
- Skip and "Skip intro" are not shown.
- It holds there until Enter. Nothing else on the intro dismisses it.
- A visitor who prefers reduced motion sees that end state at once.
- The black-hole nodes are still in the intro component, and the disk and collapse keyframes are still in the CSS.

## Acceptance criteria

1. `REQ-013` does not show the black hole on the intro, on a phone or on a desktop.
2. `REQ-013` plays the mark coming in, without the delay that waited on the collapse.
3. `REQ-013` still shows the wordmark, "Get pulled in", and Enter after the mark.
4. `REQ-013` does not show Skip or "Skip intro" on the intro, on a phone or on a desktop.
5. `REQ-013` dismisses the intro with Enter and sets the cookie.
6. `REQ-013` keeps the black-hole markup in the intro component and the disk and collapse keyframes in the CSS.
7. `REQ-013` shows the final still state immediately when reduced motion is set.

## Edge cases

- Replaying the intro from the CRUE wordmark uses this same sequence.
- Enter sets the cookie and leaves the visitor on the page underneath.
- The hidden black-hole group does not receive pointer events.

## Shopify boundary

None. This requirement does not read or write Shopify.

## Tests

Jest, with the requirement id in the name:

- `REQ-013 hides the black hole`
- `REQ-013 brings the mark in without waiting for the collapse`
- `REQ-013 still reveals the wordmark and Enter`
- `REQ-013 does not show a skip control`
- `REQ-013 dismisses the intro with Enter`
- `REQ-013 keeps the black-hole code`
- `REQ-013 skips to the still state when reduced motion is set`

That the mark's entrance reads clearly at 390 and at 1440 is a browser check. Jest in this requirement does not prove the pixels.

## Open questions

These stay open and do not block this requirement:

- Every item in [open-questions.md](../open-questions.md).

## Dependencies

- [REQ-002](REQ-002-intro-sequence.md). This requirement changes what plays and removes the Skip control that file required. Enter and the cookie stay.
- [REQ-009](REQ-009-home-and-intro-links.md). The wordmark still replays this intro.
- The intro keyframes in the Tailwind entry. They stay.
