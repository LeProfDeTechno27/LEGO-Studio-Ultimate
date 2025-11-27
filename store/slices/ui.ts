import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Tool = 'build' | 'delete' | 'rotate' | 'move' | 'scale' | 'custom';

interface UiState {
  activeTool: Tool;
  gridSnap: boolean;
  autosaveAt: string | null;
  status: string;
  selectedBrickType: string;
}

const initialState: UiState = {
  activeTool: 'build',
  gridSnap: true,
  autosaveAt: null,
  status: 'Ready',
  selectedBrickType: '1x1-brick',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<Tool>) => {
      state.activeTool = action.payload;
    },
    toggleGridSnap: (state) => {
      state.gridSnap = !state.gridSnap;
    },
    setAutosave: (state, action: PayloadAction<string>) => {
      state.autosaveAt = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setSelectedBrickType: (state, action: PayloadAction<string>) => {
      state.selectedBrickType = action.payload;
    },
  },
});

export const { setActiveTool, toggleGridSnap, setAutosave, setStatus, setSelectedBrickType } = uiSlice.actions;
export default uiSlice.reducer;
