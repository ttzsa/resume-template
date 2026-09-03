import { describe, expect, it } from 'vitest';
import { defaultTheme, mergeTheme, themeToCssVariables } from '@/src/themes/theme';
import { ResumeSchema } from '@/src/schema/resume';
import { createExampleResume } from '@/src/schema/example';

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

  it('maps body, date, entry separator and shared content spacing controls', () => {
    const variables = themeToCssVariables({
      ...defaultTheme,
      color: '#123456',
      paragraphGap: 2.4,
      entryHeader: {
        ...defaultTheme.entryHeader,
        dateColor: '#654321',
        separator: 'dash',
      },
    });

    expect(variables['--text-color']).toBe('#123456');
    expect(variables['--date-color']).toBe('#654321');
    expect(variables['--entry-separator']).toBe("'–'");
    expect(variables['--paragraph-gap']).toBe('2.4mm');
  });

  it('uses pure black body text by default', () => {
    expect(defaultTheme.color).toBe('#000000');
  });

  it('uses Times New Roman first for Latin letters and numbers while preserving the chosen CJK font', () => {
    const variables = themeToCssVariables({
      ...defaultTheme,
      fontFamily: 'KaiTi, STKaiti, serif',
    });

    expect(variables['--font-family']).toBe('"Times New Roman", Times, KaiTi, STKaiti, serif');
  });

  it('allows negative bullet indentation without changing schema validity', () => {
    const resume = createExampleResume();
    resume.theme.bullet.indent = -4;

    expect(ResumeSchema.safeParse(resume).success).toBe(true);
    expect(themeToCssVariables(resume.theme)['--bullet-indent']).toBe('-4mm');
  });
});
