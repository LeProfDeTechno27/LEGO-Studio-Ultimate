import { describe, it, expect } from 'vitest';
import reducer, { addBrick } from '../../../store/slices/scene';
import { BrickInstance } from '../../../src/types';

const brick: BrickInstance = {
  id: '1',
  type: '1x1-brick',
  color: '#fff',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  locked: false,
  visible: true,
};

describe('scene slice', () => {
  it('adds bricks', () => {
    const state = reducer(undefined, addBrick(brick));
    expect(state.bricks).toHaveLength(1);
  });
});
