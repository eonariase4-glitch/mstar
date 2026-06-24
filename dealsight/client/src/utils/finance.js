export const calculateSDLT = (price, isAdditionalProperty = true) => {
  const numericPrice = Number(price) || 0;
  let tax = 0;
  const surcharge = isAdditionalProperty ? 0.05 : 0;

  const bands = [
    { threshold: 250000, rate: 0.0 },
    { threshold: 925000, rate: 0.05 },
    { threshold: 1500000, rate: 0.1 },
    { threshold: Infinity, rate: 0.12 },
  ];

  let previousThreshold = 0;

  for (const band of bands) {
    if (numericPrice > previousThreshold) {
      const taxableAmount = Math.min(numericPrice, band.threshold) - previousThreshold;
      tax += taxableAmount * band.rate;
      previousThreshold = band.threshold;
    }
  }

  return tax + numericPrice * surcharge;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatPercent = (value, digits = 1) => `${(Number(value) || 0).toFixed(digits)}%`;
