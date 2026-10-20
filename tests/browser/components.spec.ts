import { test, expect } from '@playwright/test';
import { componentChallenges, workshopComponents } from '../../src/components';

test('every illustrated component exposes parts, state changes, and a paired teaching symbol', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.goto('/');
  await page.getByRole('tab', { name: 'Lab', exact: true }).click();
  await page.getByRole('tab', { name: 'Components', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Component workshop', exact: true })).toBeVisible();
  for (const component of workshopComponents) {
    await page.getByRole('button', { name: `Explore ${component.name}`, exact: true }).click();
    await expect(page.getByRole('img', { name: `${component.name}, ${component.states[0]}`, exact: true })).toBeVisible();
    await expect.poll(() => page.getByTestId('generated-component-art').evaluate(element => { const image = element.querySelector('img'); return Boolean(image?.complete && image.naturalWidth > 0); })).toBe(true);
    const before = await page.getByTestId('component-art-image').evaluate(element => getComputedStyle(element).left);
    await page.getByRole('tab', { name: `Show ${component.states[1]}`, exact: true }).click();
    await expect.poll(() => page.getByTestId('component-art-image').evaluate(element => getComputedStyle(element).left)).not.toBe(before);
    await expect(page.getByRole('img', { name: `${component.name}, ${component.states[1]}`, exact: true })).toBeVisible();
    await expect(page.getByText(component.stateDescriptions[1], { exact: true })).toBeVisible();
    await expect(page.getByLabel(`${component.name} teaching symbol, ${component.states[1]}`, { exact: true })).toBeVisible();
    for (const [i, part] of component.parts.entries()) {
      await page.getByRole('button', { name: `Diagram part ${i + 1}: ${part.name}`, exact: true }).click();
      await expect(page.getByRole('heading', { name: part.name, exact: true })).toBeVisible();
      await expect(page.getByText(part.description, { exact: true })).toBeVisible();
    }
    await page.getByTestId(`illustration-${component.id}`).screenshot({ path: testInfo.outputPath(`${component.id}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('button', { name: 'Explore Contactor', exact: true }).click();
  await expect(page.getByText('Discover a part', { exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Show Coil off', exact: true })).toHaveAttribute('aria-selected', 'true');
  if (testInfo.project.name === 'phone') {
    await page.setViewportSize({ width: 320, height: 740 });
    await expect(page.getByRole('tab', { name: 'Components', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const artwork = await page.getByTestId('illustration-contactor').boundingBox();
    expect(artwork?.width).toBeLessThanOrEqual(244);
    await page.getByRole('button', { name: 'Inspect Coil and armature', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Coil and armature', exact: true })).toBeVisible();
  }
});

test('component challenge hides identity, explains errors, completes, restarts, and preserves course XP', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('electro.progress.v1', JSON.stringify({ version: 1, scores: { safety: 3 } })));
  await page.goto('/');
  await expect(page.getByText('ϟ 75 XP', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Lab', exact: true }).click();
  await page.getByRole('tab', { name: 'Components', exact: true }).click();
  await page.getByRole('tab', { name: 'Component challenges', exact: true }).click();
  for (const [i, challenge] of componentChallenges.entries()) {
    await expect(page.getByRole('button', { name: 'Check component answer', exact: true })).toBeDisabled();
    await expect(page.getByRole('img', { name: 'Original component illustration for identification', exact: true })).toBeVisible();
    const choice = i === 0 ? challenge.choices.find(item => item.id !== challenge.answer)! : challenge.choices.find(item => item.id === challenge.answer)!;
    if (challenge.kind === 'defect') {
      const component = workshopComponents.find(item => item.id === challenge.component)!;
      const area = component.parts.findIndex(item => item.id === challenge.answer) + 1;
      await page.getByRole('button', { name: `Select area ${area}`, exact: true }).click();
      await page.getByTestId(`illustration-${component.id}`).screenshot({ path: testInfo.outputPath(`defect-${component.id}.png`) });
    } else await page.getByRole('radio', { name: choice.label, exact: true }).click();
    await page.getByRole('button', { name: 'Check component answer', exact: true }).click();
    await expect(page.getByText(challenge.explanation, { exact: true })).toBeVisible();
    if (i === 0) await expect(page.getByText('Look again. Here’s the evidence.', { exact: true })).toBeVisible();
    for (const radio of await page.getByRole('radio').all()) await expect(radio).toBeDisabled();
    await page.getByRole('button', { name: i === componentChallenges.length - 1 ? 'Finish component challenges' : 'Next component challenge', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Workshop complete', exact: true })).toBeVisible();
  await expect(page.getByText('11 / 12 correct', { exact: true })).toBeVisible();
  await expect(page.getByText('ϟ 75 XP', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('electro.progress.v1')!).scores)).toEqual({ safety: 3 });
  await page.getByRole('button', { name: 'Restart component challenges', exact: true }).click();
  await expect(page.getByLabel('Component challenge progress: 0 of 12', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Check component answer', exact: true })).toBeDisabled();
  expect(errors).toEqual([]);
});
