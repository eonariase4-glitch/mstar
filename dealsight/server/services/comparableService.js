import axios from 'axios';
import { extractPostcode } from './postcode.js';

export const fetchSoldData = async (postcode) => {
  const normalizedPostcode = extractPostcode(postcode);

  if (!normalizedPostcode) {
    return [];
  }

  const query = `
    PREFIX ppd: <http://landregistry.data.gov.uk/def/ppi/>
    PREFIX lrcommon: <http://landregistry.data.gov.uk/def/common/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

    SELECT ?amount ?date ?propertyType ?street ?paon ?saon
    WHERE {
      ?transx ppd:pricePaid ?amount ;
              ppd:transactionDate ?date ;
              ppd:propertyAddress ?addr .
      ?addr lrcommon:postcode "${normalizedPostcode}" .
      OPTIONAL { ?addr lrcommon:street ?street }
      OPTIONAL { ?addr lrcommon:paon ?paon }
      OPTIONAL { ?addr lrcommon:saon ?saon }
      OPTIONAL { ?transx ppd:propertyType/skos:prefLabel ?propertyType }
    }
    ORDER BY DESC(?date)
    LIMIT 100
  `;

  const url = `https://landregistry.data.gov.uk/landregistry/query?query=${encodeURIComponent(query)}&output=json`;

  try {
    const response = await axios.get(url, { timeout: 10000 });

    return response.data.results.bindings.map((item) => ({
      price: Number(item.amount.value),
      date: new Date(item.date.value).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' }),
      type: item.propertyType?.value || 'Unknown',
      address: `${item.saon?.value || ''} ${item.paon?.value || ''} ${item.street?.value || ''}`.trim(),
    }));
  } catch (error) {
    console.error('Land Registry comparable lookup failed:', error.message);
    return [];
  }
};

export const calculateCompsMetrics = (data) => {
  const validData = data.filter((item) => Number.isFinite(item.price));
  if (!validData.length) return null;

  const prices = validData.map((item) => item.price).sort((a, b) => a - b);
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const median = prices[Math.floor(prices.length / 2)];
  const confidence = Math.min((validData.length / 20) * 100, 100);

  return {
    average,
    median,
    min: prices[0],
    max: prices[prices.length - 1],
    count: validData.length,
    confidenceScore: Math.round(confidence),
  };
};
