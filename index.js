const puppeteer = require('puppeteer');
const cookieParser = require('./cookie-parser');
const moment = require('moment');
const path = require('path');
const logger = require('./logger');
const { storage } = require('./firebase-integration');

(async () => {
  logger.info('job started...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const cookie = await cookieParser
  await page.setCookie(...cookie)

  logger.info('loading 10bis shufersal page')
  await page.goto('https://www.10bis.co.il/next/restaurants/menu/delivery/26698/%D7%A9%D7%95%D7%A4%D7%A8%D7%A1%D7%9C---%D7%9B%D7%9C%D7%9C-%D7%90%D7%A8%D7%A6%D7%99', { waitUntil: 'load' });

  logger.info('try to close address suggestion popup')
  // close address suggestion popup
  await clickOnButton(page, '#walkme-visual-design-a1590b69-75d8-da98-3b09-1e0ec4cad755 > button')

  logger.info('try to close feedback popup')
  // close feedback popup
  await clickOnButton(page, '[data-test-id="modalCloseButton"]')

  logger.info('try to click 40 shekels voucher')
  //click 40 shekels voucher
  await clickOnButton(page, '[src="https://d25t2285lxl5rf.cloudfront.net/images/dishes/1898118.jpg"]')

  logger.info('try to click proceed to checkout button')
  // click proceed to checkout button
  await clickOnButton(page, '[data-test-id="proceedToCheckoutBtn"]')

  // click submit order - this will charge if CHARGE env var is set to truthy value!
  if (process.env.CHARGE) {
    logger.info('try to click submit order (charge)')
    await clickOnButton(page, '[data-test-id="checkoutSubmitOrderBtn"]')
    await page.waitForNavigation({ waitUntil: 'load' })
    await page.waitForTimeout(5000)
  }

  logger.info('taking screenshot...')
  const screenshotFilePath = `${path.resolve(__dirname)}/vouchers/${moment().format('DD.MM.YYYY')}.png`;
  await page.screenshot({ path: screenshotFilePath}, { fullPage: true });
  await browser.close();

  await storage.uploadFile(screenshotFilePath)

})();

async function clickOnButton(page, selector) {
  try {
    await page.waitForSelector(selector, { timeout: 5000 })
    const button = await page.$(selector)
    await button.click({ delay: 1000 })
  } catch (e) {
    logger.error(`button click failed for selector ${selector}`)
  }
}
