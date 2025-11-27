import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectMetadata } from '../../src/types';
import { uuid } from '../../src/utils/uuid';

const nowIso = () => new Date().toISOString();

const initialState: ProjectMetadata = {
  id: uuid(),
  version: '1.0',
  title: 'My LEGO Creation',
  description: 'Interactive build',
  tags: [],
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.updatedAt = nowIso();
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
      state.updatedAt = nowIso();
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
      state.updatedAt = nowIso();
    },
    setSourceModel: (state, action: PayloadAction<Required<ProjectMetadata>['sourceModel']>) => {
      state.sourceModel = action.payload;
      state.updatedAt = nowIso();
    },
    setProject: (_state, action: PayloadAction<ProjectMetadata>) => action.payload,
  },
});

export const { setTitle, setDescription, setTags, setSourceModel, setProject } = projectSlice.actions;
export default projectSlice.reducer;
