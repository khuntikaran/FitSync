import { LocalNotificationPayload, NotificationAdapter } from '../NotificationService';

interface PushNotificationModule {
  localNotificationSchedule: (payload: {
    channelId: string;
    title: string;
    message: string;
    date: Date;
    playSound: boolean;
    soundName: string;
    vibrate: boolean;
    vibration: number;
  }) => void;
  cancelAllLocalNotifications: () => void;
}

export class ReactNativePushNotificationAdapter implements NotificationAdapter {
  constructor(private readonly pushNotification: PushNotificationModule) {}

  async schedule(payload: LocalNotificationPayload): Promise<void> {
    this.pushNotification.localNotificationSchedule({
      channelId: 'rest-timer',
      title: payload.title,
      message: payload.message,
      date: payload.date,
      playSound: true,
      soundName: 'default',
      vibrate: true,
      vibration: 500,
    });
  }

  async cancelAll(): Promise<void> {
    this.pushNotification.cancelAllLocalNotifications();
  }
}
