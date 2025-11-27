import { useAppSelector } from '../../hooks/useAppSelector';
import { storageService } from '../../services/storageService';

export const SaveProjectModal = () => {
  const project = useAppSelector((state) => ({ metadata: state.project, scene: state.scene }));
  return (
    <button
      className="bg-emerald-600 px-3 py-2 rounded text-xs"
      onClick={() => storageService.saveAutosave(project)}
    >
      Save
    </button>
  );
};
