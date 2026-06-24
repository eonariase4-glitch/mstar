import { Map } from 'lucide-react';
import { useState } from 'react';
import { fetchComparables } from '../services/api.js';
import { formatCurrency } from '../utils/finance.js';

const Comparables = () => {
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      setResult(await fetchComparables(postcode));
    } catch (error) {
      console.error('Comparable lookup failed', error);
      setResult({ data: [], metrics: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
          <Map className="text-amber-500" /> Comps Engine
        </h1>
        <p className="text-slate-400">Query UK Land Registry sold prices by postcode.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <input
          value={postcode}
          onChange={(event) => setPostcode(event.target.value)}
          placeholder="SW1A 1AA"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
        />
        <button className="rounded-lg bg-amber-500 px-5 font-bold text-slate-950">
          {loading ? 'Loading...' : 'Fetch Comps'}
        </button>
      </form>

      {result?.metrics && (
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase text-slate-500">Average</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(result.metrics.average)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase text-slate-500">Median</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(result.metrics.median)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase text-slate-500">Sales</p>
            <p className="text-2xl font-bold text-white">{result.metrics.count}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase text-slate-500">Confidence</p>
            <p className="text-2xl font-bold text-white">{result.metrics.confidenceScore}%</p>
          </div>
        </section>
      )}

      {result?.data?.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full bg-slate-900 text-left text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="p-3">Address</th>
                <th className="p-3">Type</th>
                <th className="p-3">Date</th>
                <th className="p-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((item) => (
                <tr key={`${item.address}-${item.date}-${item.price}`} className="border-t border-slate-800">
                  <td className="p-3 text-white">{item.address || 'Unknown address'}</td>
                  <td className="p-3 text-slate-400">{item.type}</td>
                  <td className="p-3 text-slate-400">{item.date}</td>
                  <td className="p-3 font-semibold text-white">{formatCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Comparables;
