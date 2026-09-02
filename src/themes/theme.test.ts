import { describe, expect, it } from 'vitest';
import { defaultTheme, mergeTheme, themeToCssVariables } from '@/src/themes/theme';

describe('theme inheritance', () => {
  it('applies only module overrides without mutating the global theme', () => {
    const merged = mergeTheme(defaultTheme, { fontSize: 9, sectionGap: 3 });

    expect(merged.fontSize).toBe(9);
    expect(merged.sectionGap).toBe(3);
    expect(merged.page.marginTop).toBe(defaultTheme.page.marginTop);
    expect(defaultTheme.fontSize).not.toBe(9);
  });

  it('maps physical page settings to mm-based CSS variables', () => {
    const variables = themeToCssVariables(defaultTheme);

    expect(variables['--page-margin-top']).toMatch(/mm$/);
    expect(variables['--page-margin-left']).toMatch(/mm$/);
    expect(variables['--font-size']).toMatch(/pt$/);
  });
});
