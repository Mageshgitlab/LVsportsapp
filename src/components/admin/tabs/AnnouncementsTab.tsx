import React, { useState } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { Announcement } from '../../../types';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Bell, Check, X, Eye, EyeOff } from 'lucide-react';

export const AnnouncementsTab: React.FC = () => {
  const { data, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useCarnivalStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState<'general' | 'urgent' | 'schedule' | 'celebration'>('general');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    await addAnnouncement({
      title: newTitle.trim(),
      message: newMessage.trim(),
      category: newCategory,
      active: true,
      createdAt: 'Just now',
    });

    setNewTitle('');
    setNewMessage('');
    setIsAdding(false);
  };

  const startEdit = (a: Announcement) => {
    setEditingId(a.id);
    setEditTitle(a.title);
    setEditMessage(a.message);
  };

  const saveEdit = async (id: string) => {
    await updateAnnouncement(id, {
      title: editTitle.trim(),
      message: editMessage.trim(),
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">Announcements Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Post live messages, schedule updates, emergency bulletins, and celebration notices on the TV
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 rounded-2xl bg-slate-900 border border-orange-500/30 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Create Broadcast Bulletin
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
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Football Semifinals Starting"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="general">General Notice</option>
                <option value="urgent">Urgent Bulletin</option>
                <option value="schedule">Schedule Update</option>
                <option value="celebration">Celebration / Highlight</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Message Body (Readable from 75" TV)
            </label>
            <textarea
              rows={2}
              placeholder="Enter bulletin text to display on TV..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
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
              Publish Bulletin
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {data.announcements.map((ann) => {
          const isEditing = editingId === ann.id;

          return (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all ${
                ann.active
                  ? 'bg-slate-900/80 border-white/10 shadow-lg'
                  : 'bg-slate-950/40 border-white/5 opacity-60'
              }`}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/60 border border-white/20 rounded-lg text-sm text-white font-bold"
                  />
                  <textarea
                    rows={2}
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/60 border border-white/20 rounded-lg text-xs text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs text-slate-400 bg-white/5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(ann.id)}
                      className="px-3 py-1 text-xs font-bold text-slate-950 bg-orange-500 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                      <Bell className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          {ann.category}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {ann.createdAt}
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-white font-['Outfit'] mt-1">
                        {ann.title}
                      </h4>

                      <p className="text-sm text-slate-300 mt-1">
                        {ann.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Active Switch */}
                    <button
                      onClick={() => updateAnnouncement(ann.id, { active: !ann.active })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        ann.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-500 border border-white/5'
                      }`}
                      title={ann.active ? 'Active on TV (Click to hide)' : 'Hidden (Click to show)'}
                    >
                      {ann.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{ann.active ? 'Broadcast On' : 'Hidden'}</span>
                    </button>

                    <button
                      onClick={() => startEdit(ann)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
