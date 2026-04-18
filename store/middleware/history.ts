import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { pushState } from '../slices/history';
import { addBrick, updateBrick, removeBrick, removeBricks, addGroup, removeGroup } from '../slices/scene';

// Actions that mutate the scene and should be recorded in the undo history.
// NOTE: `setScene` is intentionally excluded — it's the action undo/redo
// dispatch to replay a past scene, so recording it would clobber the
// redo stack and create duplicate undo entries.
const trackedActions = [
  addBrick.type,
  updateBrick.type,
  removeBrick.type,
  removeBricks.type,
  addGroup.type,
  removeGroup.type,
];

export const historyMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (trackedActions.includes(action.type)) {
    // Snapshot the scene BEFORE the action so the undo stack actually holds
    // the *previous* state. Previously this captured post-action state,
    // which made undo a no-op (apply current → nothing changes).
    const previous = structuredClone(store.getState().scene);
    const result = next(action);
    store.dispatch(pushState(previous));
    return result;
  }
  return next(action);
};
