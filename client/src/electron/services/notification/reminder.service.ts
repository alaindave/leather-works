import { Notification } from "electron";

export interface Reminder {
  id: string;
  message: string;
  remindAt: string;
}

const reminders = new Map<string, NodeJS.Timeout>();

export function scheduleReminder(message: string, remindAt: Date): Reminder {
  if (!message.trim()) {
    throw new Error("Reminder message cannot be empty");
  }

  const id = crypto.randomUUID();

  const delay = remindAt.getTime() - Date.now();

  if (delay <= 0) {
    throw new Error("Reminder time must be in the future");
  }

  const timeout = setTimeout(() => {
    const notification = new Notification({
      title: "LeatherWorks Rappel",
      body: message.trim(),
      silent: false,
    });

    notification.show();

    reminders.delete(id);
  }, delay);

  reminders.set(id, timeout);

  return {
    id,
    message: message.trim(),
    remindAt: remindAt.toISOString(),
  };
}

export function cancelReminder(id: string): boolean {
  const timeout = reminders.get(id);

  if (!timeout) {
    return false;
  }

  clearTimeout(timeout);
  reminders.delete(id);

  return true;
}

export function cancelAllReminders(): void {
  for (const timeout of reminders.values()) {
    clearTimeout(timeout);
  }

  reminders.clear();
}
