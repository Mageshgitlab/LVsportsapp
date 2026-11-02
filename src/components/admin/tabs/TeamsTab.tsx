import React, { useState } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { Team } from '../../../types';
import { TeamCrest } from '../../common/TeamCrest';
import { Edit2, Check, X, Shield, Users } from 'lucide-react';

export const TeamsTab: React.FC = () => {
  const { data, updateTeam } = useCarnivalStore();
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<Team>>({});

  const startEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setFormState({
      name: team.name,
      color: team.color,
      secondaryColor: team.secondaryColor,
      mascot: team.mascot,
      captain: team.captain,
      viceCaptain: team.viceCaptain,
    });
  };

  const cancelEdit = () => {
    setEditingTeamId(null);
    setFormState({});
  };

  const handleSave = async (teamId: string) => {
    await updateTeam(teamId, formState);
    setEditingTeamId(null);
    setFormState({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">Teams Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize team names, brand colors, mascots, captains, and vice captains
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.teams.map((team) => {
          const isEditing = editingTeamId === team.id;
          const memberCount = data.members.filter((m) => m.teamId === team.id).length;

          // Temporary preview team if editing
          const previewTeam: Team = isEditing ? { ...team, ...formState } : team;

          return (
            <div
              key={team.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl relative overflow-hidden"
            >
              {/* Top ambient color stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: previewTeam.color }}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <TeamCrest team={previewTeam} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black font-mono text-slate-950 uppercase"
                        style={{ backgroundColor: previewTeam.color }}
                      >
                        TEAM {previewTeam.code}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">
                        {previewTeam.mascot}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white font-['Outfit'] mt-1">
                      {previewTeam.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{memberCount} Squad Members</span>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => startEdit(team)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Edit Team"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={formState.name || ''}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Mascot
                      </label>
                      <input
                        type="text"
                        value={formState.mascot || ''}
                        onChange={(e) => setFormState({ ...formState, mascot: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formState.color || '#F97316'}
                          onChange={(e) => setFormState({ ...formState, color: e.target.value })}
                          className="w-9 h-9 p-0.5 bg-black/50 border border-white/10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formState.color || ''}
                          onChange={(e) => setFormState({ ...formState, color: e.target.value })}
                          className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Secondary Shade
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formState.secondaryColor || '#C2410C'}
                          onChange={(e) => setFormState({ ...formState, secondaryColor: e.target.value })}
                          className="w-9 h-9 p-0.5 bg-black/50 border border-white/10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formState.secondaryColor || ''}
                          onChange={(e) => setFormState({ ...formState, secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Captain
                      </label>
                      <input
                        type="text"
                        value={formState.captain || ''}
                        onChange={(e) => setFormState({ ...formState, captain: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Vice Captain
                      </label>
                      <input
                        type="text"
                        value={formState.viceCaptain || ''}
                        onChange={(e) => setFormState({ ...formState, viceCaptain: e.target.value })}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(team.id)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-orange-500 hover:bg-orange-400 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Captain</span>
                    <span className="font-extrabold text-white text-sm mt-0.5 block truncate">
                      {team.captain}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Vice Captain</span>
                    <span className="font-extrabold text-white text-sm mt-0.5 block truncate">
                      {team.viceCaptain}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
