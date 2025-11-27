import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/project';
import sceneReducer from './slices/scene';
import uiReducer from './slices/ui';
import selectionReducer from './slices/selection';
import historyReducer from './slices/history';
import cameraReducer from './slices/camera';
import pdfReducer from './slices/pdf';
import { historyMiddleware } from './middleware/history';
import { storageMiddleware } from './middleware/storage';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    scene: sceneReducer,
    ui: uiReducer,
    selection: selectionReducer,
    history: historyReducer,
    camera: cameraReducer,
    pdf: pdfReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(historyMiddleware, storageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
