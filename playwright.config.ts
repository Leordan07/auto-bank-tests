import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', // we also save our own screenshots at key steps
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});