'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Color, FontFamily, FontSize, TextStyle } from '@tiptap/extension-text-style';
import type { RichTextContent } from '@/src/schema/types';
import { normalizeSafeUrl } from '@/src/utils/url';

interface RichTextEditorProps {
  content: RichTextContent;
  onChange: (content: RichTextContent) => void;
  ariaLabel: string;
  compact?: boolean;
}

function Toolbar({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {
  const setLink = () => {
    const previous = (editor.getAttributes('link').href as string | undefined) ?? '';
    const value = window.prompt('链接地址', previous);
    if (value === null) return;
    if (!value.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    const href = normalizeSafeUrl(value);
    if (!href) {
      window.alert('仅支持 http、https、mailto 和 tel 链接');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  };

  return (
    <div className="rich-toolbar" role="toolbar" aria-label="局部文本样式">
      <select aria-label="字体" defaultValue="" onChange={(event) => event.target.value && editor.chain().focus().setFontFamily(event.target.value).run()}>
        <option value="">字体</option><option value="Microsoft YaHei">微软雅黑</option><option value="SimSun">宋体</option><option value="Noto Sans CJK SC">思源黑体</option>
      </select>
      <select aria-label="字号" defaultValue="" onChange={(event) => event.target.value && editor.chain().focus().setFontSize(event.target.value).run()}>
        <option value="">字号</option><option value="9pt">9pt</option><option value="10pt">10pt</option><option value="12pt">12pt</option><option value="14pt">14pt</option>
      </select>
      <button type="button" aria-label="加粗" className={editor.isActive('bold') ? 'active' : ''} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button type="button" aria-label="斜体" className={editor.isActive('italic') ? 'active' : ''} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
      <button type="button" aria-label="下划线" className={editor.isActive('underline') ? 'active' : ''} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
      <label className="color-control" aria-label="文字颜色"><input type="color" defaultValue="#20252d" onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} /></label>
      <button type="button" aria-label="添加或修改链接" className={editor.isActive('link') ? 'active' : ''} onClick={setLink}>链接</button>
      {editor.isActive('link') && <button type="button" aria-label="取消链接" onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}>取消</button>}
    </div>
  );
}

export function RichTextEditor({ content, onChange, ariaLabel, compact = false }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false, orderedList: false, listItem: false, link: false, underline: false }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Underline,
      Link.configure({ openOnClick: false, protocols: ['http', 'https', 'mailto', 'tel'] }),
    ],
    content,
    editorProps: { attributes: { role: 'textbox', 'aria-label': ariaLabel, class: 'rich-editor-content' } },
    onUpdate: ({ editor: current }) => onChange(current.getJSON()),
  });

  useEffect(() => {
    if (!editor) return;
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return <div className="rich-editor-loading" aria-label={ariaLabel} />;
  return (
    <div className={compact ? 'rich-editor rich-editor--compact' : 'rich-editor'}>
      <Toolbar editor={editor} />
      <BubbleMenu editor={editor} shouldShow={({ from, to }) => from !== to}><Toolbar editor={editor} /></BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
