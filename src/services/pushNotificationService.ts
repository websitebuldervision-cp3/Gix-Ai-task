// Client-side Web Push Notification Manager for GIX CHATS

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
  HAS_PROMPTED: 'gix_notification_prompt_shown_v2',
  DISMISSED_AT: 'gix_notification_dismissed_timestamp',
  IS_ENABLED: 'gix_notification_user_enabled',
};

// Play audio chime using Web Audio API or audio element
export function playChimeSound(): void {
  try {
    const audio = new Audio('/notification.wav');
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Fallback to Web Audio synthesis if file play is blocked
      playSyntheticChime();
    });
  } catch {
    playSyntheticChime();
  }
}

function playSyntheticChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Dual-tone chime: D5 then A5
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15); // A5
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
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
      console.warn('[PUSH] SW registration error:', err);
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
      console.warn('[PUSH] Error getting push status:', err);
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
    permission: NotificationPermission;
    message?: string;
  }> {
    if (!this.isSupported()) {
      return {
        success: false,
        permission: 'denied',
        message: 'Web Push is not supported in this browser.',
      };
    }

    try {
      // 1. Request Browser Permission
      const permission = await Notification.requestPermission();
      localStorage.setItem(PUSH_STORAGE_KEYS.HAS_PROMPTED, 'true');

      if (permission !== 'granted') {
        localStorage.setItem(PUSH_STORAGE_KEYS.IS_ENABLED, 'false');
        return {
          success: false,
          permission,
          message: 'Permission was not granted.',
        };
      }

      // 2. Fetch VAPID Public Key from server
      const keyRes = await fetch('/api/push/public-key');
      if (!keyRes.ok) {
        throw new Error('Failed to fetch public key from server');
      }
      const { publicKey } = await keyRes.json();
      if (!publicKey) {
        throw new Error('Server returned empty public VAPID key');
      }

      // 3. Register & wait for Service Worker
      const reg = await this.getServiceWorkerRegistration();
      if (!reg) {
        throw new Error('Service Worker failed to register');
      }

      // 4. Create PushSubscription via PushManager
      const convertedKey = urlBase64ToUint8Array(publicKey);
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      }

      // 5. Send subscription to backend
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
        throw new Error('Failed to register subscription with server');
      }

      localStorage.setItem(PUSH_STORAGE_KEYS.IS_ENABLED, 'true');

      // 6. Send the First Welcome Notification immediately
      fetch('/api/push/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      }).catch((err) => console.warn('[PUSH] Welcome notification trigger failed:', err));

      // Play local sound and haptic feedback
      playChimeSound();
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      return {
        success: true,
        permission: 'granted',
        message: 'Notification permission granted and subscribed successfully!',
      };
    } catch (err: any) {
      console.error('[PUSH] Subscription error:', err);
      return {
        success: false,
        permission: Notification.permission,
        message: err.message || 'Error subscribing to notifications',
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
        // Notify server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => {});

        // Unsubscribe locally
        await subscription.unsubscribe();
      }

      localStorage.setItem(PUSH_STORAGE_KEYS.IS_ENABLED, 'false');
      return true;
    } catch (err) {
      console.error('[PUSH] Unsubscribe error:', err);
      return false;
    }
  }

  public async sendTestNotification(): Promise<{ success: boolean; message: string }> {
    try {
      const status = await this.getStatus();
      if (!status.isSubscribed || !status.subscription) {
        return {
          success: false,
          message: 'Hujajiandikisha bado. Tafadhali washa notifications kwanza.',
        };
      }

      const res = await fetch('/api/push/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: status.subscription }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playChimeSound();
        return {
          success: true,
          message: 'Notification ya majaribio imetumwa kwa mafanikio kwenye kifaa chako!',
        };
      } else {
        return {
          success: false,
          message: data.error || 'Imeshindwa kutuma notification ya majaribio.',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Hitilafu ya mtandao wakati wa kutuma jaribio.',
      };
    }
  }

  public shouldShowInitialPrompt(): boolean {
    return false; // Auto-permission handled seamlessly without intrusive prompt
  }

  public dismissInitialPrompt(): void {
    localStorage.setItem(PUSH_STORAGE_KEYS.HAS_PROMPTED, 'true');
    localStorage.setItem(PUSH_STORAGE_KEYS.DISMISSED_AT, Date.now().toString());
  }

  public initAutoPermission(language = 'sw'): void {
    if (!this.isSupported()) return;

    const attemptAutoSubscribe = async () => {
      try {
        if (Notification.permission === 'granted') {
          await this.subscribeUser(language);
          return;
        }

        if (Notification.permission === 'default') {
          // Attempt immediate request
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            await this.subscribeUser(language);
          }
        }
      } catch (e) {
        // Quietly handle browser restrictions
      }
    };

    // 1. Try immediately on load
    attemptAutoSubscribe();

    // 2. Attach one-time listener to the first tap/click anywhere on the screen
    const onFirstUserGesture = () => {
      attemptAutoSubscribe();
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('touchstart', onFirstUserGesture);
      window.removeEventListener('keydown', onFirstUserGesture);
    };

    window.addEventListener('click', onFirstUserGesture, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstUserGesture, { once: true, passive: true });
    window.addEventListener('keydown', onFirstUserGesture, { once: true, passive: true });
  }
}

export const pushService = PushNotificationService.getInstance();
