const puppeteer = require('puppeteer');
const cookieParser = require('./cookie-parser');
const moment = require('moment');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const cookie = await cookieParser
  await page.setCookie(...cookie)
  await page.goto('https://www.10bis.co.il/next/restaurants/menu/delivery/26698/%D7%A9%D7%95%D7%A4%D7%A8%D7%A1%D7%9C---%D7%9B%D7%9C%D7%9C-%D7%90%D7%A8%D7%A6%D7%99', { waitUntil: 'load' });

  // close address suggestion popup
  await clickOnButton(page, '#walkme-visual-design-a1590b69-75d8-da98-3b09-1e0ec4cad755 > button')

  // close feedback popup
  await clickOnButton(page, '[data-test-id="modalCloseButton"]')

  //click 40 shekels voucher
  await clickOnButton(page, '[src="https://d25t2285lxl5rf.cloudfront.net/images/dishes/1898118.jpg"]')

  // click proceed to checkout button
  await clickOnButton(page, '[data-test-id="proceedToCheckoutBtn"]')

  // click submit order - this will charge if CHARGE env var is set to truthy value!
  if (process.env.CHARGE) {
    await clickOnButton(page, '[data-test-id="checkoutSubmitOrderBtn"]')
    await page.waitForNavigation({ waitUntil: 'load' })
  }

  await page.screenshot({ path: `${moment().format('DD.MM.YYYY')}.png` }, { fullPage: true });
  await browser.close();
})();

async function clickOnButton(page, selector) {
  try {
    await page.waitForSelector(selector, { timeout: 5000 })
    const button = await page.$(selector)
    await button.click({ delay: 1000 })
  } catch (e) {
    console.error(e)
  }
}
