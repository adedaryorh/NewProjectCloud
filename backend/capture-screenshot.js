const puppeteer = require('puppeteer');

const captureScreenshot = async (url, filename) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: filename });
  await browser.close();
};

const args = process.argv.slice(2);

if (args[0] === 'success') {
  // Replace 'URL_FOR_SUCCESS_SCREENSHOT' with the URL of the successful linting report page.
  captureScreenshot('URL_FOR_SUCCESS_SCREENSHOT', 'success-screenshot.png');
} else if (args[0] === 'failure') {
  // Replace 'URL_FOR_FAILURE_SCREENSHOT' with the URL of the failed linting report page.
  captureScreenshot('URL_FOR_FAILURE_SCREENSHOT', 'failure-screenshot.png');
} else {
  console.error('Invalid argument. Use "success" or "failure".');
  process.exit(1);
}
