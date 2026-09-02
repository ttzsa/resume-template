'use client';

import { useResumeStore } from '@/src/store/provider';

function NumberField({ label, value, unit, min = 0, max = 100, step = 0.1, onChange }: { label: string; value: number; unit?: string; min?: number; max?: number; step?: number; onChange: (value: number) => void }) {
  return <label className="design-field"><span>{label}{unit && <small>{unit}</small>}</span><input aria-label={label} type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

export function DesignPanel() {
  const theme = useResumeStore((state) => state.resume.theme);
  const updateTheme = useResumeStore((state) => state.updateTheme);
  const updatePage = (key: keyof typeof theme.page, value: number) => updateTheme({ page: { ...theme.page, [key]: value } });

  return (
    <div className="editor-scroll design-panel">
      <div className="design-intro"><span className="eyebrow">DESIGN SYSTEM</span><h2>全局样式</h2><p>所有视觉设置通过 CSS Variables 进入同一个预览与打印 Renderer。</p></div>
      <details open className="design-group"><summary>页面</summary><div className="design-grid">
        <NumberField label="上边距" unit="mm" value={theme.page.marginTop} onChange={(value) => updatePage('marginTop', value)} />
        <NumberField label="下边距" unit="mm" value={theme.page.marginBottom} onChange={(value) => updatePage('marginBottom', value)} />
        <NumberField label="左边距" unit="mm" value={theme.page.marginLeft} onChange={(value) => updatePage('marginLeft', value)} />
        <NumberField label="右边距" unit="mm" value={theme.page.marginRight} onChange={(value) => updatePage('marginRight', value)} />
      </div></details>
      <details open className="design-group"><summary>字体与段落</summary><div className="design-grid">
        <label className="design-field design-field--wide"><span>默认字体</span><select aria-label="默认字体" value={theme.fontFamily} onChange={(event) => updateTheme({ fontFamily: event.target.value })}><option value='"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif'>思源黑体 / 微软雅黑</option><option value='"Noto Serif CJK SC", "Source Han Serif SC", SimSun, serif'>思源宋体 / 宋体</option><option value='"Microsoft YaHei", "PingFang SC", sans-serif'>微软雅黑 / 苹方</option><option value='"Times New Roman", serif'>Times New Roman</option><option value='KaiTi, STKaiti, serif'>楷体</option></select></label>
        <NumberField label="默认字号" unit="pt" value={theme.fontSize} min={6} max={18} onChange={(value) => updateTheme({ fontSize: value })} />
        <NumberField label="行高" value={theme.lineHeight} min={1} max={2} step={0.05} onChange={(value) => updateTheme({ lineHeight: value })} />
        <NumberField label="段间距" unit="mm" value={theme.paragraphGap} onChange={(value) => updateTheme({ paragraphGap: value })} />
        <NumberField label="模块间距" unit="mm" value={theme.sectionGap} onChange={(value) => updateTheme({ sectionGap: value })} />
        <label className="design-field"><span>正文颜色</span><input aria-label="正文颜色" type="color" value={theme.color} onChange={(event) => updateTheme({ color: event.target.value })} /></label>
      </div></details>
      <details className="design-group"><summary>模块标题</summary><div className="design-grid">
        <NumberField label="标题字号" unit="pt" value={theme.sectionTitle.fontSize} onChange={(value) => updateTheme({ sectionTitle: { ...theme.sectionTitle, fontSize: value } })} />
        <NumberField label="标题粗细" value={theme.sectionTitle.fontWeight} min={300} max={900} step={50} onChange={(value) => updateTheme({ sectionTitle: { ...theme.sectionTitle, fontWeight: value } })} />
        <NumberField label="横线粗细" unit="mm" value={theme.sectionTitle.ruleWidth} onChange={(value) => updateTheme({ sectionTitle: { ...theme.sectionTitle, ruleWidth: value } })} />
        <label className="design-field"><span>标题颜色</span><input aria-label="标题颜色" type="color" value={theme.sectionTitle.color} onChange={(event) => updateTheme({ sectionTitle: { ...theme.sectionTitle, color: event.target.value } })} /></label>
        <label className="design-field"><span>日期颜色</span><input aria-label="日期颜色" type="color" value={theme.entryHeader.dateColor ?? '#687487'} onChange={(event) => updateTheme({ entryHeader: { ...theme.entryHeader, dateColor: event.target.value } })} /></label>
        <label className="design-field"><span>字段分隔符</span><select aria-label="字段分隔符" value={theme.entryHeader.separator ?? 'dot'} onChange={(event) => updateTheme({ entryHeader: { ...theme.entryHeader, separator: event.target.value as NonNullable<typeof theme.entryHeader.separator> } })}><option value="dot">点号 ·</option><option value="dash">短横线 –</option><option value="none">无</option></select></label>
        <NumberField label="字段间距" unit="mm" value={theme.entryHeader.fieldGap} onChange={(value) => updateTheme({ entryHeader: { ...theme.entryHeader, fieldGap: value } })} />
      </div></details>
      <details className="design-group"><summary>列表与链接</summary><div className="design-grid">
        <NumberField label="Bullet 缩进" unit="mm" value={theme.bullet.indent} onChange={(value) => updateTheme({ bullet: { ...theme.bullet, indent: value } })} />
        <NumberField label="内容项间距" unit="mm" value={theme.paragraphGap} onChange={(value) => updateTheme({ paragraphGap: value, bullet: { ...theme.bullet, itemGap: value } })} />
        <label className="design-field"><span>链接颜色</span><input aria-label="链接颜色" type="color" value={theme.link.color === 'inherit' ? theme.color : theme.link.color} onChange={(event) => updateTheme({ link: { ...theme.link, color: event.target.value } })} /></label>
        <label className="design-check"><input type="checkbox" checked={theme.link.underline} onChange={(event) => updateTheme({ link: { ...theme.link, underline: event.target.checked } })} /><span>链接下划线</span></label>
      </div></details>
    </div>
  );
}
