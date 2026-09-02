import { createStore } from 'zustand/vanilla';
import { arrayMove } from '@dnd-kit/sortable';
import type { Resume, ResumeModule } from '@/src/schema/types';

export interface ResumeStoreState {
  resume: Resume;
  selectedModuleId: string | null;
  past: Resume[];
  future: Resume[];
  updateModule: (id: string, update: (module: ResumeModule) => ResumeModule) => void;
  updateTheme: (update: Partial<Resume['theme']>) => void;
  replaceResume: (resume: Resume, recordHistory?: boolean) => void;
  selectModule: (id: string | null) => void;
  moveModule: (activeId: string, overId: string) => void;
  addModule: (module: ResumeModule) => void;
  deleteModule: (id: string) => void;
  duplicateModule: (id: string) => void;
  toggleModule: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

const stamp = (resume: Resume): Resume => ({
  ...resume,
  metadata: { ...resume.metadata, updatedAt: new Date().toISOString() },
});

const cloneModuleWithIds = (module: ResumeModule): ResumeModule => {
  const clone = structuredClone(module);
  clone.id = crypto.randomUUID();
  if (clone.type === 'education') clone.entries.forEach((entry) => { entry.id = crypto.randomUUID(); });
  if (clone.type === 'internship') {
    clone.entries.forEach((entry) => {
      entry.id = crypto.randomUUID();
      entry.projects.forEach((project) => { project.id = crypto.randomUUID(); });
    });
  }
  if (clone.type === 'project') clone.projects.forEach((project) => { project.id = crypto.randomUUID(); });
  return clone;
};

export function createResumeStore(initialResume: Resume) {
  return createStore<ResumeStoreState>((set) => {
    const commit = (transform: (resume: Resume) => Resume) => {
      set((state) => ({
        resume: stamp(transform(state.resume)),
        past: [...state.past.slice(-49), structuredClone(state.resume)],
        future: [],
      }));
    };

    return {
      resume: initialResume,
      selectedModuleId: initialResume.modules[0]?.id ?? null,
      past: [],
      future: [],
      updateModule: (id, update) => commit((resume) => ({
        ...resume,
        modules: resume.modules.map((module) => module.id === id ? update(module) : module),
      })),
      updateTheme: (update) => commit((resume) => ({
        ...resume,
        theme: { ...resume.theme, ...update },
      })),
      replaceResume: (resume, recordHistory = true) => {
        if (recordHistory) commit(() => resume);
        else set({ resume, past: [], future: [], selectedModuleId: resume.modules[0]?.id ?? null });
      },
      selectModule: (id) => set({ selectedModuleId: id }),
      moveModule: (activeId, overId) => commit((resume) => {
        const from = resume.modules.findIndex((module) => module.id === activeId);
        const to = resume.modules.findIndex((module) => module.id === overId);
        if (from < 0 || to < 0 || from === to) return resume;
        return { ...resume, modules: arrayMove(resume.modules, from, to) };
      }),
      addModule: (module) => {
        commit((resume) => ({ ...resume, modules: [...resume.modules, module] }));
        set({ selectedModuleId: module.id });
      },
      deleteModule: (id) => {
        commit((resume) => ({ ...resume, modules: resume.modules.filter((module) => module.id !== id || module.type === 'profile') }));
        set((state) => ({ selectedModuleId: state.resume.modules.find((module) => module.id !== id)?.id ?? null }));
      },
      duplicateModule: (id) => {
        commit((resume) => {
          const index = resume.modules.findIndex((module) => module.id === id);
          const module = resume.modules[index];
          if (!module || module.type === 'profile') return resume;
          const modules = [...resume.modules];
          modules.splice(index + 1, 0, cloneModuleWithIds(module));
          return { ...resume, modules };
        });
      },
      toggleModule: (id) => commit((resume) => ({
        ...resume,
        modules: resume.modules.map((module) => module.id === id ? { ...module, visible: !module.visible } : module),
      })),
      undo: () => set((state) => {
        const previous = state.past.at(-1);
        if (!previous) return state;
        return {
          ...state,
          resume: previous,
          past: state.past.slice(0, -1),
          future: [structuredClone(state.resume), ...state.future].slice(0, 50),
        };
      }),
      redo: () => set((state) => {
        const next = state.future[0];
        if (!next) return state;
        return {
          ...state,
          resume: next,
          past: [...state.past, structuredClone(state.resume)].slice(-50),
          future: state.future.slice(1),
        };
      }),
    };
  });
}
