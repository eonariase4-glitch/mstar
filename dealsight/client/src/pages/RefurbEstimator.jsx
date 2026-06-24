import { Calculator, Hammer, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { REFURB_ITEMS } from '../constants/refurbCosts.js';

const RefurbEstimator = () => {
  const [sqft, setSqft] = useState(750);
  const [selectedItems, setSelectedItems] = useState([]);
  const [contingency, setContingency] = useState(15);
  const [total, setTotal] = useState({ low: 0, high: 0 });

  const toggleItem = (id) => {
    setSelectedItems((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  useEffect(() => {
    const size = Number(sqft) || 0;
    const calculation = selectedItems.reduce(
      (acc, id) => {
        const item = REFURB_ITEMS.find((candidate) => candidate.id === id);
        if (!item) return acc;

        const multiplier = item.unit === 'sqft' ? size : 1;
        return {
          low: acc.low + item.low * multiplier,
          high: acc.high + item.high * multiplier,
        };
      },
      { low: 0, high: 0 },
    );

    const contingencyRate = (Number(contingency) || 0) / 100;
    setTotal({
      low: calculation.low + calculation.low * contingencyRate,
      high: calculation.high + calculation.high * contingencyRate,
    });
  }, [selectedItems, sqft, contingency]);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
          <Hammer className="text-amber-500" /> Refurbishment Estimator
        </h1>
        <p className="text-slate-400">UK industry standard benchmarks for residential projects.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <label className="mb-2 block text-sm font-medium text-slate-400">Property Size (Sq Ft)</label>
            <input
              type="number"
              value={sqft}
              onChange={(event) => setSqft(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {REFURB_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedItems.includes(item.id)
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="font-bold">{item.name}</div>
                <div className="text-xs opacity-60">
                  Est: GBP {item.low} - GBP {item.high} {item.unit === 'sqft' ? '/sqft' : ''}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-8 rounded-2xl border-2 border-amber-500/30 bg-slate-900 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Calculator className="text-amber-500" size={20} /> Estimated Budget
            </h3>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-sm text-slate-400">Low Estimate</span>
                <span className="font-mono text-xl text-white">GBP {Math.round(total.low).toLocaleString()}</span>
              </div>
              <div className="flex items-end justify-between border-b border-slate-800 pb-4">
                <span className="text-sm text-slate-400">High Estimate</span>
                <span className="font-mono text-xl text-white">GBP {Math.round(total.high).toLocaleString()}</span>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase text-slate-500">Contingency ({contingency}%)</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={contingency}
                  onChange={(event) => setContingency(event.target.value)}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Average Budget</p>
                <p className="text-3xl font-bold text-white">
                  GBP {Math.round((total.low + total.high) / 2).toLocaleString()}
                </p>
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-slate-950 transition-colors hover:bg-amber-600">
              <Sparkles size={18} /> Generate AI Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefurbEstimator;
