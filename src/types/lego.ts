export type Vector3 = { x: number; y: number; z: number };
export type Euler = { x: number; y: number; z: number };

export type BrickCategory =
  | 'brick'
  | 'plate'
  | 'tile'
  | 'slope'
  | 'round'
  | 'special'
  | 'technic'
  | 'minifig'
  | 'accessory';

export interface BrickDefinition {
  id: string;
  name: string;
  category: BrickCategory;
  /** Optional finer grouping used by the brick palette (e.g. "1xN", "2xN", "baseplate"). */
  subcategory?: string;
  size: { x: number; y: number; z: number };
  slope?: number;
  inverted?: boolean;
  curved?: boolean;
}

export interface BrickInstance {
  id: string;
  type: string;
  color: string;
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  groupId?: string;
  locked: boolean;
  visible: boolean;
}

export interface GroupInstance {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  brickIds: string[];
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
}

export interface CameraState {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fov: number;
}

export interface LightingState {
  ambient: { intensity: number; color: string };
  directional: { intensity: number; color: string; position: Vector3 };
  shadows: boolean;
}

export interface SceneState {
  bricks: BrickInstance[];
  groups: GroupInstance[];
  camera: CameraState;
  lighting: LightingState;
}

export interface ProjectMetadata {
  id: string;
  version: string;
  title: string;
  description: string;
  tags: string[];
  sourceModel?: {
    type: 'pdf_import' | 'manual';
    pdfName?: string;
    currentStep?: number;
    totalSteps?: number;
    importDate?: string;
    completed?: boolean;
  };
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface ProjectFile {
  metadata: ProjectMetadata;
  scene: SceneState;
}
