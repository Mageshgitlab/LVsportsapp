import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCarnivalStore } from './store/carnivalStore';
import { TVDashboard } from './components/tv/TVDashboard';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  const { initialize, isLoading } = useCarnivalStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-[#05070F] flex items-center justify-center text-white font-['Outfit']">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto" />
          <div className="text-xl font-bold tracking-wider uppercase">Loading LV Sports Carnival...</div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/tv" element={<TVDashboard />} />
        <Route path="/admin" element={<AdminPortal />} />
        {/* Default route points to /tv */}
        <Route path="/" element={<Navigate to="/tv" replace />} />
        <Route path="*" element={<Navigate to="/tv" replace />} />
      </Routes>
    </HashRouter>
  );
}
