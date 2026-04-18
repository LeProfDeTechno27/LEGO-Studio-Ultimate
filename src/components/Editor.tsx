import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Canvas3D } from './Canvas3D';
import { Toolbar } from './Toolbar';
import { BricksPanel } from './BricksPanel';
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
import { brickLibrary } from '../services/brickLibrary';

export const Editor = () => {
  const dispatch = useAppDispatch();
  const autosaveAt = useAppSelector((state) => state.ui.autosaveAt);
  const bricks = useAppSelector((state) => state.scene.bricks);
  const selection = useAppSelector((state) => state.selection.brickIds);
  const history = useAppSelector((state) => state.history);
  const scene = useAppSelector((state) => state.scene);
  const selectedBrickType = useAppSelector((state) => state.ui.selectedBrickType);
  const activeTool = useAppSelector((state) => state.ui.activeTool);

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

  const selectedDef = useMemo(
    () => brickLibrary.find((b) => b.id === selectedBrickType),
    [selectedBrickType]
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-rose-500 via-amber-400 to-sky-500 shadow-inner" />
            <div className="font-semibold tracking-tight">LEGO Studio Ultimate</div>
          </div>
          <div className="text-[11px] opacity-50 hidden md:block">
            {brickLibrary.length} official parts · active tool{' '}
            <span className="uppercase text-sky-300">{activeTool}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleUndo}
            disabled={history.undoStack.length === 0}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-30 border border-slate-700"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={history.redoStack.length === 0}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-30 border border-slate-700"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
          <div className="mx-1 h-5 w-px bg-slate-700" />
          <SaveProjectModal />
          <LoadProjectModal />
          <ExportModal />
        </div>
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 flex-1 min-h-0">
        <aside className="lg:col-span-3 space-y-3 min-h-0 flex flex-col">
          <Toolbar />
          <BricksPanel />
          <PDFImportPanel />
        </aside>
        <main className="lg:col-span-6 flex flex-col min-h-0">
          <div className="relative flex-1 min-h-[480px] rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
            <Canvas3D />
            {selectedDef && activeTool === 'build' && (
              <div className="pointer-events-none absolute top-2 left-2 bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-[11px] tabular-nums">
                Next: <span className="text-sky-300">{selectedDef.name}</span>{' '}
                <span className="opacity-50">
                  ({selectedDef.size.x}×{selectedDef.size.y} · h {selectedDef.size.z.toFixed(2)})
                </span>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] opacity-70 px-1">
            <span className="tabular-nums">
              {bricks.length} bricks · {selection.length} selected · save{' '}
              {autosaveAt ? new Date(autosaveAt).toLocaleTimeString() : '—'}
            </span>
            <span className="opacity-50 hidden sm:inline">
              Click to place · Drag-orbit · Scroll-zoom · G: grid · Del: remove
            </span>
          </div>
        </main>
        <aside className="lg:col-span-3 space-y-3 min-h-0">
          <PropertiesPanel />
          <Palette />
        </aside>
      </div>
    </div>
  );
};
