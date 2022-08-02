const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3001;

// data collection
let obj = []; 

// path to python script
let pythonScript = "./server/analyzer.py";

// optimal configuration for puppeteer
const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

// Array of third-party domains to block
const blockedDomains = [
  'https://pagead2.googlesyndication.com',
  'https://creativecdn.com',
  'https://www.googletagmanager.com',
  'https://cdn.krxd.net',
  'https://adservice.google.com',
  'https://cdn.concert.io',
  'https://z.moatads.com',
  'https://cdn.permutive.com'];
  
app.listen(port, () => {
    // Start the Puppeteer script whenever the app launches or changes are detected
    initialisePuppeteer();
    return console.log(`Express is listening at http://localhost:${port}`);
});

// the URL we would like to visit with Puppeteer
const TARGET_URL = 'https://www.google.com/';
const initialisePuppeteer = async () => {

    const browser = await puppeteer.launch({
      headless: true,
      userDataDir: './my/path',
      args: minimal_args
    });
  
    const page = await browser.newPage();

    // placeholder for the actual item that needs to be reviewed
    const searchQuery = "taobao";

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = request.url();
      if (request.resourceType() === 'document' || blockedDomains.some((d) => url.startsWith(d)))  {
        request.continue();
      } else {
        request.abort();
      }
    });

    await page.goto(TARGET_URL);

    await page.type('input[class="gLFyf gsfi"]', searchQuery + " review site:www.reddit.com");
    await page.keyboard.press('Enter');

    await page.waitForSelector('div[class="g Ww4FFb tF2Cxc"]');
    const urls = await page.$$eval('div.yuRUbf a', el => el.map(url => url.getAttribute('href')));
  
    for (let i = 0; i < urls.length; ++i){

      await page.goto(urls[i]);

      try {
        await page.waitForSelector('p[class="_1qeIAgB0cPwnLhDF9XSiJM"]', {timeout: 50});
        const text = await page.$$eval('p._1qeIAgB0cPwnLhDF9XSiJM', el => el.map(item => item.textContent));
        for (let j = 0; j < text.length; ++j){
          let string = "";
          for (const word of text[j].split(" ")){
            if (word.length <= 50){
              string += word + " ";
            }
          }
          obj.push(string);
        }
      } catch (error) {
        console.log("This reddit post doesn't include any text.");
      }
    }

    browser.close();

    app.get('/data', (req, res) => {
      res.send(obj);
    });

    app.get('/result', (req, res) => {
      // allow node to call python script and send data to python
      const spawn = require('child_process').spawn;
      const scriptExecution = spawn('python3', [pythonScript]);

      let result = {};
    
      scriptExecution.stdout.on('data', function(data) {
        result = JSON.parse(Buffer.from(data).toString());
      });
      scriptExecution.on('close', function(code) {
        res.send(result);
      });
    });
}