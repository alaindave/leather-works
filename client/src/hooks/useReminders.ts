import { useCallback, useEffect, useRef, useState } from 'react';

export interface Reminder {
  id: string;
  note: string;
  scheduledTime: Date;
  createdAt: Date;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    // Load reminders from localStorage
    const stored = localStorage.getItem('reminders');
    return stored ? JSON.parse(stored) : [];
  });

  const remindersRef = useRef<Reminder[]>(reminders);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Update localStorage when reminders change
  useEffect(() => {
    remindersRef.current = reminders;
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check and trigger reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      remindersRef.current.forEach((reminder) => {
        const scheduledTime = new Date(reminder.scheduledTime);
        const timeDiff = scheduledTime.getTime() - now.getTime();

        // If time has come and reminder hasn't been triggered yet
        if (timeDiff <= 0 && timeDiff > -1000) {
          triggerNotification(reminder);
          removeReminder(reminder.id);
        }
      });
    };

    const interval = setInterval(checkReminders, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerNotification = useCallback((reminder: Reminder) => {
    // Use Electron API if available
    if (window.electronAPI) {
      window.electronAPI.showNotification({
        title: 'Note Reminder',
        body: reminder.note,
        silent: false,
      });
    } else {
      // Fallback to web notification API
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Note Reminder', {
          body: reminder.note,
          icon: '/favicon.ico',
        });
      }
    }

    // Remove the reminder after notification
    removeReminder(reminder.id);
  }, []);

  const addReminder = useCallback((note: string, scheduledTime: Date) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      note,
      scheduledTime,
      createdAt: new Date(),
    };
    setReminders((prev) => [...prev, newReminder]);
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
  }, []);

  const getAllReminders = useCallback(() => remindersRef.current, []);

  return {
    reminders,
    addReminder,
    removeReminder,
    getAllReminders,
  };
};
