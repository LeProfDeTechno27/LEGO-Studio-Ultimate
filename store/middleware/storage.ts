import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { storageService } from '../../src/services/storageService';

export const storageMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  const project = {
    metadata: state.project,
    scene: state.scene,
  } as const;
  storageService.saveAutosave(project);
  return result;
};
