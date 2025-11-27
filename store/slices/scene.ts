import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrickInstance, GroupInstance, SceneState } from '../../src/types';
import { uuid } from '../../src/utils/uuid';

const initialState: SceneState = {
  bricks: [],
  groups: [],
  camera: {
    position: { x: 10, y: 10, z: 10 },
    target: { x: 0, y: 0, z: 0 },
    up: { x: 0, y: 1, z: 0 },
    fov: 60,
  },
  lighting: {
    ambient: { intensity: 0.6, color: '#FFFFFF' },
    directional: { intensity: 0.8, color: '#FFFFFF', position: { x: 10, y: 10, z: 10 } },
    shadows: true,
  },
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    addBrick: (state, action: PayloadAction<BrickInstance>) => {
      state.bricks.push(action.payload);
    },
    updateBrick: (state, action: PayloadAction<BrickInstance>) => {
      const index = state.bricks.findIndex((b) => b.id === action.payload.id);
      if (index >= 0) state.bricks[index] = action.payload;
    },
    removeBrick: (state, action: PayloadAction<string>) => {
      state.bricks = state.bricks.filter((b) => b.id !== action.payload);
    },
    removeBricks: (state, action: PayloadAction<string[]>) => {
      state.bricks = state.bricks.filter((b) => !action.payload.includes(b.id));
    },
    setBricks: (state, action: PayloadAction<BrickInstance[]>) => {
      state.bricks = action.payload;
    },
    addGroup: (state, action: PayloadAction<{ name: string; brickIds: string[] }>) => {
      const group: GroupInstance = {
        id: uuid(),
        name: action.payload.name,
        visible: true,
        locked: false,
        brickIds: action.payload.brickIds,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      };
      state.groups.push(group);
      state.bricks = state.bricks.map((b) =>
        action.payload.brickIds.includes(b.id) ? { ...b, groupId: group.id } : b
      );
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
      state.bricks = state.bricks.map((b) => (b.groupId === action.payload ? { ...b, groupId: undefined } : b));
    },
    updateGroupVisibility: (state, action: PayloadAction<{ id: string; visible: boolean }>) => {
      state.groups = state.groups.map((g) => (g.id === action.payload.id ? { ...g, visible: action.payload.visible } : g));
    },
    setCamera: (state, action: PayloadAction<SceneState['camera']>) => {
      state.camera = action.payload;
    },
    setScene: (state, action: PayloadAction<SceneState>) => action.payload,
  },
});

export const {
  addBrick,
  updateBrick,
  removeBrick,
  removeBricks,
  setBricks,
  addGroup,
  removeGroup,
  updateGroupVisibility,
  setCamera,
  setScene,
} = sceneSlice.actions;

export default sceneSlice.reducer;
