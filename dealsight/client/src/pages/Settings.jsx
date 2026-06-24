import InputField from '../components/InputField.jsx';

const Settings = () => (
  <div className="max-w-2xl space-y-6">
    <header>
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <p className="text-slate-400">Default assumptions stored per user in PostgreSQL JSONB settings.</p>
    </header>

    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <InputField label="Target ROI" suffix="%" type="number" defaultValue={8} />
      <InputField label="Default LTV" suffix="%" type="number" defaultValue={75} />
      <button className="rounded-lg bg-amber-500 px-5 py-3 font-bold text-slate-950">Save Settings</button>
    </section>
  </div>
);

export default Settings;
