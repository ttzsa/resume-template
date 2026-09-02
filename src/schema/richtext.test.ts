import { describe, expect, it } from 'vitest';
import { hasRichTextContent, richText } from '@/src/schema/richtext';

describe('hasRichTextContent', () => {
  it('treats an empty Tiptap document as empty', () => {
    expect(hasRichTextContent(richText(''))).toBe(false);
  });

  it('recognizes visible text in a nested Tiptap document', () => {
    expect(hasRichTextContent(richText('项目名称'))).toBe(true);
  });
});
