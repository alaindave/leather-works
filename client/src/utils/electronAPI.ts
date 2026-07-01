// Electron API utilities for desktop notifications
export interface NotificationOptions {
  title: string;
  body: string;
  silent?: boolean;
}

export const isElectronEnvironment = (): boolean => {
  return !!(window as any).electronAPI;
};

export const showNativeNotification = (options: NotificationOptions): void => {
  const electronAPI = (window as any).electronAPI;
  if (electronAPI) {
    electronAPI.showNotification(options);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  }
  return false;
};
