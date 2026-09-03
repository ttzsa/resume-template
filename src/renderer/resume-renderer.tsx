import type { Resume, ResumeModule } from '@/src/schema/types';
import { themeToCssVariables } from '@/src/themes/theme';
import { ModuleRenderer } from '@/src/renderer/module-renderer';

export interface ResumeRendererProps {
  resume: Resume;
  mode?: 'preview' | 'print';
  pages?: ResumeModule[][];
}

export function ResumeRenderer({ resume, mode = 'preview', pages }: ResumeRendererProps) {
  const visibleModules = resume.modules.filter((module) => module.visible);
  const renderedPages = pages ?? [visibleModules];
  const previewRenderingStyle = mode === 'preview'
    ? {
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }
    : {};

  return (
    <div
      className={`resume-pages resume-pages--${mode}`}
      style={{ ...themeToCssVariables(resume.theme), ...previewRenderingStyle }}
    >
      {renderedPages.map((modules, pageIndex) => (
        <div className="resume-page" data-page={pageIndex + 1} key={`page-${pageIndex + 1}`}>
          <div className="resume-page-content">
            {modules.map((module, moduleIndex) => (
              <ModuleRenderer key={`${module.id}:${moduleIndex}`} module={module} theme={resume.theme} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
