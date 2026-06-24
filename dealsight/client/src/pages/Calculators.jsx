import BRRRCalculator from './calculators/BRRR.jsx';

const Calculators = () => (
  <div className="space-y-6">
    <header>
      <p className="text-sm uppercase tracking-[0.25em] text-amber-500">Calculators</p>
      <h1 className="text-3xl font-bold text-white">Investment Strategy Calculators</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Model acquisition costs, refinance outcomes, monthly cashflow, and ROI for UK property strategies.
      </p>
    </header>
    <BRRRCalculator />
  </div>
);

export default Calculators;
