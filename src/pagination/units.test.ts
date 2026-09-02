import { describe, expect, it } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { createPaginationUnits } from '@/src/pagination/units';

describe('createPaginationUnits', () => {
  it('keeps a section title attached to its first entry', () => {
    const resume = createExampleResume();
    const education = resume.modules.find((module) => module.type === 'education');
    if (!education || education.type !== 'education') throw new Error('education fixture missing');
    education.entries.push({ ...education.entries[0], id: crypto.randomUUID() });

    const units = createPaginationUnits(resume.modules);
    const educationUnits = units.filter((unit) => unit.sourceModuleId === education.id);

    expect(educationUnits).toHaveLength(2);
    expect(educationUnits[0].module.title).toBe('教育背景');
    expect(educationUnits[1].module.title).toBeUndefined();
  });

  it('splits free modules at content-block boundaries', () => {
    const resume = createExampleResume();
    const skills = resume.modules.find((module) => module.type === 'free' && module.title === '专业技能');
    if (!skills || skills.type !== 'free') throw new Error('skills fixture missing');

    const units = createPaginationUnits([skills]);

    expect(units).toHaveLength(skills.blocks.length);
    expect(units.every((unit) => unit.atomic)).toBe(true);
  });
});
