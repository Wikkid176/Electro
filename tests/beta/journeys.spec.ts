import { test, expect, type Locator } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { lessons } from '../../src/content';
import { componentChallenges } from '../../src/components';
import { modelVersion, planProfile, profiles } from './model';

for (const profile of profiles) test(`${profile.id}: ${profile.group}`, async ({ page }) => {
  const started = Date.now();
  const plan = planProfile(profile);
  const errors: string[] = [];
  const consoleErrors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.setViewportSize({ width: profile.width, height: profile.height });
  async function activate(locator: Locator) {
    if (profile.keyboard) { await locator.focus(); await page.keyboard.press('Enter'); }
    else await locator.click();
  }
  async function button(name: string) { await activate(page.getByRole('button', { name, exact: true })); }
  async function tab(name: string) { await activate(page.getByRole('tab', { name, exact: true })); }
  const actual: { lessonId: string; score: number; answers: number[] }[] = [];
  await page.goto('/');
  await expect(page.getByText('Build skills.')).toBeVisible();
  for (const [lessonIndex, lesson] of lessons.entries()) {
    const decisions = plan.questions.filter(question => question.lessonId === lesson.id);
    await activate(page.getByRole('button', { name: `${lesson.title}, ${lesson.minutes} minutes`, exact: true }));
    await button('Start challenge →');
    let expectedScore = 0;
    for (const [index, question] of lesson.questions.entries()) {
      const decision = decisions[index];
      await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
      if (decision.hint) {
        await button('Coach hint');
        await expect(page.getByRole('button', { name: 'Hide coach hint', exact: true })).toBeVisible();
      }
      await activate(page.getByRole('radio').nth(decision.answer));
      await expect(page.getByRole('radio').nth(decision.answer)).toHaveAttribute('aria-checked', 'true');
      await button('Check answer');
      expectedScore += decision.correct ? 1 : 0;
      await expect(page.getByText(`${expectedScore} correct`, { exact: true })).toBeVisible();
      await expect(page.getByText(question.explanation, { exact: true })).toBeVisible();
      // A late-course interruption exercises both prior completed scores and a
      // partially answered mission. No read time is simulated with artificial waits.
      if (profile.interrupt && lessonIndex === 23 && index === 1) {
        await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.session.v1') ?? 'null')?.questionIndex)).toBe(1);
        await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.session.v1') ?? 'null')?.checked)).toBe(true);
        await page.reload();
        await button('Resume mission');
        await expect(page.getByText(`${expectedScore} correct`, { exact: true })).toBeVisible();
        await expect(page.getByText(question.explanation, { exact: true })).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await button(index === 2 ? 'Finish mission →' : 'Next question →');
    }
    const result = await page.getByText(/^\d \/ 3 correct$/).innerText();
    const score = Number(result.split(' / ')[0]);
    expect(score).toBe(expectedScore);
    actual.push({ lessonId: lesson.id, score, answers: decisions.map(decision => decision.answer) });
    await expect(page.getByText(`+${score * 25} XP`, { exact: true })).toBeVisible();
    await button('Continue training →');
  }
  const scores = Object.fromEntries(actual.map(result => [result.lessonId, result.score]));
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1') ?? '{}').scores)).toEqual(scores);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('electro.session.v1'))).toBeNull();
  await page.reload();
  const correct = actual.reduce((sum, result) => sum + result.score, 0);
  const mastered = actual.filter(result => result.score === 3).length;
  await expect(page.getByText(`ϟ ${correct * 25} XP`, { exact: true })).toBeVisible();
  await tab('Progress');
  await expect(page.getByText(`${mastered} of 47 missions mastered · 47 completed`, { exact: true })).toBeVisible();

  // Four practical tasks are navigation/state checks, not measured learner skill.
  await tab('Lab');
  await button('START');
  await expect(page.getByText('● RUNNING', { exact: true })).toBeVisible();
  await button('Trip simulated overload');
  await button('START');
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
  await button('Reset simulated overload');
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
  await tab('Meter bench');
  await button('Resistance (Ω)');
  await expect(page.getByText('READING BLOCKED', { exact: true })).toBeVisible();
  await button('220 Ω resistor');
  await expect(page.getByLabel('Simulated display: 220 Ω', { exact: true })).toBeVisible();
  await tab('Trace prints');
  await button('L-DEMO, LIGHT A3');
  await button('K-DEMO.1, LIGHT A2');
  await tab('COIL sheet');
  await button('K-DEMO, COIL B2');
  await button('S-DEMO, COIL B1');
  await tab('LIGHT sheet');
  await button('0 V, LIGHT A4');
  await expect(page.getByRole('heading', { name: 'Trace complete', exact: true })).toBeVisible();
  await tab('Components');
  await tab('Component challenges');
  for (const [index, challenge] of componentChallenges.entries()) {
    const decision = plan.components[index];
    const choice = challenge.choices.find(choice => choice.id === decision.answer)!;
    await expect.poll(() => page.getByTestId('generated-component-art').evaluate(element => { const image = element.querySelector('img'); return Boolean(image?.complete && image.naturalWidth > 0); })).toBe(true);
    await activate(page.getByRole('radio', { name: choice.label, exact: true }));
    await button('Check component answer');
    await expect(page.getByText(challenge.explanation, { exact: true })).toBeVisible();
    await button(index === componentChallenges.length - 1 ? 'Finish component challenges' : 'Next component challenge');
  }
  const componentCorrect = plan.components.filter(decision => decision.correct).length;
  await expect(page.getByText(`${componentCorrect} / 12 correct`, { exact: true })).toBeVisible();
  await expect(page.getByText(`ϟ ${correct * 25} XP`, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1')!).scores)).toEqual(scores);
  expect(errors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  await mkdir('beta-results/individual', { recursive: true });
  await writeFile(`beta-results/individual/${profile.id}.json`, JSON.stringify({ modelVersion, ...plan, answerPlan: plan.questions, actual, correct, questions: 141, mastered, completed: 47, xp: correct * 25, componentCorrect, componentQuestions: 12, labTasksPassed: 4, interruptionsRecovered: profile.interrupt ? 1 : 0, errors, consoleErrors, automationSeconds: (Date.now() - started) / 1000, finishedAt: new Date().toISOString() }, null, 2) + '\n');
});
