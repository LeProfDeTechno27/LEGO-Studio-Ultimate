import { BrickCategory, BrickDefinition } from '../types';

/**
 * Unit conventions (matching the scene-space dimensions already used by
 * Canvas3D.tsx placement code):
 *   - size.x = length in studs
 *   - size.y = width in studs
 *   - size.z = height in "brick height" units (1 = standard brick, 0.33 = plate/tile)
 *
 * Geometry is rendered as an axis-aligned box, so these dimensions are the
 * key source of truth for placement Y (scale.y / 2), gizmo scaling, and
 * occupied grid footprint — even for shapes that would visually be rounded,
 * curved, or sloped in real life.
 *
 * ID convention: `<width>x<length>-<category>` (e.g. `1x4-brick`, `2x8-plate`).
 * This matches the IDs used by the original library (and PR #5 tests /
 * stored projects) so existing references resolve without migration.
 */

const PLATE = 0.33;
const TILE = 0.33;
const BRICK = 1;

type Def = BrickDefinition;

const def = (
  id: string,
  name: string,
  category: BrickCategory,
  size: { x: number; y: number; z: number },
  extra: Partial<BrickDefinition> = {}
): Def => ({ id, name, category, size, ...extra });

// Generator for rectangular footprints (width w, length l). `w` is always
// the smaller dimension to match the original LEGO naming convention
// (1x2-brick, not 2x1-brick).
const rect = (
  w: number,
  l: number,
  kind: 'brick' | 'plate' | 'tile',
  category: BrickCategory,
  height: number,
  subcategory: string
): Def =>
  def(
    `${w}x${l}-${kind}`,
    `${kind.charAt(0).toUpperCase()}${kind.slice(1)} ${w}x${l}`,
    category,
    { x: l, y: w, z: height },
    { subcategory }
  );

// ─────────────────────────────────────────────────────────────────────────────
// Bricks — standard full-height pieces
// ─────────────────────────────────────────────────────────────────────────────
const brick1xN: Def[] = [1, 2, 3, 4, 6, 8, 10, 12, 16].map((l) =>
  rect(1, l, 'brick', 'brick', BRICK, '1xN')
);
const brick2xN: Def[] = [2, 3, 4, 6, 8, 10].map((l) => rect(2, l, 'brick', 'brick', BRICK, '2xN'));
const brick4xN: Def[] = [4, 6, 8, 10, 12].map((l) => rect(4, l, 'brick', 'brick', BRICK, '4xN'));
const brick6xN: Def[] = [6, 8, 10, 12].map((l) => rect(6, l, 'brick', 'brick', BRICK, '6xN'));
const brickLargeSquares: Def[] = [
  [8, 8] as const,
  [10, 10] as const,
].map(([w, l]) => rect(w, l, 'brick', 'brick', BRICK, 'large'));

// ─────────────────────────────────────────────────────────────────────────────
// Plates — 1/3 brick height
// ─────────────────────────────────────────────────────────────────────────────
const plate1xN: Def[] = [1, 2, 3, 4, 6, 8, 10, 12, 16].map((l) =>
  rect(1, l, 'plate', 'plate', PLATE, '1xN')
);
const plate2xN: Def[] = [2, 3, 4, 6, 8, 10, 12, 16].map((l) =>
  rect(2, l, 'plate', 'plate', PLATE, '2xN')
);
const plate4xN: Def[] = [4, 6, 8, 10, 12].map((l) => rect(4, l, 'plate', 'plate', PLATE, '4xN'));
const plate6xN: Def[] = [6, 8, 10, 12, 14, 16].map((l) =>
  rect(6, l, 'plate', 'plate', PLATE, '6xN')
);
const plateLarge: Def[] = [
  [8, 8],
  [8, 16],
  [16, 16],
].map(([w, l]) => rect(w, l, 'plate', 'plate', PLATE, 'large'));

