import { Calculator, Hammer, LayoutGrid, Map, Search, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 rounded-lg px-4 py-3 transition-all
      ${isActive ? 'border-r-4 border-amber-500 bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800'}
    `}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Shell = ({ children }) => (
  <div className="flex min-h-screen bg-slate-950 text-slate-100">
    <aside className="fixed flex h-full w-64 flex-col border-r border-slate-800 p-4">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold tracking-tighter text-white">
          DEAL<span className="text-amber-500">SIGHT</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">UK Property Intelligence</p>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem to="/search" icon={Search} label="Sourcing" />
        <SidebarItem to="/calculators" icon={Calculator} label="Calculators" />
        <SidebarItem to="/comparables" icon={Map} label="Comps Engine" />
        <SidebarItem to="/refurb" icon={Hammer} label="Refurb Estimator" />
        <SidebarItem to="/board" icon={LayoutGrid} label="Deal Board" />
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <SidebarItem to="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>

    <main className="ml-64 flex-1 p-8">{children}</main>
  </div>
);

export default Shell;
