import { test, expect, type Page } from '@playwright/test';
import { lessons } from '../../src/content';
import { coachHint } from '../../src/coach';
import { checkpointMigrations } from '../../src/checkpoint-migrations';
import { lessonFingerprint } from '../../src/session';
import { startQuiz } from '../helpers/lesson';

async function explore(page: Page, id: string) {
  const lesson = lessons.find(item => item.id === id)!;
  await page.getByRole('button', { name: new RegExp(`^${lesson.title},`) }).click();
  await page.getByRole('button', { name: 'Continue to visual →', exact: true }).click();
}

test('all seven experiments change their graphics and explain the resulting physical relationship', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.goto('/');
  await explore(page, 'fundamentals');
  await page.getByRole('button', { name: 'Source: 12 V', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('24 ÷ 120 = 0.2 A');
  await page.getByRole('button', { name: 'Resistor: 120 Ω', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('24 ÷ 240 = 0.1 A');
  await page.getByTestId('lesson-experiment-ohms').screenshot({ path: testInfo.outputPath('graphic-ohms-bench.png') });
  await page.getByRole('button', { name: '← Back to training', exact: true }).click();

  await explore(page, 'circuit-paths');
  await page.getByRole('button', { name: 'Topology: series', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('Source 0.4 A');
  await page.getByRole('button', { name: 'Path: complete', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('Source 0.2 A · R1 0 A · R2 0.2 A');
  await page.getByTestId('lesson-experiment-network').screenshot({ path: testInfo.outputPath('graphic-parallel-open.png') });
  await page.getByRole('button', { name: '← Back to training', exact: true }).click();

  await explore(page, 'motor');
  await page.getByRole('button', { name: 'Model START', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('Coil energized');
  await page.getByRole('button', { name: 'Trip overload', exact: true }).click();
  await page.getByRole('button', { name: 'Reset overload', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('Coil de-energized');
  await page.getByRole('button', { name: 'Model START', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('Coil energized');
  await page.getByRole('button', { name: '← Back to training', exact: true }).click();

  await explore(page, 'panel-control-devices');
  await expect(page.getByRole('button', { name: 'Advance 1 second', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Enable: OFF', exact: true }).click();
  await page.getByRole('button', { name: 'Advance 1 second', exact: true }).click({ clickCount: 2 });
  await expect(page.getByTestId('experiment-result')).toContainText('2 uninterrupted seconds · Output open');
  await page.getByRole('button', { name: 'Enable: ON', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('0 uninterrupted seconds');
  await page.getByRole('button', { name: 'Enable: OFF', exact: true }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Advance 1 second', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('3 uninterrupted seconds · Output closed');
  await page.getByRole('button', { name: 'Advance 1 second', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('4 uninterrupted seconds · Output closed');
  await expect(page.getByRole('button', { name: 'Advance 1 second', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '← Back to training', exact: true }).click();

  await explore(page, 'analog-scaling');
  await page.getByRole('button', { name: 'Set 0 mA', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('outside this valid scale');
  await page.getByRole('button', { name: 'Set 8 mA', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('= 5 °C');
  await page.getByTestId('lesson-experiment-analog').screenshot({ path: testInfo.outputPath('graphic-analog-temperature.png') });
  await page.getByRole('button', { name: '← Back to training', exact: true }).click();

  await explore(page, 'intermittent-evidence');
  await expect(page.getByTestId('experiment-result')).toContainText('0 samples capture');
  await page.getByRole('button', { name: 'Sampling: every 20 ms', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('2 samples capture');
  await page.getByTestId('lesson-experiment-sampling').screenshot({ path: testInfo.outputPath('graphic-sampling.png') });
  await page.getByRole('button', { name: '← Back to training', exact: true }).click();

  await explore(page, 'safety');
  await page.getByRole('button', { name: 'Press STOP in the model', exact: true }).click();
  await expect(page.getByTestId('experiment-result')).toContainText('Supply and stored energy are still present');
  await expect(page.getByText('ϟ 0 XP', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('question coaching has two case-specific levels, resumes and changes with the next question', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Start with safety,/ }).click();
  await startQuiz(page);
  await page.getByRole('button', { name: 'Coach hint', exact: true }).click();
  await expect(page.getByText(coachHint('safety', 0), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Work through this hint', exact: true }).click();
  await expect(page.getByText(coachHint('safety', 0, 1), { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.session.v1') ?? '{}').hintExpanded)).toBe(true);
  await page.reload();
  await page.getByRole('button', { name: 'Resume mission', exact: true }).click();
  await expect(page.getByText(coachHint('safety', 0, 1), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hide coach hint', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.session.v1') ?? '{}').hintExpanded)).toBe(false);
  await page.getByRole('radio').nth(lessons[0].questions[0].correct).click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.getByRole('button', { name: 'Next question →', exact: true }).click();
  await page.getByRole('button', { name: 'Coach hint', exact: true }).click();
  await expect(page.getByText(coachHint('safety', 1), { exact: true })).toBeVisible();
  await expect(page.getByText(coachHint('safety', 0), { exact: true })).toHaveCount(0);
  await expect(page.getByText('ϟ 0 XP', { exact: true })).toBeVisible();
});

test('presentation-only updates retain an older checked quiz and the existing course score', async ({ page }) => {
  const lesson = lessons.find(item => item.id === 'energy-sources')!;
  const old = Object.entries(checkpointMigrations).find(([, current]) => current === lessonFingerprint(lesson))![0];
  await page.addInitScript(({ id, fingerprint, choice }) => {
    localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores: { [id]: 2 } }));
    localStorage.setItem('electro.session.v1', JSON.stringify({ version: 1, lessonId: id, fingerprint, phase: 'quiz', questionIndex: 0, selection: choice, score: 1, checked: true, hintVisible: false }));
  }, { id: lesson.id, fingerprint: old, choice: lesson.questions[0].correct });
  await page.goto('/');
  await page.getByRole('button', { name: 'Resume mission', exact: true }).click();
  await expect(page.getByRole('heading', { name: lesson.questions[0].prompt, exact: true })).toBeVisible();
  await expect(page.getByText('1 correct', { exact: true })).toBeVisible();
  await expect(page.getByText('ϟ 50 XP', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next question →', exact: true })).toBeVisible();
});
