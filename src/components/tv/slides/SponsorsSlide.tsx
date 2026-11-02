import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { ASSETS } from '../../../config/assets';
import { CarnivalEmblem } from '../../common/CarnivalEmblem';
import { Sparkles, Trophy, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const SponsorsSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const sponsors = data.sponsors || [];

  if (sponsors.length === 0) return null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 bg-gradient-to-b from-[#070A1E] via-[#0B0F2A] to-[#050716] overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src={ASSETS.trophySpotlight}
          alt="Sports Arena"
          className="w-full h-full object-cover object-center mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A1E] via-[#070A1E]/90 to-transparent" />
      </div>

      {/* Slide Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/25 pb-3 shrink-0">
        <div>
          <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase font-['Rajdhani'] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>SPECIAL RECOGNITION</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] uppercase tracking-wider mt-1">
            Tournament Partners & Supporters
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1129] border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider font-['Rajdhani']">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Empowering Sportsmanship</span>
        </div>
      </div>

      {/* Sponsors Cards filling full height */}
      <div className="relative z-10 grid grid-cols-4 gap-6 flex-1 my-3 max-w-6xl mx-auto w-full items-stretch min-h-0">
        {sponsors.map((sp, idx) => {
          return (
            <motion.div
              key={sp.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-8 rounded-xl bg-[#0D1129]/95 border-2 border-cyan-500/30 backdrop-blur-md shadow-2xl flex flex-col items-center justify-between text-center group hover:border-cyan-400 transition-all h-full"
            >
              <div className="mb-2">
                <CarnivalEmblem size="lg" glow={false} />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block mb-3 font-['Rajdhani']">
                  {sp.tier}
                </span>

                <h3 className="text-2xl font-black text-white font-['Rajdhani'] tracking-wide">
                  {sp.name}
                </h3>
              </div>

              <div className="w-full mt-4 pt-4 border-t border-white/10">
                <div className="font-['Rajdhani'] text-xl font-black tracking-widest text-amber-400 uppercase">
                  {sp.logoText}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Special Appreciation Card */}
      <div className="relative z-10 max-w-4xl mx-auto text-center p-3 rounded-lg bg-black/60 border border-cyan-500/25 text-slate-300 text-xs leading-relaxed font-['Rajdhani'] shrink-0">
        Appreciation is extended to all team captains, athletes, match officials, and organizers who make <strong className="text-white font-bold">{data.settings.eventTitle}</strong> a memorable celebration of teamwork and sportsmanship.
      </div>
    </div>
  );
};
