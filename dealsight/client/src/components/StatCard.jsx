const StatCard = ({ label, value, tone = 'default' }) => {
  const toneClass = tone === 'positive' ? 'text-green-400' : tone === 'warning' ? 'text-amber-400' : 'text-white';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
};

export default StatCard;
