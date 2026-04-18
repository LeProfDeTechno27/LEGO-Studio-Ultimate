import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setActiveTool, toggleGridSnap } from '../../store/slices/ui';
import { removeBricks, addBrick } from '../../store/slices/scene';
import { undo as undoAction, redo as redoAction } from '../../store/slices/history';
import { setSelection, clearSelection } from '../../store/slices/selection';
import { addGroup, removeGroup } from '../../store/slices/scene';
import { setScene } from '../../store/slices/scene';
import { storageService } from '../services/storageService';
import { setProject } from '../../store/slices/project';
import { uuid } from '../utils/uuid';

// Treat the event as originating from a form control so tool/hotkey shortcuts
// don't steal keystrokes meant for an <input>, <select>, <textarea>, or any
// contenteditable region. Previously only input/textarea were guarded, which
// meant typing letters into the Brick Type dropdown silently switched tools.
const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLSelectElement) return true;
  if (target.isContentEditable) return true;
  return false;
};

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  const selection = useAppSelector((state) => state.selection.brickIds);
  const bricks = useAppSelector((state) => state.scene.bricks);
  const history = useAppSelector((state) => state.history);
  const scene = useAppSelector((state) => state.scene);
  const project = useAppSelector((state) => state.project);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // --- Tool shortcuts (letter-only, no modifier) -----------------------
      if (!mod && !e.shiftKey) {
        if (key === 'r') return dispatch(setActiveTool('rotate'));
        if (key === 'd') return dispatch(setActiveTool('delete'));
        if (key === 'm') return dispatch(setActiveTool('move'));
        if (key === 's') return dispatch(setActiveTool('scale'));
        if (key === 'b') return dispatch(setActiveTool('build'));
        if (key === 'g') {
          // Plain G: toggle grid snap. Group is on Ctrl/Shift+G.
          return dispatch(toggleGridSnap());
        }
      }

      // --- Save / Select All / Copy / Paste / Undo / Redo ------------------
      if (mod && key === 's') {
        e.preventDefault();
        const projectFile = { metadata: project, scene };
        storageService.saveAutosave(projectFile);
        dispatch(setProject(project));
        return;
      }

      if (mod && key === 'a') {
        e.preventDefault();
        dispatch(setSelection(bricks.map((b) => b.id)));
        return;
      }

      if (mod && key === 'c') {
        if (selection.length > 0) {
          e.preventDefault();
          const selectedBricks = bricks.filter((b) => selection.includes(b.id));
          localStorage.setItem('lego:clipboard', JSON.stringify(selectedBricks));
        }
        return;
      }

      if (mod && key === 'v') {
        e.preventDefault();
        const clipboard = localStorage.getItem('lego:clipboard');
        if (!clipboard) return;
        try {
          const copiedBricks = JSON.parse(clipboard) as Array<{
            position: { x: number; y: number; z: number };
            [k: string]: unknown;
          }>;
          copiedBricks.forEach((brick) => {
            dispatch(
              addBrick({
                ...(brick as any),
                // Use a fresh UUID so pastes stay unique even when fired in
                // rapid succession (previously we templated Date.now() and
                // collided on sub-ms pastes).
                id: uuid(),
                position: {
                  x: brick.position.x + 2,
                  y: brick.position.y,
                  z: brick.position.z + 2,
                },
                groupId: undefined,
              })
            );
          });
        } catch {
          /* corrupt clipboard — ignore */
        }
        return;
      }

      if (mod && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          // Ctrl+Shift+Z: Redo (same semantics as Ctrl+Y)
          if (history.redoStack.length > 0) {
            const nextState = history.redoStack[0];
            dispatch(redoAction(scene));
            dispatch(setScene(nextState));
          }
        } else if (history.undoStack.length > 0) {
          const prevState = history.undoStack[0];
          dispatch(undoAction(scene));
          dispatch(setScene(prevState));
        }
        return;
      }

      if (mod && key === 'y') {
        e.preventDefault();
        if (history.redoStack.length > 0) {
          const nextState = history.redoStack[0];
          dispatch(redoAction(scene));
          dispatch(setScene(nextState));
        }
        return;
      }

      // --- Group / Ungroup -------------------------------------------------
      // Ctrl+G or Shift+G groups >1 selected bricks. Ctrl+Shift+G ungroups.
      if (key === 'g' && (mod || e.shiftKey)) {
        e.preventDefault();
        if (mod && e.shiftKey) {
          const selectedBrick = bricks.find((b) => selection.includes(b.id));
          if (selectedBrick?.groupId) {
            dispatch(removeGroup(selectedBrick.groupId));
          }
        } else if (selection.length > 1) {
          dispatch(addGroup({ name: `Group ${Date.now()}`, brickIds: selection }));
        }
        return;
      }

      // --- Selection / deletion -------------------------------------------
      if (e.key === 'Escape') {
        dispatch(clearSelection());
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection.length > 0) {
          e.preventDefault();
          dispatch(removeBricks(selection));
          dispatch(clearSelection());
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, selection, bricks, history, scene, project]);
};
