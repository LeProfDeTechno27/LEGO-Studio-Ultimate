import { useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { pdfService } from '../services/pdfService';
import { mlService } from '../services/mlService';
import { setPages, setSuggestions, setCurrentStep, startImport } from '../../store/slices/pdf';
import { addBrick } from '../../store/slices/scene';
import { uuid } from '../utils/uuid';
import { defaultColor } from '../services/brickLibrary';

export const PDFImportPanel = () => {
  const dispatch = useAppDispatch();
  const pdf = useAppSelector((state) => state.pdf);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    try {
      setError(null);
      dispatch(startImport());
      const canvases = await pdfService.extractPages(file);
      const images = await Promise.all(
        canvases.map(async (canvas) => {
          const processed = await pdfService.processImage(canvas);
          return processed.toDataURL('image/png');
        })
      );
      dispatch(setPages({ fileName: file.name, pages: images }));
      const bricks = await mlService.detectBricks(canvases[0]);
      bricks.forEach((brick) => dispatch(addBrick(brick)));
      dispatch(setSuggestions(bricks.length));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="font-semibold text-sm">PDF Import</div>
      <label className="text-xs bg-slate-900 border border-slate-700 rounded px-2 py-1 cursor-pointer inline-flex items-center gap-2">
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        Upload PDF
      </label>
      {pdf.fileName && (
        <div className="text-xs space-y-1">
          <div>{pdf.fileName}</div>
          <div>
            Step {pdf.currentStep} / {pdf.totalSteps} — Suggestions: {pdf.suggestions}
          </div>
          {pdf.pages[pdf.currentStep - 1] && (
            <img src={pdf.pages[pdf.currentStep - 1]} alt="Instruction step" className="rounded" />
          )}
          <div className="flex gap-2">
            <button
              className="bg-sky-600 text-xs px-2 py-1 rounded"
              onClick={() => dispatch(setCurrentStep(Math.max(1, pdf.currentStep - 1)))}
            >
              Prev
            </button>
            <button
              className="bg-sky-600 text-xs px-2 py-1 rounded"
              onClick={() => dispatch(setCurrentStep(Math.min(pdf.totalSteps, pdf.currentStep + 1)))}
            >
              Next
            </button>
            <button
              className="bg-emerald-600 text-xs px-2 py-1 rounded"
              onClick={() => {
                dispatch(
                  addBrick({
                    id: uuid(),
                    type: 'custom-part',
                    color: defaultColor,
                    position: { x: 0, y: 0.5, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 2, y: 1, z: 2 },
                    locked: false,
                    visible: true,
                  })
                );
              }}
            >
              Auto-build step
            </button>
          </div>
        </div>
      )}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
};
