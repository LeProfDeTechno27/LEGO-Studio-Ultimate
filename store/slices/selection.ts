import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
  brickIds: string[];
}

const initialState: SelectionState = {
  brickIds: [],
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<string[]>) => {
      state.brickIds = action.payload;
    },
    clearSelection: (state) => {
      state.brickIds = [];
    },
  },
});

export const { setSelection, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
