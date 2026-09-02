import { Fragment, type ReactNode } from 'react';
import type { JSONContent } from '@tiptap/core';
import { normalizeSafeUrl } from '@/src/utils/url';

interface RichTextViewProps {
  content?: JSONContent;
  className?: string;
}

function renderMarkedText(node: JSONContent, key: string): ReactNode {
  let value: ReactNode = node.text ?? '';

  for (const [index, mark] of (node.marks ?? []).entries()) {
    const markKey = `${key}-mark-${index}`;
    if (mark.type === 'bold') value = <strong key={markKey}>{value}</strong>;
    if (mark.type === 'italic') value = <em key={markKey}>{value}</em>;
    if (mark.type === 'underline') value = <u key={markKey}>{value}</u>;
    if (mark.type === 'textStyle') {
      const attrs = mark.attrs ?? {};
      value = (
        <span
          key={markKey}
          style={{
            color: typeof attrs.color === 'string' ? attrs.color : undefined,
            fontFamily: typeof attrs.fontFamily === 'string' ? attrs.fontFamily : undefined,
            fontSize: typeof attrs.fontSize === 'string' ? attrs.fontSize : undefined,
          }}
        >
          {value}
        </span>
      );
    }
    if (mark.type === 'link') {
      const rawHref = typeof mark.attrs?.href === 'string' ? mark.attrs.href : '';
      const href = normalizeSafeUrl(rawHref);
      if (href) {
        value = (
          <a key={markKey} href={href} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        );
      }
    }
  }

  return value;
}

function renderNode(node: JSONContent, key: string): ReactNode {
  if (node.type === 'text') return renderMarkedText(node, key);
  if (node.type === 'hardBreak') return <br key={key} />;

  const children = (node.content ?? []).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );
  if (node.type === 'paragraph') {
    return (
      <span className="rich-paragraph" key={key}>
        {children}
      </span>
    );
  }
  return <Fragment key={key}>{children}</Fragment>;
}

export function RichTextView({ content, className }: RichTextViewProps) {
  if (!content) return null;
  return <span className={className}>{renderNode(content, 'rich')}</span>;
}
