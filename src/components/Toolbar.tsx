import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setActiveTool, toggleGridSnap } from '../../store/slices/ui';

const tools: { id: 'build' | 'delete' | 'rotate' | 'move' | 'scale' | 'custom'; label: string }[] = [
  { id: 'build', label: 'Build' },
  { id: 'delete', label: 'Delete' },
  { id: 'rotate', label: 'Rotate' },
  { id: 'move', label: 'Move' },
  { id: 'scale', label: 'Scale' },
  { id: 'custom', label: 'Custom' },
];

export const Toolbar = () => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.ui.activeTool);
  const gridSnap = useAppSelector((state) => state.ui.gridSnap);

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="font-semibold text-sm">Tools</div>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => dispatch(setActiveTool(tool.id))}
            className={`rounded px-2 py-1 text-xs border ${active === tool.id ? 'bg-sky-600 border-sky-400' : 'bg-slate-900 border-slate-700'}`}
            aria-label={`Select ${tool.label} tool`}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <button
        className="text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700"
        onClick={() => dispatch(toggleGridSnap())}
      >
        Snap: {gridSnap ? 'On' : 'Off'}
      </button>
    </div>
  );
};
