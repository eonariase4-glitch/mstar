import { calculateCompsMetrics, fetchSoldData } from '../services/comparableService.js';
import { extractPostcode, scrapeRightmove } from '../services/scraper.js';

export const searchRightmove = async (req, res, next) => {
  const { location, minPrice, maxPrice } = req.body;

  try {
    const properties = await scrapeRightmove(location, minPrice, maxPrice);

    const enriched = await Promise.all(
      properties.map(async (property) => {
        const postcode = property.postcode || extractPostcode(property.address) || extractPostcode(location);

        if (!postcode) {
          return property;
        }

        const soldData = await fetchSoldData(postcode);
        return {
          ...property,
          postcode,
          comparables: {
            data: soldData.slice(0, 5),
            metrics: calculateCompsMetrics(soldData),
          },
        };
      }),
    );

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};
