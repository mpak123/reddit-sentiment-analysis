const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

// data collected
let obj = {}; 
  
app.listen(port, () => {
    // Start the Puppeteer script whenever the app launches or changes are detected
    initialisePuppeteer();
    return console.log(`Express is listening at http://localhost:${port}`);
});

// the URL we would like to visit with Puppeteer
const TARGET_URL = 'https://www.google.com/'
const initialisePuppeteer = async () => {
    const browser = await puppeteer.launch({
      headless: false
    });
  
    const page = await browser.newPage();

    // placeholder for the actual item that needs to be reviewed
    const searchQuery = "Dolly";

    await page.goto(TARGET_URL);

    await page.type('input[class="gLFyf gsfi"]', searchQuery + " review reddit");
    await page.keyboard.press('Enter');

    await page.waitForSelector('div[class="g Ww4FFb tF2Cxc"]');
    const els = await page.$$('div.g.Ww4FFb.tF2Cxc');
    const urls = [];
    for (let i = 0; i < els.length; ++i){
      urls.push(await els[i].$eval('a', el => el.getAttribute('href')));
    }
  
    for (let j = 0; j < urls.length; ++j){
      await page.goto(urls[j]);
      await page.waitForSelector('p[class="_1qeIAgB0cPwnLhDF9XSiJM"]');
      obj[j] = await page.$$eval('p._1qeIAgB0cPwnLhDF9XSiJM', el => el.map(item => item.textContent));
    }

    browser.close();
}

app.get('/', (req, res) => {
  res.send(JSON.stringify(obj));
});