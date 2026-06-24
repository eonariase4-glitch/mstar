import axios from 'axios';
import { extractPostcode } from './postcode.js';

export const fetchComparables = async (postcode) => {
  const normalizedPostcode = extractPostcode(postcode);

  if (!normalizedPostcode) {
    return [];
  }

  const query = `
    PREFIX ppd: <http://landregistry.data.gov.uk/def/ppi/>
    PREFIX lrcommon: <http://landregistry.data.gov.uk/def/common/>

    SELECT ?amount ?date ?propertyType ?address
    WHERE {
      ?transx ppd:pricePaid ?amount ;
              ppd:transactionDate ?date ;
              ppd:propertyAddress ?addr .
      ?addr lrcommon:postcode "${normalizedPostcode}" .
      OPTIONAL { ?transx ppd:propertyType ?propertyType }
    }
    ORDER BY DESC(?date)
    LIMIT 20
  `;

  const url = `https://landregistry.data.gov.uk/landregistry/query?query=${encodeURIComponent(query)}&output=json`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data.results.bindings.map((item) => ({
      price: Number(item.amount.value),
      date: item.date.value,
      type: item.propertyType?.value,
    }));
  } catch (error) {
    console.error('Land Registry Error:', error.message);
    return [];
  }
};
