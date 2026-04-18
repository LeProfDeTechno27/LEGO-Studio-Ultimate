import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useThreeScene } from '../hooks/useThreeScene';
import { setSelection } from '../../store/slices/selection';
import { addBrick, removeBrick, updateBrick } from '../../store/slices/scene';
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

  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;

  const handleSelect = useCallback(
    (id: string | null) => {
      // Delete tool: clicking a brick removes it instead of selecting.
      // Clicking empty space clears selection as usual.
      if (id && activeToolRef.current === 'delete') {
        dispatch(removeBrick(id));
        dispatch(setSelection([]));
        return;
      }
      dispatch(setSelection(id ? [id] : []));
    },
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

  // Latest tool / dropdown / snap state for the placement callback (which
  // lives inside useThreeScene's stable mount effect and can't close over
  // fresh Redux state directly).
  const gridSnapRef = useRef(gridSnap);
  gridSnapRef.current = gridSnap;
  const selectedBrickTypeRef = useRef(selectedBrickType);
  selectedBrickTypeRef.current = selectedBrickType;

  const handlePlace = useCallback(
    (world: Vector3) => {
      if (activeToolRef.current !== 'build') return;
      const brickDef =
        brickLibrary.find((b) => b.id === selectedBrickTypeRef.current) || brickLibrary[0];
      // Scene-space dimensions: x = length, y = vertical height, z = width.
      // brickLibrary.size encodes {x: length, y: width, z: height}, so we
      // swizzle to match Three.js's y-up convention.
      const scale = {
        x: brickDef.size.x,
        y: brickDef.size.z,
        z: brickDef.size.y,
      };
      // Rest on the ground plane: center Y = half the brick's height.
      // Previously this was hard-coded to 0.5, which made plates (h=0.33)
      // float and tall pieces (cones h=1.5) clip below the grid.
      const raw: Vector3 = { x: world.x, y: scale.y / 2, z: world.z };
      // Grid snap only applies to the horizontal plane; Y is driven by the
      // brick's intrinsic height so snapping it to 0.5 would re-introduce
      // the float/clip bug for non-unit-height pieces.
      const position = gridSnapRef.current
        ? { ...snapVector(raw, 0.5), y: raw.y }
        : raw;
      dispatch(
        addBrick({
          id: uuid(),
          type: brickDef.id,
          color: defaultColor,
          position,
          rotation: { x: 0, y: 0, z: 0 },
          scale,
          locked: false,
          visible: true,
        })
      );
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
  } = useThreeScene({
    onSelect: handleSelect,
    onTransformEnd: handleTransformEnd,
    onPlace: handlePlace,
  });

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

  // Placement is now handled by useThreeScene's pointerup callback
  // (onPlace). It raycasts against a ground plane so the click lands on
  // the grid at any camera angle, skips gizmo handles, and skips clicks
  // that already hit an existing brick (so selecting a brick no longer
  // double-places).

  // Keep a reference to sceneRef / rendererRef in the closure so TS is
  // happy; no-op otherwise.
  void sceneRef;
  void rendererRef;

  return <div ref={containerRef} className="w-full h-full min-h-[480px] bg-black" />;
};
