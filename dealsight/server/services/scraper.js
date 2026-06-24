import puppeteer from 'puppeteer';
export { extractPostcode } from './postcode.js';

export const scrapeRightmove = async (location, minPrice, maxPrice) => {
  let browser;
  const params = new URLSearchParams({
    searchLocation: location || '',
    minPrice: minPrice || '',
    maxPrice: maxPrice || '',
    index: '0',
  });
  const searchUrl = `https://www.rightmove.co.uk/property-for-sale/find.html?${params.toString()}`;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    );
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    return await page.evaluate(() => {
      const cards = document.querySelectorAll('.l-searchResult');
      return Array.from(cards)
        .map((card) => {
          const href = card.querySelector('.propertyCard-link')?.getAttribute('href');
          const address = card.querySelector('.propertyCard-address')?.innerText?.trim();

          return {
            id: card.id,
            price: card.querySelector('.propertyCard-priceValue')?.innerText?.trim(),
            address,
            title: card.querySelector('.propertyCard-title')?.innerText?.trim(),
            img: card.querySelector('.propertyCard-img img')?.src,
            url: href ? `https://www.rightmove.co.uk${href}` : undefined,
            agent: card.querySelector('.propertyCard-contactMethod--agentName')?.innerText?.trim(),
          };
        })
        .filter((property) => property.title || property.address);
    });
  } catch (error) {
    console.error('Rightmove scrape failed:', error.message);
    return [];
  } finally {
    await browser?.close();
  }
};
