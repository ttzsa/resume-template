import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentBlockView } from '@/src/renderer/content-block-view';
import { linkedText, richText } from '@/src/schema/richtext';

describe('ContentBlockView', () => {
  it('renders key and rich-text value without flattening the link', () => {
    render(
      <ContentBlockView
        block={{
          id: crypto.randomUUID(),
          type: 'keyValue',
          key: richText('Demo'),
          value: linkedText('在线体验', 'https://example.com'),
          keyBold: true,
        }}
      />,
    );

    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '在线体验' })).toBeInTheDocument();
  });

  it('omits empty list items so no orphan bullet is rendered', () => {
    const { container } = render(
      <ContentBlockView
        block={{
          id: crypto.randomUUID(),
          type: 'list',
          style: 'disc',
          items: [
            { id: crypto.randomUUID(), content: richText('') },
            { id: crypto.randomUUID(), content: richText('有效内容') },
          ],
        }}
      />,
    );

    expect(container.querySelectorAll('.resume-list > li')).toHaveLength(1);
    expect(screen.getByText('有效内容')).toBeInTheDocument();
  });

  it('groups each marker with its own text row for vertical centering', () => {
    const { container } = render(
      <ContentBlockView
        block={{
          id: crypto.randomUUID(),
          type: 'list',
          style: 'circle',
          items: [{ id: crypto.randomUUID(), content: richText('正文') }],
        }}
      />,
    );

    expect(container.querySelector('.resume-list-row > .resume-list-marker')).toBeInTheDocument();
    expect(container.querySelector('.resume-list-row > .resume-list-text')).toHaveTextContent('正文');
  });
});
