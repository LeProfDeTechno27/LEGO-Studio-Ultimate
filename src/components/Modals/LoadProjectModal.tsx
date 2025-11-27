import { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { storageService } from '../../services/storageService';
import { setProject } from '../../../store/slices/project';
import { setScene } from '../../../store/slices/scene';

export const LoadProjectModal = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const loadLatest = () => {
    if (confirm('Load the last saved project? Any unsaved changes will be lost.')) {
      setLoading(true);
      const autosave = storageService.loadAutosave();
      if (autosave) {
        dispatch(setProject(autosave.metadata));
        dispatch(setScene(autosave.scene));
        setTimeout(() => setLoading(false), 500);
      } else {
        alert('No saved project found');
        setLoading(false);
      }
    }
  };

  return (
    <button
      className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs transition disabled:opacity-50"
      onClick={loadLatest}
      disabled={loading}
      title="Load saved project (Ctrl+L)"
    >
      {loading ? 'Loading...' : 'Load'}
    </button>
  );
};
