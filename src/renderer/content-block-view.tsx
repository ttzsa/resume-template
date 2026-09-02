import type { CSSProperties } from 'react';
import type { ContentBlock } from '@/src/schema/types';
import { RichTextView } from '@/src/renderer/rich-text-view';

function blockStyle(block: ContentBlock): CSSProperties | undefined {
  const style = block.type === 'list' ? block.blockStyle : block.style;
  if (!style) return undefined;
  return {
    fontSize: style.fontSize ? `${style.fontSize}pt` : undefined,
    color: style.color,
    lineHeight: style.lineHeight,
    marginTop: style.marginTop ? `${style.marginTop}mm` : undefined,
    marginBottom: style.marginBottom ? `${style.marginBottom}mm` : undefined,
  };
}

interface ContentBlockViewProps {
  block: ContentBlock;
  depth?: number;
}

export function ContentBlockView({ block, depth = 1 }: ContentBlockViewProps) {
  const children = 'children' in block ? block.children : undefined;

  if (block.type === 'paragraph') {
    return (
      <div className="resume-paragraph" style={blockStyle(block)} data-block-id={block.id}>
        <RichTextView content={block.content} />
        {children?.map((child) => (
          <ContentBlockView key={child.id} block={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  if (block.type === 'keyValue') {
    return (
      <div className="resume-key-value-wrap" style={blockStyle(block)} data-block-id={block.id}>
        <div
          className="resume-key-value"
          style={{ gap: block.gap ? `${block.gap}mm` : undefined }}
        >
          <RichTextView
            className={block.keyBold === false ? 'resume-key' : 'resume-key resume-key--bold'}
            content={block.key}
          />
          <RichTextView className="resume-value" content={block.value} />
        </div>
        {children?.map((child) => (
          <ContentBlockView key={child.id} block={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  if (block.type === 'list') {
    return (
      <ol
        className={`resume-list resume-list--${block.style}`}
        style={blockStyle(block)}
        data-block-id={block.id}
      >
        {block.items.map((item) => (
          <li key={item.id}>
            <RichTextView content={item.content} />
            {item.children?.map((child) => (
              <ContentBlockView key={child.id} block={child} depth={depth + 1} />
            ))}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="resume-block-group" style={blockStyle(block)} data-block-id={block.id}>
      {block.children.map((child) => (
        <ContentBlockView key={child.id} block={child} depth={depth + 1} />
      ))}
    </div>
  );
}
