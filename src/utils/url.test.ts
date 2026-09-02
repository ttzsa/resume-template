import { describe, expect, it } from 'vitest';
import { normalizeSafeUrl } from '@/src/utils/url';

describe('normalizeSafeUrl', () => {
  it('adds https to a bare domain', () => {
    expect(normalizeSafeUrl('example.com')).toBe('https://example.com');
  });

  it.each(['https://example.com', 'mailto:hello@example.com', 'tel:+8613800000000'])(
    'keeps the safe URL %s',
    (url) => expect(normalizeSafeUrl(url)).toBe(url),
  );

  it.each(['javascript:alert(1)', 'data:text/html,<h1>x</h1>', 'ftp://example.com'])(
    'rejects the unsafe URL %s',
    (url) => expect(normalizeSafeUrl(url)).toBeNull(),
  );
});
