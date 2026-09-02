export interface MeasuredBlock {
  id: string;
  height: number;
  atomic: boolean;
}

/**
 * Packs measured logical blocks without depending on pixels or DOM APIs.
 * Oversized non-atomic blocks remain identifiable so the renderer can split
 * them at their own safe child boundaries.
 */
export function packBlocks<T extends MeasuredBlock>(blocks: T[], pageHeight: number): T[][] {
  const pages: T[][] = [];
  let page: T[] = [];
  let used = 0;

  for (const block of blocks) {
    if (page.length > 0 && used + block.height > pageHeight) {
      pages.push(page);
      page = [];
      used = 0;
    }
    page.push(block);
    used += block.height;
  }

  if (page.length > 0) pages.push(page);
  return pages;
}
