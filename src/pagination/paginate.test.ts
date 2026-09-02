import { describe, expect, it } from 'vitest';
import { packBlocks } from '@/src/pagination/pack-blocks';

describe('packBlocks', () => {
  it('moves an atomic block to the next page when it does not fit', () => {
    const pages = packBlocks(
      [
        { id: 'profile', height: 30, atomic: true },
        { id: 'education', height: 60, atomic: true },
        { id: 'project', height: 50, atomic: true },
      ],
      100,
    );

    expect(pages.map((page) => page.map((block) => block.id))).toEqual([
      ['profile', 'education'],
      ['project'],
    ]);
  });

  it('keeps oversized blocks on their own page for renderer-level splitting', () => {
    const pages = packBlocks([{ id: 'long-project', height: 140, atomic: false }], 100);

    expect(pages).toHaveLength(1);
    expect(pages[0][0].id).toBe('long-project');
  });
});
