import { Page, Locator, expect } from '@playwright/test';

export class CustomerAccountPage {
  readonly page: Page;

  // Tabs
  readonly depositTab: Locator;
  readonly withdrawTab: Locator;
  readonly transactionsTab: Locator;

  // Shared amount field + submit button on Deposit/Withdraw forms
  readonly amountInput: Locator;
  readonly submitBtn: Locator;

  // Feedback messages
  readonly depositSuccessMsg: Locator;     // "Deposit Successful"

  // Transactions table
  readonly transactionsRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.depositTab = page.getByRole('button', { name: 'Deposit' });
    this.withdrawTab = page.getByRole('button', { name: 'Withdrawl' }); // label is "Withdrawl" in this demo UI
    this.transactionsTab = page.getByRole('button', { name: 'Transactions' });

    this.amountInput = page.locator('input[ng-model="amount"]');
    this.submitBtn = page.locator('form[name="myForm"] button[type="submit"]');

    this.depositSuccessMsg = page.getByText('Deposit Successful', { exact: true });

    this.transactionsRows = page.locator('table tbody tr');
  }

  async deposit(amount: number) {
    await this.depositTab.click();
    await this.amountInput.fill(String(amount));
    await this.submitBtn.click();
    await expect(this.depositSuccessMsg).toBeVisible();
  }

  async gotoTransactions() {
    await this.transactionsTab.click();
    await expect(this.transactionsRows.first()).toBeVisible();
  }

  // Generic transaction row filter by { amount, type: 'Credit'|'Debit' }
  rowBy(amount: number, type: 'Credit' | 'Debit') {
    return this.transactionsRows
      .filter({ has: this.page.locator('td', { hasText: String(amount) }) })
      .filter({ has: this.page.locator('td', { hasText: type }) });
  }
}