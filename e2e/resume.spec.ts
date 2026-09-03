import { expect, test } from '@playwright/test';

test('edits structured content, adds a module, repaginates, and exports PDF', async ({ page }) => {
  await page.route('http://localhost:8000/api/pdf', (route) => route.fulfill({
    status: 200,
    contentType: 'application/pdf',
    body: Buffer.from('%PDF-1.4\n%%EOF'),
  }));
  await page.goto('/');
  await expect(page.locator('.resume-name').first()).toContainText('姓名');

  const editorLayout = await page.evaluate(() => {
    const body = document.querySelector('.workbench-body')!.getBoundingClientRect();
    const editor = document.querySelector('.editor-panel')!.getBoundingClientRect();
    const inputFontSize = Number.parseFloat(getComputedStyle(document.querySelector('.rich-editor-content')!).fontSize);
    return { ratio: editor.width / body.width, inputFontSize };
  });
  expect(editorLayout.ratio).toBeCloseTo(0.5, 2);
  expect(editorLayout.inputFontSize).toBeGreaterThanOrEqual(16);

  await page.getByLabel('姓名').fill('陈序');
  await expect(page.locator('.resume-name').first()).toContainText('陈序');
  await expect(page.locator('.document-title')).toContainText('陈序');

  await page.getByLabel('姓名').selectText();
  await expect(page.getByRole('toolbar', { name: '局部文本样式' })).toHaveCount(1);

  await page.locator('.module-node').filter({ hasText: '实习经历' }).click();
  await page.getByRole('textbox', { name: '公司', exact: true }).fill('星河智能科技');
  await page.getByRole('textbox', { name: '项目名称', exact: true }).fill('智能简历引擎');
  await expect(page.locator('.resume-pages--preview')).toContainText('星河智能科技');
  await expect(page.locator('.resume-pages--preview')).toContainText('智能简历引擎');

  await page.getByRole('textbox', { name: '公司', exact: true }).selectText();
  const companyColor = page.locator('.rich-toolbar input[type="color"]');
  await expect(companyColor).toHaveValue('#000000');
  await companyColor.fill('#ff0000');
  await expect(page.locator('.resume-pages--preview .resume-section--internship .resume-entry-primary [style*="color"]')).toHaveCount(1);
  await page.getByRole('textbox', { name: '公司', exact: true }).selectText();
  await companyColor.fill('#000000');
  const styledCompanyName = page.locator('.resume-pages--preview .resume-section--internship .resume-entry-primary [style*="color"]');
  await expect(styledCompanyName).toHaveCount(1);
  await expect(styledCompanyName).toHaveCSS('color', 'rgb(0, 0, 0)');

  const educationDrag = page.getByRole('button', { name: '拖动教育背景', exact: true });
  await educationDrag.focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(page.locator('.resume-pages--preview .resume-page').first()).toContainText('实习经历');

  const moduleCount = await page.locator('.module-node').count();
  await page.getByText('添加模块', { exact: true }).click();
  await page.getByRole('button', { name: '教育经历', exact: true }).click();
  await expect(page.locator('.module-node')).toHaveCount(moduleCount + 1);

  await page.getByRole('tab', { name: '设计' }).click();
  await page.getByLabel('默认字号').fill('32');
  await expect.poll(() => page.locator('.resume-pages--preview .resume-page').count()).toBeGreaterThan(1);
  await page.getByLabel('默认字号').fill('8');
  await expect.poll(() => page.locator('.resume-pages--preview .resume-page').count()).toBe(1);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 PDF' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
