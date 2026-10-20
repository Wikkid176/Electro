import { startQuiz } from '../helpers/lesson';
import { test, expect } from '@playwright/test';
import { lessons } from '../../src/content';

test('selected answers and navigation expose their state to assistive technology', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('tab', { name: 'Learn', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: /^Start with safety,/ }).click();
  await startQuiz(page);
  await page.getByRole('radio').nth(1).click();
  await expect(page.getByRole('radio').nth(1)).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio').nth(0)).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('tab', { name: 'Lab', exact: true }).click();
  await page.getByRole('tab', { name: 'Meter bench', exact: true }).click();
  await expect(page.getByRole('button', { name: 'DC voltage', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Resistance (Ω)', exact: true }).click();
  await expect(page.getByRole('button', { name: 'DC voltage', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: 'Resistance (Ω)', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: 'Trace prints', exact: true }).click();
  await page.getByRole('tab', { name: 'COIL sheet', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'COIL sheet', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'LIGHT sheet', exact: true })).toHaveAttribute('aria-selected', 'false');
});

test('an interrupted quiz can resume without losing checked feedback or gaining early XP', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Start with safety,/ }).click();
  await startQuiz(page);
  await page.getByRole('radio').nth(lessons[0].questions[0].correct).click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByText('1 correct', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.session.v1') ?? 'null')?.checked)).toBe(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume mission', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('resume.png') });
  await page.getByRole('button', { name: 'Resume mission', exact: true }).click();
  await expect(page.getByText('1 correct', { exact: true })).toBeVisible();
  await expect(page.getByText(lessons[0].questions[0].explanation, { exact: true })).toBeVisible();
  await expect(page.getByText('ϟ 0 XP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next question →', exact: true }).click();
  for (let i = 1; i < 3; i++) {
    await page.getByRole('radio').nth(lessons[0].questions[i].correct).click();
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await page.getByRole('button', { name: i === 2 ? 'Finish mission →' : 'Next question →', exact: true }).click();
  }
  await expect(page.getByText('+75 XP', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('electro.session.v1'))).toBeNull();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume mission', exact: true })).toHaveCount(0);
  await expect(page.getByText('ϟ 75 XP', { exact: true })).toBeVisible();
});

test('mastering every mission shows a completed path instead of presenting mission one as new', async ({ page }, testInfo) => {
  await page.addInitScript(scores => localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores })), Object.fromEntries(lessons.map(lesson => [lesson.id, 3])));
  await page.goto('/');
  await expect(page.getByText('LEARNING PATH MASTERED', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Review mastered missions', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start mission 01 →', exact: true })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('mastered.png') });
  await page.getByRole('button', { name: 'Review mastered missions', exact: true }).click();
  await expect(page.getByText('47 of 47 missions mastered · 47 completed', { exact: true })).toBeVisible();
});

test('an unchecked choice and hint resume; discarding removes only the checkpoint', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores: { motor: 2 } })));
  await page.goto('/');
  await page.getByRole('button', { name: /^Start with safety,/ }).click();
  await startQuiz(page);
  await page.getByRole('radio').nth(2).click();
  await page.getByRole('button', { name: 'Coach hint', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.session.v1') ?? 'null')?.hintVisible)).toBe(true);
  await page.reload();
  await page.getByRole('button', { name: 'Resume mission', exact: true }).click();
  await expect(page.getByRole('radio').nth(2)).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('button', { name: 'Hide coach hint', exact: true })).toBeVisible();
  await expect(page.getByText('0 correct', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Discard saved mission', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('electro.session.v1'))).toBeNull();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1') ?? '{}').scores)).toEqual({ motor: 2 });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume mission', exact: true })).toHaveCount(0);
  await expect(page.getByText('ϟ 50 XP', { exact: true })).toBeVisible();
});

test('a checkpoint read failure does not disable completed-score storage', async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = function(key: string) {
      if (key === 'electro.session.v1') throw new Error('Simulated checkpoint-only read failure');
      return original.call(this, key);
    };
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('unfinished mission could not be loaded');
  await page.getByRole('button', { name: /^Start with safety,/ }).click();
  await startQuiz(page);
  for (const [index, question] of lessons[0].questions.entries()) {
    await page.getByRole('radio').nth(question.correct).click();
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await page.getByRole('button', { name: index === 2 ? 'Finish mission →' : 'Next question →', exact: true }).click();
  }
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1') ?? '{}').scores?.safety)).toBe(3);
  await page.reload();
  await expect(page.getByText('ϟ 75 XP', { exact: true })).toBeVisible();
});
