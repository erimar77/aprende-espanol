'use client';

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/storage-keys';

/**
 * Manages browser notification permission + the user's preference for daily
 * Spanish-practice reminders. Returns the current permission, whether the
 * reminder is enabled, and a toggle that either requests permission or flips
 * the saved preference.
 */
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_REMINDER);
    if (saved === 'true') setReminderEnabled(true);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setReminderEnabled(true);
      localStorage.setItem(STORAGE_KEYS.DAILY_REMINDER, 'true');
      // Show confirmation
      new Notification('¡Perfecto! 🇪🇸', {
        body: "You'll get a daily reminder to practice Spanish.",
        icon: '/favicon.ico',
      });
    }
  }, []);

  const toggleReminder = useCallback(() => {
    if (reminderEnabled) {
      setReminderEnabled(false);
      localStorage.setItem(STORAGE_KEYS.DAILY_REMINDER, 'false');
    } else if (permission === 'granted') {
      setReminderEnabled(true);
      localStorage.setItem(STORAGE_KEYS.DAILY_REMINDER, 'true');
    } else {
      requestPermission();
    }
  }, [reminderEnabled, permission, requestPermission]);

  return { permission, reminderEnabled, toggleReminder };
}

/**
 * Schedules a periodic check (every 2 hours, plus a 5-second post-mount kick)
 * that fires a browser notification if the user has not yet practiced today
 * and the time-of-day is within practice hours. Caller passes `enabled` so
 * the hook respects the user's preference and bails out when notifications
 * are turned off or permission isn't granted.
 */
export function useDailyNotificationCheck(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const checkAndNotify = () => {
      const lastPractice = localStorage.getItem(STORAGE_KEYS.LAST_DAILY_PRACTICE);
      const today = new Date().toISOString().slice(0, 10);
      if (lastPractice !== today) {
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 21) {
          new Notification('¡Hora de practicar! 🇪🇸', {
            body: 'Your daily Spanish practice is waiting. Just 5 minutes!',
            icon: '/favicon.ico',
            tag: 'daily-spanish-reminder',
          });
        }
      }
    };

    const interval = setInterval(checkAndNotify, 2 * 60 * 60 * 1000);
    const timeout = setTimeout(checkAndNotify, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [enabled]);
}
