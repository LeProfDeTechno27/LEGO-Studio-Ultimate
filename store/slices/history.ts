import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SceneState } from '../../src/types';

interface HistoryState {
  undoStack: SceneState[];
  redoStack: SceneState[];
}

const initialState: HistoryState = {
  undoStack: [],
  redoStack: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    pushState: (state, action: PayloadAction<SceneState>) => {
      state.undoStack = [action.payload, ...state.undoStack].slice(0, 15);
      state.redoStack = [];
    },
    undo: (state, action: PayloadAction<SceneState>) => {
      const [latest, ...rest] = state.undoStack;
      if (latest) {
        state.undoStack = rest;
        state.redoStack = [action.payload, ...state.redoStack];
      }
    },
    redo: (state, action: PayloadAction<SceneState>) => {
      const [latest, ...rest] = state.redoStack;
      if (latest) {
        state.redoStack = rest;
        state.undoStack = [action.payload, ...state.undoStack].slice(0, 15);
      }
    },
    clearHistory: (state) => {
      state.undoStack = [];
      state.redoStack = [];
    },
  },
});

export const { pushState, undo, redo, clearHistory } = historySlice.actions;
export default historySlice.reducer;
