import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateBrick } from '../../store/slices/scene';

export const PropertiesPanel = () => {
  const dispatch = useAppDispatch();
  const selection = useAppSelector((state) => state.selection.brickIds);
  const brick = useAppSelector((state) => state.scene.bricks.find((b) => b.id === selection[0]));
  const group = useAppSelector((state) => state.scene.groups.find((g) => g.id === brick?.groupId));

  const handleToggleVisibility = () => {
    if (brick) {
      dispatch(updateBrick({ ...brick, visible: !brick.visible }));
    }
  };

  const handleToggleLock = () => {
    if (brick) {
      dispatch(updateBrick({ ...brick, locked: !brick.locked }));
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="font-semibold text-sm">Properties</div>
      {selection.length > 1 ? (
        <div className="text-xs space-y-2">
          <div className="opacity-70">{selection.length} bricks selected</div>
          <div className="text-xs">Use color palette to change color of all selected bricks</div>
        </div>
      ) : brick ? (
        <div className="text-xs space-y-2">
          <div className="space-y-1">
            <div className="font-semibold opacity-70">Type</div>
            <div>{brick.type}</div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold opacity-70">Color</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-white/20" style={{ background: brick.color }} />
              <span>{brick.color}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold opacity-70">Position</div>
            <div>
              X: {brick.position.x.toFixed(2)} | Y: {brick.position.y.toFixed(2)} | Z: {brick.position.z.toFixed(2)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold opacity-70">Rotation</div>
            <div>
              X: {((brick.rotation.x * 180) / Math.PI).toFixed(0)}° | Y: {((brick.rotation.y * 180) / Math.PI).toFixed(0)}° | Z:{' '}
              {((brick.rotation.z * 180) / Math.PI).toFixed(0)}°
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold opacity-70">Scale</div>
            <div>
              X: {brick.scale.x.toFixed(2)} | Y: {brick.scale.y.toFixed(2)} | Z: {brick.scale.z.toFixed(2)}
            </div>
          </div>
          {group && (
            <div className="space-y-1">
              <div className="font-semibold opacity-70">Group</div>
              <div>{group.name}</div>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleToggleVisibility}
              className={`px-2 py-1 rounded text-xs ${brick.visible ? 'bg-emerald-600' : 'bg-slate-700'}`}
            >
              {brick.visible ? 'Visible' : 'Hidden'}
            </button>
            <button onClick={handleToggleLock} className={`px-2 py-1 rounded text-xs ${brick.locked ? 'bg-red-600' : 'bg-slate-700'}`}>
              {brick.locked ? 'Locked' : 'Unlocked'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs opacity-70">Select a brick to view details.</div>
      )}
    </div>
  );
};
