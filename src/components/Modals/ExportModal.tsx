import { useAppSelector } from '../../hooks/useAppSelector';
import { exportJson } from '../../services/exportService';

export const ExportModal = () => {
  const project = useAppSelector((state) => ({ metadata: state.project, scene: state.scene }));
  return (
    <button className="bg-sky-600 px-3 py-2 rounded text-xs" onClick={() => exportJson(project)}>
      Export
    </button>
  );
};
