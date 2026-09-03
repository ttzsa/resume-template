import type { ResumeModule } from '@/src/schema/types';
import { mergeTheme, themeToCssVariables } from '@/src/themes/theme';
import { ContentBlockView } from '@/src/renderer/content-block-view';
import {
  EducationEntryView,
  InternshipEntryView,
  ProjectEntryView,
} from '@/src/renderer/entry-renderers';
import { GithubIcon, MailIcon, PhoneIcon } from '@/src/renderer/icons';
import { RichTextView } from '@/src/renderer/rich-text-view';
import type { ResumeTheme } from '@/src/schema/types';
import { richText } from '@/src/schema/richtext';
import type { CSSProperties } from 'react';

function ProfileView({ module }: { module: Extract<ResumeModule, { type: 'profile' }> }) {
  const photo = module.photo?.visible && module.photo.src ? module.photo : undefined;
  const photoStyle = photo ? {
    '--profile-photo-width': `${photo.width}mm`,
    '--profile-photo-reserve': `${photo.width + Math.max(0, -(photo.offsetX ?? 0)) + 8}mm`,
  } as CSSProperties : undefined;
  return (
    <header
      className={photo ? 'resume-profile resume-profile--with-photo' : 'resume-profile'}
      data-module-id={module.id}
      style={photoStyle}
    >
      <div className="resume-profile-main">
        <div className="resume-identity">
          <RichTextView className="resume-name" content={module.name} />
          {module.targetRole && <RichTextView className="resume-role" content={module.targetRole} />}
        </div>
        <div className="resume-contact-list">
          {module.phone.visible && module.phone.value && (
            <span className="resume-contact"><PhoneIcon /><RichTextView content={module.phone.content ?? richText(module.phone.value)} /></span>
          )}
          {module.email.visible && module.email.value && (
            <span className="resume-contact"><MailIcon /><RichTextView content={module.email.content ?? richText(module.email.value)} /></span>
          )}
          {module.github?.visible && module.github.value && (
            <span className="resume-contact"><GithubIcon /><RichTextView content={module.github.content ?? richText(module.github.value)} /></span>
          )}
          {module.customFields.filter((field) => field.visible).map((field) => (
            <span className="resume-contact resume-custom-field" key={field.id}>
              <span className="resume-custom-label">{field.label}</span>
              <RichTextView content={field.value} />
            </span>
          ))}
        </div>
      </div>
      {photo && (
        <img
          className="resume-photo"
          src={photo.src}
          alt="简历头像"
          style={{
            width: `${photo.width}mm`,
            height: `${photo.height}mm`,
            borderRadius: 0,
            objectPosition: photo.objectPosition,
            right: `${-(photo.offsetX ?? 0)}mm`,
            top: `${photo.offsetY ?? 0}mm`,
          }}
        />
      )}
    </header>
  );
}

function SectionTitle({ title }: { title?: string }) {
  if (!title) return null;
  return <h2 className="resume-section-title"><span>{title}</span></h2>;
}

export function ModuleRenderer({ module, theme }: { module: ResumeModule; theme: ResumeTheme }) {
  if (!module.visible) return null;
  const moduleTheme = mergeTheme(theme, module.style);
  const style = themeToCssVariables(moduleTheme);

  if (module.type === 'profile') return <ProfileView module={module} />;

  return (
    <section className={`resume-section resume-section--${module.type}`} style={style} data-module-id={module.id}>
      <SectionTitle title={module.title} />
      {module.type === 'education' && module.entries.map((entry) => (
        <EducationEntryView key={entry.id} entry={entry} />
      ))}
      {module.type === 'internship' && module.entries.map((entry) => (
        <InternshipEntryView key={entry.id} entry={entry} />
      ))}
      {module.type === 'project' && module.projects.map((project) => (
        <ProjectEntryView key={project.id} project={project} />
      ))}
      {module.type === 'free' && module.blocks.map((block) => (
        <ContentBlockView key={block.id} block={block} />
      ))}
    </section>
  );
}
