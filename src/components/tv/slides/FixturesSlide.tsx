
import React, { useEffect, useState } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { GameIcon } from '../../common/GameIcon';

export const FixturesSlide: React.FC<{ isPaused?: boolean; onComplete?: () => void; onProgress?: (n: number) => void }> = ({ isPaused = false, onComplete, onProgress }) => {
  const { data } = useCarnivalStore();
  const games = data.games.filter((g) => data.fixtureRecords.some((f) => f.gameId === g.id));
  const [index, setIndex] = useState(0);
  useEffect(() => { if (isPaused || games.length < 2) return; const id = window.setInterval(() => setIndex((x) => (x + 1) % games.length), 10000); return () => window.clearInterval(id); }, [isPaused, games.length]);
  useEffect(() => { onProgress?.(games.length ? (index + 1) / games.length : 1); }, [index, games.length, onProgress]);
  if (!games.length) return <div className="w-full h-full flex flex-col items-center justify-center bg-[#070A1E] text-center"><div className="text-cyan-400"><GameIcon icon="generic" size={52}/></div><h2 className="mt-4 text-4xl font-black text-white uppercase tracking-widest">Fixtures coming soon</h2></div>;
  const game = games[index % games.length]; const isGroup = game.type === 'group' || ['cricket', 'football', 'volleyball'].includes(game.name.toLowerCase()); const team = (id: string) => data.teams.find((t) => t.id === id); const pairs = (f: any, side: 'A' | 'B') => { const r = data.registrations.find((x) => x.gameId === game.id && x.teamId === f[`side${side}`].teamId); const p = r?.pairs?.find((x) => x.id === f[`side${side}`].pairId); return p?.memberIds.map((id) => data.members.find((m) => m.id === id)?.name).join(' + ') || ''; };
  return <div className="w-full h-full p-8 bg-[#070A1E] text-white overflow-hidden"><div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4"><GameIcon icon={game.icon} size={30}/><div><div className="text-xs uppercase tracking-[.3em] text-cyan-400">Live fixtures</div><h2 className="text-4xl font-black uppercase">{game.name}</h2></div><span className="ml-auto text-xs text-slate-400">{index + 1}/{games.length}</span></div><div className="mt-5 space-y-3">{data.fixtureRecords.filter((f) => f.gameId === game.id).sort((a) => a.status === 'live' ? -1 : 1).map((f) => { const a = team(f.sideA.teamId); const b = team(f.sideB.teamId); return <div key={f.id} className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 p-4 rounded-xl border ${f.status === 'live' ? 'border-red-500 bg-red-950/30' : 'border-white/10 bg-white/5'}`}><div className="flex items-center gap-3 min-w-0"><TeamCrest team={a!} size="sm"/><span className="font-black truncate">{a?.name}</span>{!isGroup && <small className="text-cyan-200 truncate">{pairs(f, 'A')}</small>}</div><div className="text-center"><span className="text-amber-300 font-black">VS</span><div className="text-[10px] uppercase text-slate-400">{f.status === 'live' ? 'LIVE' : f.time || 'TBD'} · {f.venue || 'Venue TBD'}</div>{f.result?.scoreA && <div className="text-lg font-black">{f.result.scoreA} - {f.result.scoreB}</div>}</div><div className="flex items-center justify-end gap-3 min-w-0"><span className="font-black truncate text-right">{!isGroup ? pairs(f, 'B') : b?.name}</span><TeamCrest team={b!} size="sm"/></div></div>; })}</div></div>;
};

