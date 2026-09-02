'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Resume, ResumeModule } from '@/src/schema/types';
import { ModuleRenderer } from '@/src/renderer/module-renderer';
import { ResumeRenderer } from '@/src/renderer/resume-renderer';
import { packBlocks } from '@/src/pagination/pack-blocks';
import { createPaginationUnits, type PaginationUnit } from '@/src/pagination/units';
import { themeToCssVariables } from '@/src/themes/theme';

interface PaginatedResumeRendererProps {
  resume: Resume;
  mode?: 'preview' | 'print';
  onPageCountChange?: (count: number) => void;
}

interface MeasuredUnit extends PaginationUnit {
  height: number;
}

const mmToCssPixels = (millimeters: number) => (millimeters * 96) / 25.4;

export function PaginatedResumeRenderer({
  resume,
  mode = 'preview',
  onPageCountChange,
}: PaginatedResumeRendererProps) {
  const measurementRef = useRef<HTMLDivElement>(null);
  const units = useMemo(() => createPaginationUnits(resume.modules), [resume.modules]);
  const [pageUnitIds, setPageUnitIds] = useState<string[][]>(() => [units.map((unit) => unit.id)]);
  const pages = useMemo<ResumeModule[][]>(() => {
    const byId = new Map(units.map((unit) => [unit.id, unit.module]));
    const currentOrder = pageUnitIds.flat();
    const unitOrder = units.map((unit) => unit.id);
    if (currentOrder.length !== unitOrder.length || currentOrder.some((id, index) => id !== unitOrder[index])) {
      return [units.map((unit) => unit.module)];
    }
    return pageUnitIds.map((page) => page.flatMap((id) => {
      const module = byId.get(id);
      return module ? [module] : [];
    }));
  }, [pageUnitIds, units]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const root = measurementRef.current;
      if (!root) return;
      const measured: MeasuredUnit[] = units.map((unit) => {
        const element = root.querySelector<HTMLElement>(`[data-pagination-unit="${unit.id}"]`);
        return { ...unit, height: element?.getBoundingClientRect().height ?? 0 };
      });
      const contentHeight = mmToCssPixels(
        297 - resume.theme.page.marginTop - resume.theme.page.marginBottom,
      );
      const packed = packBlocks(measured, contentHeight);
      const nextPages = packed.length > 0
        ? packed.map((page) => page.map((unit) => unit.id))
        : [[]];
      setPageUnitIds(nextPages);
      onPageCountChange?.(nextPages.length);
    });

    return () => cancelAnimationFrame(frame);
  }, [onPageCountChange, resume.theme, units]);

  return (
    <>
      <ResumeRenderer resume={resume} mode={mode} pages={pages} />
      <div
        ref={measurementRef}
        className="pagination-measurement"
        data-pagination-measurement
        aria-hidden="true"
        style={themeToCssVariables(resume.theme)}
      >
        <div className="resume-page-content pagination-measurement-content">
          {units.map((unit) => (
            <div className="pagination-unit" data-pagination-unit={unit.id} key={unit.id}>
              <ModuleRenderer module={unit.module} theme={resume.theme} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
