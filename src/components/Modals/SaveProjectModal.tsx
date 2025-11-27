import { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { storageService } from '../../services/storageService';
import { setAutosave } from '../../../store/slices/ui';

export const SaveProjectModal = () => {
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => ({ metadata: state.project, scene: state.scene }));
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    storageService.saveAutosave(project);
    dispatch(setAutosave(new Date().toISOString()));
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <button
      className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded text-xs transition disabled:opacity-50"
      onClick={handleSave}
      disabled={saving}
      title="Save project (Ctrl+S)"
    >
      {saving ? '✓ Saved' : 'Save'}
    </button>
  );
};
