export const calculateDealScore = (metrics) => {
  const roi = Number(metrics.roi) || 0;
  const bmvPercent = Number(metrics.bmvPercent) || 0;
  const cashflow = Number(metrics.cashflow) || 0;
  const locationScore = Number(metrics.locationScore) || 0;

  let score = 0;
  score += Math.min((roi / 12) * 30, 30);
  score += Math.min((bmvPercent / 20) * 30, 30);
  score += Math.min((cashflow / 500) * 20, 20);
  score += (locationScore / 10) * 20;

  return Math.max(0, Math.round(score));
};

export const getProximityScore = (places) => {
  const hasStation = places.some((place) => place.type === 'train_station' && place.distance < 800);
  return hasStation ? 10 : 5;
};
