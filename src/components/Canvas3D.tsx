import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useThreeScene } from '../hooks/useThreeScene';
import { setSelection } from '../../store/slices/selection';
import { addBrick, updateBrick } from '../../store/slices/scene';
import { brickLibrary, defaultColor } from '../services/brickLibrary';
import { uuid } from '../utils/uuid';
import { snapVector } from '../utils/grid';
import { BrickInstance, Vector3 } from '../types';

type Tool = 'build' | 'delete' | 'rotate' | 'move' | 'scale' | 'custom';

const TOOL_TO_TRANSFORM_MODE: Partial<Record<Tool, 'translate' | 'rotate' | 'scale'>> = {
  move: 'translate',
  rotate: 'rotate',
  scale: 'scale',
};

export const Canvas3D = () => {
  const dispatch = useAppDispatch();
  const bricks = useAppSelector((state) => state.scene.bricks);
  const gridSnap = useAppSelector((state) => state.ui.gridSnap);
  const activeTool = useAppSelector((state) => state.ui.activeTool);
  const selectedBrickType = useAppSelector((state) => state.ui.selectedBrickType);
  const selection = useAppSelector((state) => state.selection.brickIds);

  // bricks via ref so the transform-end callback can read the latest state
  // without forcing the callback identity to change on every dispatch.
  const bricksRef = useRef(bricks);
  bricksRef.current = bricks;

  const handleSelect = useCallback(
    (id: string | null) => dispatch(setSelection(id ? [id] : [])),
    [dispatch]
  );

  const handleTransformEnd = useCallback(
    (id: string, t: { position: Vector3; rotation: Vector3; scale: Vector3 }) => {
      const existing = bricksRef.current.find((b) => b.id === id);
      if (!existing) return;
      // Gizmo scale is a multiplier on the mesh's current local scale. The
      // geometry already encodes the brick's dimensions, so fold the factor
      // into the persisted scale and let syncBricks rebuild the box + reset
      // mesh.scale back to 1 on the next sync.
      const next: BrickInstance = {
        ...existing,
        position: t.position,
        rotation: t.rotation,
        scale: {
          x: existing.scale.x * t.scale.x,
          y: existing.scale.y * t.scale.y,
          z: existing.scale.z * t.scale.z,
        },
      };
      dispatch(updateBrick(next));
    },
    [dispatch]
  );

  const {
    containerRef,
    rendererRef,
    sceneRef,
    syncBricks,
    attachTransform,
    setTransformMode,
  } = useThreeScene({ onSelect: handleSelect, onTransformEnd: handleTransformEnd });

  // Keep Three.js in sync with Redux.
  useEffect(() => {
    syncBricks(bricks);
    attachTransform(selection[0] ?? null);
  }, [bricks, selection, syncBricks, attachTransform]);

  // Flip the gizmo between translate / rotate / scale based on the tool.
  useEffect(() => {
    const mode = TOOL_TO_TRANSFORM_MODE[activeTool as Tool];
    if (mode) setTransformMode(mode);
  }, [activeTool, setTransformMode]);

  // Single-click placement with the current brick type and grid snap.
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const handler = (event: MouseEvent) => {
      if (activeTool !== 'build') return;

      const brickDef = brickLibrary.find((b) => b.id === selectedBrickType) || brickLibrary[0];

      const bounds = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 50;
      const z = ((event.clientY - bounds.top) / bounds.height - 0.5) * 50;
      const position = gridSnap ? snapVector({ x, y: 0.5, z }, 0.5) : { x, y: 0.5, z };

      dispatch(
        addBrick({
          id: uuid(),
          type: brickDef.id,
          color: defaultColor,
          position,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: brickDef.size.x, y: brickDef.size.z, z: brickDef.size.y },
          locked: false,
          visible: true,
        })
      );
    };
    renderer.domElement.addEventListener('click', handler);
    return () => renderer.domElement.removeEventListener('click', handler);
  }, [rendererRef, dispatch, gridSnap, activeTool, selectedBrickType]);

  // Keep a reference to sceneRef in the closure so TS is happy; no-op otherwise.
  void sceneRef;

  return <div ref={containerRef} className="w-full h-[70vh] rounded-lg overflow-hidden bg-black" />;
};
