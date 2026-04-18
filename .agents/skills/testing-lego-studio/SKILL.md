# Testing the LEGO Studio editor

A Vite + React + Three.js editor. When testing, always prefer the **production preview** (`npm run preview -- --host --port 5174`) over `npm run dev`, because a couple of past bugs (canvas stacking, frozen-state crash) behaved differently between dev and prod.

## Quick start

```bash
cd /home/ubuntu/repos/LEGO-Studio-Ultimate
npm install           # only if node_modules is missing
npm run build
npm run preview -- --host --port 5174
```

Open http://localhost:5174 in Chrome. Clear `localStorage` (`localStorage.clear(); location.reload()`) between test runs so the status-bar brick count starts at `0`.

## High-signal runtime signals

For every test, assert against these concrete DOM / console values rather than vibes:

- Status bar text (bottom of canvas): `N bricks · M selected · save HH:MM:SS`. Use it to verify placement / delete / undo.
- `Next: <part name>` floating hint (top-left of canvas) tells you which part the Build tool will drop.
- Properties panel header shows the selected brick's `Type` and **editable** `<input type="number">` rows for `Position` (x/y/z), `Rotation (°)` (x/y/z), and `Scale` (x/y/z). Type-and-Tab in these inputs is the fastest way to exercise move / rotate / scale without fighting the gizmo.
- `document.querySelectorAll('canvas').length` must stay `=== 1` throughout a session (PR #5 canvas-stacking regression).
- Console should stay clean — watch specifically for `TypeError: Cannot assign to read only property 'x'` (Immer-frozen Vector3 on select).

## Bricks panel (PR #6)

- Count pill shape: `N / M` where `M` is the full library size (200 as of PR #6). Filtering changes `N`.
- Category chips: `All / Bricks / Plates / Tiles / Slopes / Round / Special / Technic / Minifig / Accessory`. Clicking a chip narrows to that category; `All` resets.
- Search box is case-insensitive and matches `name`, `id`, and `subcategory`. Typing `slope` should drop the count dramatically (≈ 19/200) and show only the Slopes group.
- Clicking a part card auto-switches the active tool to `Build` — a common gotcha when chaining tests: don't assume Build is still active after you tested Delete/Move/Rotate/Scale; re-pick a card (or press `B`).

## Placement / ground-rest (PR #5 fix)

Placement Y is computed as `scale.y / 2`, so:

| Part height | Expected Position Y |
|---|---|
| Standard brick (1.00) | 0.50 |
| Plate / Tile (0.33) | 0.17 |
| Cone (1.50) | 0.75 |
| 2-stud cylinder (2.00) | 1.00 |

Use a Tile 2x4 or Plate 1x1 to assert the `0.17` case — this is the fastest way to confirm the ground-rest fix didn't regress.

## Transforms

There are two ways to move/rotate/scale. When the primary thing under test is the new Properties UI, drive transforms through the numeric inputs:

- Triple-click the input to select its current value, `type` the new value, press `Tab` to commit.
- The 3D viewport updates on commit (blur), not keystroke.
- The gizmo flow (Move / Rotate / Scale toolbar buttons + drag) is still the only way to exercise `TransformControls` — keep at least one gizmo-drag in the recording when a PR touches `useThreeScene` / `Canvas3D`.

## Undo/Redo expectations

`Ctrl+Z` is granular — each property edit is its own history entry, not just placement. If you need to unplace a brick after several tweaks, expect several Ctrl+Z presses (one per mutation), not one.

The status-bar brick count is the ground truth for "did undo work" — don't rely on the Undo button's disabled state alone (it's based on stack depth, not on whether a specific action was reverted).

## Common gotchas

- Typing into the `search` / Properties inputs while a keyboard shortcut listener is global: the editor guards editable elements, but if a shortcut misbehaves during typing, it's a regression in `useKeyboardShortcuts`.
- `record_annotate` actions `setup / test_start / assertion` slow down the video at those points; always end a `test_start` with a matching `assertion` (`passed|failed|untested`).
- Before recording, maximize the window with `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`; the Super+Up shortcut only half-tiles on this WM.
- The editor has two `<header>` elements (legacy `LEGO 3D Editor` banner + new `LEGO Studio Ultimate` header). Don't rely on querying `header` — target the `LEGO Studio Ultimate` text or the `200 official parts` line for the PR #6 header.

## Devin secrets needed

None. Everything is localhost + filesystem.
