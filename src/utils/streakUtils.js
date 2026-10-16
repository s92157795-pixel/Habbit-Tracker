/**
 * Accurate streak, completion rate, and analytics calculation utilities
 * Follows strict rules:
 * - Only counts scheduled days
 * - Skips unscheduled days without penalty
 * - Today does not break current streak if not yet completed
 * - Future dates never counted as missed
 */

import { parseDate, formatDate, getTodayDateStr, isFutureDate } from './dateUtils';

/**
 * Check if a habit is scheduled on a given date (YYYY-MM-DD)
 */
export function isHabitScheduledOn(habit, dateStr) {
  if (!habit || !dateStr) return false;
  // If habit was created after this date, it wasn't active yet
  if (habit.createdAt && habit.createdAt > dateStr) {
    return false;
  }
  const date = parseDate(dateStr);
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  return Array.isArray(habit.scheduledDays) && habit.scheduledDays.includes(dayOfWeek);
}

/**
 * Check if habit is completed on dateStr
 */
export function isHabitCompletedOn(habitId, dateStr, logs) {
  return Boolean(logs?.[dateStr]?.[habitId]);
}

/**
 * Calculate current streak and longest streak for a specific habit
 */
export function calculateHabitStreaks(habit, logs) {
  if (!habit) return { currentStreak: 0, longestStreak: 0, totalCompleted: 0 };

  const todayStr = getTodayDateStr();
  const createdDateStr = habit.createdAt || '2026-01-01';

  // 1. Calculate Total Completed Days
  let totalCompleted = 0;
  if (logs) {
    for (const habitMap of Object.values(logs)) {
      if (habitMap && habitMap[habit.id]) {
        totalCompleted++;
      }
    }
  }

  // 2. Calculate Current Streak
  let currentStreak = 0;
  let checkDate = parseDate(todayStr);

  const todayScheduled = isHabitScheduledOn(habit, todayStr);
  const todayDone = isHabitCompletedOn(habit.id, todayStr, logs);

  if (todayScheduled && todayDone) {
    currentStreak++;
    // Move to yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (!todayScheduled) {
    // Today was not scheduled, start checking backwards from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Today is scheduled but not completed yet:
    // Today does not break the streak because the day is still ongoing.
    // Check backwards starting from yesterday.
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Loop backwards up to 365 days or until createdAt
  let iterations = 0;
  const maxIterations = 365;

  while (iterations < maxIterations) {
    const curDateStr = formatDate(checkDate);
    if (curDateStr < createdDateStr) {
      break;
    }

    const scheduled = isHabitScheduledOn(habit, curDateStr);
    if (scheduled) {
      const completed = isHabitCompletedOn(habit.id, curDateStr, logs);
      if (completed) {
        currentStreak++;
      } else {
        // Missed a past scheduled day, current streak ends here
        break;
      }
    }
    // If not scheduled, skip silently without breaking streak!

    checkDate.setDate(checkDate.getDate() - 1);
    iterations++;
  }

  // 3. Calculate Longest Streak chronologically from createdAt to today
  let longestStreak = 0;
  let runningStreak = 0;

  const startDate = parseDate(createdDateStr);
  const endDate = parseDate(todayStr);

  let iterDate = new Date(startDate);
  while (iterDate <= endDate) {
    const iterDateStr = formatDate(iterDate);
    const scheduled = isHabitScheduledOn(habit, iterDateStr);

    if (scheduled) {
      const done = isHabitCompletedOn(habit.id, iterDateStr, logs);
      if (done) {
        runningStreak++;
        if (runningStreak > longestStreak) {
          longestStreak = runningStreak;
        }
      } else {
        // Only reset if it's a past date
        if (iterDateStr < todayStr) {
          runningStreak = 0;
        }
      }
    }

    iterDate.setDate(iterDate.getDate() + 1);
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    totalCompleted,
  };
}

/**
 * Get daily completion status and counts for a specific date
 */
export function getDailyStats(dateStr, habits, logs) {
  const activeHabits = habits.filter(h => !h.archived);
  const scheduledHabits = activeHabits.filter(h => isHabitScheduledOn(h, dateStr));
  const total = scheduledHabits.length;

  if (total === 0) {
    return {
      dateStr,
      total: 0,
      completed: 0,
      percentage: 0,
      status: 'none', // No habits scheduled
      isFuture: isFutureDate(dateStr),
    };
  }

  const completed = scheduledHabits.filter(h => isHabitCompletedOn(h.id, dateStr, logs)).length;
  const percentage = Math.round((completed / total) * 100);

  let status = 'untouched';
  if (completed === total) {
    status = 'completed';
  } else if (completed > 0) {
    status = 'partial';
  }

  return {
    dateStr,
    total,
    completed,
    percentage,
    status,
    isFuture: isFutureDate(dateStr),
  };
}

/**
 * Calculate completion percentage for a given month
 * Count only up to today (does not penalize future days)
 */
export function getMonthStats(year, month, habits, logs) {
  const todayStr = getTodayDateStr();
  const activeHabits = habits.filter(h => !h.archived);

  // Month is 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let totalScheduledInstances = 0;
  let totalCompletedInstances = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Do not count future dates in completion rate calculation
    if (dateStr > todayStr) {
      continue;
    }

    const scheduled = activeHabits.filter(h => isHabitScheduledOn(h, dateStr));
    totalScheduledInstances += scheduled.length;

    const completed = scheduled.filter(h => isHabitCompletedOn(h.id, dateStr, logs)).length;
    totalCompletedInstances += completed;
  }

  const percentage = totalScheduledInstances > 0
    ? Math.round((totalCompletedInstances / totalScheduledInstances) * 100)
    : 0;

  return {
    totalScheduled: totalScheduledInstances,
    totalCompleted: totalCompletedInstances,
    percentage,
  };
}

/**
 * Calculate completion percentage and daily breakdown for last 7 days
 */
export function getLast7DaysStats(habits, logs) {
  const todayStr = getTodayDateStr();
  const today = parseDate(todayStr);
  const activeHabits = habits.filter(h => !h.archived);

  const days = [];
  let totalScheduled = 0;
  let totalCompleted = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);

    const scheduled = activeHabits.filter(h => isHabitScheduledOn(h, dateStr));
    const completed = scheduled.filter(h => isHabitCompletedOn(h.id, dateStr, logs));

    totalScheduled += scheduled.length;
    totalCompleted += completed.length;

    const pct = scheduled.length > 0
      ? Math.round((completed.length / scheduled.length) * 100)
      : 0;

    days.push({
      dateStr,
      date: d,
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      total: scheduled.length,
      completed: completed.length,
      percentage: pct,
    });
  }

  const overallPercentage = totalScheduled > 0
    ? Math.round((totalCompleted / totalScheduled) * 100)
    : 0;

  return {
    days,
    totalScheduled,
    totalCompleted,
    percentage: overallPercentage,
  };
}
