export const calculateUKStampDuty = (price, type = 'buy-to-let') => {
  const numericPrice = Number(price) || 0;
  const isBTL = type === 'buy-to-let' || type === 'second-home';
  const surchargeRate = isBTL ? 0.05 : 0;

  const bands = [
    { upTo: 250000, rate: 0.0 },
    { upTo: 925000, rate: 0.05 },
    { upTo: 1500000, rate: 0.1 },
    { upTo: Infinity, rate: 0.12 },
  ];

  let totalTax = 0;
  let previousThreshold = 0;

  for (const band of bands) {
    if (numericPrice > previousThreshold) {
      const taxableInBand = Math.min(numericPrice, band.upTo) - previousThreshold;
      totalTax += taxableInBand * band.rate;
      previousThreshold = band.upTo;
    }
  }

  const surcharge = numericPrice * surchargeRate;

  return {
    standardTax: totalTax,
    surcharge,
    total: totalTax + surcharge,
  };
};
