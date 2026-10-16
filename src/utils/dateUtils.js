/**
 * Date utility functions for HabitFlow
 * All dates are strictly normalized to 'YYYY-MM-DD' in local time
 * to prevent timezone-shifting bugs.
 */

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Format Date object to YYYY-MM-DD string
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string into a safe local Date object
 */
export function parseDate(dateStr) {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Noon to avoid daylight saving edge cases
}

/**
 * Get today's date in YYYY-MM-DD string
 */
export function getTodayDateStr() {
  return formatDate(new Date());
}

/**
 * Check if a date string is today
 */
export function isToday(dateStr) {
  return dateStr === getTodayDateStr();
}

/**
 * Check if a date string is in the future compared to today
 */
export function isFutureDate(dateStr) {
  return dateStr > getTodayDateStr();
}

/**
 * Check if a date string is in the past compared to today
 */
export function isPastDate(dateStr) {
  return dateStr < getTodayDateStr();
}

/**
 * Format for friendly heading, e.g. "Friday, October 16, 2026"
 */
export function formatFriendlyDate(dateStr) {
  const date = parseDate(dateStr);
  const weekday = WEEKDAYS_FULL[date.getDay()];
  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
}

/**
 * Format short, e.g. "Oct 16"
 */
export function formatShortDate(dateStr) {
  const date = parseDate(dateStr);
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const day = date.getDate();
  return `${month} ${day}`;
}

/**
 * Days in a specific month of a specific year (handles leap years correctly)
 */
export function getDaysInMonth(year, month) {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Generates calendar grid cells for a given year & month (0-indexed month)
 * Includes padding days from previous and next months to form complete weeks.
 */
export function getMonthCalendarGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = getDaysInMonth(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const cells = [];

  // Previous month trailing days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      month: prevMonth,
      year: prevYear,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      month,
      year,
    });
  }

  // Next month leading days to complete the last week (multiple of 7)
  const remainingDays = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remainingDays; day++) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      month: nextMonth,
      year: nextYear,
    });
  }

  return cells;
}

/**
 * Generate last N days ending on today (e.g. last 7 days)
 */
export function getLastNDays(n = 7) {
  const days = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 12, 0, 0);
    days.push(formatDate(d));
  }
  return days;
}

/**
 * Generate dates for a full year activity heatmap (52 weeks = 364 or 365 days)
 * Ending on today or end of current month
 */
export function getYearlyContributionDays(daysCount = 364) {
  const days = [];
  const today = new Date();
  // Align so the last day ends on the upcoming Saturday to make rectangular 7-day columns
  const dayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
  const offsetToSaturday = 6 - dayOfWeek;
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetToSaturday, 12, 0, 0);

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - i, 12, 0, 0);
    const dateStr = formatDate(d);
    days.push({
      dateStr,
      dayOfWeek: d.getDay(),
      month: d.getMonth(),
      day: d.getDate(),
      year: d.getFullYear(),
      isFuture: isFutureDate(dateStr),
    });
  }

  return days;
}
