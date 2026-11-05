import React, { useState } from 'react';
import { useCarnivalStore } from '../../store/carnivalStore';
import { TeamsTab } from './tabs/TeamsTab';
import { MembersTab } from './tabs/MembersTab';
import { GamesTab } from './tabs/GamesTab';
import { ResultsTab } from './tabs/ResultsTab';
import { AnnouncementsTab } from './tabs/AnnouncementsTab';
import { FixturesTab } from './tabs/FixturesTab';
import { SettingsTab } from './tabs/SettingsTab';
import { ThemeTab } from './tabs/ThemeTab';
import { TVPreviewModal } from './TVPreviewModal';
import { CarnivalEmblem } from '../common/CarnivalEmblem';
import {
  Users,
  Trophy,
  Calendar,
  Bell,
  Settings as SettingsIcon,
  Tv,
  LogOut,
  ExternalLink,
  Zap,
  Swords,
} from 'lucide-react';

export type AdminTab =
  | 'teams'
  | 'members'
  | 'games'
  | 'fixtures'
  | 'results'
  | 'announcements'
  | 'settings'
  | 'theme';

export const AdminLayout: React.FC = () => {
  const { data, setAdminAuthenticated } = useCarnivalStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('fixtures');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const tabs: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'games', label: 'Games', icon: Calendar },
    { id: 'fixtures', label: 'Fixtures', icon: Swords },
    { id: 'results', label: 'Results', icon: Trophy },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ];

  return (
    <div className="arena-admin-theme min-h-screen bg-[#070A1E] text-slate-100 flex flex-col font-['Rajdhani',sans-serif]">
      {/* Top Header */}
      <header className="h-16 px-4 lg:px-8 bg-[#0B0F2A] border-b border-cyan-500/25 flex items-center justify-between gap-3 shrink-0 sticky top-0 z-40 backdrop-blur-md shadow-2xl">
        {/* Zone 1: Wordmark with Emblem */}
        <div className="flex items-center gap-2.5 shrink-0">
          <CarnivalEmblem size="sm" glow={true} />
          <span className="text-base lg:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] tracking-wider whitespace-nowrap">
            {data.settings.eventTitle} <span className="text-[10px] font-bold text-cyan-400 font-mono ml-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">ADMIN</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider font-['Rajdhani'] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Settings, Tools & TV Launch Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Settings & Supabase Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 text-xs font-black font-['Rajdhani'] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 font-bold shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'bg-[#0D1432] hover:bg-[#131E48] text-cyan-300 border-cyan-500/40 hover:border-cyan-400'
            }`}
            title="Supabase Database, Slide Playlist & General Settings"
          >
            <SettingsIcon className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-slate-950 animate-spin-slow' : 'text-cyan-400'}`} />
            <span>Settings</span>
          </button>

          {/* Theme & FX Button */}
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-2.5 py-1.5 text-xs font-black font-['Rajdhani'] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
              activeTab === 'theme'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 font-bold shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'bg-[#0D1432] hover:bg-[#131E48] text-slate-300 border-white/10 hover:border-white/20'
            }`}
            title="Theme, Effects & Audio Styling"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Theme</span>
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-2.5 py-1.5 bg-[#0D1432] hover:bg-[#131E48] text-cyan-300 border border-cyan-500/40 text-xs font-black font-['Rajdhani'] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
            title="Open 16:9 TV Simulation"
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Preview</span>
          </button>

          <a
            href="#/tv"
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-['Rajdhani'] rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] whitespace-nowrap"
            title="Launch live 75 inch TV dashboard"
          >
            <span>Launch TV</span>
            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
          </a>

          <button
            onClick={() => setAdminAuthenticated(false)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Lock Admin Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 pb-32">
        {activeTab === 'teams' && <TeamsTab />}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'games' && <GamesTab />}
        {activeTab === 'fixtures' && <FixturesTab />}
        {activeTab === 'results' && <ResultsTab />}
        {activeTab === 'announcements' && <AnnouncementsTab />}
        {activeTab === 'theme' && <ThemeTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Embedded Live TV Preview Modal */}
      <TVPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
};
