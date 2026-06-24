const InputField = ({ label, suffix, className = '', ...props }) => (
  <label className="block">
    <span className="mb-1 block text-sm text-slate-400">{label}</span>
    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 focus-within:ring-2 focus-within:ring-amber-500">
      <input
        className={`w-full rounded-lg bg-transparent p-3 text-white outline-none ${className}`}
        {...props}
      />
      {suffix && <span className="pr-3 text-sm text-slate-500">{suffix}</span>}
    </div>
  </label>
);

export default InputField;
