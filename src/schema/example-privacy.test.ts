import { describe, expect, it } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { getRichTextPlainText } from '@/src/schema/richtext';

describe('example resume privacy', () => {
  it('uses generic placeholders and the 极简简历 brand', () => {
    const resume = createExampleResume();
    const serialized = JSON.stringify(resume);
    const profile = resume.modules.find((module) => module.type === 'profile');
    if (!profile || profile.type !== 'profile') throw new Error('profile fixture missing');

    expect(getRichTextPlainText(profile.name)).toBe('姓名');
    expect(profile.github?.value).toBe('github.com/username');
    expect(resume.metadata.title).toBe('姓名 · 意向岗位简历');
    expect(serialized).not.toMatch(/林墨|南京航空航天大学|澜光科技|Globex|linmo/i);
  });
});
