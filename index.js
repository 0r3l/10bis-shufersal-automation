const puppeteer = require('puppeteer');
const cookieParser = require('./cookie-parser');
const moment = require('moment');
const process = require('process');
const path = require('path');
const logger = require('./logger');
const { storage } = require('./firebase-integration');
const { fileDownload } = require('./file-download');
require('dotenv').config();

(async () => {
  try {

    logger.info('job started...')
    const browser = await puppeteer.launch({
      headless: process.env.HEADLESS_CHROME || false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    logger.info('disable page navigation timoeut...')
    await page.setDefaultNavigationTimeout(0);
    const cookie = await cookieParser
    await page.setCookie(...cookie)

    logger.info('loading 10bis shufersal page')
    await page.goto('https://www.10bis.co.il/next/restaurants/menu/delivery/26698/%D7%A9%D7%95%D7%A4%D7%A8%D7%A1%D7%9C---%D7%9B%D7%9C%D7%9C-%D7%90%D7%A8%D7%A6%D7%99');

    logger.info('try to close address suggestion popup', 10_000)
    // close address suggestion popup
    await clickOnButton(page, '#walkme-visual-design-a1590b69-75d8-da98-3b09-1e0ec4cad755 > button')

    logger.info('try to close feedback popup')
    // close feedback popup
    await clickOnButton(page, '[data-test-id="modalCloseButton"]', 10_000)

    logger.info('try to click 40 shekels voucher')
    //click 40 shekels voucher
    await clickOnButton(page, '[src="https://d25t2285lxl5rf.cloudfront.net/images/dishes/1898118.jpg"]')

    logger.info('try to click proceed to checkout button')
    // click proceed to checkout button
    await clickOnButton(page, 'button[data-test-id="proceedToCheckoutBtn"]')
    await clickOnButton(page, 'button[data-test-id="proceedToCheckoutBtn"]')

    // click submit order - this will charge if CHARGE env var is set to truthy value!
    if (process.env.CHARGE) {
      logger.info('try to click submit order (charge)')
      await clickOnButton(page, '[data-test-id="checkoutSubmitOrderBtn"]')
    }

    // save and upload barcode image & barcode number
    const voucherFilePath = `${path.resolve(__dirname)}/vouchers/${moment().format('DD.MM.YYYY')}.png`;
    await saveOnlyBarcode(page, voucherFilePath)

    await browser.close();
  } catch (e) {
    logger.error(`${e} ${e.message} ${e.stack}`);
  }

})();

/**
 *
 * @param { puppeteer.Page } page
 * @param { string } filePath
 */
async function saveOnlyBarcode(page, filePath) {

  const barcodeImageSelectorText = '[class*="CouponBarCodeComponent__BarCodeImg"]';
  logger.info('waiting for bracode image selector...');
  await page.waitForSelector(barcodeImageSelectorText, { timeout: 0 });

  logger.info('starting to save barcode...');
  const barcodeImageSelector = await page.$(barcodeImageSelectorText);
  const backgroundImage = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, barcodeImageSelector);
  const bracodeUrl = backgroundImage.replace(/url\(\"/, "").replace(/\"\)/, "");
  logger.info(`barcode url: ${bracodeUrl}`)
  const barcodeNumberSelector = await page.$('[class*="CouponBarCodeComponent__BarCodeNumber"]');
  const barcodeNumber = await page.evaluate(el => el.textContent, barcodeNumberSelector);
  logger.info(`barcode number: ${barcodeNumber}`)
  await fileDownload(bracodeUrl, filePath);
  logger.info(`file ${filePath} download completed`)
  await storage.uploadFile(filePath, barcodeNumber)

}

/**
 *
 * @param { puppeteer.Page } page
 * @param { puppeteer.ElementHandle<Element> } selector
 */
async function clickOnButton(page, selector, timeout) {
  try {
    await page.waitForSelector(selector, { timeout: timeout || 0 })
    const button = await page.$(selector)
    await button.click({ delay: 1000 })
  } catch (e) {
    logger.error(`button click failed for selector ${selector}`)
    logger.error(e, e?.stack)
  }
}
