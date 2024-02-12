const puppeteer = require('puppeteer');
const { google } = require('googleapis');
const credentials = require('./credentials.json');

const headers = {
  Method: 'GET',
  Cookie: 'csrftoken=rKHw1cL30DxtkstLjRXY0Qgjr7O6HpgK0JTctCfDsq864yl7yDfavIWH4ZgMX7mv; sessionid=8ndvobtizz7ri1c5t39hqu6frg0o5j8i'
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
const sheets = google.sheets({ version: 'v4', auth });

async function runlms(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders(headers);
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(url);

  await page.evaluate(() => {

    const bookingcode = document.querySelector("#result_list > tbody > tr > th > a");
    bookingcode.click();

  }, );

  await page.waitForTimeout(3000);

  await page.evaluate(() => {

    const confirmRR2 = document.querySelector("#id_is_completed");
    confirmRR2.click();

    const confirmRR = document.querySelector("#bookingdetailseditfields_form > div > footer > ul > li:nth-child(2) > input");
    confirmRR.click(); 
  }, ); 

  await page.waitForTimeout(3000);

  await browser.close();
}

async function processSpreadsheetData() {
    const spreadsheetId = '1yGYejYpDrFq5kufBw51gfqBuvSkMfDZVnFM-owLXhzM';
    const range = 'Unlock!F2:F';
  
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
  
      const rows = response.data.values;
      if (rows.length) {
        for (const row of rows) {
          const [url] = row;
  
          if (url) {
            await runlms(url);
          } else {
            console.log('Invalid row data:', row);
          }
        }
      } else {
        console.log('No data found.');
      }
    } catch (err) {
      console.error('The API returned an error:', err);
    }
  }
  
  processSpreadsheetData();
  