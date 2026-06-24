import { useMemo } from 'react';
import { calculateSDLT } from '../utils/finance.js';

const toNumber = (value) => Number(value) || 0;

export const useBRRRCalculator = (inputs) =>
  useMemo(() => {
    const purchasePrice = toNumber(inputs.purchasePrice);
    const buyingCosts = toNumber(inputs.buyingCosts);
    const refurbCost = toNumber(inputs.refurbCost);
    const holdingCosts = toNumber(inputs.holdingCosts);
    const arv = toNumber(inputs.arv);
    const refinanceLTV = toNumber(inputs.refinanceLTV);
    const newRate = toNumber(inputs.newRate);
    const monthlyRent = toNumber(inputs.monthlyRent);

    const sdlt = calculateSDLT(purchasePrice);
    const totalSunk = purchasePrice + sdlt + buyingCosts + refurbCost + holdingCosts;
    const newMortgage = (arv * refinanceLTV) / 100;
    const moneyLeftIn = totalSunk - newMortgage;
    const equityCreated = arv - newMortgage - Math.max(moneyLeftIn, 0);
    const monthlyInterest = (newMortgage * (newRate / 100)) / 12;
    const netCashflow = monthlyRent - monthlyInterest - monthlyRent * 0.15;

    return {
      sdlt,
      totalSunk,
      newMortgage,
      moneyLeftIn,
      equityCreated,
      netCashflow,
      roi: ((netCashflow * 12) / Math.max(moneyLeftIn, 1)) * 100,
    };
  }, [inputs]);
