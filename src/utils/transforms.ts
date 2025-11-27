import { BrickInstance } from '../types';

export const updatePosition = (brick: BrickInstance, delta: { x?: number; y?: number; z?: number }) => ({
  ...brick,
  position: {
    x: brick.position.x + (delta.x ?? 0),
    y: brick.position.y + (delta.y ?? 0),
    z: brick.position.z + (delta.z ?? 0),
  },
});

export const updateRotation = (brick: BrickInstance, delta: { x?: number; y?: number; z?: number }) => ({
  ...brick,
  rotation: {
    x: brick.rotation.x + (delta.x ?? 0),
    y: brick.rotation.y + (delta.y ?? 0),
    z: brick.rotation.z + (delta.z ?? 0),
  },
});

export const updateScale = (brick: BrickInstance, factor: { x?: number; y?: number; z?: number }) => ({
  ...brick,
  scale: {
    x: brick.scale.x * (factor.x ?? 1),
    y: brick.scale.y * (factor.y ?? 1),
    z: brick.scale.z * (factor.z ?? 1),
  },
});
