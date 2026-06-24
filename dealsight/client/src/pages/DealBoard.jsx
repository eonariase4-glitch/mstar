import { useState } from 'react';

const COLUMNS = ['Reviewing', 'Offer Made', 'Under Offer', 'Completed'];

const DealBoard = () => {
  const [deals, setDeals] = useState([
    { id: 1, title: '3 Bed Semi, Manchester', price: 180000, status: 'Reviewing', strategy: 'BRRR' },
    { id: 2, title: 'City Flat, Liverpool', price: 110000, status: 'Offer Made', strategy: 'BTL' },
    { id: 3, title: 'Terrace, Birmingham', price: 140000, status: 'Under Offer', strategy: 'FLIP' },
  ]);

  const moveDeal = (id, newStatus) => {
    setDeals((current) => current.map((deal) => (deal.id === id ? { ...deal, status: newStatus } : deal)));
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-8">
      {COLUMNS.map((column) => (
        <div key={column} className="min-w-[300px] flex-1">
          <h2 className="mb-4 flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
            {column}
            <span className="rounded-full bg-slate-800 px-2 py-0.5">
              {deals.filter((deal) => deal.status === column).length}
            </span>
          </h2>

          <div className="space-y-4">
            {deals
              .filter((deal) => deal.status === column)
              .map((deal) => (
                <div key={deal.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
                  <div className="mb-2 flex items-start justify-between">
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-500">
                      {deal.strategy}
                    </span>
                    <select
                      onChange={(event) => moveDeal(deal.id, event.target.value)}
                      className="bg-transparent text-[10px] text-slate-500 outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Move to...
                      </option>
                      {COLUMNS.map((targetColumn) => (
                        <option key={targetColumn} value={targetColumn}>
                          {targetColumn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <h4 className="font-bold text-white">{deal.title}</h4>
                  <p className="text-sm text-slate-400">GBP {deal.price.toLocaleString()}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DealBoard;
