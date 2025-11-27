import { describe, it, expect } from 'vitest';
import { snapToGrid } from '../../../src/utils/grid';

describe('grid snapping', () => {
  it('rounds to nearest step', () => {
    expect(snapToGrid(1.2, 1)).toBe(1);
    expect(snapToGrid(1.6, 1)).toBe(2);
  });
});
