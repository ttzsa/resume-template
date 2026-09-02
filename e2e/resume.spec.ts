import { expect, test } from '@playwright/test';

test('edits structured content, adds a module, repaginates, and exports PDF', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.resume-name').first()).toContainText('林墨');

  await page.getByLabel('姓名').fill('陈序');
  await expect(page.locator('.resume-name').first()).toContainText('陈序');

  const moduleCount = await page.locator('.module-node').count();
  await page.getByText('添加模块', { exact: true }).click();
  await page.getByRole('button', { name: '教育经历', exact: true }).click();
  await expect(page.locator('.module-node')).toHaveCount(moduleCount + 1);

  await page.getByRole('tab', { name: '设计' }).click();
  await page.getByLabel('默认字号').fill('18');
  await expect.poll(() => page.locator('.resume-pages--preview .resume-page').count()).toBeGreaterThan(1);
  await page.getByLabel('默认字号').fill('8');
  await expect.poll(() => page.locator('.resume-pages--preview .resume-page').count()).toBe(1);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 PDF' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
