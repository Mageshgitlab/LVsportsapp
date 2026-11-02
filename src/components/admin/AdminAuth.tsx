import React, { useState } from 'react';
import { useCarnivalStore } from '../../store/carnivalStore';
import { CarnivalEmblem } from '../common/CarnivalEmblem';
import { KeyRound, ArrowRight, Shield } from 'lucide-react';

interface AdminAuthProps {
  onSuccess: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { setAdminAuthenticated } = useCarnivalStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static password gate "lv2026"
    if (password.trim() === 'lv2026') {
      setAdminAuthenticated(true);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A1E] flex items-center justify-center p-6 text-slate-100 font-['Rajdhani',sans-serif]">
      <div className="w-full max-w-md bg-[#0D1129]/95 border-2 border-cyan-500/40 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,240,255,0.25)] backdrop-blur-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-7">
          <div className="mb-3 flex justify-center">
            <CarnivalEmblem size="lg" glow={true} />
          </div>

          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] tracking-wider">
            Admin Portal Access
          </h2>
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest font-['Rajdhani'] mt-1">
            LV Sports Carnival · Event Operations Console
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-300 font-['Rajdhani'] mb-2">
              Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter passcode (lv2026)"
                autoFocus
                className={`w-full pl-10 pr-4 py-3 bg-black/60 border-2 rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all font-mono text-sm ${
                  error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/40'
                    : 'border-cyan-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
                }`}
              />
            </div>
            {error && (
              <p className="text-xs font-bold text-red-400 mt-2 font-['Rajdhani']">
                Access Denied! Incorrect passcode. (Default: lv2026)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-black rounded-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Rajdhani'] tracking-widest text-sm"
          >
            <span>UNLOCK ADMIN PORTAL</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-['Rajdhani'] font-bold">
            <span>Passcode: <code className="text-cyan-400 font-mono">lv2026</code></span>
            <a
              href="#/tv"
              className="text-cyan-400 hover:text-white flex items-center gap-1 font-['Rajdhani']"
            >
              <span>Return to TV Dashboard</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
