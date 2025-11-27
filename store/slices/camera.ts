import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CameraState } from '../../src/types';

const initialState: CameraState = {
  position: { x: 10, y: 10, z: 10 },
  target: { x: 0, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  fov: 60,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setCameraState: (_state, action: PayloadAction<CameraState>) => action.payload,
  },
});

export const { setCameraState } = cameraSlice.actions;
export default cameraSlice.reducer;
