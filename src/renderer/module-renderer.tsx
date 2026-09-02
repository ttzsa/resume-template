import type { ResumeModule } from '@/src/schema/types';
import { mergeTheme, themeToCssVariables } from '@/src/themes/theme';
import { ContentBlockView } from '@/src/renderer/content-block-view';
import {
  EducationEntryView,
  InternshipEntryView,
  ProjectEntryView,
} from '@/src/renderer/entry-renderers';
import { MailIcon, PhoneIcon } from '@/src/renderer/icons';
import { RichTextView } from '@/src/renderer/rich-text-view';
import type { ResumeTheme } from '@/src/schema/types';

function ProfileView({ module }: { module: Extract<ResumeModule, { type: 'profile' }> }) {
  return (
    <header className="resume-profile" data-module-id={module.id}>
      <div className="resume-profile-main">
        <div className="resume-identity">
          <RichTextView className="resume-name" content={module.name} />
          {module.targetRole && <RichTextView className="resume-role" content={module.targetRole} />}
        </div>
        <div className="resume-contact-list">
          {module.phone.visible && module.phone.value && (
            <span className="resume-contact"><PhoneIcon />{module.phone.value}</span>
          )}
          {module.email.visible && module.email.value && (
            <a className="resume-contact" href={`mailto:${module.email.value}`}><MailIcon />{module.email.value}</a>
          )}
          {module.customFields.filter((field) => field.visible).map((field) => (
            <span className="resume-contact resume-custom-field" key={field.id}>
              <span className="resume-custom-label">{field.label}</span>
              <RichTextView content={field.value} />
            </span>
          ))}
        </div>
      </div>
      {module.photo?.visible && module.photo.src && (
        <img
          className="resume-photo"
          src={module.photo.src}
          alt="简历头像"
          style={{
            width: `${module.photo.width}mm`,
            height: `${module.photo.height}mm`,
            borderRadius: `${module.photo.borderRadius}mm`,
            objectPosition: module.photo.objectPosition,
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
