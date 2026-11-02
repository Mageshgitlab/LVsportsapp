import React, { useState } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { Member, TeamId } from '../../../types';
import { MemberAvatar } from '../../common/MemberAvatar';
import { Plus, Trash2, Edit2, Search, ArrowRightLeft, Check, X, Users, UserPlus } from 'lucide-react';

export const MembersTab: React.FC = () => {
  const { data, addMember, updateMember, deleteMember, moveMember } = useCarnivalStore();
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Member Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTeamId, setNewTeamId] = useState<TeamId>('team-d');
  const [newJersey, setNewJersey] = useState<number>(10);
  const [newRole, setNewRole] = useState<'player' | 'captain' | 'vice-captain'>('player');

  // Edit Member Inline State
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editJersey, setEditJersey] = useState<number>(0);
  const [editRole, setEditRole] = useState<'player' | 'captain' | 'vice-captain'>('player');

  const filteredMembers = data.members.filter((m) => {
    const matchesTeam = selectedTeamFilter === 'all' || m.teamId === selectedTeamFilter;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const getTeam = (teamId: string) => data.teams.find((t) => t.id === teamId);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await addMember({
      name: newName.trim(),
      teamId: newTeamId,
      jerseyNumber: Number(newJersey) || undefined,
      role: newRole,
    });

    setNewName('');
    setIsAdding(false);
  };

  const startEdit = (m: Member) => {
    setEditingMemberId(m.id);
    setEditName(m.name);
    setEditJersey(m.jerseyNumber || 0);
    setEditRole(m.role || 'player');
  };

  const handleEditSave = async (memberId: string) => {
    await updateMember(memberId, {
      name: editName.trim(),
      jerseyNumber: Number(editJersey) || undefined,
      role: editRole,
    });
    setEditingMemberId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">Members & Squad Roster</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add athletes, edit details, and reassign squad members across teams
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Athlete</span>
        </button>
      </div>

      {/* Add Member Drawer */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 rounded-2xl bg-slate-900 border border-orange-500/30 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-400" />
              <span>Enroll New Athlete</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Suresh Kumar"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Assign Team
              </label>
              <select
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value as TeamId)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              >
                {data.teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    Team {t.code} - {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Jersey #
              </label>
              <input
                type="number"
                value={newJersey}
                onChange={(e) => setNewJersey(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="player" className="bg-slate-900">Squad Player</option>
                <option value="captain" className="bg-slate-900">Captain</option>
                <option value="vice-captain" className="bg-slate-900">Vice Captain</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-white/5 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-orange-500 hover:bg-orange-400 rounded-lg"
            >
              Save Athlete
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Team Segmented Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedTeamFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              selectedTeamFilter === 'all'
                ? 'bg-orange-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Squads ({data.members.length})
          </button>
          {data.teams.map((team) => {
            const count = data.members.filter((m) => m.teamId === team.id).length;
            const isSelected = selectedTeamFilter === team.id;
            return (
              <button
                key={team.id}
                onClick={() => setSelectedTeamFilter(team.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? team.color : undefined,
                }}
              >
                <span>Team {team.code}</span>
                <span className="opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search athlete by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Members Grid / List */}
      <div className="bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div className="col-span-4">Athlete</div>
          <div className="col-span-3">Assigned Team</div>
          <div className="col-span-2">Jersey #</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const team = getTeam(member.teamId);
              const isEditing = editingMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors text-sm"
                >
                  {/* Athlete Name & Avatar */}
                  <div className="col-span-4 flex items-center gap-3">
                    <MemberAvatar
                      name={member.name}
                      color={team?.color}
                      role={member.role}
                      size="sm"
                    />

                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 bg-black/60 border border-white/20 rounded text-xs text-white"
                      />
                    ) : (
                      <div>
                        <div className="font-bold text-white tracking-wide">{member.name}</div>
                        {member.role && member.role !== 'player' && (
                          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                            {member.role === 'captain' ? 'CAPTAIN' : 'VICE CAPTAIN'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Team Reassignment Dropdown */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={member.teamId}
                        onChange={(e) => moveMember(member.id, e.target.value as TeamId)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                        style={{
                          backgroundColor: `${team?.color}15`,
                          borderColor: `${team?.color}40`,
                          color: team?.color || '#fff',
                        }}
                      >
                        {data.teams.map((t) => (
                          <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                            Team {t.code}: {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Jersey & Role */}
                  <div className="col-span-2">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editJersey}
                        onChange={(e) => setEditJersey(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-black/60 border border-white/20 rounded text-xs text-white"
                      />
                    ) : (
                      <span className="font-mono text-xs text-slate-300">
                        #{member.jerseyNumber || '-'}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleEditSave(member.id)}
                          className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded-lg cursor-pointer"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingMemberId(null)}
                          className="p-1.5 text-slate-400 hover:bg-white/10 rounded-lg cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(member)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Remove Athlete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No athletes found matching the current search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
