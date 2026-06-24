import { useState } from 'react';
import InputField from '../../components/InputField.jsx';
import StatCard from '../../components/StatCard.jsx';
import { useBRRRCalculator } from '../../hooks/useBRRRCalculator.js';
import { formatCurrency, formatPercent } from '../../utils/finance.js';

const INPUTS = [
  ['purchasePrice', 'Purchase Price', 'GBP'],
  ['buyingCosts', 'Buying Costs', 'GBP'],
  ['refurbCost', 'Refurb Cost', 'GBP'],
  ['arv', 'After Repair Value', 'GBP'],
  ['refinanceLTV', 'Refinance LTV', '%'],
  ['newRate', 'New Mortgage Rate', '%'],
  ['monthlyRent', 'Monthly Rent', 'GBP'],
  ['holdingCosts', 'Holding Costs', 'GBP'],
];

const BRRRCalculator = () => {
  const [inputs, setInputs] = useState({
    purchasePrice: 200000,
    buyingCosts: 2000,
    refurbCost: 30000,
    arv: 280000,
    refinanceLTV: 75,
    newRate: 5.5,
    monthlyRent: 1500,
    holdingCosts: 1000,
  });

  const results = useBRRRCalculator(inputs);

  const updateInput = (key, value) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="rounded-lg bg-slate-900 p-6 text-amber-500 shadow-xl">
      <h2 className="mb-4 border-b border-amber-900/50 pb-2 text-2xl font-bold">BRRR Strategy</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {INPUTS.map(([key, label, suffix]) => (
            <InputField
              key={key}
              label={label}
              suffix={suffix}
              type="number"
              value={inputs[key]}
              onChange={(event) => updateInput(key, event.target.value)}
            />
          ))}
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-slate-800/50 p-6">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-widest">Money Left In Deal</p>
            <p className={`text-4xl font-bold ${results.moneyLeftIn <= 0 ? 'text-green-400' : 'text-white'}`}>
              {formatCurrency(results.moneyLeftIn)}
            </p>
            {results.moneyLeftIn <= 0 && <span className="text-xs text-green-400">100% Capital Recycled</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-4">
            <StatCard label="Stamp Duty" value={formatCurrency(results.sdlt)} />
            <StatCard label="New Mortgage" value={formatCurrency(results.newMortgage)} />
            <StatCard label="Monthly Cashflow" value={formatCurrency(results.netCashflow)} tone="positive" />
            <StatCard
              label="Infinite ROI?"
              value={results.moneyLeftIn <= 0 ? 'YES' : formatPercent(results.roi)}
              tone={results.moneyLeftIn <= 0 ? 'positive' : 'default'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BRRRCalculator;
