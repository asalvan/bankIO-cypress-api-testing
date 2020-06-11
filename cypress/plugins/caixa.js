
const puppeteer = require('./puppeteer');

async function doCaixaSandboxLogin(url, options) {
  const { browser, page } = await puppeteer.newPage(options);
  
  try {
    await page.goto(url);

    await page.waitFor('input[name="usuario"]');
    await page.type('input[name="usuario"]', "user1");

    await page.waitFor('input[name="pass"]');
    await page.type('input[name="pass"]', "1234");
    
    const returnToTPPElement = await page.$x("//button[contains(., 'LOGIN')]");
    await returnToTPPElement[0].click();
    
    await page.waitForXPath("//button[contains(., 'Continuar')]");
    const confirmButtonElement = await page.$x("//button[contains(., 'Continuar')]");
    await confirmButtonElement[0].click();

    const firstRequest = await page.waitForRequest((request) => {
      return request.url().includes("https://cypress.bankio.local/openbanking/callback") && request.method() === "GET";
    });

    await browser.close();

    return firstRequest.url();
  } catch (e) {
    console.error(e);

    await page.screenshot({
      path: "./cypress/screenshots/caixa.jpg",
      type: "jpeg",
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
    doCaixaSandboxLogin
}