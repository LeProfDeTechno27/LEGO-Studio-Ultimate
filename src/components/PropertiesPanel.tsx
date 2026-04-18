import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { removeBrick, updateBrick } from '../../store/slices/scene';
import { setSelection } from '../../store/slices/selection';
import { brickLibrary } from '../services/brickLibrary';
import { BrickInstance } from '../types';

/**
 * Properties panel with editable numeric inputs for Position / Rotation /
 * Scale, a human-readable brick type label, and visibility / lock / delete
 * controls. Replaces the previous read-only rows so the user can type in
 * precise values alongside the transform gizmo.
 */
export const PropertiesPanel = () => {
  const dispatch = useAppDispatch();
  const selection = useAppSelector((state) => state.selection.brickIds);
  const brick = useAppSelector((state) => state.scene.bricks.find((b) => b.id === selection[0]));
  const group = useAppSelector((state) => state.scene.groups.find((g) => g.id === brick?.groupId));

  const brickDef = brick ? brickLibrary.find((b) => b.id === brick.type) : undefined;

  const patch = (next: Partial<BrickInstance>) => {
    if (!brick) return;
    dispatch(updateBrick({ ...brick, ...next }));
  };

  const onDelete = () => {
    if (!brick) return;
    dispatch(removeBrick(brick.id));
    dispatch(setSelection([]));
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">Properties</div>
        {brick && (
          <div className="text-[10px] opacity-60 tabular-nums truncate max-w-[120px]" title={brick.id}>
            {brick.id.slice(0, 8)}…
          </div>
        )}
      </div>

      {selection.length > 1 ? (
        <div className="text-xs space-y-2">
          <div className="opacity-70">{selection.length} bricks selected</div>
          <div className="text-[11px] opacity-60">
            Use the color palette to change the color of all selected bricks.
          </div>
        </div>
      ) : brick ? (
        <div className="text-xs space-y-3">
          <Field label="Type">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm border border-white/20" style={{ background: brick.color }} />
              <span className="truncate">{brickDef?.name ?? brick.type}</span>
            </div>
          </Field>

          <Vector3Editor
            label="Position"
            value={brick.position}
            onChange={(v) => patch({ position: v })}
            step={0.5}
          />
          <Vector3Editor
            label="Rotation (°)"
            value={{
              x: radToDeg(brick.rotation.x),
              y: radToDeg(brick.rotation.y),
              z: radToDeg(brick.rotation.z),
            }}
            onChange={(v) =>
              patch({
                rotation: {
                  x: degToRad(v.x),
                  y: degToRad(v.y),
                  z: degToRad(v.z),
                },
              })
            }
            step={15}
          />
          <Vector3Editor
            label="Scale"
            value={brick.scale}
            onChange={(v) => patch({ scale: v })}
            step={0.25}
            min={0.1}
          />

          {group && (
            <Field label="Group">
              <div className="truncate">{group.name}</div>
            </Field>
          )}

          <div className="flex gap-1.5 pt-1">
            <ToggleButton
              active={brick.visible}
              onClick={() => patch({ visible: !brick.visible })}
              activeLabel="Visible"
              inactiveLabel="Hidden"
              activeClass="bg-emerald-600"
            />
            <ToggleButton
              active={brick.locked}
              onClick={() => patch({ locked: !brick.locked })}
              activeLabel="Locked"
              inactiveLabel="Unlocked"
              activeClass="bg-red-600"
            />
            <button
              onClick={onDelete}
              className="px-2 py-1 rounded text-xs bg-slate-700 hover:bg-red-600 transition ml-auto"
              title="Delete brick (Delete key)"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs opacity-70">Select a brick to view and edit its properties.</div>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="text-[10px] uppercase tracking-wider opacity-50">{label}</div>
    {children}
  </div>
);

const Vector3Editor = ({
  label,
  value,
  onChange,
  step = 1,
  min,
}: {
  label: string;
  value: { x: number; y: number; z: number };
  onChange: (v: { x: number; y: number; z: number }) => void;
  step?: number;
  min?: number;
}) => {
  const set = (axis: 'x' | 'y' | 'z') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    if (!Number.isFinite(n)) return;
    onChange({ ...value, [axis]: n });
  };
  return (
    <Field label={label}>
      <div className="grid grid-cols-3 gap-1">
        {(['x', 'y', 'z'] as const).map((axis) => (
          <label key={axis} className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
            <span className="text-[10px] opacity-60 uppercase">{axis}</span>
            <input
              type="number"
              value={Number.isFinite(value[axis]) ? Number(value[axis].toFixed(2)) : 0}
              onChange={set(axis)}
              step={step}
              min={min}
              className="w-full bg-transparent outline-none text-[11px] tabular-nums"
            />
          </label>
        ))}
      </div>
    </Field>
  );
};

const ToggleButton = ({
  active,
  onClick,
  activeLabel,
  inactiveLabel,
  activeClass,
}: {
  active: boolean;
  onClick: () => void;
  activeLabel: string;
  inactiveLabel: string;
  activeClass: string;
}) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 rounded text-xs transition ${active ? activeClass : 'bg-slate-700 hover:bg-slate-600'}`}
  >
    {active ? activeLabel : inactiveLabel}
  </button>
);

const radToDeg = (r: number) => (r * 180) / Math.PI;
const degToRad = (d: number) => (d * Math.PI) / 180;
