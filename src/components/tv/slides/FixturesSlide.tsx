import React, { useState, useEffect, useRef } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { TEAM_STYLES, tournamentSound } from '../../../theme/theme';
import { Swords, Trophy, Flame, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Team } from '../../../types';

interface FixturesSlideProps {
  isPaused?: boolean;
  onComplete?: () => void;
  onProgress?: (ratio: number) => void;
}

export const FixturesSlide: React.FC<FixturesSlideProps> = ({
  isPaused = false,
  onComplete,
  onProgress,
}) => {
  const { data } = useCarnivalStore();
  const { fixtures, teams, members } = data;

  // Flatten all ties across all rounds into an ordered fixture queue
  const allTies = React.useMemo(() => {
    if (!fixtures || !fixtures.rounds) return [];
    return fixtures.rounds.flatMap((r) =>
      r.ties.map((tie) => ({
        ...tie,
        roundTitle: r.title,
        roundNumber: r.roundNumber,
      }))
    );
  }, [fixtures]);

  const [activeTieIndex, setActiveTieIndex] = useState(0);
  const [tieElapsedMs, setTieElapsedMs] = useState(0);

  // Each tie gets 5 seconds of cinematic spotlight
  const TIE_DURATION_MS = 5000;

  // Track progress and auto-cycle through all fixtures in this slide
  useEffect(() => {
    if (isPaused || allTies.length === 0) return;

    const intervalMs = 50;
    const interval = setInterval(() => {
      setTieElapsedMs((prev) => {
        const nextVal = prev + intervalMs;

        // Report overall progress ratio to parent TV dashboard (0 to 1)
        const overallProgress =
          (activeTieIndex + Math.min(1, nextVal / TIE_DURATION_MS)) / Math.max(1, allTies.length);
        if (onProgress) {
          onProgress(overallProgress);
        }

        if (nextVal >= TIE_DURATION_MS) {
          if (activeTieIndex < allTies.length - 1) {
            // Advance to next fixture in the queue
            setActiveTieIndex((idx) => idx + 1);
            tournamentSound.play('round');
            return 0;
          } else {
            // All fixtures have completed their cycle! Advance to next TV slide
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
        }
        return nextVal;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPaused, activeTieIndex, allTies.length, onComplete, onProgress]);

  if (!fixtures || allTies.length === 0) {
    return null;
  }

  const currentTie = allTies[activeTieIndex % allTies.length];
  const teamA: Team | undefined = teams.find((t) => t.id === currentTie.teamAId);
  const teamB: Team | undefined = teams.find((t) => t.id === currentTie.teamBId);

  if (!teamA || !teamB) {
    return null;
  }

  const styleA = TEAM_STYLES[teamA.id];
  const styleB = TEAM_STYLES[teamB.id];

  const getPairPlayerNames = (teamId: string, pairNumber: number): { p1: string; p2: string; raw: string } => {
    const pairKey = `${teamId}_pair_${pairNumber}`;
    const pairIds = fixtures.pairPlayers?.[pairKey];
    if (!pairIds || (!pairIds[0] && !pairIds[1])) {
      return { p1: `Pair ${pairNumber} Fighter 1`, p2: `Pair ${pairNumber} Fighter 2`, raw: '' };
    }
    const mem1 = members.find((m) => m.id === pairIds[0]);
    const mem2 = members.find((m) => m.id === pairIds[1]);
    const p1 = mem1 ? `${mem1.name} (#${mem1.jerseyNumber || '?'})` : 'Player 1';
    const p2 = mem2 ? `${mem2.name} (#${mem2.jerseyNumber || '?'})` : 'Player 2';
    return { p1, p2, raw: `${mem1?.name || ''} & ${mem2?.name || ''}` };
  };

  // Calculate tie match statistics
  const teamAWins = currentTie.matches.filter((m) => m.winnerTeamId === teamA.id).length;
  const teamBWins = currentTie.matches.filter((m) => m.winnerTeamId === teamB.id).length;
  const hasLiveMatch = currentTie.matches.some((m) => m.status === 'live');
  const isTieCompleted = currentTie.matches.every((m) => m.status === 'completed');

  // Pair 1 is designated showcase duo for Team A, Pair 2 for Team B
  const featuredPairA = getPairPlayerNames(teamA.id, 1);
  const featuredPairB = getPairPlayerNames(teamB.id, 2);

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-4 bg-gradient-to-b from-[#040612] via-[#080D26] to-[#04050E] overflow-hidden select-none font-['Rajdhani']">
      {/* Dynamic Background Atmosphere with Dragon & Energy Clashes */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 20% 40%, ${styleA?.glowColor || 'rgba(245,158,11,0.3)'} 0%, transparent 55%), radial-gradient(circle at 80% 40%, ${styleB?.glowColor || 'rgba(0,240,255,0.3)'} 0%, transparent 55%)`,
        }}
      />

      {/* Center Mythic Dragon Backdrop Emblem (Inspired by Mortal Kombat Dragon Emblem) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none flex items-center justify-center opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-amber-300">
          <path d="M100 15 C 60 15, 25 45, 20 85 C 15 125, 45 165, 80 180 C 120 195, 170 170, 180 125 C 190 85, 160 35, 120 20 C 110 16, 105 15, 100 15 Z M 100 35 C 130 35, 155 60, 160 90 C 165 120, 140 150, 110 160 C 80 170, 45 150, 40 120 C 35 90, 60 45, 95 36 Z" />
        </svg>
      </div>

      {/* Floating Ember & Spark Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Top Banner: Stage Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-cyan-500/25 pb-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#0A102A] border border-cyan-500/40 text-cyan-300 shadow-md">
            <Swords className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-black tracking-widest uppercase">
              CARROM DOUBLES · BATTLE ARENA
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-md">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black tracking-widest uppercase">
              {currentTie.roundTitle.toUpperCase()} · TIE {currentTie.tieNumber} OF {allTies.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-black tracking-wider uppercase">
          <span className="text-slate-400 font-mono">
            VENUE: <span className="text-white font-bold">RECREATION ARENA · 4 BOARDS</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            AUTO-CYCLING ALL FIXTURES
          </span>
        </div>
      </div>

      {/* Main Mortal Kombat Style Fight Showcase (Left P1 vs Right P2) */}
      <div className="relative z-20 flex-1 grid grid-cols-12 gap-6 items-center my-2 min-h-0">
        {/* ====================================================================== */}
        {/* LEFT COLUMN: PLAYER 1 (TEAM A)                                        */}
        {/* ====================================================================== */}
        <motion.div
          key={`team-a-${teamA.id}-${activeTieIndex}`}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="col-span-4 flex flex-col justify-between h-full rounded-2xl bg-gradient-to-r from-[#0C1230]/95 via-[#0A0E26]/90 to-transparent border-l-4 border-y border-r border-white/10 p-5 shadow-2xl relative overflow-hidden backdrop-blur-md"
          style={{ borderLeftColor: styleA?.primaryColor || teamA.color }}
        >
          {/* P1 Floating Tag & Health Gauge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className="px-3 py-0.5 rounded text-xs font-black text-slate-950 uppercase tracking-widest shadow-md flex items-center gap-1.5"
                style={{ backgroundColor: styleA?.primaryColor || teamA.color }}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>P1 COMBATANT</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                CAPTAIN: {teamA.captain}
              </span>
            </div>

            {/* Team Name in Mortal Kombat Giant Title Typography */}
            <h1
              className="text-4xl lg:text-5xl font-black uppercase tracking-wider font-['Cinzel',sans-serif] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-none"
              style={{ color: styleA?.primaryColor || teamA.color }}
            >
              {teamA.name}
            </h1>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className="text-amber-400 font-black">{styleA?.codename || 'THE APEX PREDATOR'}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{teamA.mascot} Mascot</span>
            </div>

            {/* Health / Board Score Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                <span className="text-slate-300">TIE SCORE</span>
                <span className="text-amber-300 font-mono font-extrabold">{teamAWins} / 4 BOARDS WON</span>
              </div>
              <div className="w-full h-3 bg-black/70 rounded-full border border-white/10 overflow-hidden flex p-0.5">
                {[0, 1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className={`flex-1 h-full mx-0.5 rounded-sm transition-all duration-300 ${
                      slot < teamAWins
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Character Fighter Card: Featured Pair */}
          <div className="my-auto py-3">
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 relative overflow-hidden shadow-inner">
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center p-2 border-2 shadow-lg shrink-0"
                  style={{
                    borderColor: styleA?.primaryColor || teamA.color,
                    backgroundColor: `${styleA?.primaryColor || teamA.color}15`,
                  }}
                >
                  <TeamCrest team={teamA} size="md" glow={true} />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>BOARD 1 STRIKE PAIR</span>
                  </span>
                  <div className="text-sm font-black text-white uppercase truncate mt-0.5">
                    {featuredPairA.p1}
                  </div>
                  <div className="text-sm font-black text-white uppercase truncate">
                    {featuredPairA.p2}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Tagline */}
          <div className="text-xs text-slate-400 italic border-t border-white/10 pt-2 flex items-center justify-between font-mono">
            <span>"{styleA?.tagline || 'Victory at all costs.'}"</span>
            <span className="text-amber-400 font-bold uppercase">TEAM A</span>
          </div>
        </motion.div>

        {/* ====================================================================== */}
        {/* CENTER COLUMN: METALLIC "VS" & 4 BOARD MATCHES                         */}
        {/* ====================================================================== */}
        <div className="col-span-4 flex flex-col items-center justify-between h-full py-1">
          {/* Mortal Kombat 3D Metallic "VS" Emblem */}
          <div className="relative flex flex-col items-center shrink-0">
            <div className="relative">
              <span className="text-6xl lg:text-7xl font-black font-['Metal_Mania','Cinzel_Decorative',serif] italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C0] via-[#EAB308] to-[#92400E] drop-shadow-[0_0_35px_rgba(234,179,8,0.7)] select-none">
                VS
              </span>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.3em] text-cyan-300 font-mono animate-pulse whitespace-nowrap">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>FIGHT!</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>

            {/* Current Tie Score Badge */}
            <div className="flex items-center gap-3 px-5 py-1 rounded-full bg-black/80 border-2 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.4)] mt-1">
              <span
                className="text-2xl font-black font-mono"
                style={{ color: styleA?.primaryColor || teamA.color }}
              >
                {teamAWins}
              </span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">─ TIE SCORE ─</span>
              <span
                className="text-2xl font-black font-mono"
                style={{ color: styleB?.primaryColor || teamB.color }}
              >
                {teamBWins}
              </span>
            </div>
          </div>

          {/* 4 Board Match Combat Cards */}
          <div className="w-full space-y-1.5 my-2 flex-1 flex flex-col justify-center">
            {currentTie.matches.map((match, mIdx) => {
              const aWon = match.winnerTeamId === teamA.id;
              const bWon = match.winnerTeamId === teamB.id;
              const isLive = match.status === 'live';
              const namesA = getPairPlayerNames(teamA.id, match.pairANumber);
              const namesB = getPairPlayerNames(teamB.id, match.pairBNumber);

              return (
                <div
                  key={match.id}
                  className={`px-3 py-1.5 rounded-lg border flex items-center justify-between text-xs transition-all shadow-md ${
                    aWon
                      ? 'bg-gradient-to-r from-amber-500/25 via-black/60 to-black/40 border-amber-500/50'
                      : bWon
                      ? 'bg-gradient-to-l from-cyan-500/25 via-black/60 to-black/40 border-cyan-500/50'
                      : isLive
                      ? 'bg-red-950/60 border-red-500/60 animate-pulse'
                      : 'bg-black/60 border-white/10'
                  }`}
                >
                  {/* Left Board Pair */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-slate-950 shrink-0 shadow-sm"
                      style={{ backgroundColor: styleA?.primaryColor || teamA.color }}
                    >
                      P{match.pairANumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-200 truncate uppercase">
                      {namesA.raw || `Pair ${match.pairANumber}`}
                    </span>
                  </div>

                  {/* Board Center Pill */}
                  <div className="px-2 shrink-0 flex items-center justify-center">
                    {aWon ? (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50">
                        WIN ◄
                      </span>
                    ) : bWon ? (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300 border border-cyan-500/50">
                        ► WIN
                      </span>
                    ) : isLive ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/40 text-red-200 border border-red-400">
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        BOARD {mIdx + 1}
                      </span>
                    )}
                  </div>

                  {/* Right Board Pair */}
                  <div className="flex items-center gap-2 min-w-0 flex-1 justify-end text-right">
                    <span className="text-[11px] font-bold text-slate-200 truncate uppercase">
                      {namesB.raw || `Pair ${match.pairBNumber}`}
                    </span>
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-slate-950 shrink-0 shadow-sm"
                      style={{ backgroundColor: styleB?.primaryColor || teamB.color }}
                    >
                      P{match.pairBNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sub-Timer Kicker */}
          <div className="w-full text-center shrink-0">
            <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
              AUTO-CYCLE: TIE {activeTieIndex + 1} OF {allTies.length} · ADVANCES IN {Math.ceil((TIE_DURATION_MS - tieElapsedMs) / 1000)}s
            </span>
          </div>
        </div>

        {/* ====================================================================== */}
        {/* RIGHT COLUMN: PLAYER 2 (TEAM B)                                       */}
        {/* ====================================================================== */}
        <motion.div
          key={`team-b-${teamB.id}-${activeTieIndex}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="col-span-4 flex flex-col justify-between h-full rounded-2xl bg-gradient-to-l from-[#0C1230]/95 via-[#0A0E26]/90 to-transparent border-r-4 border-y border-l border-white/10 p-5 shadow-2xl relative overflow-hidden backdrop-blur-md text-right"
          style={{ borderRightColor: styleB?.primaryColor || teamB.color }}
        >
          {/* P2 Floating Tag & Health Gauge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                CAPTAIN: {teamB.captain}
              </span>
              <span
                className="px-3 py-0.5 rounded text-xs font-black text-slate-950 uppercase tracking-widest shadow-md flex items-center gap-1.5"
                style={{ backgroundColor: styleB?.primaryColor || teamB.color }}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>P2 COMBATANT</span>
              </span>
            </div>

            {/* Team Name in Mortal Kombat Giant Title Typography */}
            <h1
              className="text-4xl lg:text-5xl font-black uppercase tracking-wider font-['Cinzel',sans-serif] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-none"
              style={{ color: styleB?.primaryColor || teamB.color }}
            >
              {teamB.name}
            </h1>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1 flex items-center justify-end gap-2">
              <span className="text-slate-400">{teamB.mascot} Mascot</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400 font-black">{styleB?.codename || 'FROST OVERLORD'}</span>
            </div>

            {/* Health / Board Score Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                <span className="text-cyan-300 font-mono font-extrabold">{teamBWins} / 4 BOARDS WON</span>
                <span className="text-slate-300">TIE SCORE</span>
              </div>
              <div className="w-full h-3 bg-black/70 rounded-full border border-white/10 overflow-hidden flex p-0.5 flex-row-reverse">
                {[0, 1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className={`flex-1 h-full mx-0.5 rounded-sm transition-all duration-300 ${
                      slot < teamBWins
                        ? 'bg-gradient-to-l from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Character Fighter Card: Featured Pair */}
          <div className="my-auto py-3">
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 relative overflow-hidden shadow-inner text-left">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center p-2 border-2 shadow-lg shrink-0"
                  style={{
                    borderColor: styleB?.primaryColor || teamB.color,
                    backgroundColor: `${styleB?.primaryColor || teamB.color}15`,
                  }}
                >
                  <TeamCrest team={teamB} size="md" glow={true} />
                </div>

                <div className="min-w-0 flex-1 text-right">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center justify-end gap-1">
                    <span>BOARD 2 STRIKE PAIR</span>
                    <Sparkles className="w-3 h-3" />
                  </span>
                  <div className="text-sm font-black text-white uppercase truncate mt-0.5">
                    {featuredPairB.p1}
                  </div>
                  <div className="text-sm font-black text-white uppercase truncate">
                    {featuredPairB.p2}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Tagline */}
          <div className="text-xs text-slate-400 italic border-t border-white/10 pt-2 flex items-center justify-between font-mono">
            <span className="text-cyan-400 font-bold uppercase">TEAM B</span>
            <span>"{styleB?.tagline || 'Cold precision strikes.'}"</span>
          </div>
        </motion.div>
      </div>

      {/* ====================================================================== */}
      {/* BOTTOM STRIP: MORTAL KOMBAT CHARACTER SELECT ROSTER GRID               */}
      {/* ====================================================================== */}
      <div className="relative z-20 pt-2 border-t border-cyan-500/20 shrink-0">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="text-[11px] font-black uppercase text-cyan-400 tracking-[0.2em] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>MORTAL CLASH ROSTER GRID · ALL 6 FIXTURE TIES</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            CLICK ANY FIXTURE TO PREVIEW DIRECTLY
          </div>
        </div>

        {/* The 6 Roster Tiles (Matches the Bottom Character Grid in MK) */}
        <div className="grid grid-cols-6 gap-2.5">
          {allTies.map((tie, idx) => {
            const tA = teams.find((t) => t.id === tie.teamAId);
            const tB = teams.find((t) => t.id === tie.teamBId);
            const isSelected = idx === activeTieIndex;
            const tieCompleted = tie.matches.every((m) => m.status === 'completed');
            const tieLive = tie.matches.some((m) => m.status === 'live');

            return (
              <button
                key={tie.id}
                onClick={() => {
                  setActiveTieIndex(idx);
                  setTieElapsedMs(0);
                  tournamentSound.play('round');
                }}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer text-left overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1C2555] to-[#0A0F2B] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-[1.03] z-10 ring-2 ring-amber-400'
                    : 'bg-[#080C22]/80 border-white/10 hover:border-cyan-400/40 hover:bg-[#0D1438]'
                }`}
              >
                {/* Active P1 / P2 Selector Badges (Mortal Kombat Style) */}
                {isSelected && (
                  <>
                    <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-red-600 text-white font-black text-[9px] rounded uppercase font-mono shadow-md">
                      P1
                    </span>
                    <span className="absolute top-1 right-1 px-1.5 py-0.2 bg-blue-600 text-white font-black text-[9px] rounded uppercase font-mono shadow-md">
                      P2
                    </span>
                  </>
                )}

                {/* Round & Match Number */}
                <div className="text-[10px] font-mono font-bold text-center text-slate-400 uppercase mb-1">
                  R{tie.roundNumber} · TIE {tie.tieNumber}
                </div>

                {/* Team Badges vs Header */}
                <div className="flex items-center justify-between gap-1 mt-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tA?.color || '#FFF' }}
                    />
                    <span className="text-xs font-black text-white uppercase truncate">
                      {tA?.name?.split(' ')[0] || 'T1'}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-amber-400 font-mono">VS</span>

                  <div className="flex items-center gap-1 min-w-0 justify-end">
                    <span className="text-xs font-black text-white uppercase truncate text-right">
                      {tB?.name?.split(' ')[0] || 'T2'}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tB?.color || '#FFF' }}
                    />
                  </div>
                </div>

                {/* Mini Status Strip on Tile */}
                <div className="mt-1 pt-1 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400">4 Matches</span>
                  {tieLive ? (
                    <span className="text-red-400 font-bold uppercase animate-pulse">LIVE</span>
                  ) : tieCompleted ? (
                    <span className="text-emerald-400 font-bold uppercase">DONE</span>
                  ) : (
                    <span className="text-cyan-400 font-bold uppercase">READY</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
