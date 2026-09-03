import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EducationEntryView, ProjectEntryView } from '@/src/renderer/entry-renderers';
import { linkedText, richText } from '@/src/schema/richtext';

describe('entry renderers', () => {
  it('renders education otherInfo and a right-side date range', () => {
    const { container } = render(
      <EducationEntryView
        entry={{
          id: crypto.randomUUID(),
          school: richText('南京航空航天大学'),
          degree: richText('硕士'),
          major: richText('软件工程'),
          otherInfo: linkedText('学校官网', 'https://www.nuaa.edu.cn'),
          startDate: '2024-09',
          endDate: '2027-04',
          blocks: [],
        }}
      />,
    );

    expect(screen.getByText('南京航空航天大学')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '学校官网' })).toBeInTheDocument();
    expect(screen.getByText('2024.09 – 2027.04')).toBeInTheDocument();
    expect(container.querySelector('.resume-entry-header')?.children).toHaveLength(3);
  });

  it('renders project details through the shared project component', () => {
    render(
      <ProjectEntryView
        project={{
          id: crypto.randomUUID(),
          name: richText('Globex Agent'),
          role: richText('AI Agent 开发'),
          otherInfo: linkedText('Demo', 'https://example.com/demo'),
          blocks: [],
        }}
      />,
    );

    expect(screen.getByText('Globex Agent')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Demo' })).toBeInTheDocument();
  });

  it('does not render separators or an empty header row for blank project fields', () => {
    const { container } = render(
      <ProjectEntryView
        project={{
          id: crypto.randomUUID(),
          name: richText(''),
          role: richText(''),
          otherInfo: richText(''),
          blocks: [],
        }}
      />,
    );

    expect(container.querySelector('.resume-entry-header')).not.toBeInTheDocument();
    expect(container.querySelector('.resume-entry-field')).not.toBeInTheDocument();
  });

  it('supports a removable, single-line entry header with per-entry typography', () => {
    const { container, rerender } = render(
      <ProjectEntryView
        project={{
          id: crypto.randomUUID(),
          name: richText('智能文档 Agent'),
          role: richText('核心开发'),
          blocks: [],
          header: { visible: true, layout: 'single-line', fontSize: 8.5 },
        }}
      />,
    );

    expect(container.querySelector('.resume-entry-header--single-line')?.getAttribute('style')).toContain('font-size: 8.5pt');

    rerender(
      <ProjectEntryView
        project={{
          id: crypto.randomUUID(),
          name: richText('智能文档 Agent'),
          role: richText('核心开发'),
          blocks: [],
          header: { visible: false },
        }}
      />,
    );
    expect(container.querySelector('.resume-entry-header')).not.toBeInTheDocument();
  });

  it('renders the date dash as a separately centered element', () => {
    const { container } = render(
      <ProjectEntryView
        project={{
          id: crypto.randomUUID(),
          name: richText('项目名'),
          startDate: '2025-01',
          endDate: '2025-12',
          blocks: [],
        }}
      />,
    );

    expect(container.querySelector('.resume-date-separator')).toHaveTextContent('–');
  });
});
