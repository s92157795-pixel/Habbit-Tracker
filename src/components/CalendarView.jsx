import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';
import {
  MONTH_NAMES,
  WEEKDAYS,
  getMonthCalendarGrid,
  getTodayDateStr,
  isToday,
  isFutureDate,
  formatShortDate,
  getYearlyContributionDays,
} from '../utils/dateUtils';
import { getDailyStats } from '../utils/streakUtils';
import HabitChecklist from './HabitChecklist';

export default function CalendarView({
  selectedDate,
  onSelectDate,
  habits,
  logs,
  habitStreaks,
  onToggleHabit,
  onEditHabit,
  onOpenCreateModal,
}) {
  const todayStr = getTodayDateStr();
  const [todayYear, todayMonth] = todayStr.split('-').map(Number);

  // Month navigation state (0-indexed month)
  const [currentYear, setCurrentYear] = useState(todayYear);
  const [currentMonth, setCurrentMonth] = useState(todayMonth - 1);

  // Heatmap hover tooltip
  const [hoveredCell, setHoveredCell] = useState(null);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(todayYear);
    setCurrentMonth(todayMonth - 1);
    onSelectDate(todayStr);
  };

  // Generate calendar grid
  const calendarCells = getMonthCalendarGrid(currentYear, currentMonth);

  // Generate yearly heatmap days (past 52 weeks = 364 days)
  const heatmapDays = getYearlyContributionDays(364);

  return (
    <div className="space-y-6">
      {/* Top Monthly Calendar Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-all">
        {/* Month Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any date to inspect and record your habits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleJumpToToday}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Today
            </button>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-6">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell) => {
              const stats = getDailyStats(cell.dateStr, habits, logs);
              const isSelected = selectedDate === cell.dateStr;
              const isTodayCell = isToday(cell.dateStr);
              const isFutureCell = isFutureDate(cell.dateStr);

              // Completion appearance
              const isCompleted = stats.status === 'completed';
              const isPartial = stats.status === 'partial';

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => onSelectDate(cell.dateStr)}
                  className={`relative min-h-[58px] sm:min-h-[76px] md:min-h-[88px] p-1 sm:p-2 rounded-lg sm:rounded-xl flex flex-col justify-between transition-all text-left cursor-pointer border ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm z-10'
                      : isTodayCell
                      ? 'border-emerald-400/80 bg-white dark:bg-slate-800/90 shadow-xs'
                      : cell.isCurrentMonth
                      ? 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                      : 'border-transparent bg-slate-50/50 dark:bg-slate-900/40 opacity-40 hover:opacity-75'
                  }`}
                >
                  {/* Top: Day number + Today indicator */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[11px] sm:text-xs md:text-sm font-semibold rounded-md px-1 sm:px-1.5 py-0.5 ${
                        isTodayCell
                          ? 'bg-emerald-600 text-white font-bold'
                          : cell.isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Checkmark icon for complete days */}
                    {isCompleted && !isFutureCell && (
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                      </span>
                    )}

                    {isPartial && !isFutureCell && (
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
                    )}
                  </div>

                  {/* Bottom: Progress info */}
                  <div className="w-full mt-0.5 sm:mt-1">
                    {stats.total > 0 && !isFutureCell ? (
                      <div>
                        {/* Mini Progress Bar */}
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-0.5 sm:mb-1">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : isPartial
                                ? 'bg-amber-400'
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                            style={{ width: `${stats.percentage}%` }}
                          />
                        </div>

                        {/* Fraction Indicator */}
                        <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                          <span>
                            {stats.completed}/{stats.total}
                          </span>
                          <span className="hidden sm:inline">
                            {stats.percentage}%
                          </span>
                        </div>
                      </div>
                    ) : stats.total > 0 && isFutureCell ? (
                      <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {stats.total} set
                      </div>
                    ) : (
                      <div className="text-[9px] sm:text-[10px] text-slate-400/60 dark:text-slate-600">
                        -
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Partially Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
                <span>Untouched / Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border-2 border-emerald-500 bg-emerald-50/50" />
                <span>Selected Date</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              * Future dates are never marked complete automatically
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Activity Heatmap (Contribution Calendar) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Yearly Activity Heatmap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              52-week consistency matrix. Click any square to jump to that day.
            </p>
          </div>
          <span className="text-[10px] text-slate-400 sm:hidden">
            Swipe sideways to view full year →
          </span>
        </div>

        {/* Heatmap Grid Container with smooth touch scrolling */}
        <div className="mt-4 overflow-x-auto pb-3 pt-1 touch-pan-x">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1">
            {heatmapDays.map((day) => {
              const stats = getDailyStats(day.dateStr, habits, logs);
              const isSelected = selectedDate === day.dateStr;

              // Color intensity based on percentage
              let bgClass = 'bg-slate-100 dark:bg-slate-800/80';
              if (!day.isFuture && stats.total > 0) {
                if (stats.percentage === 100) {
                  bgClass = 'bg-emerald-600 dark:bg-emerald-500';
                } else if (stats.percentage >= 66) {
                  bgClass = 'bg-emerald-400 dark:bg-emerald-600';
                } else if (stats.percentage >= 33) {
                  bgClass = 'bg-emerald-300 dark:bg-emerald-700/70';
                } else if (stats.percentage > 0) {
                  bgClass = 'bg-emerald-200 dark:bg-emerald-800/50';
                }
              }

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => onSelectDate(day.dateStr)}
                  onMouseEnter={() => setHoveredCell({ ...day, stats })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-3.5 h-3.5 rounded-xs transition-all cursor-pointer ${bgClass} ${
                    isSelected ? 'ring-2 ring-emerald-500 ring-offset-1 scale-125 z-10' : 'hover:scale-125'
                  }`}
                  aria-label={`${day.dateStr}: ${stats.completed}/${stats.total} habits completed`}
                />
              );
            })}
          </div>

          {/* Floating Tooltip */}
          {hoveredCell && (
            <div className="mt-3 p-2 bg-slate-900 text-white rounded-lg text-xs shadow-md inline-block">
              <span className="font-semibold">{formatShortDate(hoveredCell.dateStr)}</span>: {hoveredCell.stats.completed} of {hoveredCell.stats.total} habits completed ({hoveredCell.stats.percentage}%)
            </div>
          )}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-end gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
          <span>Less</span>
          <span className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-slate-800" />
          <span className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-800/50" />
          <span className="w-3 h-3 rounded-xs bg-emerald-300 dark:bg-emerald-700/70" />
          <span className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-600" />
          <span className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
          <span>More</span>
        </div>
      </div>

      {/* Selected Date Habit Checklist directly underneath */}
      <HabitChecklist
        selectedDate={selectedDate}
        onSelectToday={handleJumpToToday}
        habits={habits}
        logs={logs}
        habitStreaks={habitStreaks}
        onToggleHabit={onToggleHabit}
        onEditHabit={onEditHabit}
        onOpenCreateModal={onOpenCreateModal}
      />
    </div>
  );
}
