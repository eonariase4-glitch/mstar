import { BarChart3, ExternalLink, MapPin, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { searchRightmove } from '../services/api.js';

const Sourcing = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState({ location: '', minPrice: '', maxPrice: '' });

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await searchRightmove(search);
      setResults(data);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="min-w-[200px] flex-1">
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              placeholder="Postcode or Town (e.g. Manchester)"
              value={search.location}
              onChange={(event) => setSearch({ ...search, location: event.target.value })}
            />
          </div>
          <input
            type="number"
            className="w-32 rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            placeholder="Min GBP"
            value={search.minPrice}
            onChange={(event) => setSearch({ ...search, minPrice: event.target.value })}
          />
          <input
            type="number"
            className="w-32 rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            placeholder="Max GBP"
            value={search.maxPrice}
            onChange={(event) => setSearch({ ...search, maxPrice: event.target.value })}
          />
          <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-950">
            <Search size={18} /> {loading ? 'Searching...' : 'Find Deals'}
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((property) => (
          <div
            key={property.id || property.url}
            className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-amber-500/50"
          >
            <div className="relative h-48 bg-slate-800">
              {property.img && (
                <img
                  src={property.img}
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100"
                  alt={property.title || property.address || 'Property'}
                />
              )}
              <div className="absolute right-2 top-2 rounded-full bg-slate-950/80 px-3 py-1 font-bold text-amber-500">
                {property.price}
              </div>
            </div>
            <div className="space-y-3 p-4">
              <h3 className="truncate font-bold text-white">{property.title}</h3>
              <p className="flex items-center gap-1 text-sm text-slate-400">
                <MapPin size={14} /> {property.address}
              </p>
              {property.comparables?.metrics && (
                <p className="text-xs text-slate-500">
                  Local median: GBP {Math.round(property.comparables.metrics.median).toLocaleString()} from{' '}
                  {property.comparables.metrics.count} sales
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded bg-slate-800 py-2 text-xs text-white hover:bg-slate-700">
                  <BarChart3 size={14} /> Analyze
                </button>
                <button className="rounded bg-slate-800 px-3 text-amber-500 transition-colors hover:bg-amber-500 hover:text-slate-950">
                  <PlusCircle size={18} />
                </button>
                {property.url ? (
                  <a
                    href={property.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded bg-slate-800 px-3 py-2 text-slate-400"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="rounded bg-slate-800 px-3 py-2 text-slate-600" aria-label="No listing URL">
                    <ExternalLink size={14} />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sourcing;
