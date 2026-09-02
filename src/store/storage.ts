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
  return parsed.success ? parsed.data : null;
}

export async function clearLocalResume() {
  await del(STORAGE_KEY);
}
