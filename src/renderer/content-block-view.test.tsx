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
});
