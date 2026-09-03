import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { loadLocalResume } from '@/src/store/storage';

const keyValueMocks = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
}));

vi.mock('idb-keyval', () => keyValueMocks);

describe('loadLocalResume', () => {
  beforeEach(() => vi.clearAllMocks());

  it('migrates the legacy default body color to pure black', async () => {
    const storedResume = createExampleResume();
    storedResume.theme.color = '#20252d';
    keyValueMocks.get.mockResolvedValue(storedResume);

    const resume = await loadLocalResume();

    expect(resume?.theme.color).toBe('#000000');
  });
});
