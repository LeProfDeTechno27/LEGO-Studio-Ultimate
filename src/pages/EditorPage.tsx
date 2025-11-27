import { Editor } from '../components/Editor';

export const EditorPage = () => (
  <div className="min-h-screen bg-slate-900 text-slate-100">
    <header className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950">
      <h1 className="text-xl font-semibold">LEGO 3D Editor</h1>
      <div className="text-sm opacity-80">Real-time LEGO builder with PDF assist</div>
    </header>
    <Editor />
  </div>
);
