import { describe, expect, it } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { ResumeSchema } from '@/src/schema/resume';

describe('ResumeSchema', () => {
  it('accepts the complete structured example resume', () => {
    const result = ResumeSchema.safeParse(createExampleResume());

    expect(result.success).toBe(true);
  });

  it('rejects content blocks nested deeper than three levels', () => {
    const resume = createExampleResume();
    resume.modules.push({
      id: crypto.randomUUID(),
      type: 'free',
      title: '过深模块',
      visible: true,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: 'group',
          children: [
            {
              id: crypto.randomUUID(),
              type: 'group',
              children: [
                {
                  id: crypto.randomUUID(),
                  type: 'group',
                  children: [
                    {
                      id: crypto.randomUUID(),
                      type: 'paragraph',
                      content: { type: 'doc', content: [] },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(ResumeSchema.safeParse(resume).success).toBe(false);
  });
});
