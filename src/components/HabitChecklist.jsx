import React, { useState } from 'react';
import {
  Check,
  Flame,
  Calendar,
  Clock,
  Edit2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  formatFriendlyDate,
  isToday,
  isFutureDate,
  isPastDate,
} from '../utils/dateUtils';
import { isHabitScheduledOn } from '../utils/streakUtils';

export default function HabitChecklist({
  title,
  selectedDate,
  onSelectToday,
  habits,
  logs,
  habitStreaks,
  onToggleHabit,
  onEditHabit,
  onOpenCreateModal,
}) {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  const viewingToday = isToday(selectedDate);
  const viewingFuture = isFutureDate(selectedDate);
  const viewingPast = isPastDate(selectedDate);

  // Active (non-archived) habits
  const activeHabits = habits.filter((h) => !h.archived);

  // Categorize habits on this date: scheduled vs rest day
  const dateHabits = activeHabits.map((habit) => {
    const isScheduled = isHabitScheduledOn(habit, selectedDate);
    const isCompleted = Boolean(logs[selectedDate]?.[habit.id]);
    const streakInfo = habitStreaks[habit.id] || { currentStreak: 0 };
    return {
      ...habit,
      isScheduled,
      isCompleted,
      streak: streakInfo.currentStreak,
    };
  });

  const scheduledHabits = dateHabits.filter((h) => h.isScheduled);
  const scheduledCount = scheduledHabits.length;
  const completedCount = scheduledHabits.filter((h) => h.isCompleted).length;
  const completionPercentage =
    scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;

  // Filtered list
  const filteredHabits = dateHabits.filter((h) => {
    if (filter === 'completed') return h.isCompleted;
    if (filter === 'pending') return !h.isCompleted;
    return true; // 'all'
  });

  const displayHeading = title || (viewingToday ? 'Daily Habit Check-in' : 'Habit Check-in');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-all">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {displayHeading}
            </h3>
            {viewingToday && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Today
              </span>
            )}
            {viewingPast && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Past Date
              </span>
            )}
            {viewingFuture && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Future Date
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{formatFriendlyDate(selectedDate)}</span>
            <span>•</span>
            <span>
              {viewingPast
                ? 'Record or update habits completed earlier.'
                : viewingFuture
                ? 'Preview of scheduled habits for this upcoming date.'
                : 'Click any habit to mark it complete for today.'}
            </span>
          </p>
        </div>

        {/* Date Jump / Progress Counter */}
        <div className="flex items-center gap-3">
          {!viewingToday && (
            <button
              onClick={onSelectToday}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Jump to Today
            </button>
          )}

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Progress
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {completedCount} of {scheduledCount} done
              <span className="text-xs font-normal text-slate-400 ml-1">
                ({completionPercentage}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Celebratory Banner when 100% completed */}
      {scheduledCount > 0 && completedCount === scheduledCount && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎉</span>
            <div>
              <p className="text-xs sm:text-sm font-bold">All habits checked in for this date!</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">Outstanding work completing all scheduled tasks. Consistency is your superpower.</p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
            100% Complete
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 mt-4 mb-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            All ({dateHabits.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Pending ({scheduledCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          + Add Habit
        </button>
      </div>

      {/* Habit Items List */}
      <div className="space-y-2.5">
        {activeHabits.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No habits created yet
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Create your first habit or pick a starter template to start checking off daily routines.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              + Create Habit
            </button>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {filter === 'completed'
                ? 'No habits completed yet for this date'
                : filter === 'pending'
                ? 'All scheduled habits for this date are completed! 🎉'
                : 'No habits scheduled for this day'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {filter === 'pending'
                ? 'Great job keeping up with your goals!'
                : 'Check off a habit or select another date on your calendar.'}
            </p>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const isCompleted = habit.isCompleted;
            const isScheduled = habit.isScheduled;

            return (
              <div
                key={habit.id}
                className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-xs'
                    : isScheduled
                    ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-dashed border-slate-200 dark:border-slate-700 opacity-70'
                }`}
              >
                {/* Left section: Checkbox, Emoji, Name */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Circular Completion Button */}
                  <button
                    type="button"
                    onClick={() => onToggleHabit(habit.id, selectedDate)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-500/20 scale-105'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 hover:scale-105 bg-white dark:bg-slate-800'
                    }`}
                    aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Habit Emoji Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs text-white"
                    style={{ backgroundColor: habit.color || '#10b981' }}
                  >
                    {habit.emoji || '🎯'}
                  </div>

                  {/* Name, Description, Schedule */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm font-semibold truncate transition-colors ${
                          isCompleted
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {habit.name}
                      </h4>

                      {/* Not scheduled badge */}
                      {!isScheduled && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Rest Day
                        </span>
                      )}

                      {/* Reminder pill */}
                      {habit.reminderTime && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {habit.reminderTime}
                        </span>
                      )}
                    </div>

                    {habit.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right section: Streak & Edit Button */}
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {/* Streak badge */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      habit.streak > 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                    title={`Current streak: ${habit.streak} scheduled days`}
                  >
                    <Flame
                      className={`w-3.5 h-3.5 ${
                        habit.streak > 0
                          ? 'text-amber-500 fill-amber-500 animate-pulse'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{habit.streak}d</span>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => onEditHabit(habit)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Edit habit details"
                    aria-label={`Edit ${habit.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
