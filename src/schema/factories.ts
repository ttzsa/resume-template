import type { ContentBlock, ResumeModule } from '@/src/schema/types';
import { richText } from '@/src/schema/richtext';

export function createContentBlock(type: 'paragraph' | 'list' | 'keyValue'): ContentBlock {
  if (type === 'paragraph') {
    return { id: crypto.randomUUID(), type, content: richText('在这里输入内容') };
  }
  if (type === 'list') {
    return {
      id: crypto.randomUUID(),
      type,
      style: 'circle',
      items: [{ id: crypto.randomUUID(), content: richText('新的要点') }],
    };
  }
  return {
    id: crypto.randomUUID(),
    type,
    key: richText('标题'),
    value: richText('内容'),
    keyBold: true,
  };
}

export function createModule(
  type: Exclude<ResumeModule['type'], 'profile'>,
  freeTitle = '自定义模块',
): ResumeModule {
  const base = { id: crypto.randomUUID(), type, visible: true } as const;
  if (type === 'education') {
    return {
      ...base,
      type,
      title: '教育背景',
      entries: [{
        id: crypto.randomUUID(),
        school: richText('学校名称'),
        degree: richText('学历'),
        major: richText('专业'),
        startDate: '2024-09',
        current: true,
        blocks: [],
      }],
    };
  }
  if (type === 'internship') {
    return {
      ...base,
      type,
      title: '实习经历',
      entries: [{
        id: crypto.randomUUID(),
        company: richText('公司名称'),
        role: richText('岗位'),
        startDate: '2026-01',
        current: true,
        projects: [],
      }],
    };
  }
  if (type === 'project') {
    return {
      ...base,
      type,
      title: '项目经历',
      projects: [{
        id: crypto.randomUUID(),
        name: richText('项目名称'),
        role: richText('项目职责'),
        startDate: '2026-01',
        current: true,
        blocks: [createContentBlock('list')],
      }],
    };
  }
  return { ...base, type: 'free', title: freeTitle, blocks: [createContentBlock('paragraph')] };
}
