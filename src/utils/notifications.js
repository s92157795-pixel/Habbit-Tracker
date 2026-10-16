/**
 * Browser Notification Helper
 * Only triggers if Web Notifications API is supported and permission is explicitly granted.
 */

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'granted', 'denied', or 'default'
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    return { granted: false, reason: 'unsupported' };
  }

  try {
    const permission = await Notification.requestPermission();
    return {
      granted: permission === 'granted',
      permission,
    };
  } catch (error) {
    console.warn('Error requesting notification permission:', error);
    return { granted: false, reason: 'error', error };
  }
}

export function sendHabitNotification(habit) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(`Reminder: ${habit.name}`, {
      body: habit.description || `It is time for your scheduled habit: ${habit.name}`,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"><circle cx="12" cy="12" r="10"/></svg>',
      tag: `habit-reminder-${habit.id}`,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.error('Failed to trigger notification:', err);
    return false;
  }
}
