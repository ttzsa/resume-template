import type { ResumeModule } from '@/src/schema/types';

export interface PaginationUnit {
  id: string;
  sourceModuleId: string;
  module: ResumeModule;
  atomic: boolean;
}

export function createPaginationUnits(modules: ResumeModule[]): PaginationUnit[] {
  const units: PaginationUnit[] = [];

  for (const module of modules.filter((candidate) => candidate.visible)) {
    if (module.type === 'profile') {
      units.push({ id: `${module.id}:profile`, sourceModuleId: module.id, module, atomic: true });
      continue;
    }

    if (module.type === 'education') {
      if (module.entries.length === 0) {
        units.push({ id: `${module.id}:empty`, sourceModuleId: module.id, module, atomic: true });
      }
      module.entries.forEach((entry, index) => {
        units.push({
          id: `${module.id}:entry:${entry.id}`,
          sourceModuleId: module.id,
          module: { ...module, title: index === 0 ? module.title : undefined, entries: [entry] },
          atomic: true,
        });
      });
      continue;
    }

    if (module.type === 'internship') {
      if (module.entries.length === 0) {
        units.push({ id: `${module.id}:empty`, sourceModuleId: module.id, module, atomic: true });
      }
      module.entries.forEach((entry, index) => {
        units.push({
          id: `${module.id}:entry:${entry.id}`,
          sourceModuleId: module.id,
          module: { ...module, title: index === 0 ? module.title : undefined, entries: [entry] },
          atomic: true,
        });
      });
      continue;
    }

    if (module.type === 'project') {
      if (module.projects.length === 0) {
        units.push({ id: `${module.id}:empty`, sourceModuleId: module.id, module, atomic: true });
      }
      module.projects.forEach((project, index) => {
        units.push({
          id: `${module.id}:project:${project.id}`,
          sourceModuleId: module.id,
          module: { ...module, title: index === 0 ? module.title : undefined, projects: [project] },
          atomic: true,
        });
      });
      continue;
    }

    if (module.blocks.length === 0) {
      units.push({ id: `${module.id}:empty`, sourceModuleId: module.id, module, atomic: true });
    }
    module.blocks.forEach((block, index) => {
      units.push({
        id: `${module.id}:block:${block.id}`,
        sourceModuleId: module.id,
        module: { ...module, title: index === 0 ? module.title : '', blocks: [block] },
        atomic: true,
      });
    });
  }

  return units;
}
