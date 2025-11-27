import { Vector3 } from '../types';

export const snapToGrid = (value: number, step = 1) => Math.round(value / step) * step;

export const snapVector = (vector: Vector3, step = 1): Vector3 => ({
  x: snapToGrid(vector.x, step),
  y: snapToGrid(vector.y, step),
  z: snapToGrid(vector.z, step),
});
