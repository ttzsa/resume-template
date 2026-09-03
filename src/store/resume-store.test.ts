import { describe, expect, it } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { getRichTextPlainText, richText } from '@/src/schema/richtext';
import { createResumeStore } from '@/src/store/resume-store';

describe('resume store history', () => {
  it('undoes and redoes structural and content changes', () => {
    const store = createResumeStore(createExampleResume());
    const profile = store.getState().resume.modules.find((module) => module.type === 'profile');
    if (!profile) throw new Error('profile fixture missing');

    store.getState().updateModule(profile.id, (module) =>
      module.type === 'profile' ? { ...module, name: richText('陈序') } : module,
    );
    expect(getRichTextPlainText(store.getState().resume.modules[0].type === 'profile' ? store.getState().resume.modules[0].name : undefined)).toBe('陈序');

    store.getState().undo();
    expect(getRichTextPlainText(store.getState().resume.modules[0].type === 'profile' ? store.getState().resume.modules[0].name : undefined)).toBe('姓名');

    store.getState().redo();
    expect(getRichTextPlainText(store.getState().resume.modules[0].type === 'profile' ? store.getState().resume.modules[0].name : undefined)).toBe('陈序');
  });

  it('moves modules using stable IDs rather than array keys', () => {
    const store = createResumeStore(createExampleResume());
    const before = store.getState().resume.modules.map((module) => module.id);

    store.getState().moveModule(before[0], before[2]);

    expect(store.getState().resume.modules.map((module) => module.id)).toEqual([
      before[1],
      before[2],
      before[0],
      ...before.slice(3),
    ]);
  });
});
