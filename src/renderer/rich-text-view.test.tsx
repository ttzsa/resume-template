import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { linkedText } from '@/src/schema/richtext';
import { RichTextView } from '@/src/renderer/rich-text-view';

describe('RichTextView', () => {
  it('renders a safe Tiptap link as a real anchor', () => {
    render(<RichTextView content={linkedText('在线 Demo', 'https://example.com/demo')} />);

    expect(screen.getByRole('link', { name: '在线 Demo' })).toHaveAttribute(
      'href',
      'https://example.com/demo',
    );
  });

  it('does not render unsafe link protocols', () => {
    render(<RichTextView content={linkedText('危险链接', 'javascript:alert(1)')} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('危险链接')).toBeInTheDocument();
  });
});
