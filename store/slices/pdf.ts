import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PdfState {
  fileName?: string;
  pages: string[];
  currentStep: number;
  totalSteps: number;
  suggestions: number;
  loading: boolean;
}

const initialState: PdfState = {
  pages: [],
  currentStep: 0,
  totalSteps: 0,
  suggestions: 0,
  loading: false,
};

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    startImport: (state) => {
      state.loading = true;
    },
    setPages: (state, action: PayloadAction<{ fileName: string; pages: string[] }>) => {
      state.fileName = action.payload.fileName;
      state.pages = action.payload.pages;
      state.totalSteps = action.payload.pages.length;
      state.currentStep = action.payload.pages.length ? 1 : 0;
      state.loading = false;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<number>) => {
      state.suggestions = action.payload;
    },
    resetPdf: () => initialState,
  },
});

export const { startImport, setPages, setCurrentStep, setSuggestions, resetPdf } = pdfSlice.actions;
export default pdfSlice.reducer;
