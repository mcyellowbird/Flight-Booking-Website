const puppeteer = require('puppeteer');

async function scrapeInfo(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('//*[@id="flyingtime"]');
    const src = await el.getProperty('innerHTML');
    const srcTxt = await src.jsonValue();

    return srcTxt;
    console.log(srcTxt);
}