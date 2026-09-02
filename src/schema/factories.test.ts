import { describe, expect, it } from 'vitest';
import { createModule, createContentBlock } from '@/src/schema/factories';

describe('schema factories', () => {
  it.each(['education', 'internship', 'project', 'free'] as const)(
    'creates a valid %s module with a stable UUID',
    (type) => {
      const module = createModule(type, type === 'free' ? '奖项荣誉' : undefined);
      expect(module.type).toBe(type);
      expect(module.id).toMatch(/^[0-9a-f-]{36}$/i);
    },
  );

  it.each(['paragraph', 'list', 'keyValue'] as const)('creates a %s content block', (type) => {
    expect(createContentBlock(type).type).toBe(type);
  });
});
