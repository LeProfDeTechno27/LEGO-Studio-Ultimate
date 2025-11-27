import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
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

export const Editor = () => {
  const dispatch = useAppDispatch();
  const autosaveAt = useAppSelector((state) => state.ui.autosaveAt);

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

  const status = useMemo(() => `Last autosave: ${autosaveAt ?? 'pending'}`, [autosaveAt]);

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <aside className="col-span-2 space-y-3">
        <Toolbar />
        <Palette />
        <PDFImportPanel />
      </aside>
      <main className="col-span-7">
        <Canvas3D />
        <div className="mt-2 text-xs opacity-75">{status}</div>
      </main>
      <aside className="col-span-3 space-y-3">
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
