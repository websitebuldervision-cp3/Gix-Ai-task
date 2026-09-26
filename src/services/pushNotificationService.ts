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
  isInIframe: boolean;
  subscription: PushSubscription | null;
}

export const PUSH_STORAGE_KEYS = {
  HAS_PROMPTED_SESSION: 'gix_notification_prompt_dismissed_session',
  LAST_ENTRY_NOTIFICATION: 'gix_last_entry_notification_ts',
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
  private isSyncingOnEntry = false;

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

  public isInIframe(): boolean {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
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
        isInIframe: this.isInIframe(),
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
      isInIframe: this.isInIframe(),
      subscription,
    };
  }

  public async subscribeUser(language = 'sw'): Promise<{
    success: boolean;
    permission: NotificationPermission | 'unsupported';
    isBlocked?: boolean;
    isInIframe?: boolean;
    message?: string;
  }> {
    if (!this.isSupported()) {
      return {
        success: false,
        permission: 'unsupported',
        message: 'Web Push is not supported in this browser.',
      };
    }

    try {
      // 1. Request real browser notification permission (only on explicit user click)
      const permission = await Notification.requestPermission();
      sessionStorage.setItem(PUSH_STORAGE_KEYS.HAS_PROMPTED_SESSION, 'true');

      if (permission !== 'granted') {
        return {
          success: false,
          permission,
          isBlocked: permission === 'denied',
          message: permission === 'denied'
            ? 'Notifications zimezuiwa na browser.'
            : 'Permission haijatolewa na mtumiaji.',
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

      // 4. Clean up any stale subscription from previous VAPID key mismatch
      const convertedKey = urlBase64ToUint8Array(publicKey);
      let existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        try {
          await existingSub.unsubscribe();
        } catch {
          // ignore
        }
      }

      // 5. Create fresh PushSubscription with active applicationServerKey
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      const subJson = subscription.toJSON();

      // 6. Send PushSubscription to backend database
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subJson,
          userAgent: navigator.userAgent,
          language,
        }),
      });

      // 7. Show immediate local Service Worker notification on Android notification drawer
      try {
        if ('showNotification' in reg) {
          await reg.showNotification('🤖 GIX CHATS', {
            body: 'Karibu GIX CHATS! Fungua account yako na uanze AI Jobs kwa Kiswahili. 💰',
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: 'gix-welcome-first',
            renotify: true,
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 300],
            data: { url: '/?tab=account', target: 'account' },
            actions: [
              { action: 'open_account', title: '👉 Fungua Account (15,000 TSh)' },
              { action: 'dismiss', title: 'Baadaye' },
            ],
          } as NotificationOptions);
        }
      } catch (swErr) {
        console.warn('[SW] showNotification warning:', swErr);
      }

      // 8. Trigger backend push notification to phone
      await fetch('/api/push/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subJson }),
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

  // Auto-sync on site entry: If user already has permission granted, make sure they are subscribed and send arrival alert
  public async syncOnEntry(language = 'sw'): Promise<void> {
    if (!this.isSupported() || this.isInIframe()) return;
    if (Notification.permission !== 'granted') return;
    if (this.isSyncingOnEntry) return;

    this.isSyncingOnEntry = true;
    try {
      const reg = await this.getServiceWorkerRegistration();
      if (!reg) return;

      let subscription = await reg.pushManager.getSubscription();

      // If not subscribed yet even though permission is granted, subscribe now
      if (!subscription) {
        const keyRes = await fetch('/api/push/public-key');
        if (keyRes.ok) {
          const { publicKey } = await keyRes.json();
          if (publicKey) {
            subscription = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey),
            });
          }
        }
      }

      if (subscription) {
        const subJson = subscription.toJSON();
        // Sync to backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: subJson,
            userAgent: navigator.userAgent,
            language,
          }),
        });

        // Send an entry notification if it has been more than 30 minutes since the last one
        const lastEntryTs = parseInt(sessionStorage.getItem(PUSH_STORAGE_KEYS.LAST_ENTRY_NOTIFICATION) || '0', 10);
        const now = Date.now();
        if (now - lastEntryTs > 1000 * 60 * 30) {
          sessionStorage.setItem(PUSH_STORAGE_KEYS.LAST_ENTRY_NOTIFICATION, now.toString());

          // Show on phone
          if ('showNotification' in reg) {
            reg.showNotification('🤖 GIX CHATS', {
              body: 'Karibu tena GIX CHATS! AI Jobs zinakusubiri leo. Fungua account kwa 15,000 TSh na uanze. 💰',
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: 'gix-entry-' + Math.floor(now / (1000 * 60 * 30)),
              renotify: true,
              vibrate: [200, 100, 200, 100, 300],
              data: { url: '/?tab=account', target: 'account' },
            } as NotificationOptions).catch(() => {});
          }

          // Also trigger backend push
          fetch('/api/push/send-welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: subJson }),
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('[PUSH] syncOnEntry warning:', err);
    } finally {
      this.isSyncingOnEntry = false;
    }
  }

  public shouldShowInitialPrompt(): boolean {
    if (!this.isSupported()) return false;

    // If user already granted permission, no need to show the prompt again
    if (Notification.permission === 'granted') {
      return false;
    }

    // If dismissed in this session, don't show again this session
    const hasDismissedSession = sessionStorage.getItem(PUSH_STORAGE_KEYS.HAS_PROMPTED_SESSION);
    return hasDismissedSession !== 'true';
  }

  public dismissInitialPrompt(): void {
    sessionStorage.setItem(PUSH_STORAGE_KEYS.HAS_PROMPTED_SESSION, 'true');
  }

  public async sendTestNotification(): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) {
      return { success: false, message: 'Web Push haipatikani kwenye browser hii.' };
    }

    if (Notification.permission !== 'granted') {
      return { success: false, message: 'Tafadhali washa notifications kwanza.' };
    }

    try {
      const reg = await this.getServiceWorkerRegistration();
      if (!reg) {
        return { success: false, message: 'Service worker haijapatikana.' };
      }

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const keyRes = await fetch('/api/push/public-key');
        if (keyRes.ok) {
          const { publicKey } = await keyRes.json();
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });
        }
      }

      // 1. Show immediate local Service Worker notification
      if ('showNotification' in reg) {
        await reg.showNotification('🔔 GIX CHATS (Majaribio)', {
          body: 'Hongera! Notifications zinafanya kazi vizuri kwenye simu yako. Fungua account kwa 15,000 TSh uanze AI Jobs! 🚀',
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'gix-test-' + Date.now(),
          renotify: true,
          vibrate: [200, 100, 200, 100, 300],
          data: { url: '/?tab=account', target: 'account' },
        } as NotificationOptions);
      }

      // 2. Also send via backend push
      if (sub) {
        await fetch('/api/push/send-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub.toJSON() }),
        });
      }

      playChimeSound();
      return { success: true, message: 'Notification imetumwa kwenye simu yako!' };
    } catch (err: any) {
      console.error('[PUSH] sendTestNotification error:', err);
      return { success: false, message: err.message || 'Hitilafu wakati wa kutuma.' };
    }
  }
}

export const pushService = PushNotificationService.getInstance();
