import type {
  ContentBlock,
  EducationEntry,
  EntryHeaderConfig,
  ExperienceProject,
  InternshipEntry,
  RichTextContent,
} from '@/src/schema/types';
import type { CSSProperties } from 'react';
import { formatDateRange } from '@/src/utils/date';
import { ContentBlockView } from '@/src/renderer/content-block-view';
import { RichTextView } from '@/src/renderer/rich-text-view';
import { hasRichTextContent } from '@/src/schema/richtext';

interface EntryHeaderProps {
  primary: RichTextContent;
  secondary?: RichTextContent;
  tertiary?: RichTextContent;
  otherInfo?: RichTextContent;
  date?: string;
  header?: EntryHeaderConfig;
}

const separatorContent = (separator?: EntryHeaderConfig['separator']) => separator === 'dash' ? "'–'" : separator === 'none' ? "''" : undefined;

function EntryHeader({ primary, secondary, tertiary, otherInfo, date, header }: EntryHeaderProps) {
  if (header?.visible === false) return null;
  const showPrimary = header?.primaryVisible !== false && hasRichTextContent(primary);
  const showSecondary = header?.secondaryVisible !== false && hasRichTextContent(secondary);
  const showTertiary = header?.tertiaryVisible !== false && hasRichTextContent(tertiary);
  const showOther = header?.otherInfoVisible !== false && hasRichTextContent(otherInfo);
  const showDate = header?.dateVisible !== false && Boolean(date);
  if (!showPrimary && !showSecondary && !showTertiary && !showOther && !showDate) return null;
  const style: CSSProperties & Record<`--${string}`, string | undefined> = {};
  if (header?.fontSize) style.fontSize = `${header.fontSize}pt`;
  if (header?.fieldGap) style.columnGap = `${header.fieldGap}mm`;
  const localSeparator = separatorContent(header?.separator);
  if (localSeparator) style['--entry-separator'] = localSeparator;
  return (
    <div className={`resume-entry-header resume-entry-header--${header?.layout ?? 'wrap'}`} style={style}>
      {showPrimary && <RichTextView className="resume-entry-primary" content={primary} />}
      <div className="resume-entry-fields">
        {showSecondary && <RichTextView className="resume-entry-field" content={secondary} />}
        {showTertiary && <RichTextView className="resume-entry-field" content={tertiary} />}
        {showOther && <RichTextView className="resume-entry-other" content={otherInfo} />}
      </div>
      {showDate && <time className="resume-entry-date">{date}</time>}
    </div>
  );
}

function Blocks({ blocks }: { blocks?: ContentBlock[] }) {
  return blocks?.map((block) => <ContentBlockView key={block.id} block={block} />);
}

export function EducationEntryView({ entry }: { entry: EducationEntry }) {
  return (
    <article className="resume-entry" data-entry-id={entry.id}>
      <EntryHeader
        primary={entry.school}
        secondary={entry.degree}
        tertiary={entry.major}
        otherInfo={entry.otherInfo}
        date={formatDateRange(entry.startDate, entry.endDate, entry.current)}
        header={entry.header}
      />
      <Blocks blocks={entry.blocks} />
    </article>
  );
}

export function ProjectEntryView({ project }: { project: ExperienceProject }) {
  return (
    <article className="resume-entry resume-project" data-entry-id={project.id}>
      <EntryHeader
        primary={project.name}
        secondary={project.role}
        otherInfo={project.otherInfo}
        date={formatDateRange(project.startDate, project.endDate, project.current)}
        header={project.header}
      />
      <Blocks blocks={project.blocks} />
    </article>
  );
}

export function InternshipEntryView({ entry }: { entry: InternshipEntry }) {
  return (
    <article className="resume-entry resume-internship" data-entry-id={entry.id}>
      <EntryHeader
        primary={entry.company}
        secondary={entry.role}
        otherInfo={entry.otherInfo}
        date={formatDateRange(entry.startDate, entry.endDate, entry.current)}
        header={entry.header}
      />
      <Blocks blocks={entry.blocks} />
      {entry.projects.map((project) => (
        <ProjectEntryView key={project.id} project={project} />
      ))}
    </article>
  );
}
