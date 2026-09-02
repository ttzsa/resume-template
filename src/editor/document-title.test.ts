import { describe, expect, it } from 'vitest';
import { getResumeDisplayTitle } from '@/src/editor/document-title';
import { createExampleResume } from '@/src/schema/example';
import { richText } from '@/src/schema/richtext';

describe('getResumeDisplayTitle', () => {
  it('follows the current profile name and target role', () => {
    const resume = createExampleResume();
    const profile = resume.modules.find((module) => module.type === 'profile');
    if (!profile || profile.type !== 'profile') throw new Error('profile fixture missing');
    profile.name = richText('陈序');
    profile.targetRole = richText('前端架构师');

    expect(getResumeDisplayTitle(resume)).toBe('陈序 · 前端架构师简历');
  });
});
