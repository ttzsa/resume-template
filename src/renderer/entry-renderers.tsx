import type {
  ContentBlock,
  EducationEntry,
  ExperienceProject,
  InternshipEntry,
  RichTextContent,
} from '@/src/schema/types';
import { formatDateRange } from '@/src/utils/date';
import { ContentBlockView } from '@/src/renderer/content-block-view';
import { RichTextView } from '@/src/renderer/rich-text-view';

interface EntryHeaderProps {
  primary: RichTextContent;
  secondary?: RichTextContent;
  tertiary?: RichTextContent;
  otherInfo?: RichTextContent;
  date?: string;
}

function EntryHeader({ primary, secondary, tertiary, otherInfo, date }: EntryHeaderProps) {
  return (
    <div className="resume-entry-header">
      <RichTextView className="resume-entry-primary" content={primary} />
      <div className="resume-entry-fields">
        {secondary && <RichTextView className="resume-entry-field" content={secondary} />}
        {tertiary && <RichTextView className="resume-entry-field" content={tertiary} />}
        {otherInfo && <RichTextView className="resume-entry-other" content={otherInfo} />}
      </div>
      {date && <time className="resume-entry-date">{date}</time>}
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
      />
      <Blocks blocks={entry.blocks} />
      {entry.projects.map((project) => (
        <ProjectEntryView key={project.id} project={project} />
      ))}
    </article>
  );
}
