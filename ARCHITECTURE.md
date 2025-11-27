# Architecture

The app is a Vite + React 18 + TypeScript SPA. Redux Toolkit manages editor state, with middleware persisting to `localStorage` and capturing undo history. Three.js powers the 3D canvas with orbit + transform controls. PDF import uses `pdfjs-dist` to rasterize instruction steps and TensorFlow.js COCO-SSD to suggest bricks.

## Key folders
- `src/components` – UI and layout including 3D canvas and PDF pane.
- `src/hooks` – Custom hooks such as `useThreeScene` wrapper around Three.js.
- `store` – Redux slices and middleware for scene, project metadata, PDF import, UI, history, and camera.
- `src/services` – Brick library, PDF processing, ML detection, export helpers, and storage adapter.
- `src/utils` – Color matching, grid snapping, collisions, transforms, and UUID helper.

## Rendering loop
`useThreeScene` sets up renderer, camera, grid, lighting, orbit controls, and transform controls. Bricks map to cached meshes; selection attaches transform gizmo. `Canvas3D` syncs Redux brick data into the Three.js scene and pushes interaction changes back into Redux.
