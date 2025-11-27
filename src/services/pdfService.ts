import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const renderPage = async (pdf: PDFDocumentProxy, pageNumber: number) => {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  if (!context) throw new Error('Unable to create canvas context');
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
};

export const pdfService = {
  extractPages: async (file: File) => {
    if (file.type !== 'application/pdf') throw new Error('File must be a PDF');
    if (file.size > 100 * 1024 * 1024) throw new Error('File is too large');
    const pdf = await pdfjsLib.getDocument({ url: URL.createObjectURL(file) }).promise;
    const pages: HTMLCanvasElement[] = [];
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const canvas = await renderPage(pdf, i);
      pages.push(canvas);
    }
    return pages;
  },
  processImage: async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.1);
      data[i + 1] = Math.min(255, data[i + 1] * 1.1);
      data[i + 2] = Math.min(255, data[i + 2] * 1.1);
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  },
};
