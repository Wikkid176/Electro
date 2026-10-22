import { startQuiz } from '../helpers/lesson';
import { test, expect, type Page } from '@playwright/test';
import { lessons } from '../../src/content';

async function finishLesson(page: Page, lessonIndex: number, missFirst = false) {
  const lesson = lessons[lessonIndex];
  await page.getByRole('button', { name: new RegExp(`^${lesson.title},`) }).click();
  await startQuiz(page);
  for (const [i, question] of lesson.questions.entries()) {
    await expect(page.getByRole('button', { name: 'Check answer' })).toBeDisabled();
    const answer = missFirst && i === 0 ? (question.correct + 1) % question.choices.length : question.correct;
    await page.getByRole('radio').nth(answer).click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByText(question.explanation, { exact: true })).toBeVisible();
    if (missFirst && i === 0) await expect(page.getByText('Keep learning. Here’s why.')).toBeVisible();
    await page.getByRole('button', { name: i === 2 ? 'Finish mission' : 'Next question' }).click();
  }
  await expect(page.getByText(`${missFirst ? 2 : 3} / 3 correct`, { exact: true })).toBeVisible();
}

test('all missions award XP, best scores survive replay and reload', async ({ page }) => {
  // This case completes 47 missions plus replay/reload, and can share CI with
  // native compilation. Keep every assertion while allowing the full journey.
  test.setTimeout(360_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByText('Build skills.')).toBeVisible();
  for (let i = 0; i < lessons.length; i++) {
    await finishLesson(page, i);
    await expect(page.getByText('+75 XP', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Continue training' }).click();
  }
  await finishLesson(page, 0, true);
  await expect(page.getByText('+0 XP', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1') ?? '{}').scores?.safety)).toBe(3);
  await page.reload();
  await expect(page.getByText('ϟ 3525 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Progress' }).click();
  await expect(page.getByText('47 of 47 missions mastered · 47 completed')).toBeVisible();
  await expect(page.getByText('Control thinker', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('existing learners keep their progress and are guided to the new safety missions', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores: {
      safety: 3, fundamentals: 3, motor: 3, schematics: 3, plc: 3, diagnosis: 3,
    } }));
  });
  await page.goto('/');
  await expect(page.getByText('ϟ 450 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Progress' }).click();
  await expect(page.getByText('6 of 47 missions mastered · 6 completed')).toBeVisible();
  await expect(page.getByText('3525 XP AVAILABLE · BEST SCORES COUNT')).toBeVisible();
  await page.getByRole('tab', { name: 'Learn' }).click();
  await page.getByRole('button', { name: 'Start mission 02' }).click();
  await expect(page.getByRole('heading', { name: 'Find the hidden energy' })).toBeVisible();
});

test('previous safety-course progress remains intact when meter missions are added', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores: {
      safety: 3, 'energy-sources': 3, 'loto-roles': 3, verification: 3, 'shared-protection': 3,
      'electrical-hazards': 3, fundamentals: 3, motor: 3, schematics: 3, plc: 3, diagnosis: 3,
    } }));
  });
  await page.goto('/');
  await expect(page.getByText('ϟ 825 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Progress' }).click();
  await expect(page.getByText('11 of 47 missions mastered · 11 completed')).toBeVisible();
  await page.getByRole('tab', { name: 'Learn' }).click();
  await page.getByRole('button', { name: 'Start mission 08' }).click();
  await expect(page.getByRole('heading', { name: 'Make the units count' })).toBeVisible();
});

