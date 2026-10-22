import { test, expect, type Page } from '@playwright/test';
import { wiringBenches, type Bench, type ControlAction } from '../../src/wiring';
async function open(page: Page) {
  await page.goto('/'); await page.getByRole('tab', { name: 'Lab', exact: true }).click();
  await page.getByRole('tab', { name: 'Virtual wiring', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The wiring bench' })).toBeVisible();
}
async function connect(page: Page, bench: Bench, a: string, b: string) {
  for (const id of [a, b]) await page.getByRole('button', { name: `Terminal ${bench.terminals.find(t => t.id === id)!.label}`, exact: true }).click();
}
const buttons: Record<ControlAction, string> = { 'power-on': 'Turn bench power ON', 'power-off': 'Turn bench power OFF', 'switch-on': 'Switch S1 ON', 'switch-off': 'Switch S1 OFF', 'start-press': 'Press START', 'start-release': 'Release START', 'stop-press': 'Press STOP', 'stop-release': 'Release STOP' };

test('three virtual builds accept real terminal taps, operate their hardware, prove behavior and save badges', async ({ page }, testInfo) => {
  test.setTimeout(150_000);
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await open(page);
  for (const [i, bench] of wiringBenches.entries()) {
    await page.getByRole('button', { name: `Build ${i + 1}: ${bench.title}`, exact: true }).click();
    for (const [a, b] of bench.connections) await connect(page, bench, a, b);
    await page.getByRole('button', { name: 'Check wiring', exact: true }).click();
    await expect(page.getByTestId('wiring-feedback')).toContainText('connections match');
    await page.getByTestId('wiring-panel').screenshot({ path: testInfo.outputPath(`build-${bench.id}-wired.png`) });
    for (const [step, item] of bench.steps.entries()) {
      await page.getByRole('button', { name: buttons[item.action], exact: true }).click();
      await expect(page.getByText(`PROVE IT / ${step + 1} OF ${bench.steps.length} TESTS`, { exact: true })).toBeVisible();
      if ((bench.id !== 'holding' && item.action === 'switch-on') || (bench.id === 'holding' && item.action === 'start-release' && step === 2)) await page.getByTestId('wiring-panel').screenshot({ path: testInfo.outputPath(`build-${bench.id}-operating.png`) });
      if (item.action !== 'power-off') await expect(page.getByRole('button', { name: 'Terminal PS +24', exact: true })).toBeDisabled();
    }
    await expect(page.getByTestId('wiring-feedback')).toContainText('Circuit proved!');
    await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('ell.wiring.v1') ?? '{}').boards?.[id]?.passed, bench.id)).toBe(true);
  }
  await page.reload(); await page.getByRole('tab', { name: 'Lab', exact: true }).click(); await page.getByRole('tab', { name: 'Virtual wiring', exact: true }).click();
  await expect(page.getByText('BUILD 1 · PROVED', { exact: true })).toBeVisible();
  await expect(page.getByText('BUILD 2 · PROVED', { exact: true })).toBeVisible();
  await expect(page.getByText('BUILD 3 · PROVED', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Turn bench power ON', exact: true })).toBeEnabled();
  await expect(page.getByLabel('Circuit output: lamp OFF', { exact: true })).toBeVisible();
  await expect(page.getByText('ϟ 0 XP', { exact: true })).toBeVisible(); expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('short circuits cut virtual power and targeted hints change when the wrong wire is removed', async ({ page }) => {
  await open(page); const bench = wiringBenches[0];
  await connect(page, bench, 'P', 'N');
  await page.getByRole('button', { name: 'Turn bench power ON', exact: true }).click();
  await expect(page.getByTestId('wiring-feedback')).toContainText('virtual current limit cut bench power');
  await expect(page.getByRole('button', { name: 'Turn bench power ON', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Check wiring', exact: true }).click();
  await expect(page.getByTestId('wiring-feedback')).toContainText('PS +24 → PS 0V');
  await page.getByRole('button', { name: 'Remove wire 1', exact: true }).click();
  await page.getByRole('button', { name: 'Ask Click for a wiring hint', exact: true }).click();
  await expect(page.getByTestId('wiring-feedback')).toContainText('connect PS +24 to S1 13');
  await connect(page, bench, 'P', 'S1');
  await page.getByRole('button', { name: 'Ask Click for a wiring hint', exact: true }).click();
  await expect(page.getByTestId('wiring-feedback')).toContainText('connect S1 14 to H1 +');
});

test('wire tools support accessible terminals, colors, cancellation, undo and confirmed clearing', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'blue wire', exact: true }).click();
  await page.getByRole('button', { name: 'Show terminal list', exact: true }).click();
  await page.getByRole('button', { name: 'Connect at PS +24', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel connection', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Terminal PS +24', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Connect at PS +24', exact: true }).click();
  await page.getByRole('button', { name: 'Connect at S1 13', exact: true }).click();
  await expect(page.getByText('W1 · PS +24 → S1 13 · blue', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Undo last wire', exact: true }).click();
  await expect(page.getByText('0 WIRES FITTED', { exact: true })).toBeVisible();
  await connect(page, wiringBenches[0], 'P', 'S1');
  await page.getByRole('button', { name: 'Clear this build', exact: true }).click();
  await page.getByRole('button', { name: 'Keep my wires', exact: true }).click();
  await expect(page.getByText('1 WIRES FITTED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear this build', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm clear wires', exact: true }).click();
  await expect(page.getByText('0 WIRES FITTED', { exact: true })).toBeVisible();
});

test('wire edits lock while powered and changing builds returns them to off without losing leads', async ({ page }) => {
  await open(page); const bench = wiringBenches[0];
  for (const [a, b] of bench.connections) await connect(page, bench, a, b);
  await page.getByRole('button', { name: 'Turn bench power ON', exact: true }).click();
  for (const name of ['Terminal PS +24', 'Remove wire 1', 'Undo last wire', 'Clear this build']) await expect(page.getByRole('button', { name, exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Build 2: Let the relay do the switching', exact: true }).click();
  await page.getByRole('button', { name: 'Build 1: Switch a pilot light', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Turn bench power ON', exact: true })).toBeEnabled();
  await expect(page.getByText('3 WIRES FITTED', { exact: true })).toBeVisible();
  await expect(page.getByText('PROVE IT / 0 OF 3 TESTS', { exact: true })).toBeVisible();
});

test('meter hardware responds to probe placement and preserves function/input guards', async ({ page }, testInfo) => {
  await page.goto('/'); await page.getByRole('tab', { name: 'Lab', exact: true }).click(); await page.getByRole('tab', { name: 'Meter bench', exact: true }).click();
  await page.getByRole('button', { name: 'Red probe to terminal B', exact: true }).click();
  await expect(page.getByLabel('Simulated display: 0.0 V', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Black probe to terminal A', exact: true }).click();
  await expect(page.getByLabel('Simulated display: −18.0 V', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Red probe lift off', exact: true }).click();
  await expect(page.getByLabel('Simulated display: LEADS', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Resistance (Ω)', exact: true }).click();
  await expect(page.getByLabel('Simulated display: STOP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '220 Ω resistor', exact: true }).click();
  await page.getByRole('button', { name: 'Red probe to terminal B', exact: true }).click();
  await expect(page.getByLabel('Simulated display: 220 Ω', { exact: true })).toBeVisible();
  await page.getByRole('img', { name: /^Digital meter equipment view/ }).screenshot({ path: testInfo.outputPath('meter-probes.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('the motor equipment view follows contactor, running and overload states', async ({ page }, testInfo) => {
  await page.goto('/'); await page.getByRole('tab', { name: 'Lab', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Starter equipment: contactor released, motor stopped, overload ready', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'START', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Starter equipment: contactor pulled in, motor running, overload ready', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Trip simulated overload', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Starter equipment: contactor released, motor stopped, overload tripped', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset simulated overload', exact: true }).click();
  await page.getByRole('img', { name: /^Starter equipment/ }).screenshot({ path: testInfo.outputPath('starter-equipment.png') });
});
