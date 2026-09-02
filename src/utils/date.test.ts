import { describe, expect, it } from 'vitest';
import { formatDateRange } from '@/src/utils/date';

describe('formatDateRange', () => {
  it('formats stored YYYY-MM values with dots', () => {
    expect(formatDateRange('2024-09', '2027-04')).toBe('2024.09 – 2027.04');
  });

  it('supports a current end date', () => {
    expect(formatDateRange('2026-07', undefined, true)).toBe('2026.07 – 至今');
  });
});
