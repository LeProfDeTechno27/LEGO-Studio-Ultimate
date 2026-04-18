import { useMemo, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setActiveTool, setSelectedBrickType } from '../../store/slices/ui';
import { brickCategories, brickLibrary } from '../services/brickLibrary';
import type { BrickCategory, BrickDefinition } from '../types';

type CategoryFilter = 'all' | BrickCategory;

/**
 * Replaces the cramped `<select>` dropdown previously in `Toolbar.tsx`.
 * Shows a searchable, category-filterable grid of all pieces in the library
 * so the user can visually pick parts from a 100+ brick catalog.
 *
 * Selecting a brick card automatically also switches the active tool to
 * `build` — matching the typical expectation that picking a part in a
 * CAD palette means "I want to place this next."
 */
export const BricksPanel = () => {
  const dispatch = useAppDispatch();
  const selectedBrickType = useAppSelector((state) => state.ui.selectedBrickType);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brickLibrary.filter((b) => {
      if (category !== 'all' && b.category !== category) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.subcategory ?? '').toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, BrickDefinition[]>();
    filtered.forEach((b) => {
      const key = b.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const handlePick = (id: string) => {
    dispatch(setSelectedBrickType(id));
    dispatch(setActiveTool('build'));
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: brickLibrary.length };
    brickCategories.forEach((cat) => {
      c[cat.id] = brickLibrary.filter((b) => b.category === cat.id).length;
    });
    return c;
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-3 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">Bricks</div>
        <div className="text-[10px] opacity-60 tabular-nums">
          {filtered.length} / {brickLibrary.length}
        </div>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search parts…"
        className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none rounded px-2 py-1 text-xs"
        aria-label="Search brick library"
      />

      <div className="flex flex-wrap gap-1">
        <CategoryChip
          active={category === 'all'}
          onClick={() => setCategory('all')}
          label="All"
          count={counts.all}
        />
        {brickCategories.map((cat) => (
          <CategoryChip
            key={cat.id}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
            label={cat.label}
            count={counts[cat.id] ?? 0}
          />
        ))}
      </div>

      <div className="overflow-y-auto max-h-[420px] pr-1 space-y-3">
        {grouped.length === 0 && (
          <div className="text-xs opacity-60 text-center py-6">No parts match “{query}”.</div>
        )}
        {grouped.map(([catId, bricks]) => (
          <div key={catId} className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider opacity-50">
              {brickCategories.find((c) => c.id === catId)?.label ?? catId}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {bricks.map((brick) => (
                <BrickCard
                  key={brick.id}
                  brick={brick}
                  active={brick.id === selectedBrickType}
                  onClick={() => handlePick(brick.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryChip = ({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) => (
  <button
    onClick={onClick}
    className={`text-[10px] px-1.5 py-0.5 rounded-full border transition ${
      active
        ? 'bg-sky-600 border-sky-400 text-white'
        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
    }`}
  >
    {label}
    <span className="ml-1 opacity-60 tabular-nums">{count}</span>
  </button>
);

const BrickCard = ({
  brick,
  active,
  onClick,
}: {
  brick: BrickDefinition;
  active: boolean;
  onClick: () => void;
}) => {
  const { x, y, z } = brick.size;
  return (
    <button
      onClick={onClick}
      title={`${brick.name}\n${brick.id}\n${x}×${y} (h ${z.toFixed(2)})`}
      className={`text-left rounded border px-1.5 py-1 transition group ${
        active
          ? 'bg-sky-700/40 border-sky-400'
          : 'bg-slate-900 border-slate-700 hover:border-slate-500'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <BrickThumbnail brick={brick} active={active} />
        <div className="min-w-0">
          <div className="text-[10px] font-medium truncate">{brick.name}</div>
          <div className="text-[9px] opacity-50 tabular-nums">
            {x}×{y} · h {z.toFixed(2)}
          </div>
        </div>
      </div>
    </button>
  );
};

/**
 * Compact 2D "footprint" preview of the brick — top-down rectangle scaled
 * to the piece's width/length, colored by category.
 */
const BrickThumbnail = ({ brick, active }: { brick: BrickDefinition; active: boolean }) => {
  const max = Math.max(brick.size.x, brick.size.y, 1);
  // Cap preview box to ~22x22 px.
  const w = Math.max(4, Math.round((brick.size.x / max) * 22));
  const h = Math.max(4, Math.round((brick.size.y / max) * 22));
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: 24, height: 24 }}
      aria-hidden="true"
    >
      <div
        className={`rounded-sm ${CATEGORY_COLORS[brick.category] ?? 'bg-slate-500'} ${
          active ? 'ring-1 ring-sky-300' : ''
        }`}
        style={{ width: w, height: h }}
      />
    </div>
  );
};

const CATEGORY_COLORS: Record<BrickCategory, string> = {
  brick: 'bg-rose-400',
  plate: 'bg-amber-400',
  tile: 'bg-emerald-400',
  slope: 'bg-violet-400',
  round: 'bg-cyan-400',
  special: 'bg-pink-400',
  technic: 'bg-lime-400',
  minifig: 'bg-orange-400',
  accessory: 'bg-teal-400',
};
