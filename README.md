# AUTO-BANK-TESTS
 
 **Features**
- ✔ Playwright + TypeScript
- ✔ Page Object Model design
- ✔ Screenshots saved during critical steps
- ✔ Headless + headed (Chrome visible) test execution
- ✔ Deposit, withdrawal, and negative validation tests
- ✔ Transaction history verification using Playwright assertions
- ✔ Organized folder structure suitable for CI/CD

**Tech Stack**
- Playwright (Test Runner + Browser Automation)
- TypeScript
- Node.js
- Page Object Model (POM)
- VS Code / GitHub Actions ready

**Installation**
1. Install dependencies
- npm install
2. Install Playwright browsers
- npx playwright install

**Running Tests**
- Run headless (default)
  - npx playwright test
- Run visible in Chrome (headed)
  - npx playwright test --headed --project=chromium
- Run with the interactive UI
  - npx playwright test --ui

 **Screenshots**
 Screenshots are saved automatically to:
- /screenshots/<testName>__timestamp__<step>.png

**Implemented Tests**

✅ Deposit Test
1. Login as Harry Potter
2. Deposit 100
3. Navigate to Transactions
4. Assert a row exists showing Credit and 100

✅ Negative Test
1. Ensures invalid inputs:
- "abc"
- empty amount
