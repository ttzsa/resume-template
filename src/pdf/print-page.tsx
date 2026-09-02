'use client';

import { useEffect, useState } from 'react';
import type { Resume } from '@/src/schema/types';
import { createExampleResume } from '@/src/schema/example';
import { decodeResumePayload } from '@/src/pdf/payload';
import { PaginatedResumeRenderer } from '@/src/pagination/paginated-resume';

export function PrintResumePage({ initialResume }: { initialResume: Resume }) {
  const [resume, setResume] = useState<Resume>(initialResume);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const payload = new URLSearchParams(window.location.search).get('data');
    if (payload) {
      try { setResume(decodeResumePayload(payload)); }
      catch { setResume(createExampleResume()); }
    }
  }, []);

  const paginationReady = async () => {
    await document.fonts?.ready;
    const images = Array.from(document.images);
    await Promise.all(images.map((image) => image.complete ? Promise.resolve() : new Promise<void>((resolve) => { image.addEventListener('load', () => resolve(), { once: true }); image.addEventListener('error', () => resolve(), { once: true }); })));
    setReady(true);
  };

  return <main className="print-resume-root" data-pdf-ready={ready ? 'true' : 'false'}><PaginatedResumeRenderer resume={resume} mode="print" onPageCountChange={paginationReady} /></main>;
}
