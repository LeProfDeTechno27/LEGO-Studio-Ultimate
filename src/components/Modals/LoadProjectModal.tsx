import { useAppDispatch } from '../../hooks/useAppDispatch';
import { storageService } from '../../services/storageService';
import { setProject } from '../../../store/slices/project';
import { setScene } from '../../../store/slices/scene';

export const LoadProjectModal = () => {
  const dispatch = useAppDispatch();
  const loadLatest = () => {
    const autosave = storageService.loadAutosave();
    if (autosave) {
      dispatch(setProject(autosave.metadata));
      dispatch(setScene(autosave.scene));
    }
  };
  return (
    <button className="bg-slate-700 px-3 py-2 rounded text-xs" onClick={loadLatest}>
      Load
    </button>
  );
};
