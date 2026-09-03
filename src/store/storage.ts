import { del, get, set } from 'idb-keyval';
import type { Resume } from '@/src/schema/types';
import { ResumeSchema } from '@/src/schema/resume';

const STORAGE_KEY = 'jian-ce:resume:v1';

export async function saveResumeLocally(resume: Resume) {
  await set(STORAGE_KEY, resume);
}

export async function loadLocalResume(): Promise<Resume | null> {
  const value: unknown = await get(STORAGE_KEY);
  const parsed = ResumeSchema.safeParse(value);
  if (!parsed.success) return null;
  if (parsed.data.theme.color.toLowerCase() !== '#20252d') return parsed.data;
  return { ...parsed.data, theme: { ...parsed.data.theme, color: '#000000' } };
}

export async function clearLocalResume() {
  await del(STORAGE_KEY);
}
