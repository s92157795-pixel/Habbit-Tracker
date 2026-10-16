import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  loadStoredHabits,
  saveStoredHabits,
  loadStoredLogs,
  saveStoredLogs,
  loadStoredTheme,
  saveStoredTheme,
  exportDataAsJSON,
  validateImportedData,
  resetAllStorage,
} from '../utils/storage';
import { getTodayDateStr } from '../utils/dateUtils';
import {
  calculateHabitStreaks,
  getDailyStats,
  isHabitScheduledOn,
} from '../utils/streakUtils';
import { INITIAL_SAMPLE_HABITS } from '../utils/constants';
import { sendHabitNotification } from '../utils/notifications';

export function useHabits() {
  const [habits, setHabits] = useState(() => loadStoredHabits());
  const [logs, setLogs] = useState(() => loadStoredLogs(habits));
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateStr());
  const [theme, setThemeState] = useState(() => loadStoredTheme());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [toast, setToast] = useState(null);

  // Apply theme class to document
  useEffect(() => {
    saveStoredTheme(theme);
  }, [theme]);

  // Synchronize habits to localStorage
  useEffect(() => {
    saveStoredHabits(habits);
  }, [habits]);

  // Synchronize logs to localStorage
  useEffect(() => {
    saveStoredLogs(logs);
  }, [logs]);

  // Toast notification helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Toggle habit completion on a specific date (defaults to selectedDate)
  const toggleHabitCompletion = useCallback(
    (habitId, targetDate = selectedDate) => {
      setLogs((prevLogs) => {
        const nextLogs = { ...prevLogs };
        const dayLogs = { ...(nextLogs[targetDate] || {}) };

        const currentlyCompleted = Boolean(dayLogs[habitId]);
        if (currentlyCompleted) {
          delete dayLogs[habitId];
        } else {
          dayLogs[habitId] = true;
        }

        nextLogs[targetDate] = dayLogs;
        return nextLogs;
      });

      // Quick feedback toast
      const habit = habits.find((h) => h.id === habitId);
      const habitName = habit ? habit.name : 'Habit';
      const isNowDone = !logs[targetDate]?.[habitId];

      if (isNowDone) {
        showToast(`Completed "${habitName}"! 🎯`, 'success');
      } else {
        showToast(`Marked "${habitName}" as pending`, 'info');
      }
    },
    [habits, logs, selectedDate, showToast]
  );

  // Add new habit
  const createHabit = useCallback(
    (habitData) => {
      const newHabit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: habitData.name.trim(),
        emoji: habitData.emoji || '🎯',
        description: habitData.description?.trim() || '',
        color: habitData.color || '#10b981',
        colorName: habitData.colorName || 'emerald',
        scheduleType: habitData.scheduleType || 'daily',
        scheduledDays: habitData.scheduledDays || [0, 1, 2, 3, 4, 5, 6],
        reminderTime: habitData.reminderTime || '',
        createdAt: getTodayDateStr(),
        archived: false,
      };

      setHabits((prev) => [newHabit, ...prev]);
      showToast(`Created habit: "${newHabit.name}"`, 'success');
    },
    [showToast]
  );

  // Update existing habit
  const updateHabit = useCallback(
    (habitId, habitData) => {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                name: habitData.name.trim(),
                emoji: habitData.emoji || h.emoji,
                description: habitData.description?.trim() || '',
                color: habitData.color || h.color,
                colorName: habitData.colorName || h.colorName,
                scheduleType: habitData.scheduleType || h.scheduleType,
                scheduledDays: habitData.scheduledDays || h.scheduledDays,
                reminderTime: habitData.reminderTime || '',
              }
            : h
        )
      );
      showToast('Habit updated successfully', 'success');
    },
    [showToast]
  );

  // Delete habit
  const deleteHabit = useCallback(
    (habitId) => {
      const targetHabit = habits.find((h) => h.id === habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));

      // Also clean up logs for this habit
      setLogs((prevLogs) => {
        const nextLogs = { ...prevLogs };
        for (const date in nextLogs) {
          if (nextLogs[date][habitId]) {
            const updatedDay = { ...nextLogs[date] };
            delete updatedDay[habitId];
            nextLogs[date] = updatedDay;
          }
        }
        return nextLogs;
      });

      showToast(`Deleted habit "${targetHabit?.name || 'Habit'}"`, 'info');
    },
    [habits, showToast]
  );

  // Archive / Unarchive habit
  const toggleArchiveHabit = useCallback(
    (habitId) => {
      let isNowArchived = false;
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id === habitId) {
            isNowArchived = !h.archived;
            return { ...h, archived: !h.archived };
          }
          return h;
        })
      );
      showToast(
        isNowArchived ? 'Habit archived' : 'Habit restored to active',
        'info'
      );
    },
    [showToast]
  );

  // Export data
  const exportData = useCallback(() => {
    exportDataAsJSON(habits, logs);
    showToast('Habit data exported successfully! 📁', 'success');
  }, [habits, logs, showToast]);

  // Import data
  const importData = useCallback(
    (importedJson) => {
      const validation = validateImportedData(importedJson);
      if (!validation.valid) {
        showToast(validation.message, 'error');
        return false;
      }

      setHabits(validation.habits);
      setLogs(validation.logs);
      showToast('Habit data imported successfully! 🎉', 'success');
      return true;
    },
    [showToast]
  );

  // Add a starter habit template with one click
  const addStarterHabit = useCallback(
    (template) => {
      const newHabit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: template.name.trim(),
        emoji: template.emoji || '🎯',
        description: template.description?.trim() || '',
        color: template.color || '#10b981',
        colorName: template.colorName || 'emerald',
        scheduleType: template.scheduleType || 'daily',
        scheduledDays: template.scheduledDays || [0, 1, 2, 3, 4, 5, 6],
        reminderTime: template.reminderTime || '',
        createdAt: getTodayDateStr(),
        archived: false,
      };

      setHabits((prev) => [newHabit, ...prev]);
      showToast(`Added habit "${newHabit.name}"! 🎯`, 'success');
    },
    [showToast]
  );

  // Reset all data to clean slate
  const resetData = useCallback(() => {
    resetAllStorage();
    setHabits([]);
    setLogs({});
    showToast('Reset all habit data to clean initial state', 'info');
  }, [showToast]);

  // Check background habit reminder times every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayStr = getTodayDateStr();

      habits.forEach((habit) => {
        if (
          !habit.archived &&
          habit.reminderTime === currentTimeStr &&
          isHabitScheduledOn(habit, todayStr) &&
          !logs[todayStr]?.[habit.id]
        ) {
          sendHabitNotification(habit);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [habits, logs]);

  // Computed values
  const todayStr = getTodayDateStr();

  const activeHabits = useMemo(
    () => habits.filter((h) => !h.archived),
    [habits]
  );

  const archivedHabits = useMemo(
    () => habits.filter((h) => h.archived),
    [habits]
  );

  const todayStats = useMemo(
    () => getDailyStats(todayStr, habits, logs),
    [todayStr, habits, logs]
  );

  const selectedDateStats = useMemo(
    () => getDailyStats(selectedDate, habits, logs),
    [selectedDate, habits, logs]
  );

  const habitStreaks = useMemo(() => {
    const map = {};
    habits.forEach((h) => {
      map[h.id] = calculateHabitStreaks(h, logs);
    });
    return map;
  }, [habits, logs]);

  const bestStreak = useMemo(() => {
    let best = 0;
    activeHabits.forEach((h) => {
      const streakInfo = habitStreaks[h.id];
      if (streakInfo && streakInfo.currentStreak > best) {
        best = streakInfo.currentStreak;
      }
    });
    return best;
  }, [activeHabits, habitStreaks]);

  return {
    habits,
    activeHabits,
    archivedHabits,
    logs,
    selectedDate,
    setSelectedDate,
    todayStr,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    editingHabit,
    setEditingHabit,
    toast,
    showToast,
    closeToast,
    toggleHabitCompletion,
    createHabit,
    addStarterHabit,
    updateHabit,
    deleteHabit,
    toggleArchiveHabit,
    exportData,
    importData,
    resetData,
    todayStats,
    selectedDateStats,
    habitStreaks,
    bestStreak,
  };
}
