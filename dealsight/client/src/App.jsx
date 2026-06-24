import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/layout/Shell.jsx';
import Calculators from './pages/Calculators.jsx';
import Comparables from './pages/Comparables.jsx';
import DealBoard from './pages/DealBoard.jsx';
import RefurbEstimator from './pages/RefurbEstimator.jsx';
import Settings from './pages/Settings.jsx';
import Sourcing from './pages/Sourcing.jsx';

const App = () => (
  <Shell>
    <Routes>
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route path="/search" element={<Sourcing />} />
      <Route path="/calculators" element={<Calculators />} />
      <Route path="/comparables" element={<Comparables />} />
      <Route path="/refurb" element={<RefurbEstimator />} />
      <Route path="/board" element={<DealBoard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Shell>
);

export default App;
