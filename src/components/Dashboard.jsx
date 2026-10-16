import React from 'react';
import {
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
} from 'lucide-react';
import {
  formatFriendlyDate,
  getTodayDateStr,
  formatShortDate,
} from '../utils/dateUtils';
import { getMotivationalMessage, STARTER_HABIT_TEMPLATES } from '../utils/constants';
import { getLast7DaysStats } from '../utils/streakUtils';
import HabitChecklist from './HabitChecklist';

export default function Dashboard({
  habits,
  logs,
  todayStats,
  bestStreak,
  selectedDate,
  onSelectDate,
  habitStreaks,
  onToggleHabit,
  onEditHabit,
  onOpenCreateModal,
  onAddStarterHabit,
}) {
  const todayStr = getTodayDateStr();
  const activeHabits = habits.filter((h) => !h.archived);

  // Motivational message
  const motivation = activeHabits.length === 0
    ? {
        title: 'Welcome to your private Habit Tracker!',
        message: 'Start tracking your daily goals. Add your own custom habit or pick a starter below.',
        type: 'initial',
      }
    : getMotivationalMessage(
        todayStats.percentage,
        todayStats.completed,
        todayStats.total
      );

  // 7-day stats for week strip
  const weekStats = getLast7DaysStats(habits, logs);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatFriendlyDate(todayStr)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Build Better Habits, One Day at a Time
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              {motivation.message}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              New Habit
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Habits */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Habits
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {activeHabits.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {habits.length - activeHabits.length} archived
          </p>
        </div>

        {/* Metric 2: Completed Today */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Today
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {todayStats.completed}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              of {todayStats.total} scheduled
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {todayStats.total - todayStats.completed} remaining today
          </p>
        </div>

        {/* Metric 3: Today's Completion % */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Rate
            </span>
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {todayStats.percentage}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {todayStats.percentage === 100 ? 'Complete' : 'In Progress'}
            </span>
          </div>
          {/* Progress bar inside card */}
          <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${todayStats.percentage}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Current Best Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Best Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {bestStreak}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              days streak
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Highest active habit run
          </p>
        </div>
      </div>

      {/* If no habits exist yet, show a welcoming starter section */}
      {activeHabits.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Welcome to Your Habit Tracker
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your habits and targets are private to your device. Pick a starter habit or create a custom routine.
              </p>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Create Custom Habit
            </button>
          </div>

          <div className="mt-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Starter Suggestions (1-Click Add)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STARTER_HABIT_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.name}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 text-white shadow-xs"
                      style={{ backgroundColor: tpl.color }}
                    >
                      {tpl.emoji}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tpl.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddStarterHabit && onAddStarterHabit(tpl)}
                    className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    Add Habit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Immediate Daily Progress Bar Section */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Today's Daily Target
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {todayStats.completed} / {todayStats.total} Completed
              </span>
            </div>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {todayStats.percentage}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${todayStats.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Prominent Daily Habit Check-in Section */}
      <HabitChecklist
        title="Daily Habit Check-in"
        selectedDate={selectedDate}
        onSelectToday={() => onSelectDate(todayStr)}
        habits={habits}
        logs={logs}
        habitStreaks={habitStreaks}
        onToggleHabit={onToggleHabit}
        onEditHabit={onEditHabit}
        onOpenCreateModal={onOpenCreateModal}
      />

      {/* 7-Day Quick Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Last 7 Days Consistency
          </h3>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {weekStats.percentage}% 7-Day Average
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekStats.days.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            const isTodayDay = d.dateStr === todayStr;

            return (
              <button
                key={d.dateStr}
                onClick={() => onSelectDate(d.dateStr)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/30'
                    : isTodayDay
                    ? 'border-slate-400 bg-white dark:bg-slate-800 shadow-xs'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {d.dayLabel}
                </span>
                <span
                  className={`text-xs font-bold block my-0.5 ${
                    isTodayDay
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {formatShortDate(d.dateStr)}
                </span>
                <div className="mt-1 flex items-center justify-center">
                  {d.total > 0 ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        d.percentage === 100
                          ? 'bg-emerald-500 text-white'
                          : d.percentage > 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {d.completed}/{d.total}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">-</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
