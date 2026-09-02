import type { Resume } from '@/src/schema/types';
import { getRichTextPlainText } from '@/src/schema/richtext';

export function getResumeDisplayTitle(resume: Resume): string {
  const profile = resume.modules.find((module) => module.type === 'profile');
  if (!profile || profile.type !== 'profile') return resume.metadata.title;
  const name = getRichTextPlainText(profile.name).trim();
  const role = getRichTextPlainText(profile.targetRole).trim();
  if (!name) return resume.metadata.title;
  return role ? `${name} · ${role}简历` : `${name} · 简历`;
}
