import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { Bell, AlertTriangle, Sparkles, Calendar, Clock, Megaphone, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export const AnnouncementsSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const activeAnnouncements = data.announcements.filter((a) => a.active);

  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'urgent':
        return {
          icon: AlertTriangle,
          badge: 'URGENT BULLETIN',
          style: 'bg-red-500/20 text-red-300 border-red-500/40',
          cardStyle: 'border-red-500/60 bg-[#160D1E]/95 shadow-[0_0_25px_rgba(239,68,68,0.3)]',
        };
      case 'celebration':
        return {
          icon: Sparkles,
          badge: 'SPECIAL CITATION',
          style: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          cardStyle: 'border-amber-400/60 bg-[#17140B]/95 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        };
      case 'schedule':
        return {
          icon: Calendar,
          badge: 'SCHEDULE UPDATE',
          style: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          cardStyle: 'border-cyan-500/50 bg-[#0A1224]/95 shadow-[0_0_20px_rgba(0,240,255,0.2)]',
        };
      default:
        return {
          icon: Bell,
          badge: 'CARNIVAL DISPATCH',
          style: 'bg-slate-700/40 text-slate-300 border-slate-600',
          cardStyle: 'border-cyan-500/30 bg-[#0D1129]/95',
        };
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 bg-gradient-to-b from-[#070A1E] via-[#0B0F2A] to-[#050716] overflow-hidden">
      {/* Background Cyber Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3 relative z-10 shrink-0">
        <div>
          <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase font-['Rajdhani'] flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>CARNIVAL DISPATCHES</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] uppercase tracking-wider mt-1">
            Announcements & Official Notices
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1129] border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider font-['Rajdhani']">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>LIVE BROADCAST</span>
        </div>
      </div>

      {/* Announcements Cards filling full height */}
      <div className="flex-1 my-3 max-w-5xl mx-auto w-full flex flex-col justify-between gap-3.5 relative z-10 min-h-0">
        {activeAnnouncements.length > 0 ? (
          activeAnnouncements.slice(0, 4).map((ann, idx) => {
            const meta = getCategoryMeta(ann.category);
            const Icon = meta.icon;

            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className={`p-6 rounded-xl border-2 backdrop-blur-md shadow-2xl flex items-center gap-6 transition-all flex-1 ${meta.cardStyle}`}
              >
                <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-cyan-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`px-3 py-0.5 rounded text-[11px] font-black uppercase tracking-wider border font-['Rajdhani'] ${meta.style}`}
                    >
                      {meta.badge}
                    </span>
                    <span className="text-xs font-['Rajdhani'] font-bold text-slate-400 uppercase tracking-wider">
                      {ann.createdAt}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white font-['Rajdhani'] tracking-wide mt-1.5">
                    {ann.title}
                  </h3>

                  <p className="text-base text-slate-200 mt-1 leading-relaxed font-semibold font-['Rajdhani']">
                    {ann.message}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center p-12 bg-black/40 rounded-xl border-2 border-dashed border-cyan-500/30 my-auto">
            <Bell className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <h4 className="text-xl font-bold text-white font-['Rajdhani']">All Clear</h4>
            <p className="text-slate-400 text-sm mt-1 font-['Rajdhani']">No active announcements currently registered.</p>
          </div>
        )}
      </div>

      {/* Bottom Kicker */}
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-['Rajdhani'] relative z-10 shrink-0 pt-1">
        STAY TUNED FOR EVENT BROADCASTS & AWARDS CEREMONY TIMINGS
      </div>
    </div>
  );
};
