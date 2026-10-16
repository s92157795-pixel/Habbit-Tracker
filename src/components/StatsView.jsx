import React from 'react';
import {
  Flame,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  BarChart2,
} from 'lucide-react';
import {
  getTodayDateStr,
  MONTH_NAMES,
  formatShortDate,
} from '../utils/dateUtils';
import { getLast7DaysStats, getMonthStats } from '../utils/streakUtils';

export default function StatsView({ habits, logs, habitStreaks, bestStreak }) {
  const todayStr = getTodayDateStr();
  const [year, month] = todayStr.split('-').map(Number);
  const currentMonthIndex = month - 1;

  const activeHabits = habits.filter((h) => !h.archived);

  // 7-day stats
  const weekStats = getLast7DaysStats(habits, logs);

  // Current month stats
  const monthStats = getMonthStats(year, currentMonthIndex, habits, logs);

  // Calculate total completions all-time
  let totalCompletionsAllTime = 0;
  if (logs) {
    for (const date in logs) {
      if (logs[date]) {
        totalCompletionsAllTime += Object.values(logs[date]).filter(Boolean).length;
      }
    }
  }

  // Sort habits by current streak descending
  const rankedHabits = [...activeHabits].sort((a, b) => {
    const streakA = habitStreaks[a.id]?.currentStreak || 0;
    const streakB = habitStreaks[b.id]?.currentStreak || 0;
    return streakB - streakA;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Streaks & Performance Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Accurate tracking of consistency, streaks, and scheduled milestones
            </p>
          </div>
        </div>

        {/* 4 Analytics Highlight Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Best Streak
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                {bestStreak}
              </span>
              <span className="text-xs text-slate-400">days run</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              7-Day Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {weekStats.percentage}%
              </span>
              <span className="text-xs text-slate-400">
                {weekStats.totalCompleted}/{weekStats.totalScheduled}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {MONTH_NAMES[currentMonthIndex]} Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                {monthStats.percentage}%
              </span>
              <span className="text-xs text-slate-400">to date</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Completions
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalCompletionsAllTime}
              </span>
              <span className="text-xs text-slate-400">habits checked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart & Monthly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Last 7 Days Progress
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily completion ratios for the past week
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {weekStats.percentage}% avg
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 space-y-4">
            {weekStats.days.map((day) => (
              <div key={day.dateStr} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="font-bold w-9 uppercase">{day.dayLabel}</span>
                    <span className="text-slate-400">{formatShortDate(day.dateStr)}</span>
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    {day.total > 0 ? (
                      <>
                        {day.completed}/{day.total} ({day.percentage}%)
                      </>
                    ) : (
                      'Rest Day'
                    )}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      day.percentage === 100
                        ? 'bg-emerald-500'
                        : day.percentage >= 50
                        ? 'bg-teal-500'
                        : day.percentage > 0
                        ? 'bg-amber-400'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${day.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  {MONTH_NAMES[currentMonthIndex]} {year} Overview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly scheduled habits vs completed
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Month-to-Date Completion
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {monthStats.percentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transition-all"
                    style={{ width: `${monthStats.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>{monthStats.totalCompleted} habits logged</span>
                  <span>{monthStats.totalScheduled} total scheduled</span>
                </div>
              </div>

              {/* Informative Rule Callouts */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Accurate & Honest Calculations:
                </div>
                <p className="leading-relaxed">
                  • Only scheduled days count towards your completion percentage.
                </p>
                <p className="leading-relaxed">
                  • Future days in the month are never counted as missed.
                </p>
                <p className="leading-relaxed">
                  • Editing past checkmarks recalculates all streaks instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habit Streak Leaderboard */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Habit Streak Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current and all-time longest streaks for active habits
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {rankedHabits.map((habit, index) => {
            const streak = habitStreaks[habit.id] || {
              currentStreak: 0,
              longestStreak: 0,
              totalCompleted: 0,
            };

            return (
              <div
                key={habit.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-6 text-xs font-bold text-slate-400 text-center shrink-0">
                    #{index + 1}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: habit.color || '#10b981' }}
                  >
                    {habit.emoji || '🎯'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {habit.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {habit.description || 'No description'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Current Streak
                    </span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {streak.currentStreak} days
                    </span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Longest Streak
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {streak.longestStreak} days
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Total Done
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {streak.totalCompleted}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