const baseplates: Def[] = [
  def('16x16-base', 'Baseplate 16x16', 'plate', { x: 16, y: 16, z: PLATE }, { subcategory: 'baseplate' }),
  def('32x32-base', 'Baseplate 32x32', 'plate', { x: 32, y: 32, z: PLATE }, { subcategory: 'baseplate' }),
  def('48x48-base', 'Baseplate 48x48', 'plate', { x: 48, y: 48, z: PLATE }, { subcategory: 'baseplate' }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Tiles — flat plates with no studs
// ─────────────────────────────────────────────────────────────────────────────
const tile1xN: Def[] = [1, 2, 3, 4, 6, 8].map((l) => rect(1, l, 'tile', 'tile', TILE, '1xN'));
const tile2xN: Def[] = [2, 4, 6, 8].map((l) => rect(2, l, 'tile', 'tile', TILE, '2xN'));
const tileLarge: Def[] = [
  [4, 4] as const,
  [6, 6] as const,
  [8, 8] as const,
].map(([w, l]) => rect(w, l, 'tile', 'tile', TILE, 'large'));

// ─────────────────────────────────────────────────────────────────────────────
// Slopes — angled pieces
// ─────────────────────────────────────────────────────────────────────────────
const slopes: Def[] = [
  def('slope-1x2-45', 'Slope 1x2 45°', 'slope', { x: 2, y: 1, z: BRICK }, { slope: 45, subcategory: 'slope' }),
  def('slope-2x1-45', 'Slope 2x1 45°', 'slope', { x: 2, y: 1, z: BRICK }, { slope: 45, subcategory: 'slope' }),
  def('slope-2x2-45', 'Slope 2x2 45°', 'slope', { x: 2, y: 2, z: BRICK }, { slope: 45, subcategory: 'slope' }),
  def('slope-2x3-25', 'Slope 2x3 25°', 'slope', { x: 3, y: 2, z: BRICK }, { slope: 25, subcategory: 'slope' }),
  def('slope-2x3-45', 'Slope 2x3 45°', 'slope', { x: 3, y: 2, z: BRICK }, { slope: 45, subcategory: 'slope' }),
  def('slope-2x4-45', 'Slope 2x4 45°', 'slope', { x: 4, y: 2, z: BRICK }, { slope: 45, subcategory: 'slope' }),
  def('slope-3x1-25', 'Slope 3x1 25°', 'slope', { x: 3, y: 1, z: BRICK }, { slope: 25, subcategory: 'slope' }),
  def('slope-3x1-33', 'Slope 3x1 33°', 'slope', { x: 3, y: 1, z: BRICK }, { slope: 33, subcategory: 'slope' }),
  def('slope-4x1-18', 'Slope 4x1 18°', 'slope', { x: 4, y: 1, z: BRICK }, { slope: 18, subcategory: 'slope' }),
  def('slope-6x1-10', 'Slope 6x1 10°', 'slope', { x: 6, y: 1, z: BRICK }, { slope: 10, subcategory: 'slope' }),
  def('cheese-1x1', 'Cheese Slope 1x1', 'slope', { x: 1, y: 1, z: 0.66 }, { slope: 33, subcategory: 'cheese' }),
  def('cheese-1x2', 'Cheese Slope 1x2', 'slope', { x: 2, y: 1, z: 0.66 }, { slope: 33, subcategory: 'cheese' }),
  def('wedge-2x2', 'Wedge Plate 2x2', 'slope', { x: 2, y: 2, z: PLATE }, { subcategory: 'wedge' }),
  def('wedge-3x3', 'Wedge Plate 3x3', 'slope', { x: 3, y: 3, z: PLATE }, { subcategory: 'wedge' }),
  def('wedge-4x4', 'Wedge Plate 4x4', 'slope', { x: 4, y: 4, z: PLATE }, { subcategory: 'wedge' }),
  def('slope-1x2-inv', 'Inverted Slope 1x2', 'slope', { x: 2, y: 1, z: BRICK }, { inverted: true, slope: 45, subcategory: 'inverted' }),
  def('slope-2x2-inv', 'Inverted Slope 2x2', 'slope', { x: 2, y: 2, z: BRICK }, { inverted: true, slope: 45, subcategory: 'inverted' }),
  def('slope-2x3-inv', 'Inverted Slope 2x3', 'slope', { x: 3, y: 2, z: BRICK }, { inverted: true, slope: 25, subcategory: 'inverted' }),
  def('slope-1x2-curved', 'Curved Slope 1x2', 'slope', { x: 2, y: 1, z: BRICK }, { curved: true, subcategory: 'curved' }),
  def('slope-2x2-curved', 'Curved Slope 2x2', 'slope', { x: 2, y: 2, z: BRICK }, { curved: true, subcategory: 'curved' }),
  def('slope-2x4-curved', 'Curved Slope 2x4', 'slope', { x: 4, y: 2, z: BRICK }, { curved: true, subcategory: 'curved' }),
  def('slope-1x4-curved', 'Curved Slope 1x4', 'slope', { x: 4, y: 1, z: BRICK }, { curved: true, subcategory: 'curved' }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Round & cylindrical pieces
// ─────────────────────────────────────────────────────────────────────────────
const rounds: Def[] = [
  def('round-1x1', 'Round Brick 1x1', 'round', { x: 1, y: 1, z: BRICK }, { subcategory: 'round brick' }),
  def('round-2x2', 'Round Brick 2x2', 'round', { x: 2, y: 2, z: BRICK }, { subcategory: 'round brick' }),
  def('round-2x2-corner', 'Round Corner 2x2', 'round', { x: 2, y: 2, z: BRICK }, { subcategory: 'round brick' }),
  def('round-4x4', 'Round Brick 4x4', 'round', { x: 4, y: 4, z: BRICK }, { subcategory: 'round brick' }),
  def('round-1x1-plate', 'Round Plate 1x1', 'round', { x: 1, y: 1, z: PLATE }, { subcategory: 'round plate' }),
  def('round-2x2-plate', 'Round Plate 2x2', 'round', { x: 2, y: 2, z: PLATE }, { subcategory: 'round plate' }),
  def('round-4x4-plate', 'Round Plate 4x4', 'round', { x: 4, y: 4, z: PLATE }, { subcategory: 'round plate' }),
  def('round-6x6-plate', 'Round Plate 6x6', 'round', { x: 6, y: 6, z: PLATE }, { subcategory: 'round plate' }),
  def('round-8x8-plate', 'Round Plate 8x8', 'round', { x: 8, y: 8, z: PLATE }, { subcategory: 'round plate' }),
  def('dish-2x2', 'Dish 2x2', 'round', { x: 2, y: 2, z: PLATE }, { subcategory: 'dish' }),
  def('dish-3x3', 'Dish 3x3', 'round', { x: 3, y: 3, z: PLATE }, { subcategory: 'dish' }),
  def('dish-4x4', 'Dish 4x4', 'round', { x: 4, y: 4, z: PLATE }, { subcategory: 'dish' }),
  def('dish-6x6', 'Dish 6x6', 'round', { x: 6, y: 6, z: PLATE }, { subcategory: 'dish' }),
  def('dish-8x8', 'Dish 8x8', 'round', { x: 8, y: 8, z: PLATE }, { subcategory: 'dish' }),
  def('cylinder-1x1', 'Cylinder 1x1', 'round', { x: 1, y: 1, z: 2 }, { subcategory: 'cylinder' }),
  def('cylinder-2x2', 'Cylinder 2x2', 'round', { x: 2, y: 2, z: 2 }, { subcategory: 'cylinder' }),
  def('cylinder-2x2-half', 'Half Cylinder 2x2', 'round', { x: 2, y: 1, z: 2 }, { subcategory: 'cylinder' }),
  def('cone-1x1', 'Cone 1x1', 'round', { x: 1, y: 1, z: 1.5 }, { subcategory: 'cone' }),
  def('cone-2x2', 'Cone 2x2', 'round', { x: 2, y: 2, z: 2 }, { subcategory: 'cone' }),
  def('cone-4x4', 'Cone 4x4', 'round', { x: 4, y: 4, z: 3 }, { subcategory: 'cone' }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Special — arches, brackets, windows, doors, panels, corners, stairs
// ─────────────────────────────────────────────────────────────────────────────
const specials: Def[] = [
  def('arch-1x3', 'Arch 1x3', 'special', { x: 3, y: 1, z: BRICK }, { curved: true, subcategory: 'arch' }),
  def('arch-1x4', 'Arch 1x4', 'special', { x: 4, y: 1, z: BRICK }, { curved: true, subcategory: 'arch' }),
  def('arch-1x6', 'Arch 1x6', 'special', { x: 6, y: 1, z: 2 }, { curved: true, subcategory: 'arch' }),
  def('arch-1x8', 'Arch 1x8', 'special', { x: 8, y: 1, z: 2 }, { curved: true, subcategory: 'arch' }),
  def('arch-2x6', 'Arch 2x6', 'special', { x: 6, y: 2, z: 2 }, { curved: true, subcategory: 'arch' }),
  def('headlight', 'Headlight Brick', 'special', { x: 1, y: 1, z: BRICK }, { subcategory: 'headlight' }),
  def('bracket-1x2', 'Bracket 1x2 - 1x2', 'special', { x: 2, y: 1, z: BRICK }, { subcategory: 'bracket' }),
  def('bracket-2x2', 'Bracket 2x2 - 2x2', 'special', { x: 2, y: 2, z: BRICK }, { subcategory: 'bracket' }),
  def('bracket', 'Bracket Generic', 'special', { x: 1, y: 1, z: BRICK }, { subcategory: 'bracket' }),
  def('corner-2x2', 'Corner Brick 2x2', 'special', { x: 2, y: 2, z: BRICK }, { subcategory: 'corner' }),
  def('corner-plate-2x2', 'Corner Plate 2x2', 'special', { x: 2, y: 2, z: PLATE }, { subcategory: 'corner' }),
  def('panel-1x2x2', 'Panel 1x2x2', 'special', { x: 2, y: 1, z: 2 }, { subcategory: 'panel' }),
  def('panel-1x4x3', 'Panel 1x4x3', 'special', { x: 4, y: 1, z: 3 }, { subcategory: 'panel' }),
  def('panel-1x6x5', 'Panel 1x6x5', 'special', { x: 6, y: 1, z: 5 }, { subcategory: 'panel' }),
  def('window-1x2x2', 'Window 1x2x2', 'special', { x: 2, y: 1, z: 2 }, { subcategory: 'window' }),
  def('window-1x4x3', 'Window 1x4x3', 'special', { x: 4, y: 1, z: 3 }, { subcategory: 'window' }),
  def('window-1x6x3', 'Window 1x6x3', 'special', { x: 6, y: 1, z: 3 }, { subcategory: 'window' }),
  def('door-1x3x4', 'Door 1x3x4', 'special', { x: 3, y: 1, z: 4 }, { subcategory: 'door' }),
  def('door-1x4x6', 'Door 1x4x6', 'special', { x: 4, y: 1, z: 6 }, { subcategory: 'door' }),
  def('fence-1x4x2', 'Fence 1x4x2', 'special', { x: 4, y: 1, z: 2 }, { subcategory: 'fence' }),
  def('fence-1x4x1', 'Fence 1x4x1', 'special', { x: 4, y: 1, z: BRICK }, { subcategory: 'fence' }),
  def('stairs-2x2', 'Stairs 2x2', 'special', { x: 2, y: 2, z: 2 }, { subcategory: 'stairs' }),
  def('stairs-2x4', 'Stairs 2x4', 'special', { x: 4, y: 2, z: 2 }, { subcategory: 'stairs' }),
  // Legacy id kept so saved projects / PR #5 tests referencing `cone` resolve.
  def('cone', 'Cone (Legacy)', 'special', { x: 1, y: 1, z: 1.5 }, { subcategory: 'legacy' }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Technic — studless beams, pins, axles, connectors, gears
// ─────────────────────────────────────────────────────────────────────────────
const technicBricks: Def[] = [2, 4, 6, 8, 10, 12, 16].map((l) =>
  def(`technic-brick-1x${l}`, `Technic Brick 1x${l}`, 'technic', { x: l, y: 1, z: BRICK }, { subcategory: 'brick' })
);

const technicLiftarms: Def[] = [2, 3, 4, 5, 7, 9, 11, 13, 15].map((l) =>
  def(`technic-liftarm-1x${l}`, `Technic Liftarm 1x${l}`, 'technic', { x: l, y: 1, z: BRICK }, { subcategory: 'liftarm' })
);

const technicAxles: Def[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((l) =>
  def(`technic-axle-${l}`, `Technic Axle ${l}L`, 'technic', { x: l, y: 0.5, z: 0.5 }, { subcategory: 'axle' })
);

const technicPinsConnectors: Def[] = [
  def('technic-pin', 'Technic Pin', 'technic', { x: 0.5, y: 0.5, z: 0.5 }, { subcategory: 'pin' }),
  def('technic-pin-friction', 'Technic Pin (Friction)', 'technic', { x: 0.5, y: 0.5, z: 0.5 }, { subcategory: 'pin' }),
  def('technic-pin-long', 'Technic Pin 3L', 'technic', { x: 1.5, y: 0.5, z: 0.5 }, { subcategory: 'pin' }),
  def('technic-axle-pin', 'Technic Axle-Pin', 'technic', { x: 1, y: 0.5, z: 0.5 }, { subcategory: 'pin' }),
  def('technic-connector', 'Technic Connector', 'technic', { x: 1, y: 1, z: 0.5 }, { subcategory: 'connector' }),
  def('technic-connector-angle', 'Angle Connector', 'technic', { x: 1, y: 1, z: 1 }, { subcategory: 'connector' }),
  def('technic-bushing-half', 'Bushing Half', 'technic', { x: 0.5, y: 0.5, z: 0.33 }, { subcategory: 'bushing' }),
  def('technic-bushing', 'Bushing', 'technic', { x: 0.5, y: 0.5, z: 0.66 }, { subcategory: 'bushing' }),
  def('technic-gear-8', 'Gear 8-tooth', 'technic', { x: 1, y: 1, z: 0.5 }, { subcategory: 'gear' }),
  def('technic-gear-16', 'Gear 16-tooth', 'technic', { x: 2, y: 2, z: 0.5 }, { subcategory: 'gear' }),
  def('technic-gear-24', 'Gear 24-tooth', 'technic', { x: 3, y: 3, z: 0.5 }, { subcategory: 'gear' }),
  def('technic-gear-40', 'Gear 40-tooth', 'technic', { x: 5, y: 5, z: 0.5 }, { subcategory: 'gear' }),
  // Legacy ids from the previous library.
  def('technic-brick', 'Technic Brick (Legacy)', 'technic', { x: 1, y: 1, z: BRICK }, { subcategory: 'legacy' }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Minifig — figure body parts & equipment
// ─────────────────────────────────────────────────────────────────────────────
const minifig: Def[] = [
  def('minifig-head', 'Minifig Head', 'minifig', { x: 1, y: 1, z: 0.75 }, { subcategory: 'body' }),
  def('minifig-torso', 'Minifig Torso', 'minifig', { x: 1, y: 1, z: 1 }, { subcategory: 'body' }),
  def('minifig-legs', 'Minifig Legs', 'minifig', { x: 1, y: 1, z: 1 }, { subcategory: 'body' }),
  def('minifig-hair', 'Minifig Hair', 'minifig', { x: 1, y: 1, z: 0.5 }, { subcategory: 'head gear' }),
  def('minifig-hat', 'Minifig Hat', 'minifig', { x: 1, y: 1, z: 0.66 }, { subcategory: 'head gear' }),
  def('minifig-helmet', 'Minifig Helmet', 'minifig', { x: 1, y: 1, z: 0.66 }, { subcategory: 'head gear' }),
  def('minifig-weapon-sword', 'Sword', 'minifig', { x: 2, y: 0.33, z: 0.33 }, { subcategory: 'weapon' }),
  def('minifig-weapon-axe', 'Axe', 'minifig', { x: 1.5, y: 0.33, z: 0.33 }, { subcategory: 'weapon' }),
  def('minifig-tool-wrench', 'Wrench', 'minifig', { x: 1, y: 0.33, z: 0.33 }, { subcategory: 'tool' }),
  def('minifig-tool-pan', 'Frying Pan', 'minifig', { x: 1.5, y: 0.5, z: 0.33 }, { subcategory: 'tool' }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Accessories — plants, wheels, misc
// ─────────────────────────────────────────────────────────────────────────────
const accessories: Def[] = [
  def('flower', 'Flower', 'accessory', { x: 1, y: 1, z: 0.5 }, { subcategory: 'plant' }),
  def('flower-stem', 'Flower Stem', 'accessory', { x: 1, y: 1, z: 2 }, { subcategory: 'plant' }),
  def('bamboo', 'Bamboo Leaf', 'accessory', { x: 1, y: 1, z: 2 }, { subcategory: 'plant' }),
  def('plant-leaf-6x5', 'Plant Leaves 6x5', 'accessory', { x: 6, y: 5, z: 1 }, { subcategory: 'plant' }),
  def('plant-tree', 'Tree', 'accessory', { x: 2, y: 2, z: 4 }, { subcategory: 'plant' }),
  def('plant-grass', 'Grass Tuft', 'accessory', { x: 1, y: 1, z: 0.66 }, { subcategory: 'plant' }),
  def('wheel-small', 'Wheel Small', 'accessory', { x: 1, y: 1, z: 1 }, { subcategory: 'wheel' }),
  def('wheel-medium', 'Wheel Medium', 'accessory', { x: 2, y: 1, z: 2 }, { subcategory: 'wheel' }),
  def('wheel-large', 'Wheel Large', 'accessory', { x: 3, y: 1, z: 3 }, { subcategory: 'wheel' }),
  def('antenna', 'Antenna 1x4', 'accessory', { x: 1, y: 1, z: 4 }, { subcategory: 'misc' }),
  def('lever', 'Lever', 'accessory', { x: 1, y: 1, z: 1.5 }, { subcategory: 'misc' }),
  def('custom-part', 'Custom Part', 'accessory', { x: 2, y: 2, z: BRICK }, { subcategory: 'misc' }),
];

// ─────────────────────────────────────────────────────────────────────────────
// Final library — assembled, deduped on id (first occurrence wins).
// ─────────────────────────────────────────────────────────────────────────────
const all: Def[] = [
  ...brick1xN,
  ...brick2xN,
  ...brick4xN,
  ...brick6xN,
  ...brickLargeSquares,
  ...plate1xN,
  ...plate2xN,
  ...plate4xN,
  ...plate6xN,
  ...plateLarge,
  ...baseplates,
  ...tile1xN,
  ...tile2xN,
  ...tileLarge,
  ...slopes,
  ...rounds,
  ...specials,
  ...technicBricks,
  ...technicLiftarms,
  ...technicAxles,
  ...technicPinsConnectors,
  ...minifig,
  ...accessories,
];

const seen = new Set<string>();
export const brickLibrary: BrickDefinition[] = all.filter((b) => {
  if (seen.has(b.id)) return false;
  seen.add(b.id);
  return true;
});

export const defaultColor = '#F2F3F2';

export const brickCategories: { id: BrickCategory; label: string }[] = [
  { id: 'brick', label: 'Bricks' },
  { id: 'plate', label: 'Plates' },
  { id: 'tile', label: 'Tiles' },
  { id: 'slope', label: 'Slopes' },
  { id: 'round', label: 'Round' },
  { id: 'special', label: 'Special' },
  { id: 'technic', label: 'Technic' },
  { id: 'minifig', label: 'Minifig' },
  { id: 'accessory', label: 'Accessory' },
];
