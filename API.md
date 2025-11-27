# Public APIs

## Hooks
- `useThreeScene(options)` – Sets up Three.js renderer, returns refs and helpers to sync bricks and attach transform controls.
- `useAppDispatch` / `useAppSelector` – Typed Redux helpers.

## Services
- `pdfService.extractPages(file)` – Validates and rasterizes PDF pages to canvases.
- `pdfService.processImage(canvas)` – Enhances page contrast.
- `mlService.detectBricks(canvas)` – Runs COCO-SSD to infer brick suggestions.
- `storageService.saveAutosave(project)` / `loadAutosave()` – Persist/load from localStorage.
- `exportJson(project)` – Download `.lego.json` export.

## Redux slices
- `scene` – Bricks, groups, camera, lighting.
- `project` – Metadata and source model info.
- `ui` – Active tool, grid snapping, status.
- `pdf` – PDF import progress.
- `history` – Undo/redo stacks.
