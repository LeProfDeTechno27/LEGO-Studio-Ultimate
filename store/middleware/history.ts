import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { pushState } from '../slices/history';
import { setScene, addBrick, updateBrick, removeBrick, removeBricks, addGroup, removeGroup } from '../slices/scene';

const trackedActions = [addBrick.type, updateBrick.type, removeBrick.type, removeBricks.type, addGroup.type, removeGroup.type, setScene.type];

export const historyMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  if (trackedActions.includes(action.type)) {
    const scene = store.getState().scene;
    store.dispatch(pushState(structuredClone(scene)));
  }
  return result;
};
