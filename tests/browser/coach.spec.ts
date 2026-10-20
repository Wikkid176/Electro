import { test, expect } from '@playwright/test';
import { lessons } from '../../src/content';
import { coachHint } from '../../src/coach';

test('coach welcomes, offers optional hints, responds supportively, celebrates, and preserves best XP', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByTestId('coach-welcome')).toBeVisible();
  await expect.poll(() => page.getByTestId('coach-welcome').evaluate(element => { const image = element.querySelector('img'); return Boolean(image?.complete && image.naturalWidth > 0); })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('coach-home.png') });
  const lesson = lessons[0];
  async function start() {
    await page.getByRole('button', { name: new RegExp(`^${lesson.title},`) }).click();
    await page.getByRole('button', { name: 'Start challenge →', exact: true }).click();
  }
  async function answerAll(missFirst: boolean) {
    for (const [i, question] of lesson.questions.entries()) {
      const hint = page.getByText(coachHint(lesson.category), { exact: true });
      await expect(hint).toHaveCount(0);
      await page.getByRole('button', { name: 'Coach hint', exact: true }).click();
      await expect(hint).toBeVisible();
      await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
      if (i === 0) {
        await page.getByRole('button', { name: 'Hide coach hint', exact: true }).click();
        await expect(hint).toHaveCount(0);
      }
      const answer = missFirst && i === 0 ? (question.correct + 1) % question.choices.length : question.correct;
      await page.getByRole('radio').nth(answer).click();
      await page.getByRole('button', { name: 'Check answer', exact: true }).click();
      await expect(page.getByTestId(missFirst && i === 0 ? 'coach-think' : 'coach-encourage')).toBeVisible();
      await expect(page.getByText(question.explanation, { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Coach hint', exact: true })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.getByRole('button', { name: i === 2 ? 'Finish mission →' : 'Next question →', exact: true }).click();
    }
  }
  await start();
  await answerAll(false);
  await expect(page.getByTestId('coach-celebrate')).toBeVisible();
  await expect(page.getByText('+75 XP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continue training →', exact: true }).click();
  await start();
  await answerAll(true);
  await expect(page.getByTestId('coach-encourage')).toBeVisible();
  await expect(page.getByText('+0 XP', { exact: true })).toBeVisible();
  await expect(page.getByText('ϟ 75 XP', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1') ?? '{}').scores?.safety)).toBe(3);
});
