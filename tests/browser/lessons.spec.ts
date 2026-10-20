import { test, expect } from '@playwright/test';
import { lessons } from '../../src/content';
import { teachingLessons } from '../../src/teaching';
import { newStudy } from '../../src/beta';
import { startQuiz } from '../helpers/lesson';

test('coach teaches before the quiz; guided practice gives feedback without XP', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Start with safety,/ }).click();
  const teaching = teachingLessons.safety;
  await expect(page.getByText(teaching.coach, { exact: true })).toBeVisible();
  for (const section of teaching.sections) await expect(page.getByText(section.body, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start quiz →', exact: true })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('coach-lesson.png'), fullPage: true });
  await page.getByRole('button', { name: 'Continue to visual →', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Raised load', exact: true }).click();
  await expect(page.getByText(teaching.visual.nodes[2].detail, { exact: true })).toBeVisible();
  await expect(page.getByText(teaching.example.scenario, { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('energy-visual.png'), fullPage: true });
  await page.getByRole('button', { name: 'Continue to practice →', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Continue to recap →', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Check practice', exact: true })).toBeDisabled();
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: 'Check practice', exact: true }).click();
  await expect(page.getByText(teaching.practice.explanation, { exact: true })).toBeVisible();
  await page.getByRole('radio').nth(0).click();
  await expect(page.getByRole('button', { name: 'Continue to recap →', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Check practice', exact: true }).click();
  await page.getByRole('button', { name: 'Continue to recap →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your lesson recap', exact: true })).toBeVisible();
  await expect(page.getByText('ϟ 0 XP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start quiz →', exact: true }).click();
  await expect(page.getByRole('heading', { name: lessons[0].questions[0].prompt, exact: true })).toBeVisible();
});

test('reading checkpoints resume on the same page and quiz review preserves checked answers', async ({ page }) => {
  const study = newStudy('A01', 'Adults 30–45 / beginner', {});
  await page.addInitScript(record => { if (!localStorage.getItem('electro.human-beta.v1')) localStorage.setItem('electro.human-beta.v1', JSON.stringify(record)); }, study);
  await page.goto('/');
  await page.getByRole('button', { name: /^Start with safety,/ }).click();
  await page.getByRole('button', { name: 'Continue to visual →', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.session.v1') ?? '{}').lessonPage)).toBe(1);
  await page.reload();
  await page.getByRole('button', { name: 'Resume mission', exact: true }).click();
  await expect(page.getByText(teachingLessons.safety.visual.title, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '← Previous lesson page', exact: true }).click();
  await startQuiz(page);
  await page.getByRole('radio').nth(lessons[0].questions[0].correct).click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.getByRole('button', { name: 'Review lesson', exact: true }).click();
  await expect(page.getByText(teachingLessons.safety.sections[0].body, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Return to quiz →', exact: true }).click();
  await expect(page.getByText('1 correct', { exact: true })).toBeVisible();
  await expect(page.getByText(lessons[0].questions[0].explanation, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next question →', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.human-beta.v1') ?? '{}').attempts?.[0]?.answers?.length)).toBe(1);
  await expect(page.getByText('ϟ 0 XP', { exact: true })).toBeVisible();
});

test('all eight visual forms are interactive, responsive and load component artwork', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const ids = ['safety', 'fundamentals', 'circuit-paths', 'meter-readings', 'drawing-navigation', 'plc', 'analog-scaling', 'panel-control-devices'];
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  for (const id of ids) {
    const lesson = lessons.find(item => item.id === id)!;
    const visual = teachingLessons[id].visual;
    await page.getByRole('button', { name: new RegExp(`^${lesson.title},`) }).click();
    await page.getByRole('button', { name: 'Continue to visual →', exact: true }).click();
    const node = visual.nodes[visual.nodes.length - 1];
    await page.getByRole('button', { name: `Explore ${node.label}`, exact: true }).click();
    await expect(page.getByText(node.detail, { exact: true })).toBeVisible();
    if (visual.component) {
      await expect.poll(() => page.getByTestId('component-art-image').evaluate(element => { const image = element.querySelector('img'); return !!image?.complete && image.naturalWidth > 0; })).toBe(true);
      await page.getByRole('button', { name: /^Diagram part 1:/ }).click();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (id === 'analog-scaling' || id === 'panel-control-devices') await page.screenshot({ path: testInfo.outputPath(`${id}-lesson.png`), fullPage: true });
    await page.getByRole('button', { name: '← Back to training', exact: true }).click();
  }
  expect(errors).toEqual([]);
});

test('older beta study exports keep their version and cannot resume into the new course', async ({ page }) => {
  const earlier = { ...newStudy('A01', 'Adults 30–45 / beginner', { safety: 2 }), build: '0.2.0-beta.1' };
  await page.addInitScript(record => { if (!localStorage.getItem('electro.human-beta.v1')) localStorage.setItem('electro.human-beta.v1', JSON.stringify(record)); }, earlier);
  await page.goto('/');
  await page.getByRole('tab', { name: 'Beta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('earlier beta record is preserved and paused');
  await expect(page.getByRole('button', { name: 'Resume beta recording', exact: true })).toBeDisabled();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download beta results', exact: true }).click();
  const download = await downloaded;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = []; for await (const chunk of stream!) chunks.push(chunk);
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.data.build).toBe('0.2.0-beta.1');
  expect(exported.data.recording).toBe(false);
  await page.getByRole('button', { name: 'Delete beta record', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm delete beta record', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Beta testing', exact: true })).toBeVisible();
});
