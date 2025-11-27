import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useThreeScene } from '../hooks/useThreeScene';
import { setSelection } from '../../store/slices/selection';
import { addBrick, updateBrick } from '../../store/slices/scene';
import { brickLibrary, defaultColor } from '../services/brickLibrary';
import { uuid } from '../utils/uuid';
import { snapVector } from '../utils/grid';

export const Canvas3D = () => {
  const dispatch = useAppDispatch();
  const bricks = useAppSelector((state) => state.scene.bricks);
  const gridSnap = useAppSelector((state) => state.ui.gridSnap);
  const activeTool = useAppSelector((state) => state.ui.activeTool);
  const selectedBrickType = useAppSelector((state) => state.ui.selectedBrickType);
  const selection = useAppSelector((state) => state.selection.brickIds);
  const { containerRef, rendererRef, sceneRef, attachTransform, syncBricks } = useThreeScene({
    onSelect: (id) => dispatch(setSelection(id ? [id] : [])),
  });

  useEffect(() => {
    syncBricks(bricks);
    attachTransform(selection[0] ?? null);
  }, [bricks, selection, syncBricks, attachTransform]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const handler = (event: MouseEvent) => {
      if (activeTool !== 'build') return;

      // Find the brick definition
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
    // Changed from 'dblclick' to 'click' for easier brick placement
    renderer.domElement.addEventListener('click', handler);
    return () => renderer.domElement.removeEventListener('click', handler);
  }, [rendererRef, dispatch, gridSnap, activeTool, selectedBrickType]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const transform = selection[0];
    if (!transform) return;
    const mesh = sceneRef.current.getObjectByName(transform);
    if (!mesh) return;
    const interval = setInterval(() => {
      const meshObj = sceneRef.current.getObjectByName(transform);
      if (!meshObj) return;
      dispatch(
        updateBrick({
          ...bricks.find((b) => b.id === transform)!,
          position: meshObj.position,
          rotation: meshObj.rotation,
        } as any)
      );
    }, 300);
    return () => clearInterval(interval);
  }, [selection, rendererRef, sceneRef, dispatch, bricks]);

  return <div ref={containerRef} className="w-full h-[70vh] rounded-lg overflow-hidden bg-black" />;
};
