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

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  const selection = useAppSelector((state) => state.selection.brickIds);
  const bricks = useAppSelector((state) => state.scene.bricks);
  const history = useAppSelector((state) => state.history);
  const scene = useAppSelector((state) => state.scene);
  const project = useAppSelector((state) => state.project);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Tool shortcuts
      if (e.key === 'r' || e.key === 'R') {
        dispatch(setActiveTool('rotate'));
      } else if (e.key === 'd' || e.key === 'D') {
        dispatch(setActiveTool('delete'));
      } else if (e.key === 'm' || e.key === 'M') {
        dispatch(setActiveTool('move'));
      } else if (e.key === 's' || e.key === 'S') {
        if (e.ctrlKey || e.metaKey) {
          // Ctrl+S: Save
          e.preventDefault();
          const projectFile = { metadata: project, scene };
          storageService.saveAutosave(projectFile);
        } else {
          dispatch(setActiveTool('scale'));
        }
      } else if (e.key === 'b' || e.key === 'B') {
        dispatch(setActiveTool('build'));
      }

      // Selection shortcuts
      else if (e.key === 'Escape') {
        dispatch(clearSelection());
      } else if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        dispatch(setSelection(bricks.map((b) => b.id)));
      }

      // Delete selected
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection.length > 0) {
          e.preventDefault();
          dispatch(removeBricks(selection));
          dispatch(clearSelection());
        }
      }

      // Copy/Paste
      else if ((e.key === 'c' || e.key === 'C') && (e.ctrlKey || e.metaKey)) {
        if (selection.length > 0) {
          e.preventDefault();
          const selectedBricks = bricks.filter((b) => selection.includes(b.id));
          localStorage.setItem('lego:clipboard', JSON.stringify(selectedBricks));
        }
      } else if ((e.key === 'v' || e.key === 'V') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const clipboard = localStorage.getItem('lego:clipboard');
        if (clipboard) {
          const copiedBricks = JSON.parse(clipboard);
          copiedBricks.forEach((brick: any) => {
            dispatch(
              addBrick({
                ...brick,
                id: `${brick.id}-copy-${Date.now()}`,
                position: { x: brick.position.x + 2, y: brick.position.y, z: brick.position.z + 2 },
              })
            );
          });
        }
      }

      // Group/Ungroup
      else if (e.key === 'g' || e.key === 'G') {
        if (selection.length > 1) {
          dispatch(addGroup({ name: `Group ${Date.now()}`, brickIds: selection }));
        }
      } else if (e.key === 'u' || e.key === 'U') {
        const selectedBrick = bricks.find((b) => selection.includes(b.id));
        if (selectedBrick?.groupId) {
          dispatch(removeGroup(selectedBrick.groupId));
        }
      }

      // Undo/Redo
      else if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          if (history.redoStack.length > 0) {
            const nextState = history.redoStack[0];
            dispatch(redoAction(scene));
            dispatch(setScene(nextState));
          }
        } else {
          // Undo
          if (history.undoStack.length > 0) {
            const prevState = history.undoStack[0];
            dispatch(undoAction(scene));
            dispatch(setScene(prevState));
          }
        }
      } else if ((e.key === 'y' || e.key === 'Y') && (e.ctrlKey || e.metaKey)) {
        // Ctrl+Y: Redo
        e.preventDefault();
        if (history.redoStack.length > 0) {
          const nextState = history.redoStack[0];
          dispatch(redoAction(scene));
          dispatch(setScene(nextState));
        }
      }

      // Grid snap toggle
      else if (e.key === 'g' || e.key === 'G') {
        if (e.shiftKey) {
          dispatch(toggleGridSnap());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, selection, bricks, history, scene, project]);
};
