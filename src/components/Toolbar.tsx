import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setActiveTool, toggleGridSnap, setSelectedBrickType } from '../../store/slices/ui';
import { brickLibrary } from '../services/brickLibrary';

const tools: { id: 'build' | 'delete' | 'rotate' | 'move' | 'scale' | 'custom'; label: string; shortcut: string }[] = [
  { id: 'build', label: 'Build', shortcut: 'B' },
  { id: 'delete', label: 'Delete', shortcut: 'D' },
  { id: 'rotate', label: 'Rotate', shortcut: 'R' },
  { id: 'move', label: 'Move', shortcut: 'M' },
  { id: 'scale', label: 'Scale', shortcut: 'S' },
  { id: 'custom', label: 'Custom', shortcut: '' },
];

export const Toolbar = () => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.ui.activeTool);
  const gridSnap = useAppSelector((state) => state.ui.gridSnap);
  const selectedBrickType = useAppSelector((state) => state.ui.selectedBrickType);

  // Group bricks by category
  const bricksByCategory = brickLibrary.reduce((acc, brick) => {
    if (!acc[brick.category]) acc[brick.category] = [];
    acc[brick.category].push(brick);
    return acc;
  }, {} as Record<string, typeof brickLibrary>);

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-3">
      <div className="font-semibold text-sm">Tools</div>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => dispatch(setActiveTool(tool.id))}
            className={`rounded px-2 py-1 text-xs border ${active === tool.id ? 'bg-sky-600 border-sky-400' : 'bg-slate-900 border-slate-700'}`}
            aria-label={`Select ${tool.label} tool`}
            title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold opacity-70">Brick Type</div>
        <select
          value={selectedBrickType}
          onChange={(e) => dispatch(setSelectedBrickType(e.target.value))}
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
        >
          {Object.entries(bricksByCategory).map(([category, bricks]) => (
            <optgroup key={category} label={category.toUpperCase()}>
              {bricks.map((brick) => (
                <option key={brick.id} value={brick.id}>
                  {brick.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <button
        className="w-full text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-700 transition"
        onClick={() => dispatch(toggleGridSnap())}
      >
        Grid Snap: {gridSnap ? '✓ On' : '✗ Off'}
      </button>
    </div>
  );
};
