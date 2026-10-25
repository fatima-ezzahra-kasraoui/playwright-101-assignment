# Playwright 101 – Cross-Browser Test Automation on TestMu AI

End-to-end UI tests written with **Playwright (TypeScript)** and executed **in parallel on the TestMu AI cloud grid** (formerly LambdaTest), as part of the TestMu AI *Playwright 101* certification assignment.

The tests target the public [TestMu AI Selenium Playground](https://www.testmuai.com/selenium-playground/) and cover form handling, validation, dropdown selection and slider interaction across two browser/OS combinations.

## Highlights

- **Cloud cross-browser execution**: tests run remotely on TestMu AI, no local browsers required.
- **Parallel runs** on two environments at the same time:
  | Project | OS | Browser |
  |---|---|---|
  | `Windows10-Chrome` | Windows 10 | Chrome (latest) |
  | `macOS-Sonoma-Firefox` | macOS Sonoma | Firefox (latest) |
- **Full observability enabled** for every session: video recording, network logs, console logs and screenshots.
- **Custom Playwright fixture** that connects to the grid, builds the capabilities, and reports the pass/fail status back to the TestMu AI dashboard.
- **Resilient locators**: role-based, placeholder-based, id-based and scoped locators (no brittle XPath).
- **Secrets kept out of source control** via `.env` (only `.env.example` is committed).

## Tech Stack

- Playwright Test 1.61
- TypeScript
- Node.js
- dotenv
- TestMu AI (LambdaTest) cloud grid via Playwright CDP endpoint

## Test Scenarios

| # | Scenario | What it verifies |
|---|---|---|
| 1 | **Simple Form Demo** | Navigates from the playground home page, validates the URL contains `simple-form-demo`, types a message stored in a variable, clicks *Get Checked Value* and asserts the same text appears under *Your Message:*. |
| 2 | **Drag & Drop Sliders** | Drags the "Default value 15" slider with the mouse to **95** and asserts the displayed range value is `95` (keyboard fine-tuning handles sub-pixel drift between browsers). |
| 3 | **Input Form Submit** | Submits the empty form and asserts the validation message, fills all fields, selects **United States** by its visible text, submits and asserts the success message *"Thanks for contacting us, we will get back to you shortly."* |

## Project Structure

```
.
├── fixtures/
│   └── lambdatest.ts          # Custom `page` fixture: grid connection, capabilities, status reporting
├── tests/
│   ├── scenario1-simple-form.spec.ts
│   ├── scenario2-slider.spec.ts
│   └── scenario3-input-form.spec.ts
├── playwright.config.ts       # Two projects (browser/OS combos), parallel workers
├── .env.example               # Template for credentials
├── package.json
└── tsconfig.json
```

## How It Works

1. `playwright.config.ts` defines one **project per browser/OS combination** and runs them with 2 parallel workers.
2. Each project passes its capabilities (browser, version, platform) to the fixture through a custom `ltCaps` option.
3. The fixture in `fixtures/lambdatest.ts` builds the `LT:Options` capabilities (build name, test name, credentials, `video`, `network`, `console`, `visual`), connects to `wss://cdp.lambdatest.com/playwright` using the matching browser type, and hands a ready-to-use `page` to the test.
4. After each test, the fixture sends a `setTestStatus` action so the TestMu AI dashboard shows the real pass/fail result.

## Getting Started

### Prerequisites
- Node.js 18+
- A TestMu AI account (username and access key)

### Installation
```bash
git clone https://github.com/fatima-ezzahra-kasraoui/playwright-101-assignment.git
cd playwright-101-assignment
npm install
```

### Configuration
```bash
cp .env.example .env
```
Edit `.env` with your own credentials (found under *Settings → Account Settings → Password & Security* on TestMu AI):
```
LT_USERNAME=your_username
LT_ACCESS_KEY=your_access_key
```

### Run the tests
```bash
npx playwright test
```
This starts all 3 scenarios on both environments (6 sessions) in parallel. Results appear in the terminal, and the full sessions (video, logs, screenshots) are available on the TestMu AI dashboard under **Automation → Builds**.

To open the local HTML report:
```bash
npx playwright show-report
```

## Challenges Solved

- **Strict-mode locator violations**: the page footer contains additional `email` inputs, so the form locators are scoped to the demo form instead of using global attribute selectors.
- **Flaky click on a freshly loaded page**: the *Get Checked Value* action is retried with `expect(...).toPass()` until the page script has attached its handler.
- **Cross-browser slider precision**: the slider is dragged with real mouse events and corrected with keyboard steps so the result is deterministic on Chrome and Firefox.
- **Firefox on the cloud grid**: the connection uses the browser type that matches the requested browser, and the macOS version and Playwright version were aligned with what the grid supports.

## Possible Improvements

- Add a CI workflow (GitHub Actions) to run the suite on every push.
- Add a WebKit/Safari project to extend browser coverage.
- Move selectors into Page Object classes for larger suites.

## Author

**Fatima Ezzahra Kasraoui**
