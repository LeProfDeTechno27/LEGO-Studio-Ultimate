import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from '../../../src/services/storageService';
import { ProjectFile } from '../../../src/types';

global.localStorage = {
  data: new Map<string, string>(),
  getItem(key: string) {
    return this.data.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    this.data.set(key, value);
  },
  removeItem(key: string) {
    this.data.delete(key);
  },
  clear() {
    this.data.clear();
  },
  key: vi.fn(),
  length: 0,
} as any;

const project: ProjectFile = {
  metadata: {
    id: '1',
    version: '1.0',
    title: 'Test',
    description: 'Test',
    tags: [],
    createdAt: 'now',
    updatedAt: 'now',
  },
  scene: { bricks: [], groups: [], camera: { position: { x: 0, y: 0, z: 0 }, target: { x: 0, y: 0, z: 0 }, up: { x: 0, y: 1, z: 0 }, fov: 60 }, lighting: { ambient: { intensity: 1, color: '#fff' }, directional: { intensity: 1, color: '#fff', position: { x: 0, y: 0, z: 0 } }, shadows: true } },
};

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists autosave', () => {
    storageService.saveAutosave(project);
    const loaded = storageService.loadAutosave();
    expect(loaded?.metadata.id).toBe('1');
  });
});
