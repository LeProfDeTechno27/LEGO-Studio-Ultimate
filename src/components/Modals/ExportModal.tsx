import { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { exportJson, exportPng, exportGlb } from '../../services/exportService';

export const ExportModal = () => {
  const project = useAppSelector((state) => ({ metadata: state.project, scene: state.scene }));
  const [isOpen, setIsOpen] = useState(false);

  const handleExportJson = () => {
    exportJson(project);
    setIsOpen(false);
  };

  const handleExportPng = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      exportPng(canvas, project.metadata.title || 'lego-project');
    }
    setIsOpen(false);
  };

  const handleExportGlb = () => {
    // Note: This requires the Three.js scene object - we'll implement this later
    alert('GLB export will be available in Canvas3D context');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="bg-sky-600 hover:bg-sky-700 px-3 py-2 rounded text-xs transition w-full"
        onClick={() => setIsOpen(!isOpen)}
        title="Export project"
      >
        Export
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-slate-800 border border-slate-700 rounded shadow-lg p-2 space-y-1 min-w-[120px] z-10">
          <button
            onClick={handleExportJson}
            className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 rounded transition"
          >
            JSON
          </button>
          <button
            onClick={handleExportPng}
            className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 rounded transition"
          >
            PNG
          </button>
          <button
            onClick={handleExportGlb}
            className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 rounded transition opacity-50"
            disabled
          >
            GLB (Soon)
          </button>
        </div>
      )}
    </div>
  );
};
