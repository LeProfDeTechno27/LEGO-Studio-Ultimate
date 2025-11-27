import { useAppSelector } from '../hooks/useAppSelector';

const colors = ['#F2F3F2', '#C4281B', '#F5CD2F', '#0D69AB', '#237841', '#923978', '#FF6D8D'];

export const Palette = () => {
  const count = useAppSelector((state) => state.scene.bricks.length);
  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Palette</span>
        <span className="text-xs opacity-70">{count} bricks</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <div key={color} className="w-6 h-6 rounded" style={{ background: color }} aria-label={`Color ${color}`} />
        ))}
      </div>
    </div>
  );
};
