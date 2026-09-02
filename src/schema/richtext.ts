import type { RichTextContent } from '@/src/schema/types';

export const richText = (text: string): RichTextContent => ({
  type: 'doc',
  content: text
    ? [{ type: 'paragraph', content: [{ type: 'text', text }] }]
    : [{ type: 'paragraph' }],
});

export const linkedText = (label: string, href: string): RichTextContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: label,
          marks: [{ type: 'link', attrs: { href, target: '_blank', rel: 'noopener noreferrer' } }],
        },
      ],
    },
  ],
});

export function getRichTextPlainText(content?: RichTextContent): string {
  if (!content) return '';
  if (content.text) return content.text;
  return (content.content ?? []).map(getRichTextPlainText).join('');
}

export function hasRichTextContent(content?: RichTextContent): boolean {
  return getRichTextPlainText(content).trim().length > 0;
}
