import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';

/** Ensure screenshots/ exists and return absolute path for a given filename */
async function shotPath(testTitle: string, step: string) {
  const dir = path.resolve('screenshots');
  await fs.mkdir(dir, { recursive: true });
  // sanitize test title for filesystem
  const safeTitle = testTitle.replace(/[^\w.-]+/g, '_').slice(0, 80);
  return path.join(dir, `${safeTitle}__${Date.now()}__${step}.png`);
}

test.describe('XYZ Bank (Customer flow)', () => {
  test('Deposit $100 is visible in Transactions (Credit 100)', async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    const acct = new CustomerAccountPage(page);

    await login.goto();
    await login.customerLoginAs('Harry Potter');
    await page.screenshot({ path: await shotPath(testInfo.title, 'after-login'), fullPage: true });

    await acct.deposit(100);
    await page.screenshot({ path: await shotPath(testInfo.title, 'after-deposit'), fullPage: true });

    await acct.gotoTransactions();
    await page.screenshot({ path: await shotPath(testInfo.title, 'transactions-view'), fullPage: true });

    // Final built-in assertion: a transaction row exists with amount 100 and type Credit
    await expect(acct.rowBy(100, 'Credit')).not.toHaveCount(0);
  });

  test('Negative: deposit rejects non-numeric and empty values', async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    const acct = new CustomerAccountPage(page);

    await login.goto();
    await login.customerLoginAs('Harry Potter');

    // 1) Non-numeric input
    await acct.depositTab.click();
    await acct.amountInput.fill('abc'); // invalid for type=number
    await acct.submitBtn.click();

    // Expect NO success banner
    await expect(acct.depositSuccessMsg).toBeHidden();

    // Go to Transactions and assert there is NO new Credit "abc" (should never exist)
    await acct.gotoTransactions();
    // A safer check: ensure there's no fresh row with "Credit" and a cell containing 'abc'
    const bogus = page.locator('table tbody tr')
      .filter({ has: page.locator('td', { hasText: 'Credit' }) })
      .filter({ has: page.locator('td', { hasText: 'abc' }) });
    await expect(bogus).toHaveCount(0);

    await page.screenshot({ path: await shotPath(testInfo.title, 'after-invalid-deposit'), fullPage: true });

    // 2) Empty value
    await acct.depositTab.click();
    await acct.amountInput.fill(''); // leave empty
    await acct.submitBtn.click();

    // Still no success
    await expect(acct.depositSuccessMsg).toBeHidden();

    // And transactions should not gain an empty amount row
    await acct.gotoTransactions();
    const emptyRow = page.locator('table tbody tr').filter({ has: page.locator('td', { hasText: /^$/ }) });
    await expect(emptyRow).toHaveCount(0);
  });
});