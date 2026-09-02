'use client';

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import type { ContentBlock, ListItem } from '@/src/schema/types';
import { createContentBlock } from '@/src/schema/factories';
import { RichTextEditor } from '@/src/richtext/rich-text-editor';

function ChildControls({ onAdd }: { onAdd: (type: 'paragraph' | 'list' | 'keyValue') => void }) {
  return <div className="block-add-row"><span>添加子内容</span><button onClick={() => onAdd('paragraph')}>段落</button><button onClick={() => onAdd('list')}>列表</button><button onClick={() => onAdd('keyValue')}>键值对</button></div>;
}

function BlockBody({ block, depth, onChange }: { block: ContentBlock; depth: number; onChange: (block: ContentBlock) => void }) {
  const appendChild = (type: 'paragraph' | 'list' | 'keyValue') => {
    if (depth >= 3 || block.type === 'list') return;
    onChange({ ...block, children: [...(block.children ?? []), createContentBlock(type)] });
  };
  if (block.type === 'paragraph') return <><RichTextEditor ariaLabel="段落内容" content={block.content} onChange={(content) => onChange({ ...block, content })} />{block.children && <ContentBlocksEditor blocks={block.children} depth={depth + 1} onChange={(children) => onChange({ ...block, children })} />}{depth < 3 && <ChildControls onAdd={appendChild} />}</>;
  if (block.type === 'keyValue') return <>
    <div className="rich-field-pair"><div><span className="field-label">Key</span><RichTextEditor ariaLabel="键值对标题" compact content={block.key} onChange={(key) => onChange({ ...block, key })} /></div><div><span className="field-label">Value</span><RichTextEditor ariaLabel="键值对内容" compact content={block.value} onChange={(value) => onChange({ ...block, value })} /></div></div>
    <label className="design-check"><input type="checkbox" checked={block.keyBold !== false} onChange={(event) => onChange({ ...block, keyBold: event.target.checked })} /><span>Key 加粗</span></label>
    {block.children && <ContentBlocksEditor blocks={block.children} depth={depth + 1} onChange={(children) => onChange({ ...block, children })} />}{depth < 3 && <ChildControls onAdd={appendChild} />}
  </>;
  if (block.type === 'list') {
    const updateItem = (id: string, update: (item: ListItem) => ListItem) => onChange({ ...block, items: block.items.map((item) => item.id === id ? update(item) : item) });
    return <div className="list-item-editor">
      <select aria-label="列表样式" value={block.style} onChange={(event) => onChange({ ...block, style: event.target.value as typeof block.style })}><option value="circle">空心圆</option><option value="disc">实心圆</option><option value="decimal">数字</option></select>
      {block.items.map((item, index) => <div className="list-editor-item" key={item.id}><span>{index + 1}</span><RichTextEditor ariaLabel={`列表项 ${index + 1}`} compact content={item.content} onChange={(content) => updateItem(item.id, (current) => ({ ...current, content }))} /><button aria-label="删除列表项" onClick={() => onChange({ ...block, items: block.items.filter((candidate) => candidate.id !== item.id) })}><Trash2 size={13} /></button>{item.children && <ContentBlocksEditor blocks={item.children} depth={depth + 1} onChange={(children) => updateItem(item.id, (current) => ({ ...current, children }))} />}{depth < 3 && <ChildControls onAdd={(type) => updateItem(item.id, (current) => ({ ...current, children: [...(current.children ?? []), createContentBlock(type)] }))} />}</div>)}
      <button className="inline-add" onClick={() => onChange({ ...block, items: [...block.items, { id: crypto.randomUUID(), content: createContentBlock('paragraph').type === 'paragraph' ? createContentBlock('paragraph').content : {} }] })}><Plus size={14} />添加列表项</button>
    </div>;
  }
  return <ContentBlocksEditor blocks={block.children} depth={depth + 1} onChange={(children) => onChange({ ...block, children })} />;
}

function SortableBlock({ block, depth, onChange, onRemove }: { block: ContentBlock; depth: number; onChange: (block: ContentBlock) => void; onRemove: () => void }) {
  const sortable = useSortable({ id: block.id });
  return <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className="content-block-card">
    <div className="content-block-heading"><button className="drag-button" aria-label="拖动内容块" {...sortable.attributes} {...sortable.listeners}><GripVertical size={14} /></button><span>{block.type === 'paragraph' ? '段落' : block.type === 'list' ? '列表' : block.type === 'keyValue' ? '键值对' : '分组'}</span><button aria-label="删除内容块" onClick={onRemove}><Trash2 size={13} /></button></div>
    <BlockBody block={block} depth={depth} onChange={onChange} />
  </div>;
}

export function ContentBlocksEditor({ blocks, onChange, depth = 1 }: { blocks: ContentBlock[]; onChange: (blocks: ContentBlock[]) => void; depth?: number }) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = ({ active, over }: DragEndEvent) => { if (!over || active.id === over.id) return; const from = blocks.findIndex((block) => block.id === active.id); const to = blocks.findIndex((block) => block.id === over.id); if (from >= 0 && to >= 0) onChange(arrayMove(blocks, from, to)); };
  return <div className={`content-blocks content-blocks--depth-${depth}`}>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}><SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>{blocks.map((block) => <SortableBlock key={block.id} block={block} depth={depth} onChange={(next) => onChange(blocks.map((candidate) => candidate.id === block.id ? next : candidate))} onRemove={() => onChange(blocks.filter((candidate) => candidate.id !== block.id))} />)}</SortableContext></DndContext>
    {depth <= 3 && <div className="block-add-row block-add-row--main"><span><Plus size={13} />添加内容</span><button onClick={() => onChange([...blocks, createContentBlock('paragraph')])}>段落</button><button onClick={() => onChange([...blocks, createContentBlock('list')])}>列表</button><button onClick={() => onChange([...blocks, createContentBlock('keyValue')])}>键值对</button></div>}
  </div>;
}
