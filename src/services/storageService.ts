import { ProjectFile } from '../types';

const AUTOSAVE_KEY = 'lego:autosave';
const PROJECTS_KEY = 'lego:projects';

export const storageService = {
  loadAutosave: (): ProjectFile | null => {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    return raw ? (JSON.parse(raw) as ProjectFile) : null;
  },
  saveAutosave: (project: ProjectFile) => {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(project));
    const projects = storageService.loadProjects();
    const metadataOnly = project.metadata;
    const next = [metadataOnly, ...projects.filter((p) => p.id !== metadataOnly.id)].slice(0, 50);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
  },
  loadProjects: () => {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as ProjectFile['metadata'][]) : [];
  },
};
