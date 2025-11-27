import { BrickInstance } from '../types';

export const intersects = (a: BrickInstance, b: BrickInstance) => {
  const sizeA = a.scale;
  const sizeB = b.scale;
  return (
    Math.abs(a.position.x - b.position.x) * 2 < sizeA.x + sizeB.x &&
    Math.abs(a.position.y - b.position.y) * 2 < sizeA.y + sizeB.y &&
    Math.abs(a.position.z - b.position.z) * 2 < sizeA.z + sizeB.z
  );
};

export const hasCollision = (candidate: BrickInstance, bricks: BrickInstance[]) =>
  bricks.some((brick) => brick.id !== candidate.id && intersects(candidate, brick));
