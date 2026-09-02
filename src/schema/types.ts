import type { JSONContent } from '@tiptap/core';

export type RichTextContent = JSONContent;

export type ResumeModuleType =
  | 'profile'
  | 'education'
  | 'internship'
  | 'project'
  | 'free';

export interface ThemePage {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
}

export interface ResumeTheme {
  page: ThemePage;
  fontFamily: string;
  fontSize: number;
  color: string;
  lineHeight: number;
  paragraphGap: number;
  sectionGap: number;
  entryGap: number;
  sectionTitle: {
    fontSize: number;
    fontWeight: number;
    color: string;
    marginBottom: number;
    showRule: boolean;
    ruleWidth: number;
    ruleColor: string;
    ruleGap: number;
  };
  entryHeader: {
    fontSize: number;
    fontWeight: number;
    fieldGap: number;
    dateAlignRight: boolean;
    dateColor?: string;
    separator?: 'dot' | 'dash' | 'none';
  };
  bullet: {
    style: 'circle' | 'disc' | 'decimal';
    size: number;
    indent: number;
    textGap: number;
    itemGap: number;
    color: string;
  };
  link: {
    color: string;
    underline: boolean;
    fontWeight: number;
  };
  photo: {
    width: number;
    height: number;
    borderRadius: number;
    objectFit: 'cover' | 'contain';
    objectPosition: string;
  };
}

export interface ModuleStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  lineHeight?: number;
  paragraphGap?: number;
  sectionGap?: number;
  entryGap?: number;
}

export interface BlockStyle {
  fontSize?: number;
  color?: string;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
}

export interface BaseModule {
  id: string;
  type: ResumeModuleType;
  title?: string;
  visible: boolean;
  style?: ModuleStyle;
}

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  content: RichTextContent;
  style?: BlockStyle;
  children?: ContentBlock[];
}

export interface ListItem {
  id: string;
  content: RichTextContent;
  children?: ContentBlock[];
}

export interface ListBlock {
  id: string;
  type: 'list';
  style: 'circle' | 'disc' | 'decimal';
  items: ListItem[];
  blockStyle?: BlockStyle;
}

export interface KeyValueBlock {
  id: string;
  type: 'keyValue';
  key: RichTextContent;
  value: RichTextContent;
  keyBold?: boolean;
  keyWidth?: number;
  gap?: number;
  style?: BlockStyle;
  children?: ContentBlock[];
}

export interface GroupBlock {
  id: string;
  type: 'group';
  children: ContentBlock[];
  style?: BlockStyle;
}

export type ContentBlock = ParagraphBlock | ListBlock | KeyValueBlock | GroupBlock;

export interface DateRange {
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface EntryHeaderConfig {
  visible?: boolean;
  layout?: 'single-line' | 'wrap';
  fontSize?: number;
  separator?: 'dot' | 'dash' | 'none';
  fieldGap?: number;
  primaryVisible?: boolean;
  secondaryVisible?: boolean;
  tertiaryVisible?: boolean;
  otherInfoVisible?: boolean;
  dateVisible?: boolean;
}

export interface CustomField {
  id: string;
  label: string;
  value: RichTextContent;
  visible: boolean;
}

export interface ProfileModule extends BaseModule {
  type: 'profile';
  name: RichTextContent;
  targetRole?: RichTextContent;
  phone: { value: string; content?: RichTextContent; visible: boolean };
  email: { value: string; content?: RichTextContent; visible: boolean };
  customFields: CustomField[];
  photo?: {
    src: string;
    visible: boolean;
    width: number;
    height: number;
    borderRadius: number;
    objectPosition?: string;
    offsetX?: number;
    offsetY?: number;
  };
}

export interface EducationEntry extends DateRange {
  id: string;
  school: RichTextContent;
  degree?: RichTextContent;
  major?: RichTextContent;
  otherInfo?: RichTextContent;
  blocks: ContentBlock[];
  header?: EntryHeaderConfig;
}

export interface EducationModule extends BaseModule {
  type: 'education';
  entries: EducationEntry[];
}

export interface ExperienceProject extends DateRange {
  id: string;
  name: RichTextContent;
  role?: RichTextContent;
  otherInfo?: RichTextContent;
  blocks: ContentBlock[];
  header?: EntryHeaderConfig;
}

export interface InternshipEntry extends DateRange {
  id: string;
  company: RichTextContent;
  role?: RichTextContent;
  otherInfo?: RichTextContent;
  blocks?: ContentBlock[];
  projects: ExperienceProject[];
  header?: EntryHeaderConfig;
}

export interface InternshipModule extends BaseModule {
  type: 'internship';
  entries: InternshipEntry[];
}

export interface ProjectModule extends BaseModule {
  type: 'project';
  projects: ExperienceProject[];
}

export interface FreeModule extends BaseModule {
  type: 'free';
  title: string;
  blocks: ContentBlock[];
}

export type ResumeModule =
  | ProfileModule
  | EducationModule
  | InternshipModule
  | ProjectModule
  | FreeModule;

export interface ResumeMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  version: 1;
  metadata: ResumeMetadata;
  theme: ResumeTheme;
  modules: ResumeModule[];
}
