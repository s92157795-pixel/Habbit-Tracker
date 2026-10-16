import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Archive,
  Trash2,
  Flame,
  Clock,
  ArchiveRestore,
} from 'lucide-react';
import { WEEKDAYS } from '../utils/dateUtils';
import ConfirmModal from './ConfirmModal';

export default function HabitManagement({
  habits,
  habitStreaks,
  onOpenCreateModal,
  onEditHabit,
  onToggleArchiveHabit,
  onDeleteHabit,
}) {
  const [tab, setTab] = useState('active'); // 'active' or 'archived'
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmHabit, setDeleteConfirmHabit] = useState(null);

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);

  const displayedList = (tab === 'active' ? activeHabits : archivedHabits).filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Habits Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure your daily routines, frequencies, and schedules
            </p>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Habit
          </button>
        </div>

        {/* Tab & Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setTab('active')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'active'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Active Habits ({activeHabits.length})
            </button>
            <button
              onClick={() => setTab('archived')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'archived'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Archived ({archivedHabits.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search habits..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Archive className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {searchQuery
                ? 'No habits match your search query.'
                : tab === 'archived'
                ? 'No archived habits.'
                : 'No active habits.'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {tab === 'active' && !searchQuery
                ? 'Start building your personalized routine by adding your first habit.'
                : ''}
            </p>
            {tab === 'active' && (
              <button
                onClick={onOpenCreateModal}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                Create Habit
              </button>
            )}
          </div>
        ) : (
          displayedList.map((habit) => {
            const streak = habitStreaks[habit.id] || {
              currentStreak: 0,
              longestStreak: 0,
              totalCompleted: 0,
            };

            const scheduledCount = habit.scheduledDays?.length || 7;
            const isEveryday = scheduledCount === 7;

            return (
              <div
                key={habit.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side: Icon, Title, Description, Schedule */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs text-white"
                    style={{ backgroundColor: habit.color || '#10b981' }}
                  >
                    {habit.emoji || '🎯'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {habit.name}
                      </h3>
                      {habit.reminderTime && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {habit.reminderTime}
                        </span>
                      )}
                    </div>

                    {habit.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {habit.description}
                      </p>
                    )}

                    {/* Schedule days badges */}
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                        Schedule:
                      </span>
                      {isEveryday ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
                          Every Single Day
                        </span>
                      ) : (
                        WEEKDAYS.map((dayName, idx) => {
                          const isScheduled = habit.scheduledDays?.includes(idx);
                          return (
                            <span
                              key={dayName}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                isScheduled
                                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                              }`}
                            >
                              {dayName}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Streaks & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                  {/* Streak Stats */}
                  <div className="flex items-center gap-4 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Current
                      </span>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {streak.currentStreak}d
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Longest
                      </span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {streak.longestStreak}d
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Total Done
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {streak.totalCompleted}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditHabit(habit)}
                      className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Edit habit"
                      aria-label={`Edit ${habit.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onToggleArchiveHabit(habit.id)}
                      className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title={habit.archived ? 'Restore to active' : 'Archive habit'}
                      aria-label={habit.archived ? 'Restore habit' : 'Archive habit'}
                    >
                      {habit.archived ? (
                        <ArchiveRestore className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteConfirmHabit(habit)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Delete habit"
                      aria-label={`Delete ${habit.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmHabit)}
        title="Delete Habit"
        message={`Are you sure you want to permanently delete "${deleteConfirmHabit?.name}"? Its historical completion records will be removed.`}
        confirmText="Delete Habit"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => {
          if (deleteConfirmHabit) {
            onDeleteHabit(deleteConfirmHabit.id);
            setDeleteConfirmHabit(null);
          }
        }}
        onCancel={() => setDeleteConfirmHabit(null)}
      />
    </div>
  );
}
