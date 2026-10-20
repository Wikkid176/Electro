import { startQuiz } from '../helpers/lesson';
import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { lessons } from '../../src/content';

const key = 'electro.human-beta.v1';
async function startRecording(page: Page) {
  await page.getByRole('tab', { name: 'Beta', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start beta recording', exact: true })).toBeDisabled();
  await page.getByRole('textbox', { name: 'Tester code', exact: true }).fill('A01');
  await page.getByRole('radio', { name: 'Adults 30–45 / beginner', exact: true }).click();
  await page.getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Start beta recording', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause beta recording', exact: true })).toBeVisible();
}
async function beginMission(page: Page, replay = false) {
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: new RegExp(`^${lessons[0].title},`) }).click();
  await startQuiz(page);
  for (const [index, question] of lessons[0].questions.entries()) {
    if (index === 0 && !replay) {
      await page.getByRole('button', { name: 'Coach hint', exact: true }).click();
      await page.getByRole('button', { name: 'Hide coach hint', exact: true }).click();
    }
    const answer = index === 0 && !replay ? (question.correct + 1) % question.choices.length : question.correct;
    await page.getByRole('radio').nth(answer).click();
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    if (index === 0 && !replay) {
      await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).attempts[0].answers.length, key)).toBe(1);
      await page.reload();
      await page.getByRole('button', { name: 'Resume mission', exact: true }).click();
    }
    await page.getByRole('button', { name: index === 2 ? 'Finish mission →' : 'Next question →', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Continue training →', exact: true }).click();
}

test('beta recording is optional and a first attempt survives reload and replay', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Build skills.')).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
  await startRecording(page);
  await beginMission(page);
  await beginMission(page, true);
  await page.getByRole('tab', { name: 'Beta', exact: true }).click();
  await expect(page.getByText(/2 \/ 3 recorded first-pass answers correct/)).toBeVisible();
  await expect(page.getByText('ϟ 75 XP', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).attempts.length, key)).toBe(2);
  const attempts = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).attempts, key);
  expect(attempts[0].score).toBe(2); expect(attempts[1].score).toBe(3);
  expect(attempts[0].answers[0].hintUsed).toBe(true);
  await page.getByRole('button', { name: 'Pause beta recording', exact: true }).click();
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: /^Make the units count,/ }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).attempts.length, key)).toBe(2);
});

test('human feedback exports only on request and deleting it preserves course scores', async ({ page }, testInfo) => {
  await page.goto('/');
  await startRecording(page);
  await beginMission(page, true);
  await page.getByRole('tab', { name: 'Beta', exact: true }).click();
  await page.getByRole('textbox', { name: 'Mission or lab for feedback', exact: true }).fill('Safety mission');
  await page.getByRole('textbox', { name: 'Beta feedback', exact: true }).fill('The hint helped. I would like a clearer progress indicator.');
  await page.getByRole('button', { name: 'Save feedback on this device', exact: true }).click();
  await expect(page.getByText('The hint helped. I would like a clearer progress indicator.', { exact: true })).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download beta results', exact: true }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe('ell-beta-A01.json');
  await download.saveAs(testInfo.outputPath(download.suggestedFilename()));
  const record = JSON.parse(await readFile(testInfo.outputPath(download.suggestedFilename()), 'utf8'));
  expect(record.kind).toBe('ElectroLessonLab voluntary human beta record');
  expect(record.summary.firstPassCorrect).toBe(3);
  expect(record.data.feedback[0].note).toContain('clearer progress');
  await page.getByRole('button', { name: 'Delete beta record', exact: true }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).not.toBeNull();
  await page.getByRole('button', { name: 'Confirm delete beta record', exact: true }).click();
  await expect.poll(() => page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1')!).scores.safety)).toBe(3);
  await page.reload();
  await expect(page.getByText('ϟ 75 XP', { exact: true })).toBeVisible();
});

test('foreground timing stops while backgrounded and while viewing tester tools', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await startRecording(page);
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.clock.runFor(11000);
  const first = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).trainingSeconds, key);
  expect(first).toBeGreaterThanOrEqual(5);
  await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  const hiddenStart = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).trainingSeconds, key);
  await page.clock.runFor(10000);
  const background = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).trainingSeconds, key);
  expect(background).toBe(hiddenStart);
  await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.getByRole('tab', { name: 'Beta', exact: true }).click();
  const beta = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).trainingSeconds, key);
  await page.clock.runFor(10000);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).trainingSeconds, key)).toBe(beta);
});
