import { describe, expect, it } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { exportResumeJson, importResumeJson } from '@/src/store/io';

describe('resume JSON import and export', () => {
  it('round-trips a valid versioned resume', () => {
    const resume = createExampleResume();
    const imported = importResumeJson(exportResumeJson(resume));

    expect(imported.version).toBe(1);
    expect(imported.modules).toHaveLength(resume.modules.length);
  });

  it('returns a readable validation error for invalid data', () => {
    expect(() => importResumeJson('{"version":99,"modules":[]}')).toThrow('简历 JSON 校验失败');
  });
});
