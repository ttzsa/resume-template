import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RichTextEditor } from '@/src/richtext/rich-text-editor';
import { richText } from '@/src/schema/richtext';

describe('RichTextEditor', () => {
  it('exposes local formatting and link controls for a rich-text field', () => {
    render(<RichTextEditor ariaLabel="项目描述" content={richText('结构化内容')} onChange={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: '项目描述' })).toHaveTextContent('结构化内容');
    expect(screen.getByRole('button', { name: '加粗' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '添加或修改链接' })).toBeInTheDocument();
  });
});
