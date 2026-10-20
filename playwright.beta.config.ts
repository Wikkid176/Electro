import { defineConfig } from '@playwright/test';
import regular from './playwright.config';

export default defineConfig({
  ...regular,
  testDir: './tests/beta',
  testMatch: 'journeys.spec.ts',
  timeout: 240_000,
  workers: 2,
  fullyParallel: true,
  projects: [{ name: 'simulated-beta' }],
  outputDir: 'test-results/beta',
  reporter: [['list'], ['json', { outputFile: 'beta-results/playwright-beta.json' }]],
});
