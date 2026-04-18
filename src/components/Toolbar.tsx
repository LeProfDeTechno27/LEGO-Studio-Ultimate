import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setActiveTool, toggleGridSnap } from '../../store/slices/ui';

type ToolId = 'build' | 'delete' | 'move' | 'rotate' | 'scale' | 'custom';

const tools: {
  id: ToolId;
  label: string;
  shortcut: string;
  icon: JSX.Element;
}[] = [
  { id: 'build', label: 'Build', shortcut: 'B', icon: <BuildIcon /> },
  { id: 'delete', label: 'Delete', shortcut: 'D', icon: <DeleteIcon /> },
  { id: 'move', label: 'Move', shortcut: 'M', icon: <MoveIcon /> },
  { id: 'rotate', label: 'Rotate', shortcut: 'R', icon: <RotateIcon /> },
  { id: 'scale', label: 'Scale', shortcut: 'S', icon: <ScaleIcon /> },
  { id: 'custom', label: 'Custom', shortcut: '', icon: <CustomIcon /> },
];

export const Toolbar = () => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.ui.activeTool);
  const gridSnap = useAppSelector((state) => state.ui.gridSnap);

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-3">
      <div className="font-semibold text-sm">Tools</div>
      <div className="grid grid-cols-3 gap-1.5">
        {tools.map((tool) => {
          const isActive = active === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => dispatch(setActiveTool(tool.id))}
              className={`flex flex-col items-center justify-center gap-0.5 rounded py-1.5 border transition ${
                isActive
                  ? 'bg-sky-600 border-sky-400 text-white shadow-inner shadow-black/20'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
              aria-label={`${tool.label} tool`}
              aria-pressed={isActive}
              title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
            >
              <span className="h-4 w-4">{tool.icon}</span>
              <span className="text-[10px] leading-none">{tool.label}</span>
            </button>
          );
        })}
      </div>

      <button
        className={`w-full text-xs px-2 py-1 rounded border transition flex items-center justify-between ${
          gridSnap
            ? 'bg-emerald-700/40 border-emerald-500 text-emerald-100'
            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
        }`}
        onClick={() => dispatch(toggleGridSnap())}
        title="Toggle grid snap (G)"
      >
        <span className="flex items-center gap-1.5">
          <GridIcon />
          Grid Snap
        </span>
        <span className="text-[10px] tabular-nums">{gridSnap ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  );
};

// ─── Icons (inline SVG, 16x16) ──────────────────────────────────────────────
function BuildIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="12" height="7" rx="1" />
      <circle cx="5" cy="4" r="1" />
      <circle cx="8" cy="4" r="1" />
      <circle cx="11" cy="4" r="1" />
    </svg>
  );
}
function DeleteIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h10" />
      <path d="M5 4V2h6v2" />
      <path d="M4 4l1 10h6l1-10" />
    </svg>
  );
}
function MoveIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v12M2 8h12M8 2l-2 2M8 2l2 2M8 14l-2-2M8 14l2-2M2 8l2-2M2 8l2 2M14 8l-2-2M14 8l-2 2" />
    </svg>
  );
}
function RotateIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a5 5 0 1 1 1.5 3.5" />
      <path d="M3 11V8h3" />
    </svg>
  );
}
function ScaleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L13 3" />
      <path d="M3 13V8M3 13h5" />
      <path d="M13 3v5M13 3h-5" />
    </svg>
  );
}
function CustomIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4M8 10v4M2 8h4M10 8h4" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 6h12M2 10h12M6 2v12M10 2v12" />
    </svg>
  );
}
