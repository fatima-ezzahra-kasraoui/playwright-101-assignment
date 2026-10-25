# Playwright 101 – TestMu AI assignment

## Setup
```bash
npm install
cp .env.example .env     # fill LT_USERNAME and LT_ACCESS_KEY
npx playwright test
```
Runs the 3 scenarios in parallel on:
- Windows 10 + Chrome (latest)
- macOS Catalina + Firefox (latest)

Network logs, video, console logs and screenshots are enabled in `fixtures/lambdatest.ts`.
Test Session IDs: TestMu AI dashboard → Automation → Builds → "Playwright 101 Assignment".
