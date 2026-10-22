import { test, expect } from '@playwright/test';
import { newStudy } from '../../src/beta';

test('Click logo loads in the header and fits a phone layout', async ({ page }, testInfo) => {
  await page.goto('/');
  const logo = page.locator('[role="img"][aria-label="Click, the ELL relay coach logo"]');
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.locator('img').evaluateAll(images => images.length > 0 && images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await logo.screenshot({ path: testInfo.outputPath('click-header-logo.png') });
  await expect(page.getByText(/ElectroLessonLab/i).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('an existing beta4 study stays active and can save feedback through the icon update', async ({ page }) => {
  const data = { ...newStudy('A01', 'Adults 30–45 / beginner', {}), build: '0.5.0-beta.4' };
  await page.addInitScript(data => localStorage.setItem('electro.human-beta.v1', JSON.stringify(data)), data);
  await page.goto('/'); await page.getByRole('tab', { name: 'Beta', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause beta recording', exact: true })).toBeEnabled();
  await expect(page.getByText(/earlier beta record is preserved and paused/)).toHaveCount(0);
  await page.getByRole('textbox', { name: 'Mission or lab for feedback', exact: true }).fill('Click logo');
  await page.getByRole('textbox', { name: 'Beta feedback', exact: true }).fill('The relay coach is now recognizable on the icon.');
  await page.getByRole('button', { name: 'Save feedback on this device', exact: true }).click();
  await expect(page.getByText('The relay coach is now recognizable on the icon.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause beta recording', exact: true }).click();
  await page.getByRole('button', { name: 'Resume beta recording', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause beta recording', exact: true })).toBeEnabled();
});
