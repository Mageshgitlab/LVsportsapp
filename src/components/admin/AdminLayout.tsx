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
    { id: 'games', label: 'Games Schedule', icon: Calendar },
    { id: 'fixtures', label: 'Carrom Fixtures', icon: Swords },
    { id: 'results', label: 'Results & Points', icon: Trophy },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'theme', label: 'Theme & FX', icon: Zap },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#070A1E] text-slate-100 flex flex-col font-['Rajdhani',sans-serif]">
      {/* Top Header */}
      <header className="h-16 px-8 bg-[#0B0F2A] border-b border-cyan-500/25 flex items-center justify-between gap-6 shrink-0 sticky top-0 z-40 backdrop-blur-md shadow-2xl">
        {/* Zone 1: Wordmark with Emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <CarnivalEmblem size="sm" glow={true} />
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] tracking-wider whitespace-nowrap">
            {data.settings.eventTitle} <span className="text-xs font-bold text-cyan-400 font-mono ml-1">ADMIN PORTAL</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider font-['Rajdhani'] transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
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

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 py-1.5 bg-[#0D1432] hover:bg-[#131E48] text-cyan-300 border border-cyan-500/40 text-xs font-black font-['Rajdhani'] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
            title="Open 16:9 TV Simulation"
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span>TV Preview</span>
          </button>

          <a
            href="#/tv"
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-['Rajdhani'] rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] whitespace-nowrap"
            title="Launch live 75 inch TV dashboard"
          >
            <span>Launch TV View</span>
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 overflow-y-auto">
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
