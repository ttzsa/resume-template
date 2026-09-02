import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FONT_OPTIONS, RichTextEditor } from '@/src/richtext/rich-text-editor';
import { richText } from '@/src/schema/richtext';

describe('RichTextEditor', () => {
  it('keeps formatting controls hidden until text is selected', () => {
    render(<RichTextEditor ariaLabel="项目描述" content={richText('结构化内容')} onChange={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: '项目描述' })).toHaveTextContent('结构化内容');
    expect(screen.queryByRole('toolbar', { name: '局部文本样式' })).not.toBeInTheDocument();
  });

  it('offers Times New Roman and KaiTi in every rich-text toolbar', () => {
    expect(FONT_OPTIONS.map((option) => option.label)).toEqual(
      expect.arrayContaining(['Times New Roman', '楷体']),
    );
  });
});
