import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const testPort = Number(process.env.ELECTRO_TEST_PORT ?? 8082);
if (!Number.isInteger(testPort) || testPort < 1024 || testPort > 65535) {
  throw new Error('ELECTRO_TEST_PORT must be an integer from 1024 to 65535');
}
const testUrl = `http://localhost:${testPort}`;

export default defineConfig({
  testDir: './tests/browser',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: testUrl,
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
      args: ['--no-sandbox'],
    },
  },
  projects: [
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: `npm run web -- --localhost --port ${testPort} --max-workers 2`,
    url: testUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { EXPO_NO_TELEMETRY: '1' },
  },
});
