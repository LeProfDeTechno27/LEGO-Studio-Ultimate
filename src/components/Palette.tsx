import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateBrick } from '../../store/slices/scene';

// Official LEGO color palette
const colors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Light Gray', hex: '#F2F3F2' },
  { name: 'Red', hex: '#C4281B' },
  { name: 'Yellow', hex: '#F5CD2F' },
  { name: 'Blue', hex: '#0D69AB' },
  { name: 'Green', hex: '#237841' },
  { name: 'Magenta', hex: '#923978' },
  { name: 'Pink', hex: '#FF6D8D' },
  { name: 'Gray', hex: '#A0A5A9' },
  { name: 'Dark Gray', hex: '#6D6E5C' },
  { name: 'Dark Red', hex: '#B40000' },
  { name: 'Orange', hex: '#E16E1A' },
  { name: 'Bright Yellow', hex: '#F9BA00' },
  { name: 'Lime', hex: '#4C9135' },
  { name: 'Dark Green', hex: '#0F2A2A' },
  { name: 'Dark Blue', hex: '#1B2A34' },
];

export const Palette = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.scene.bricks.length);
  const selection = useAppSelector((state) => state.selection.brickIds);
  const bricks = useAppSelector((state) => state.scene.bricks);
  const [selectedColor, setSelectedColor] = useState(colors[0].hex);

  const handleColorClick = (hex: string) => {
    setSelectedColor(hex);
    // Apply to selected bricks
    if (selection.length > 0) {
      selection.forEach((brickId) => {
        const brick = bricks.find((b) => b.id === brickId);
        if (brick) {
          dispatch(updateBrick({ ...brick, color: hex }));
        }
      });
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Colors</span>
        <span className="text-xs opacity-70">{count} bricks</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {colors.map(({ name, hex }) => (
          <button
            key={hex}
            onClick={() => handleColorClick(hex)}
            className={`w-full h-8 rounded border-2 transition ${selectedColor === hex ? 'border-white' : 'border-transparent'}`}
            style={{ background: hex }}
            aria-label={`Color ${name}`}
            title={name}
          />
        ))}
      </div>
      {selection.length > 0 && (
        <div className="text-xs opacity-70 mt-2">Click a color to apply to {selection.length} selected brick(s)</div>
      )}
    </div>
  );
};
