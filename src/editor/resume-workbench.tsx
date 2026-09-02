'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronDown, Download, FileJson, Layers3, Palette, Redo2, RotateCcw, Save, Undo2, Upload } from 'lucide-react';
import type { Resume } from '@/src/schema/types';
import { createExampleResume } from '@/src/schema/example';
import { ResumeStoreProvider, useResumeStore } from '@/src/store/provider';
import { downloadTextFile, exportResumeJson, importResumeJson } from '@/src/store/io';
import { loadLocalResume, saveResumeLocally } from '@/src/store/storage';
import { ModuleTree } from '@/src/editor/module-tree';
import { ModuleEditor } from '@/src/editor/module-editor';
import { DesignPanel } from '@/src/editor/design-panel';
import { PaginatedResumeRenderer } from '@/src/pagination/paginated-resume';
import { resolvePdfServiceUrl } from '@/src/pdf/service-url';

function ResumeWorkbenchInner() {
  const resume = useResumeStore((state) => state.resume);
  const pastCount = useResumeStore((state) => state.past.length);
  const futureCount = useResumeStore((state) => state.future.length);
  const undo = useResumeStore((state) => state.undo);
  const redo = useResumeStore((state) => state.redo);
  const replaceResume = useResumeStore((state) => state.replaceResume);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [zoom, setZoom] = useState('0.69');
  const [pageCount, setPageCount] = useState(1);
  const [saveState, setSaveState] = useState('已保存');
  const [hydrated, setHydrated] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const onPageCountChange = useCallback((count: number) => setPageCount(count), []);

  useEffect(() => {
    if (typeof indexedDB === 'undefined') { setHydrated(true); return; }
    loadLocalResume()
      .then((saved) => saved && replaceResume(saved, false))
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, [replaceResume]);

  useEffect(() => {
    if (!hydrated) return;
    setSaveState('保存中…');
    const timer = window.setTimeout(() => {
      saveResumeLocally(resume).then(() => setSaveState('已保存')).catch(() => setSaveState('仅本次会话'));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [hydrated, resume]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z') return;
      event.preventDefault();
      if (event.shiftKey) redo(); else undo();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [redo, undo]);

  const importFile = async (file?: File) => {
    if (!file) return;
    try { replaceResume(importResumeJson(await file.text())); }
    catch (error) { window.alert(error instanceof Error ? error.message : '导入失败'); }
  };

  const exportPdf = async () => {
    const serviceUrl = resolvePdfServiceUrl(process.env.NEXT_PUBLIC_PDF_SERVICE_URL, window.location.hostname);
    if (!serviceUrl) { window.print(); return; }
    try {
      const response = await fetch(`${serviceUrl.replace(/\/$/, '')}/api/pdf`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resume, frontendUrl: window.location.origin }) });
      if (!response.ok) throw new Error('PDF 服务暂时不可用');
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${resume.metadata.title}.pdf`; anchor.click(); URL.revokeObjectURL(url);
    } catch { window.print(); }
  };

  if (!hydrated) return <main className="workbench-loading" aria-busy="true">正在恢复本地简历…</main>;

  return <main className="workbench-shell">
    <header className="app-header">
      <div className="brand-lockup"><div className="brand-mark"><span>简</span></div><div><strong>简册</strong><span>STRUCTURED RESUME STUDIO</span></div></div>
      <div className="document-title"><span className="status-dot" /><span>{resume.metadata.title}</span><small>{saveState}</small></div>
      <div className="header-actions">
        <button className="icon-button" aria-label="撤销" disabled={!pastCount} onClick={undo}><Undo2 size={17} /></button><button className="icon-button" aria-label="重做" disabled={!futureCount} onClick={redo}><Redo2 size={17} /></button><span className="header-separator" />
        <button className="quiet-button" onClick={() => saveResumeLocally(resume)}><Save size={16} />保存</button><button className="primary-button" onClick={exportPdf}><Download size={16} />导出 PDF</button>
      </div>
    </header>
    <div className="workbench-body">
      <aside className="editor-panel">
        <div className="panel-tabs" role="tablist" aria-label="编辑模式"><button className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')} role="tab" aria-selected={activeTab === 'content'}><Layers3 size={16} />内容</button><button className={activeTab === 'design' ? 'active' : ''} onClick={() => setActiveTab('design')} role="tab" aria-selected={activeTab === 'design'}><Palette size={16} />设计</button></div>
        {activeTab === 'content' ? <div className="editor-scroll"><ModuleTree /><ModuleEditor /></div> : <DesignPanel />}
      </aside>
      <section className="preview-panel" aria-label="A4 实时预览">
        <div className="preview-toolbar"><div><strong>A4 实时预览</strong><span>所见即所得 · 自动分页</span></div><div className="preview-actions">
          <button onClick={() => downloadTextFile(exportResumeJson(resume), `${resume.metadata.title}.json`)}><FileJson size={15} />导出 JSON</button><button onClick={() => importRef.current?.click()}><Upload size={14} />导入</button><input ref={importRef} hidden type="file" accept="application/json" onChange={(event) => importFile(event.target.files?.[0])} />
          <button title="恢复默认示例" onClick={() => replaceResume(createExampleResume())}><RotateCcw size={14} /></button>
          <select className="zoom-control" aria-label="预览缩放" value={zoom} onChange={(event) => setZoom(event.target.value)}><option value="0.5">50%</option><option value="0.75">75%</option><option value="1">100%</option><option value="0.69">适合宽度</option></select><ChevronDown className="zoom-chevron" size={13} /><span className="page-count">1 / {pageCount}</span>
        </div></div>
        <div className="preview-stage" data-testid="resume-preview"><div className="preview-sheet-wrap" style={{ '--preview-scale': zoom } as CSSProperties}><PaginatedResumeRenderer resume={resume} onPageCountChange={onPageCountChange} /></div></div>
      </section>
    </div>
  </main>;
}

export function ResumeWorkbench({ initialResume }: { initialResume: Resume }) {
  return <ResumeStoreProvider initialResume={initialResume}><ResumeWorkbenchInner /></ResumeStoreProvider>;
}
