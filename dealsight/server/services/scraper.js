import puppeteer from 'puppeteer';

const UK_POSTCODE_PATTERN = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i;

export const extractPostcode = (value = '') => {
  const match = String(value).match(UK_POSTCODE_PATTERN);
  if (!match) return null;

  const compact = match[0].toUpperCase().replace(/\s+/g, '');
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
};

export const scrapeRightmove = async (location, minPrice, maxPrice) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const params = new URLSearchParams({
    searchLocation: location || '',
    minPrice: minPrice || '',
    maxPrice: maxPrice || '',
    index: '0',
  });
  const searchUrl = `https://www.rightmove.co.uk/property-for-sale/find.html?${params.toString()}`;

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    );
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

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
  } finally {
    await browser.close();
  }
};
