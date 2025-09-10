
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpacecraftProvider } from './context/SpacecraftContext';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Scanner from './pages/Scanner';
import Inventory from './pages/Inventory';
import Recycling from './pages/Recycling';
import EnergyMonitor from './pages/EnergyMonitor';
import Logs from './pages/Logs';
import GroundControl from './pages/GroundControl';

const App: React.FC = () => {
  return (
    <SpacecraftProvider>
      <HashRouter>
        <Routes>
          <Route path="/crew" element={<Layout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="scanner" element={<Scanner />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="recycling" element={<Recycling />} />
            <Route path="energy" element={<EnergyMonitor />} />
            <Route path="logs" element={<Logs />} />
          </Route>
          <Route path="/ground-control" element={<GroundControl />} />
          <Route path="*" element={<Navigate to="/crew" replace />} />
        </Routes>
      </HashRouter>
    </SpacecraftProvider>
  );
};

export default App;
