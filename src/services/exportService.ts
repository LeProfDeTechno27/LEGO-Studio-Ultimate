import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { ProjectFile } from '../types';

export const exportJson = (project: ProjectFile) => {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  download(blob, `${project.metadata.title || 'project'}.lego.json`);
};

export const exportPng = (canvas: HTMLCanvasElement, title: string) => {
  canvas.toBlob((blob) => {
    if (blob) download(blob, `${title}.png`);
  }, 'image/png');
};

export const exportGlb = (scene: THREE.Scene, title: string) => {
  const exporter = new GLTFExporter();
  exporter.parse(scene, (content) => {
    const blob = new Blob([content as BlobPart], { type: 'model/gltf-binary' });
    download(blob, `${title}.glb`);
  }, { binary: true });
};

const download = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
