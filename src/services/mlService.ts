import * as coco from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { BrickInstance } from '../types';
import { matchColor } from '../utils/color';
import { snapVector } from '../utils/grid';
import { uuid } from '../utils/uuid';
import { defaultColor } from './brickLibrary';

let modelPromise: Promise<coco.ObjectDetection> | null = null;

const mapToGrid = (bbox: [number, number, number, number]) => {
  const [x, y, width, height] = bbox;
  const base = snapVector({ x: x / 50, y: 0, z: y / 50 }, 0.5);
  return { position: base, size: { x: width / 50, y: 1, z: height / 50 } };
};

export const mlService = {
  loadModel: async () => {
    if (!modelPromise) modelPromise = coco.load();
    return modelPromise;
  },
  detectBricks: async (canvas: HTMLCanvasElement) => {
    const model = await mlService.loadModel();
    const predictions = await model.detect(canvas, 6);
    const bricks: BrickInstance[] = predictions.map((pred) => {
      const mapping = mapToGrid(pred.bbox as [number, number, number, number]);
      return {
        id: uuid(),
        type: '1x2-brick',
        color: matchColor(defaultColor),
        position: mapping.position,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: mapping.size.x, y: 1, z: mapping.size.z },
        locked: false,
        visible: true,
      };
    });
    return bricks;
  },
};
