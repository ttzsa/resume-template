import { describe, expect, it } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { decodeResumePayload, encodeResumePayload } from '@/src/pdf/payload';

describe('print payload', () => {
  it('round-trips Chinese structured resume JSON through a URL-safe payload', () => {
    const resume = createExampleResume();
    const encoded = encodeResumePayload(resume);
    const decoded = decodeResumePayload(encoded);

    expect(encoded).not.toMatch(/[+/=]/);
    expect(decoded.metadata.title).toBe(resume.metadata.title);
  });
});
