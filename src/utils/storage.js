/**
 * Persistent localStorage management with error recovery,
 * export/import capabilities, and initial data seeding.
 */

import { INITIAL_SAMPLE_HABITS } from './constants';
import { formatDate, parseDate, getTodayDateStr } from './dateUtils';
import { isHabitScheduledOn } from './streakUtils';

export const STORAGE_KEYS = {
  HABITS: 'habitflow_habits_v1',
  LOGS: 'habitflow_logs_v1',
  THEME: 'habitflow_theme_v1',
  FIRST_LAUNCH: 'habitflow_initialized_v1',
};

/**
 * Generate initial sample completion logs for the past 14 days
 * so the initial experience has rich visual streaks, calendar checkmarks, and heatmap data.
 */
function generateInitialSampleLogs(habits) {
  const logs = {};
  const today = parseDate(getTodayDateStr());

  // Populate realistic completions for past 14 days
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);

    logs[dateStr] = {};

    habits.forEach((habit) => {
      if (isHabitScheduledOn(habit, dateStr)) {
        // High consistency with occasional rest
        // Coding: almost every day
        // Exercise: on its scheduled days
        // Reading: everyday except maybe 1 day
        const dayNum = d.getDate();
        let isDone = true;
        if (habit.id === 'habit-2-study' && dayNum % 5 === 0) {
          isDone = false; // realistic occasional miss
        } else if (habit.id === 'habit-5-video' && i === 12) {
          isDone = false;
        } else if (i === 0 && habit.id === 'habit-5-video') {
          // Today not done yet for some habits so user can test checking them off!
          isDone = false;
        } else if (i === 0 && habit.id === 'habit-3-reading') {
          isDone = false;
        }
        if (isDone) {
          logs[dateStr][habit.id] = true;
        }
      }
    });
  }

  return logs;
}

/**
 * Safely load habits from localStorage
 */
export function loadStoredHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) {
      // First launch: initialize with sample habits
      saveStoredHabits(INITIAL_SAMPLE_HABITS);
      return INITIAL_SAMPLE_HABITS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_HABITS;
  } catch (err) {
    console.error('Failed to parse habits from localStorage:', err);
    return INITIAL_SAMPLE_HABITS;
  }
}

/**
 * Safely save habits to localStorage
 */
export function saveStoredHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error('Failed to save habits to localStorage:', err);
  }
}

/**
 * Safely load logs from localStorage
 */
export function loadStoredLogs(habits) {
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);

    if (!isInit || !raw) {
      const initialLogs = generateInitialSampleLogs(habits || INITIAL_SAMPLE_HABITS);
      saveStoredLogs(initialLogs);
      localStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'true');
      return initialLogs;
    }

    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (err) {
    console.error('Failed to parse logs from localStorage:', err);
    return {};
  }
}

/**
 * Safely save logs to localStorage
 */
export function saveStoredLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to localStorage:', err);
  }
}

/**
 * Safely load theme preference
 */
export function loadStoredTheme() {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

/**
 * Safely save theme
 */
export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
}

/**
 * Export all habit and log data as a JSON file download
 */
export function exportDataAsJSON(habits, logs) {
  const exportPayload = {
    appName: 'HabitFlow',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    habits,
    logs,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportPayload, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `habitflow-backup-${getTodayDateStr()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validate imported data structure
 */
export function validateImportedData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, message: 'Invalid file: Content must be a JSON object.' };
  }

  if (!Array.isArray(data.habits)) {
    return { valid: false, message: 'Invalid format: Missing "habits" array in file.' };
  }

  if (!data.logs || typeof data.logs !== 'object' || Array.isArray(data.logs)) {
    return { valid: false, message: 'Invalid format: Missing or invalid "logs" object in file.' };
  }

  // Validate each habit
  for (const habit of data.habits) {
    if (!habit.id || !habit.name) {
      return { valid: false, message: 'Invalid habit format: Each habit must have an id and name.' };
    }
    if (!Array.isArray(habit.scheduledDays)) {
      habit.scheduledDays = [0, 1, 2, 3, 4, 5, 6];
    }
  }

  return { valid: true, habits: data.habits, logs: data.logs };
}

/**
 * Reset all data to fresh state
 */
export function resetAllStorage() {
  try {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.FIRST_LAUNCH);
    localStorage.removeItem(STORAGE_KEYS.THEME);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