test('meter bench distinguishes readings, polarity, unsafe setup, and an open path', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Lab', exact: true }).click();
  await page.getByRole('tab', { name: 'Meter bench', exact: true }).click();
  await expect(page.getByLabel('Simulated display: 18.0 V', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reference: normal', exact: true }).click();
  await expect(page.getByLabel('Simulated display: −18.0 V', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Resistance (Ω)', exact: true }).click();
  await expect(page.getByText('READING BLOCKED', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Simulated display: STOP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '220 Ω resistor', exact: true }).click();
  await expect(page.getByLabel('Simulated display: 220 Ω', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'A input', exact: true }).click();
  await expect(page.getByLabel('Simulated display: INPUT', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'V/Ω input', exact: true }).click();
  await page.getByRole('button', { name: 'Continuity', exact: true }).click();
  await expect(page.getByLabel('Simulated display: 220 Ω · NO TONE', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Low-resistance link', exact: true }).click();
  await expect(page.getByLabel('Simulated display: 0.2 Ω · TONE', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open path', exact: true }).click();
  await expect(page.getByLabel('Simulated display: OL · NO TONE', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('meter-course progress is preserved when drawing missions are added', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores: {
      safety: 3, 'energy-sources': 3, 'loto-roles': 3, verification: 3, 'shared-protection': 3,
      'electrical-hazards': 3, fundamentals: 3, 'electrical-units': 3, 'circuit-paths': 3,
      'electrical-power': 3, 'meter-setup': 3, 'meter-readings': 3, 'measurement-evidence': 3,
      motor: 3, schematics: 3, plc: 3, diagnosis: 3,
    } }));
  });
  await page.goto('/');
  await expect(page.getByText('ϟ 1275 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Progress', exact: true }).click();
  await expect(page.getByText('17 of 47 missions mastered · 17 completed')).toBeVisible();
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Start mission 16' }).click();
  await expect(page.getByRole('heading', { name: 'Find the right drawing' })).toBeVisible();
});

test('fictional drawing trace checks wrong targets, sheet references, completion, and restart', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Lab', exact: true }).click();
  await page.getByRole('tab', { name: 'Trace prints', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Trace the signal', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'F-DEMO, LIGHT A1', exact: true }).click();
  await expect(page.getByText('Check the drawing', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Trace progress: 0 of 5', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'L-DEMO, LIGHT A3', exact: true }).click();
  await page.getByRole('button', { name: 'K-DEMO.1, LIGHT A2', exact: true }).click();
  await page.getByRole('tab', { name: 'COIL sheet', exact: true }).click();
  await page.getByRole('button', { name: 'K-DEMO, COIL B2', exact: true }).click();
  await expect(page.getByText('K-DEMO is the associated coil. This is a device relationship; it does not electrically join the two circuit paths.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'S-DEMO, COIL B1', exact: true }).click();
  await page.getByRole('tab', { name: 'LIGHT sheet', exact: true }).click();
  await page.getByRole('button', { name: '0 V, LIGHT A4', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Trace complete', exact: true })).toBeVisible();
  await expect(page.getByLabel('Trace progress: 5 of 5', { exact: true })).toBeVisible();
  await expect(page.getByText('ϟ 0 XP', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('trace-complete.png') });
  await page.getByRole('button', { name: 'Restart tracing practice', exact: true }).click();
  await expect(page.getByLabel('Trace progress: 0 of 5', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Challenge 1', exact: true })).toBeVisible();
});

test('drawing-course progress is preserved when reference skills are added', async ({ page }) => {
  const ids = ['safety', 'energy-sources', 'loto-roles', 'verification', 'shared-protection', 'electrical-hazards',
    'fundamentals', 'electrical-units', 'circuit-paths', 'electrical-power', 'meter-setup', 'meter-readings',
    'measurement-evidence', 'motor', 'schematics', 'drawing-navigation', 'drawing-language', 'drawing-references',
    'complete-circuit-path', 'drawing-evidence', 'plc', 'diagnosis'];
  await page.addInitScript(scores => {
    localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores }));
  }, Object.fromEntries(ids.map(id => [id, 3])));
  await page.goto('/');
  await expect(page.getByText('ϟ 1650 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Progress', exact: true }).click();
  await expect(page.getByText('22 of 47 missions mastered · 22 completed')).toBeVisible();
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Start mission 21' }).click();
  await expect(page.getByRole('heading', { name: 'Choose the right source' })).toBeVisible();
});

test('open-book lookup shows applicable and misleading sources and explains a wrong selection', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Find it and cite it,/ }).click();
  await startQuiz(page);
  await expect(page.getByText('REFERENCE CARDS', { exact: true })).toBeVisible();
  await expect(page.getByText('CARD-A: TRAIN-CTRL-A / Manual revision C', { exact: true })).toBeVisible();
  await expect(page.getByText('CARD-B: TRAIN-CTRL-B / Manual revision C', { exact: true })).toBeVisible();
  await expect(page.getByText('CARD-C: TRAIN-CTRL-A / Manual revision A', { exact: true })).toBeVisible();
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Keep learning. Here’s why.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next question' }).click();
  await expect(page.getByText('REFERENCE CARDS', { exact: true })).toBeVisible();
  await page.getByRole('radio').nth(0).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await page.getByRole('button', { name: 'Next question' }).click();
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await page.getByRole('button', { name: 'Finish mission' }).click();
  await expect(page.getByText('2 / 3 correct', { exact: true })).toBeVisible();
  await expect(page.getByText('+50 XP', { exact: true })).toBeVisible();
});

test('reference-course progress leads to the new panel missions without changing earned XP', async ({ page }) => {
  const ids = ['safety', 'energy-sources', 'loto-roles', 'verification', 'shared-protection', 'electrical-hazards',
    'fundamentals', 'electrical-units', 'circuit-paths', 'electrical-power', 'meter-setup', 'meter-readings',
    'measurement-evidence', 'motor', 'schematics', 'drawing-navigation', 'drawing-language', 'drawing-references',
    'complete-circuit-path', 'drawing-evidence', 'standards-scope', 'edition-evidence', 'ratings-context',
    'reference-hunt', 'plc', 'diagnosis'];
  await page.addInitScript(scores => {
    localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores }));
  }, Object.fromEntries(ids.map(id => [id, 3])));
  await page.goto('/');
  await expect(page.getByText('ϟ 1950 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Progress', exact: true }).click();
  await expect(page.getByText('26 of 47 missions mastered · 26 completed')).toBeVisible();
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Start mission 25' }).click();
  await expect(page.getByRole('heading', { name: 'Plan the panel' })).toBeVisible();
});

test('panel inspection compares evidence, explains a missed defect, and preserves the best score', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Catch the build defects,/ }).click();
  await startQuiz(page);
  await expect(page.getByText('BUILD-PLAN: TRAIN-BOX / Approved plan revision D', { exact: true })).toBeVisible();
  await expect(page.getByText('BUILD-LOG: TRAIN-BOX / Observation record', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('panel-inspection.png'), fullPage: true });
  for (const [i, answer] of [0, 2, 0].entries()) {
    await page.getByRole('radio').nth(answer).click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByText(i === 0 ? 'Keep learning. Here’s why.' : 'Correct. Good thinking.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: i === 2 ? 'Finish mission' : 'Next question' }).click();
  }
  await expect(page.getByText('2 / 3 correct', { exact: true })).toBeVisible();
  await expect(page.getByText('+50 XP', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1') ?? '{}').scores?.['panel-inspection'])).toBe(2);
  await page.reload();
  await expect(page.getByText('ϟ 50 XP', { exact: true })).toBeVisible();
});

test('panel-course progress is preserved and leads to the troubleshooting expansion', async ({ page }) => {
  const ids = ['safety', 'energy-sources', 'loto-roles', 'verification', 'shared-protection', 'electrical-hazards',
    'fundamentals', 'electrical-units', 'circuit-paths', 'electrical-power', 'meter-setup', 'meter-readings',
    'measurement-evidence', 'motor', 'schematics', 'drawing-navigation', 'drawing-language', 'drawing-references',
    'complete-circuit-path', 'drawing-evidence', 'standards-scope', 'edition-evidence', 'ratings-context',
    'reference-hunt', 'panel-layout', 'panel-terminations', 'panel-bonding', 'panel-protection',
    'panel-transformers', 'panel-control-devices', 'panel-inspection', 'plc', 'diagnosis'];
  await page.addInitScript(scores => {
    localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores }));
  }, Object.fromEntries(ids.map(id => [id, 3])));
  await page.goto('/');
  await expect(page.getByText('ϟ 2475 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Progress', exact: true }).click();
  await expect(page.getByText('33 of 47 missions mastered · 33 completed')).toBeVisible();
  await page.getByRole('tab', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Start mission 32' }).click();
  await expect(page.getByRole('heading', { name: 'Build a testable theory' })).toBeVisible();
});

test('fault case exposes assumptions and corrects an unsupported component diagnosis', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Narrow the fault region,/ }).click();
  await startQuiz(page);
  await expect(page.getByText('CASE-MODEL: SIM-PATH / Model assumptions', { exact: true })).toBeVisible();
  await expect(page.getByText('CASE-RECORD: SIM-PATH / Supplied evidence', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('fault-evidence.png'), fullPage: true });
  for (const [i, answer] of [2, 0, 0].entries()) {
    await page.getByRole('radio').nth(answer).click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByText(i === 2 ? 'Keep learning. Here’s why.' : 'Correct. Good thinking.', { exact: true })).toBeVisible();
    if (i === 2) await expect(page.getByText('Narrowing the region is progress in reasoning. It does not prove a particular part failed, establish isolation, or authorize physical work.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: i === 2 ? 'Finish mission' : 'Next question' }).click();
  }
  await expect(page.getByText('2 / 3 correct', { exact: true })).toBeVisible();
  await expect(page.getByText('+50 XP', { exact: true })).toBeVisible();
});

test('lab blocks unsafe simulated starts and never restarts on reset', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Lab' }).click();
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'START', exact: true }).click();
  await expect(page.getByText('● RUNNING', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Trip simulated overload', exact: true }).click();
  await page.getByRole('button', { name: 'START', exact: true }).click();
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset simulated overload', exact: true }).click();
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'START', exact: true }).click();
  await page.getByRole('button', { name: 'Activate simulated E-stop', exact: true }).click();
  await page.getByRole('button', { name: 'START', exact: true }).click();
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Release simulated E-stop', exact: true }).click();
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'START', exact: true }).click();
  await expect(page.getByText('● RUNNING', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'STOP', exact: true }).click();
  await expect(page.getByText('○ STOPPED', { exact: true })).toBeVisible();
});

test('layout fits the viewport and app contains no source branding', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByText('Build skills.')).toBeVisible();
  const copy = await page.locator('body').innerText();
  expect(copy).not.toMatch(/\bBTI\b/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('learn.png'), fullPage: true });
  await page.getByRole('tab', { name: 'Lab' }).click();
  await expect(page.getByText('THREE-WIRE STARTER MODEL')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('lab.png'), fullPage: true });
});
