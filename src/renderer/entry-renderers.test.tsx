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
});
