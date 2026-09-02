import type { Resume } from '@/src/schema/types';
import { ResumeSchema } from '@/src/schema/resume';

export function encodeResumePayload(resume: Resume): string {
  const bytes = new TextEncoder().encode(JSON.stringify(resume));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeResumePayload(payload: string): Resume {
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return ResumeSchema.parse(JSON.parse(new TextDecoder().decode(bytes)) as unknown);
}
