import { describe, it, expect } from 'vitest';
import { hasCollision } from '../../../src/utils/collision';
import { BrickInstance } from '../../../src/types';

const base: BrickInstance = {
  id: 'a',
  type: '1x1-brick',
  color: '#fff',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  locked: false,
  visible: true,
};

describe('collision detection', () => {
  it('detects overlap', () => {
    const b: BrickInstance = { ...base, id: 'b', position: { x: 0.4, y: 0, z: 0 } };
    expect(hasCollision(base, [base, b])).toBe(true);
  });
  it('ignores separated bricks', () => {
    const b: BrickInstance = { ...base, id: 'b', position: { x: 5, y: 0, z: 0 } };
    expect(hasCollision(base, [base, b])).toBe(false);
  });
});
