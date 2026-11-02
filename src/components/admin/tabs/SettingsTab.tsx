import React, { useState, useRef } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { SlideConfig, SlideId } from '../../../types';
import {
  Clock,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Download,
  Upload,
  Building2,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    data,
    updateSettings,
    setSlidesOrder,
    toggleSlide,
    addSponsor,
    deleteSponsor,
    resetToDefault,
    exportData,
    importData,
  } = useCarnivalStore();

  const [title, setTitle] = useState(data.settings.eventTitle);
  const [subtitle, setSubtitle] = useState(data.settings.eventSubtitle);
  const [eventDate, setEventDate] = useState(data.settings.eventDate);
  const [venue, setVenue] = useState(data.settings.venueName);
  const [slideDurationSec, setSlideDurationSec] = useState(
    Math.round((data.settings.slideDurationMs || 5000) / 1000)
  );

  const [savedNotice, setSavedNotice] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // New Sponsor Form
  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorTier, setNewSponsorTier] = useState('Official Partner');
  const [newSponsorText, setNewSponsorText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      eventTitle: title,
      eventSubtitle: subtitle,
      eventDate,
      venueName: venue,
      slideDurationMs: Math.max(2, slideDurationSec) * 1000,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const currentSlides = [...data.settings.slides].sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= currentSlides.length) return;

    // Swap
    const temp = currentSlides[index];
    currentSlides[index] = currentSlides[targetIndex];
    currentSlides[targetIndex] = temp;

    // Re-assign order numbers
    const reordered = currentSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
    await setSlidesOrder(reordered);
  };

  const handleExportJson = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lv_sports_carnival_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = async () => {
    setImportError(null);
    if (!importJsonText.trim()) return;

    const res = await importData(importJsonText.trim());
    if (res.success) {
      setImportModalOpen(false);
      setImportJsonText('');
    } else {
      setImportError(res.error || 'Failed to import JSON data');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = await importData(content);
        if (res.success) {
          setImportModalOpen(false);
        } else {
          setImportError(res.error || 'Invalid JSON file');
          setImportModalOpen(true);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsorName.trim()) return;

    await addSponsor({
      name: newSponsorName.trim(),
      tier: newSponsorTier.trim(),
      logoText: (newSponsorText || newSponsorName).trim().toUpperCase(),
    });

    setNewSponsorName('');
    setNewSponsorText('');
  };

  const sortedSlides = [...data.settings.slides].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">System & Display Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure rotation timings, event identity, slide playlist ordering, and backups
          </p>
        </div>

        {/* Export / Import & Reset Actions */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
            title="Upload and load JSON backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
            title="Download full database snapshot"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setResetModalOpen(true)}
            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to default seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>

      {/* General Configuration Form */}
      <form
        onSubmit={handleSaveGeneral}
        className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-5 shadow-xl"
      >
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-['Outfit']">
          Event Branding & TV Timing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Event Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Event Date / Period
            </label>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Venue Name
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Slide Duration Controls */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
            Slide Auto-Rotation Duration: <strong className="text-orange-400 font-mono text-sm">{slideDurationSec} seconds</strong> ({slideDurationSec * 1000} ms)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={slideDurationSec}
              onChange={(e) => setSlideDurationSec(parseInt(e.target.value) || 5)}
              className="flex-1 accent-orange-500 cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              {[5, 8, 10, 15].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSlideDurationSec(preset)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                    slideDurationSec === preset
                      ? 'bg-orange-500 text-slate-950'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset}s
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedNotice ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Changes apply instantly to TV rotation
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2 text-xs font-black text-slate-950 bg-orange-500 hover:bg-orange-400 rounded-xl transition-all cursor-pointer shadow-lg shadow-orange-500/20"
          >
            Save General Settings
          </button>
        </div>
      </form>

      {/* Slide Playlist Reordering & Enable/Disable */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-['Outfit']">
              Slide Sequence & Rotation Playlist
            </h3>
            <p className="text-xs text-slate-400">
              Reorder slides or toggle individual screens on/off. Empty slides are skipped automatically.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {sortedSlides.filter((s) => s.enabled).length} of {sortedSlides.length} Active
          </span>
        </div>

        <div className="divide-y divide-white/5 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
          {sortedSlides.map((slide, index) => {
            const isFirst = index === 0;
            const isLast = index === sortedSlides.length - 1;

            return (
              <div
                key={slide.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono text-xs font-bold text-slate-400">
                    {index + 1}
                  </span>

                  <div>
                    <h4 className="text-sm font-bold text-white">{slide.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {slide.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle Enabled */}
                  <button
                    onClick={() => toggleSlide(slide.id, !slide.enabled)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      slide.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-500 border border-white/5'
                    }`}
                  >
                    {slide.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  {/* Move Up / Down */}
                  <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                    <button
                      disabled={isFirst}
                      onClick={() => handleMoveSlide(index, 'up')}
                      className={`p-1.5 rounded-lg ${
                        isFirst
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer'
                      }`}
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={isLast}
                      onClick={() => handleMoveSlide(index, 'down')}
                      className={`p-1.5 rounded-lg ${
                        isLast
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer'
                      }`}
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sponsors & Acknowledgements Manager */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-['Outfit']">
          Sponsors & Tournament Partners
        </h3>

        {/* Add Sponsor Form */}
        <form onSubmit={handleAddSponsorSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Partner Name"
            value={newSponsorName}
            onChange={(e) => setNewSponsorName(e.target.value)}
            className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
          />
          <input
            type="text"
            placeholder="Tier (e.g. Title Partner)"
            value={newSponsorTier}
            onChange={(e) => setNewSponsorTier(e.target.value)}
            className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
          />
          <input
            type="text"
            placeholder="Logo Text Banner"
            value={newSponsorText}
            onChange={(e) => setNewSponsorText(e.target.value)}
            className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Partner</span>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {(data.sponsors || []).map((sp) => (
            <div
              key={sp.id}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-orange-400">
                  {sp.tier}
                </span>
                <h5 className="font-extrabold text-white text-sm">{sp.name}</h5>
                <span className="text-xs font-mono text-slate-400">{sp.logoText}</span>
              </div>
              <button
                onClick={() => deleteSponsor(sp.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {resetModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Reset All Tournament Data?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore all default teams (Pardus, Falcon Fury, Stormbreakers, Tiger Ka Hukum), original member rosters, schedule fixtures, and reset all points to 0.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await resetToDefault();
                  setResetModalOpen(false);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
