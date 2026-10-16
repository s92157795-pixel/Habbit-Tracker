/**
 * Constants, default options, and initial sample habits
 */

export const HABIT_COLORS = [
  { id: 'emerald', name: 'Emerald', hex: '#10b981', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  { id: 'blue', name: 'Ocean Blue', hex: '#0284c7', bg: 'bg-sky-600', lightBg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800' },
  { id: 'indigo', name: 'Royal Indigo', hex: '#6366f1', bg: 'bg-indigo-500', lightBg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' },
  { id: 'violet', name: 'Purple Violet', hex: '#8b5cf6', bg: 'bg-purple-500', lightBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' },
  { id: 'amber', name: 'Golden Amber', hex: '#f59e0b', bg: 'bg-amber-500', lightBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  { id: 'rose', name: 'Crimson Rose', hex: '#f43f5e', bg: 'bg-rose-500', lightBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
  { id: 'teal', name: 'Teal Forest', hex: '#14b8a6', bg: 'bg-teal-500', lightBg: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800' },
  { id: 'orange', name: 'Sunset Orange', hex: '#f97316', bg: 'bg-orange-500', lightBg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800' },
];

export const HABIT_EMOJIS = [
  '💻', '📚', '📖', '🏃', '🎬', '💧', '🧘', '🥗',
  '🏋️', '🧠', '✍️', '🎨', '🎯', '🛌', '🚶', '🌱',
  '🎸', '⚡', '☕', '🌟'
];

export const SCHEDULE_TYPES = {
  DAILY: 'daily',
  WEEKDAYS_ONLY: 'weekdays',
  WEEKENDS_ONLY: 'weekends',
  CUSTOM: 'custom',
};

export const INITIAL_SAMPLE_HABITS = [
  {
    id: 'habit-1-coding',
    name: 'Coding Practice',
    emoji: '💻',
    description: 'Solve 1 algorithmic problem or build project features',
    color: '#6366f1', // Indigo
    colorName: 'indigo',
    scheduleType: 'daily',
    scheduledDays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    reminderTime: '09:00',
    createdAt: '2026-10-01',
    archived: false,
  },
  {
    id: 'habit-2-study',
    name: 'Study',
    emoji: '📚',
    description: 'Review coursework, articles, or technical documentation',
    color: '#0284c7', // Sky Blue
    colorName: 'blue',
    scheduleType: 'custom',
    scheduledDays: [1, 2, 3, 4, 5], // Mon-Fri
    reminderTime: '14:00',
    createdAt: '2026-10-01',
    archived: false,
  },
  {
    id: 'habit-3-reading',
    name: 'Read 10 Pages',
    emoji: '📖',
    description: 'Non-fiction book or insightful literature',
    color: '#f59e0b', // Amber
    colorName: 'amber',
    scheduleType: 'daily',
    scheduledDays: [0, 1, 2, 3, 4, 5, 6], // Everyday
    reminderTime: '21:30',
    createdAt: '2026-10-01',
    archived: false,
  },
  {
    id: 'habit-4-exercise',
    name: 'Exercise',
    emoji: '🏃',
    description: 'Gym workout, running, stretching, or brisk walk',
    color: '#10b981', // Emerald
    colorName: 'emerald',
    scheduleType: 'custom',
    scheduledDays: [1, 3, 5, 6], // Mon, Wed, Fri, Sat
    reminderTime: '07:30',
    createdAt: '2026-10-01',
    archived: false,
  },
  {
    id: 'habit-5-video',
    name: 'Upload Video',
    emoji: '🎬',
    description: 'Edit, polish, and publish weekly video content',
    color: '#f43f5e', // Rose
    colorName: 'rose',
    scheduleType: 'custom',
    scheduledDays: [2, 4, 0], // Tue, Thu, Sun
    reminderTime: '17:00',
    createdAt: '2026-10-01',
    archived: false,
  },
];

/**
 * Motivational encouraging messages based on daily progress percentage
 * Never shaming, always constructive and uplifting
 */
export function getMotivationalMessage(percentage, completedCount, totalCount) {
  if (totalCount === 0) {
    return {
      title: 'No habits scheduled for today',
      message: 'Enjoy your rest day or add a new habit whenever you are ready.',
      type: 'neutral',
    };
  }

  if (percentage === 100) {
    return {
      title: 'Flawless day! All habits complete! 🎉',
      message: `You crushed all ${totalCount} scheduled goals today. Outstanding consistency!`,
      type: 'success',
    };
  }

  if (percentage >= 75) {
    return {
      title: 'Almost at the finish line! 🚀',
      message: `You have completed ${completedCount} of ${totalCount} habits. Finish strong today!`,
      type: 'high',
    };
  }

  if (percentage >= 40) {
    return {
      title: 'Solid momentum building! ⚡',
      message: `${completedCount} habits done today. Keep taking it step by step.`,
      type: 'medium',
    };
  }

  if (completedCount > 0) {
    return {
      title: 'Off to a great start! 🌱',
      message: `First habit checked off. Every small win sets the rhythm for the rest of your day.`,
      type: 'starting',
    };
  }

  return {
    title: 'Ready to build better habits today? ✨',
    message: 'Take a deep breath and start with your first quick win. Consistency beats intensity.',
    type: 'initial',
  };
}
