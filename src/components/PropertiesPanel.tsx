import { useAppSelector } from '../hooks/useAppSelector';

export const PropertiesPanel = () => {
  const selection = useAppSelector((state) => state.selection.brickIds);
  const brick = useAppSelector((state) => state.scene.bricks.find((b) => b.id === selection[0]));
  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="font-semibold text-sm">Properties</div>
      {brick ? (
        <div className="text-xs space-y-1">
          <div>ID: {brick.id}</div>
          <div>Type: {brick.type}</div>
          <div>Color: {brick.color}</div>
          <div>
            Position: {brick.position.x.toFixed(1)}, {brick.position.y.toFixed(1)}, {brick.position.z.toFixed(1)}
          </div>
        </div>
      ) : (
        <div className="text-xs opacity-70">Select a brick to view details.</div>
      )}
    </div>
  );
};
