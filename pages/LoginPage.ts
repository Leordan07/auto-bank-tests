import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly customerLoginBtn: Locator;
  readonly userSelect: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerLoginBtn = page.getByRole('button', { name: 'Customer Login' });
    this.userSelect = page.locator('select#userSelect');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('#/login');
    await expect(this.customerLoginBtn).toBeVisible();
  }

  async customerLoginAs(name: string) {
    await this.customerLoginBtn.click();
    await this.userSelect.selectOption({ label: name });
    await this.loginBtn.click();
  }
}