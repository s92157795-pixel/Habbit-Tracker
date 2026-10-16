import React, { useState } from 'react';
import { X, Sparkles, Clock, CalendarDays, Palette } from 'lucide-react';
import { HABIT_COLORS, HABIT_EMOJIS, SCHEDULE_TYPES } from '../utils/constants';
import { WEEKDAYS } from '../utils/dateUtils';

function HabitForm({ habit, onSave, onClose }) {
  const [name, setName] = useState(() => habit?.name || '');
  const [description, setDescription] = useState(() => habit?.description || '');
  const [emoji, setEmoji] = useState(() => habit?.emoji || '🎯');
  const [selectedColor, setSelectedColor] = useState(() => {
    if (habit) {
      const foundColor = HABIT_COLORS.find(
        (c) => c.hex === habit.color || c.id === habit.colorName
      );
      if (foundColor) return foundColor;
    }
    return HABIT_COLORS[0];
  });
  const [scheduleType, setScheduleType] = useState(() => habit?.scheduleType || SCHEDULE_TYPES.DAILY);
  const [scheduledDays, setScheduledDays] = useState(() => habit?.scheduledDays || [0, 1, 2, 3, 4, 5, 6]);
  const [reminderTime, setReminderTime] = useState(() => habit?.reminderTime || '');
  const [error, setError] = useState('');

  // Handle schedule presets
  const handleSchedulePreset = (type) => {
    setScheduleType(type);
    if (type === SCHEDULE_TYPES.DAILY) {
      setScheduledDays([0, 1, 2, 3, 4, 5, 6]);
    } else if (type === SCHEDULE_TYPES.WEEKDAYS_ONLY) {
      setScheduledDays([1, 2, 3, 4, 5]);
    } else if (type === SCHEDULE_TYPES.WEEKENDS_ONLY) {
      setScheduledDays([0, 6]);
    }
  };

  const toggleDay = (dayIndex) => {
    setScheduleType(SCHEDULE_TYPES.CUSTOM);
    setScheduledDays((prev) => {
      if (prev.includes(dayIndex)) {
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort();
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a habit name.');
      return;
    }
    if (scheduledDays.length === 0) {
      setError('Please select at least one scheduled day.');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      emoji,
      color: selectedColor.hex,
      colorName: selectedColor.id,
      scheduleType,
      scheduledDays,
      reminderTime,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Habit Name & Emoji */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          Habit Name & Emoji
        </label>
        <div className="flex items-center gap-2">
          <div className="relative group shrink-0">
            <button
              type="button"
              className="w-12 h-12 text-2xl flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Pick icon"
            >
              {emoji}
            </button>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g. Read 10 Pages, Morning Run, Code..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
            autoFocus
          />
        </div>

        {/* Quick Emoji Strip */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">Quick icons:</span>
          {HABIT_EMOJIS.slice(0, 10).map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setEmoji(em)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer ${
                emoji === em
                  ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 scale-110'
                  : ''
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          Description <span className="font-normal text-slate-400 lowercase">(optional)</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Chapter a day, build focus and mindfulness"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
        />
      </div>

      {/* Color Tag Selection */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          <Palette className="w-3.5 h-3.5" />
          Theme Color
        </label>
        <div className="flex items-center gap-2.5 flex-wrap">
          {HABIT_COLORS.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setSelectedColor(col)}
              className={`w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                col.bg
              } ${
                selectedColor.id === col.id
                  ? 'ring-4 ring-offset-2 ring-emerald-500 dark:ring-offset-slate-900 scale-110 shadow-sm'
                  : 'opacity-80 hover:opacity-100'
              }`}
              title={col.name}
            >
              {selectedColor.id === col.id && (
                <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Configuration */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          <CalendarDays className="w-3.5 h-3.5" />
          Frequency & Schedule
        </label>

        {/* Presets */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            type="button"
            onClick={() => handleSchedulePreset(SCHEDULE_TYPES.DAILY)}
            className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
              scheduleType === SCHEDULE_TYPES.DAILY
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Every Day
          </button>
          <button
            type="button"
            onClick={() => handleSchedulePreset(SCHEDULE_TYPES.WEEKDAYS_ONLY)}
            className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
              scheduleType === SCHEDULE_TYPES.WEEKDAYS_ONLY
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Weekdays (Mon-Fri)
          </button>
          <button
            type="button"
            onClick={() => handleSchedulePreset(SCHEDULE_TYPES.WEEKENDS_ONLY)}
            className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
              scheduleType === SCHEDULE_TYPES.WEEKENDS_ONLY
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Weekends Only
          </button>
        </div>

        {/* Weekday check pills */}
        <div className="flex items-center justify-between gap-1">
          {WEEKDAYS.map((dayName, idx) => {
            const isSelected = scheduledDays.includes(idx);
            return (
              <button
                key={dayName}
                type="button"
                onClick={() => toggleDay(idx)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {dayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Daily Reminder */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          <Clock className="w-3.5 h-3.5" />
          Daily Reminder Time <span className="font-normal text-slate-400 lowercase">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {reminderTime && (
            <button
              type="button"
              onClick={() => setReminderTime('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
            >
              Clear reminder
            </button>
          )}
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="pt-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
          Live Preview
        </span>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-xs text-white"
              style={{ backgroundColor: selectedColor.hex }}
            >
              {emoji}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {name || 'New Habit'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {description || 'No description provided'}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              {scheduledDays.length === 7 ? 'Everyday' : `${scheduledDays.length} days/wk`}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          {habit ? 'Save Changes' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
}

export default function HabitModal({
  isOpen,
  habit = null,
  onSave,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              {habit ? '✎' : '+'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {habit ? 'Edit Habit' : 'Create New Habit'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set goals you can accomplish consistently
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with fresh key whenever habit changes */}
        <HabitForm
          key={habit ? habit.id : 'new-habit'}
          habit={habit}
          onSave={onSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
