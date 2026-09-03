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

  it('aligns each marker with the first line of multiline text', () => {
    const { container } = render(
      <ContentBlockView
        block={{
          id: crypto.randomUUID(),
          type: 'list',
          style: 'circle',
          blockStyle: { lineHeight: 1.2 },
          items: [{
            id: crypto.randomUUID(),
            content: {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [
                  { type: 'text', text: '第一行正文' },
                  { type: 'hardBreak' },
                  { type: 'text', text: '第二行正文' },
                ],
              }],
            },
          }],
        }}
      />,
    );

    const row = container.querySelector<HTMLElement>('.resume-list-row');
    const marker = container.querySelector<HTMLElement>('.resume-list-marker');
    expect(row).not.toBeNull();
    expect(marker).not.toBeNull();
    expect(row!.style.alignItems).toBe('start');
    expect(marker!.style.alignSelf).toBe('start');
    expect(marker!.style.lineHeight).toBe('inherit');
    expect(marker!.style.height).toBe('1lh');
  });
});
