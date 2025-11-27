import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Canvas3D } from './Canvas3D';
import { Toolbar } from './Toolbar';
import { Palette } from './Palette';
import { PropertiesPanel } from './PropertiesPanel';
import { PDFImportPanel } from './PDFImportPanel';
import { ExportModal } from './Modals/ExportModal';
import { LoadProjectModal } from './Modals/LoadProjectModal';
import { SaveProjectModal } from './Modals/SaveProjectModal';
import { setAutosave } from '../../store/slices/ui';
import { storageService } from '../services/storageService';
import { setProject } from '../../store/slices/project';
import { setScene } from '../../store/slices/scene';
import { undo as undoAction, redo as redoAction } from '../../store/slices/history';

export const Editor = () => {
  const dispatch = useAppDispatch();
  const autosaveAt = useAppSelector((state) => state.ui.autosaveAt);
  const bricks = useAppSelector((state) => state.scene.bricks);
  const selection = useAppSelector((state) => state.selection.brickIds);
  const history = useAppSelector((state) => state.history);
  const scene = useAppSelector((state) => state.scene);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    const autosave = storageService.loadAutosave();
    if (autosave) {
      dispatch(setProject(autosave.metadata));
      dispatch(setScene(autosave.scene));
    }
    const interval = setInterval(() => {
      dispatch(setAutosave(new Date().toISOString()));
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const status = useMemo(
    () => `${bricks.length} bricks | ${selection.length} selected | Last save: ${autosaveAt ? new Date(autosaveAt).toLocaleTimeString() : 'never'}`,
    [bricks.length, selection.length, autosaveAt]
  );

  const handleUndo = () => {
    if (history.undoStack.length > 0) {
      const prevState = history.undoStack[0];
      dispatch(undoAction(scene));
      dispatch(setScene(prevState));
    }
  };

  const handleRedo = () => {
    if (history.redoStack.length > 0) {
      const nextState = history.redoStack[0];
      dispatch(redoAction(scene));
      dispatch(setScene(nextState));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-screen bg-slate-900 text-white">
      <aside className="lg:col-span-2 space-y-3">
        <Toolbar />
        <Palette />
        <PDFImportPanel />
      </aside>
      <main className="lg:col-span-7">
        <Canvas3D />
        <div className="mt-2 flex items-center justify-between text-xs opacity-75">
          <span>{status}</span>
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={history.undoStack.length === 0}
              className="px-3 py-1 bg-slate-700 rounded disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={history.redoStack.length === 0}
              className="px-3 py-1 bg-slate-700 rounded disabled:opacity-30"
              title="Redo (Ctrl+Y)"
            >
              Redo
            </button>
          </div>
        </div>
      </main>
      <aside className="lg:col-span-3 space-y-3">
        <PropertiesPanel />
        <div className="grid grid-cols-3 gap-2 text-xs">
          <SaveProjectModal />
          <LoadProjectModal />
          <ExportModal />
        </div>
      </aside>
    </div>
  );
};
