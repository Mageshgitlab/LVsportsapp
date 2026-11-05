import React, { useState } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { Game, GameStatus } from '../../../types';
import { GameIcon } from '../../common/GameIcon';
import { Plus, Edit2, Trash2, Clock, Check, X, Radio, CheckCircle2 } from 'lucide-react';

export const GamesTab: React.FC = () => {
  const { data, addGame, updateGame, deleteGame } = useCarnivalStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    category: 'Outdoor Championship',
    icon: 'generic',
    status: 'upcoming' as GameStatus,
    scheduledTime: '10:00 AM',
    venue: 'Arena 1',
    notes: '',
  });

  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Game>>({});

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame.name.trim()) return;

    await addGame({
      ...newGame,
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
    });

    setNewGame({
      name: '',
      category: 'Outdoor Championship',
      icon: 'generic',
      status: 'upcoming',
      scheduledTime: '10:00 AM',
      venue: 'Arena 1',
      notes: '',
    });
    setIsAdding(false);
  };

  const startEdit = (g: Game) => {
    setEditingGameId(g.id);
    setEditForm({
      name: g.name,
      category: g.category,
      icon: g.icon,
      status: g.status,
      scheduledTime: g.scheduledTime,
      venue: g.venue,
      notes: g.notes || '',
    });
  };

  const saveEdit = async (id: string) => {
    await updateGame(id, editForm);
    setEditingGameId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">Games & Fixtures Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure sports events, venues, schedule times, and live match statuses
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Game</span>
        </button>
      </div>

      {/* Add Game Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 rounded-2xl bg-slate-900 border border-orange-500/30 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Create New Sporting Fixture
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Sport / Game Name
              </label>
              <input
                type="text"
                placeholder="e.g. Badminton Doubles"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Category
              </label>
              <input
                type="text"
                value={newGame.category}
                onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Sport Icon Type
              </label>
              <select
                value={newGame.icon}
                onChange={(e) => setNewGame({ ...newGame, icon: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="carrom">Carrom</option>
                <option value="foosball">Foosball / Table Soccer</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="snooker">Snooker / Billiards</option>
                <option value="volleyball">Volleyball</option>
                <option value="badminton">Badminton</option>
                <option value="chess">Chess</option>
                <option value="generic">Trophy / Generic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Schedule Time
              </label>
              <input
                type="text"
                value={newGame.scheduledTime}
                onChange={(e) => setNewGame({ ...newGame, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Venue
              </label>
              <input
                type="text"
                value={newGame.venue}
                onChange={(e) => setNewGame({ ...newGame, venue: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Initial Status
              </label>
              <select
                value={newGame.status}
                onChange={(e) => setNewGame({ ...newGame, status: e.target.value as GameStatus })}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live Now</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Rules / Match Notes
            </label>
            <input
              type="text"
              placeholder="e.g. 10 Overs a side · Tennis ball"
              value={newGame.notes}
              onChange={(e) => setNewGame({ ...newGame, notes: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            />
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
              Save Game
            </button>
          </div>
        </form>
      )}

      {/* Games List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.games.map((game) => {
          const isEditing = editingGameId === game.id;

          return (
            <div
              key={game.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg flex flex-col justify-between"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Game Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Time</label>
                      <input
                        type="text"
                        value={editForm.scheduledTime || ''}
                        onChange={(e) => setEditForm({ ...editForm, scheduledTime: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Venue</label>
                      <input
                        type="text"
                        value={editForm.venue || ''}
                        onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Status</label>
                      <select
                        value={editForm.status || 'upcoming'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as GameStatus })}
                        className="w-full px-2 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live Now</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Notes</label>
                    <input
                      type="text"
                      value={editForm.notes || ''}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingGameId(null)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white bg-white/5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(game.id)}
                      className="px-3 py-1 text-xs font-bold text-slate-950 bg-orange-500 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-orange-400">
                        <GameIcon icon={game.icon} size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {game.category}
                        </span>
                        <h4 className="text-xl font-bold text-white font-['Outfit']">
                          {game.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status switcher quick buttons */}
                      <button
                        onClick={() => updateGame(game.id, { status: 'upcoming' })}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          game.status === 'upcoming'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        Upcoming
                      </button>
                      <button
                        onClick={() => updateGame(game.id, { status: 'live' })}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          game.status === 'live'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                            : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        Live
                      </button>
                      <button
                        onClick={() => updateGame(game.id, { status: 'completed' })}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          game.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        Done
                      </button>

                      <button
                        onClick={() => startEdit(game)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg ml-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteGame(game.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <span>Time: </span>
                      <strong className="text-white font-mono">{game.scheduledTime}</strong>
                    </div>
                    <div>
                      <span>Venue: </span>
                      <strong className="text-slate-200">{game.venue}</strong>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
