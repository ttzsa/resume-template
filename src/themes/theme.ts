import type { CSSProperties } from 'react';
import type { ModuleStyle, ResumeTheme } from '@/src/schema/types';

export const defaultTheme: ResumeTheme = {
  page: { marginTop: 10, marginRight: 12, marginBottom: 10, marginLeft: 12 },
  fontFamily:
    '"Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif',
  fontSize: 9.5,
  color: '#000000',
  lineHeight: 1.38,
  paragraphGap: 1.2,
  sectionGap: 3.8,
  entryGap: 2.4,
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: 750,
    color: '#17233a',
    marginBottom: 1.8,
    showRule: true,
    ruleWidth: 0.35,
    ruleColor: '#23385f',
    ruleGap: 1.2,
  },
  entryHeader: {
    fontSize: 10,
    fontWeight: 700,
    fieldGap: 2.2,
    dateAlignRight: true,
    dateColor: '#687487',
    separator: 'dot',
  },
  bullet: {
    style: 'circle',
    size: 1.3,
    indent: 3.8,
    textGap: 1.8,
    itemGap: 0.7,
    color: '#23385f',
  },
  link: { color: 'inherit', underline: false, fontWeight: 600 },
  photo: { width: 25, height: 33, borderRadius: 1.8, objectFit: 'cover', objectPosition: '50% 50%' },
};

export function mergeTheme(theme: ResumeTheme, override?: ModuleStyle): ResumeTheme {
  if (!override) return theme;
  return {
    ...theme,
    ...override,
    page: theme.page,
    sectionTitle: theme.sectionTitle,
    entryHeader: theme.entryHeader,
    bullet: theme.bullet,
    link: theme.link,
    photo: theme.photo,
  };
}

export type ResumeCssVariables = CSSProperties & Record<`--${string}`, string | number>;

const withTimesNewRomanForLatin = (fontFamily: string) =>
  /^\s*["']?Times New Roman["']?\s*(?:,|$)/i.test(fontFamily)
    ? fontFamily
    : `"Times New Roman", Times, ${fontFamily}`;

export function themeToCssVariables(theme: ResumeTheme): ResumeCssVariables {
  return {
    '--page-margin-top': `${theme.page.marginTop}mm`,
    '--page-margin-right': `${theme.page.marginRight}mm`,
    '--page-margin-bottom': `${theme.page.marginBottom}mm`,
    '--page-margin-left': `${theme.page.marginLeft}mm`,
    '--font-family': withTimesNewRomanForLatin(theme.fontFamily),
    '--font-size': `${theme.fontSize}pt`,
    '--text-color': theme.color,
    '--line-height': theme.lineHeight,
    '--paragraph-gap': `${theme.paragraphGap}mm`,
    '--section-gap': `${theme.sectionGap}mm`,
    '--entry-gap': `${theme.entryGap}mm`,
    '--section-title-size': `${theme.sectionTitle.fontSize}pt`,
    '--section-title-weight': theme.sectionTitle.fontWeight,
    '--section-title-color': theme.sectionTitle.color,
    '--section-title-margin': `${theme.sectionTitle.marginBottom}mm`,
    '--section-rule-width': `${theme.sectionTitle.ruleWidth}mm`,
    '--section-rule-color': theme.sectionTitle.ruleColor,
    '--section-rule-gap': `${theme.sectionTitle.ruleGap}mm`,
    '--entry-header-size': `${theme.entryHeader.fontSize}pt`,
    '--entry-header-weight': theme.entryHeader.fontWeight,
    '--entry-field-gap': `${theme.entryHeader.fieldGap}mm`,
    '--date-color': theme.entryHeader.dateColor ?? '#687487',
    '--entry-separator': (theme.entryHeader.separator ?? 'dot') === 'dot'
      ? "'·'"
      : theme.entryHeader.separator === 'dash'
        ? "'–'"
        : "''",
    '--bullet-size': `${theme.bullet.size}mm`,
    '--bullet-indent': `${theme.bullet.indent}mm`,
    '--bullet-text-gap': `${theme.bullet.textGap}mm`,
    '--bullet-item-gap': `${theme.bullet.itemGap}mm`,
    '--bullet-color': theme.bullet.color,
    '--link-color': theme.link.color,
    '--link-decoration': theme.link.underline ? 'underline' : 'none',
    '--link-weight': theme.link.fontWeight,
  };
}
