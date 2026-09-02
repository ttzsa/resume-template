import type { Resume } from '@/src/schema/types';
import { ResumeSchema } from '@/src/schema/resume';

export function exportResumeJson(resume: Resume): string {
  return JSON.stringify(resume, null, 2);
}

export function importResumeJson(source: string): Resume {
  try {
    const parsed: unknown = JSON.parse(source);
    const result = ResumeSchema.safeParse(parsed);
    if (!result.success) {
      const detail = result.error.issues[0]?.message ?? '结构不符合 Resume Schema';
      throw new Error(detail);
    }
    return result.data;
  } catch (error) {
    const detail = error instanceof Error ? error.message : '未知错误';
    throw new Error(`简历 JSON 校验失败：${detail}`);
  }
}

export function downloadTextFile(content: string, fileName: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
