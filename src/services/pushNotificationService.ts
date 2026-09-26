// Clean Client-side Web Push Notification Manager for GIX CHATS

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface PushStatus {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  isSubscribed: boolean;
  subscription: PushSubscription | null;
}

export const PUSH_STORAGE_KEYS = {
  HAS_PROMPTED: 'gix_notification_prompt_shown_v3',
  DISMISSED_AT: 'gix_notification_dismissed_timestamp_v3',
};

// Play audio chime when allowed
export function playChimeSound(): void {
  try {
    const audio = new Audio('/notification.wav');
    audio.volume = 0.8;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  public async getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) return null;
    if (this.swRegistration) return this.swRegistration;

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
      return this.swRegistration;
    } catch (err) {
      console.warn('[PUSH] Service Worker registration error:', err);
      return null;
    }
  }

  public async getStatus(): Promise<PushStatus> {
    if (!this.isSupported()) {
      return {
        supported: false,
        permission: 'unsupported',
        isSubscribed: false,
        subscription: null,
      };
    }

    const permission = Notification.permission;
    let subscription: PushSubscription | null = null;
    let isSubscribed = false;

    try {
      const reg = await this.getServiceWorkerRegistration();
      if (reg) {
        subscription = await reg.pushManager.getSubscription();
        isSubscribed = !!subscription;
      }
    } catch (err) {
      console.warn('[PUSH] Error checking push status:', err);
    }

    return {
      supported: true,
      permission,
      isSubscribed,
      subscription,
    };
  }

  public async subscribeUser(language = 'sw'): Promise<{
    success: boolean;
    permission: NotificationPermission | 'unsupported';
    isBlocked?: boolean;
    message?: string;
  }> {
    if (!this.isSupported()) {
      return {
        success: false,
        permission: 'unsupported',
        message: 'Web Push is not supported in this browser.',
      };
    }

    // If permission is already DENIED, do not repeatedly call requestPermission()
    if (Notification.permission === 'denied') {
      return {
        success: false,
        permission: 'denied',
        isBlocked: true,
        message: 'Notifications zimezuiwa na browser. Tafadhali ziwezeshe kwenye Chrome Site Settings.',
      };
    }

    try {
      // 1. Request real browser notification permission (only on explicit user click)
      const permission = await Notification.requestPermission();
      localStorage.setItem(PUSH_STORAGE_KEYS.HAS_PROMPTED, 'true');

      if (permission !== 'granted') {
        return {
          success: false,
          permission,
          isBlocked: permission === 'denied',
          message: permission === 'denied'
            ? 'Notifications zimezuiwa na browser.'
            : 'Permission haijatolewa.',
        };
      }

      // 2. Fetch VAPID Public Key from backend
      const keyRes = await fetch('/api/push/public-key');
      if (!keyRes.ok) {
        throw new Error('Failed to fetch public VAPID key');
      }
      const { publicKey } = await keyRes.json();
      if (!publicKey) {
        throw new Error('Public VAPID key is empty');
      }

      // 3. Ensure Service Worker is registered and active
      const reg = await this.getServiceWorkerRegistration();
      if (!reg) {
        throw new Error('Could not initialize Service Worker');
      }

      // 4. Create real PushSubscription with applicationServerKey
      const convertedKey = urlBase64ToUint8Array(publicKey);
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      }

      // 5. Send PushSubscription to backend database
      const subRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
          language,
        }),
      });

      if (!subRes.ok) {
        throw new Error('Server failed to store push subscription');
      }

      // 6. Trigger immediate real mobile push notification from backend
      await fetch('/api/push/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      }).catch((err) => console.warn('[PUSH] Welcome push send warning:', err));

      playChimeSound();

      return {
        success: true,
        permission: 'granted',
        message: 'Notifications zimewashwa na ujumbe wa kwanza umetumwa kwenye simu yako!',
      };
    } catch (err: any) {
      console.error('[PUSH] Subscription error:', err);
      return {
        success: false,
        permission: Notification.permission,
        message: err.message || 'Error subscribing to web push',
      };
    }
  }

  public async unsubscribeUser(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const reg = await this.getServiceWorkerRegistration();
      if (!reg) return false;

      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => {});

        await subscription.unsubscribe();
      }
      return true;
    } catch (err) {
      console.error('[PUSH] Unsubscribe error:', err);
      return false;
    }
  }

  public shouldShowInitialPrompt(): boolean {
    if (!this.isSupported()) return false;
    // If user already granted or denied permission, never show the prompt
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return false;
    }

    const hasPrompted = localStorage.getItem(PUSH_STORAGE_KEYS.HAS_PROMPTED);
    return hasPrompted !== 'true';
  }

  public dismissInitialPrompt(): void {
    localStorage.setItem(PUSH_STORAGE_KEYS.HAS_PROMPTED, 'true');
    localStorage.setItem(PUSH_STORAGE_KEYS.DISMISSED_AT, Date.now().toString());
  }
}

export const pushService = PushNotificationService.getInstance();
