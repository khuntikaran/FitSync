export interface LocalNotificationPayload {
  title: string;
  message: string;
  date: Date;
}

export interface NotificationAdapter {
  schedule: (payload: LocalNotificationPayload) => Promise<void>;
  cancelAll: () => Promise<void>;
}

class NoopNotificationAdapter implements NotificationAdapter {
  async schedule(): Promise<void> {
    return;
  }

  async cancelAll(): Promise<void> {
    return;
  }
}

export class NotificationService {
  private static adapter: NotificationAdapter = new NoopNotificationAdapter();

  static setAdapter(adapter: NotificationAdapter): void {
    NotificationService.adapter = adapter;
  }

  static async scheduleRestTimer(seconds: number): Promise<void> {
    const delayMs = Math.max(1, seconds) * 1000;

    await NotificationService.adapter.schedule({
      title: 'Rest Complete! 💪',
      message: 'Time for your next set',
      date: new Date(Date.now() + delayMs),
    });
  }

  static async cancelAll(): Promise<void> {
    await NotificationService.adapter.cancelAll();
  }
}
