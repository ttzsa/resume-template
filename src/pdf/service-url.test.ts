import { describe, expect, it } from 'vitest';
import { resolvePdfServiceUrl } from '@/src/pdf/service-url';

describe('resolvePdfServiceUrl', () => {
  it('uses the local PDF service during local development', () => {
    expect(resolvePdfServiceUrl(undefined, 'localhost')).toBe('http://localhost:8000');
  });

  it('does not assume a PDF service for a deployed host', () => {
    expect(resolvePdfServiceUrl(undefined, 'resume.example.com')).toBeUndefined();
  });
});
