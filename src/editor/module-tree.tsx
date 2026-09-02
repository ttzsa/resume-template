'use client';

import { CSS } from '@dnd-kit/utilities';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import type { ResumeModule } from '@/src/schema/types';
import { createModule } from '@/src/schema/factories';
import { useResumeStore } from '@/src/store/provider';

const moduleLabels = { profile: '个人信息', education: '教育背景', internship: '实习经历', project: '项目经历', free: '自由模块' };

function SortableModuleNode({ module, index, selected }: { module: ResumeModule; index: number; selected: boolean }) {
  const select = useResumeStore((state) => state.selectModule);
  const toggle = useResumeStore((state) => state.toggleModule);
  const duplicate = useResumeStore((state) => state.duplicateModule);
  const remove = useResumeStore((state) => state.deleteModule);
  const sortable = useSortable({ id: module.id });
  return (
    <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className={selected ? 'module-node selected' : 'module-node'} onClick={() => select(module.id)} role="button" tabIndex={0}>
      <button className="drag-button" aria-label={`拖动${module.title || moduleLabels[module.type]}`} {...sortable.attributes} {...sortable.listeners}><GripVertical size={15} /></button>
      <span className="module-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="module-name">{module.title || moduleLabels[module.type]}</span>
      <div className="module-row-actions">
        <button aria-label={module.visible ? '隐藏模块' : '显示模块'} onClick={(event) => { event.stopPropagation(); toggle(module.id); }}>{module.visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
        {module.type !== 'profile' && <button aria-label="复制模块" onClick={(event) => { event.stopPropagation(); duplicate(module.id); }}><Copy size={13} /></button>}
        {module.type !== 'profile' && <button aria-label="删除模块" onClick={(event) => { event.stopPropagation(); remove(module.id); }}><Trash2 size={13} /></button>}
      </div>
    </div>
  );
}

export function ModuleTree() {
  const modules = useResumeStore((state) => state.resume.modules);
  const selectedId = useResumeStore((state) => state.selectedModuleId);
  const moveModule = useResumeStore((state) => state.moveModule);
  const addModule = useResumeStore((state) => state.addModule);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = ({ active, over }: DragEndEvent) => { if (over && active.id !== over.id) moveModule(String(active.id), String(over.id)); };
  return (
    <>
      <div className="panel-heading"><div><span>简历结构</span><small>{modules.length} 个模块</small></div><details className="add-module-menu"><summary className="add-button"><Plus size={15} />添加模块</summary><div>
        <button onClick={() => addModule(createModule('education'))}>教育经历</button><button onClick={() => addModule(createModule('internship'))}>实习经历</button><button onClick={() => addModule(createModule('project'))}>项目经历</button><button onClick={() => addModule(createModule('free', window.prompt('模块名称', '奖项荣誉') || '自定义模块'))}>自由模块</button>
      </div></details></div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map((module) => module.id)} strategy={verticalListSortingStrategy}>
          <nav className="module-tree" aria-label="简历模块">{modules.map((module, index) => <SortableModuleNode key={module.id} module={module} index={index} selected={module.id === selectedId} />)}</nav>
        </SortableContext>
      </DndContext>
    </>
  );
}
