import express from 'express';
import path from 'path';
import fs from 'fs';
import webpush from 'web-push';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json());

// -------------------------------------------------------------
// 1. VAPID KEYS SETUP (Auto-generate or use environment)
// -------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, 'data_storage');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const VAPID_FILE = path.join(DATA_DIR, 'vapid-keys.json');
const SUBS_FILE = path.join(DATA_DIR, 'subscriptions.json');

interface VapidKeys {
  publicKey: string;
  privateKey: string;
  subject: string;
}

function getOrGenerateVapidKeys(): VapidKeys {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
      subject: process.env.VAPID_SUBJECT || 'mailto:support@gixchat.com',
    };
  }

  if (fs.existsSync(VAPID_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf-8'));
      if (data.publicKey && data.privateKey) {
        return data;
      }
    } catch (e) {
      console.warn('[VAPID] Error reading vapid-keys.json, regenerating...', e);
    }
  }

  // Generate new keys
  const keys = webpush.generateVAPIDKeys();
  const vapidData: VapidKeys = {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    subject: process.env.VAPID_SUBJECT || 'mailto:support@gixchat.com',
  };

  fs.writeFileSync(VAPID_FILE, JSON.stringify(vapidData, null, 2), 'utf-8');
  console.log('[VAPID] Generated new VAPID keys and saved to', VAPID_FILE);
  return vapidData;
}

const vapid = getOrGenerateVapidKeys();
webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);

// -------------------------------------------------------------
// 2. SUBSCRIPTIONS PERSISTENCE
// -------------------------------------------------------------
interface PushSub {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt?: string;
  updatedAt?: string;
  userAgent?: string;
  language?: string;
}

function loadSubscriptions(): PushSub[] {
  if (!fs.existsSync(SUBS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(SUBS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[DB] Error loading subscriptions:', err);
    return [];
  }
}

function saveSubscriptions(subs: PushSub[]): void {
  try {
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error saving subscriptions:', err);
  }
}

// -------------------------------------------------------------
// 3. ROTATING NOTIFICATION MESSAGES (Africa/Dar_es_Salaam)
// -------------------------------------------------------------
interface NotificationPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
  icon?: string;
  badge?: string;
  target?: string;
}

const MORNING_MESSAGES: Omit<NotificationPayload, 'url' | 'tag'>[] = [
  {
    title: '🤖 GIX CHATS',
    body: 'AI Jobs zinakusubiri leo. Fungua GIX CHATS na anza.',
  },
  {
    title: '🔔 GIX CHATS',
    body: 'Usikose taarifa za AI Jobs. Fungua site yako sasa.',
  },
  {
    title: '🌅 GIX CHATS',
    body: 'Usikose AI Jobs za leo. Fungua account yako kwa 15,000 TSh na uanze.',
  },
];

const AFTERNOON_MESSAGES: Omit<NotificationPayload, 'url' | 'tag'>[] = [
  {
    title: '💻 GIX CHATS',
    body: 'Karibu tena! Fungua account yako na fuata hatua za kuanza.',
  },
  {
    title: '🚀 GIX CHATS',
    body: 'Anza leo na ujifunze jinsi ya kufanya AI Jobs kwa Kiswahili.',
  },
  {
    title: '☀️ GIX CHATS',
    body: 'Fungua account kwa 15,000 TSh na uanze kufanya AI Jobs leo.',
  },
];

const EVENING_MESSAGES: Omit<NotificationPayload, 'url' | 'tag'>[] = [
  {
    title: '💰 GIX CHATS',
    body: 'Fungua account kwa 15,000 TSh na uanze kufanya AI Jobs leo.',
  },
  {
    title: '🌙 GIX CHATS',
    body: 'Kamilisha AI Jobs za leo. Fungua account yako kwa 15,000 TSh.',
  },
  {
    title: '🤖 GIX CHATS',
    body: 'AI Jobs zinakusubiri leo. Fungua GIX CHATS na anza.',
  },
];

// Helper to broadcast a push notification to all subscribers
async function broadcastNotification(
  payload: NotificationPayload,
  originUrl?: string
): Promise<{ sent: number; failed: number; pruned: number }> {
  const subscriptions = loadSubscriptions();
  if (subscriptions.length === 0) {
    console.log('[PUSH] No subscribers found to send to.');
    return { sent: 0, failed: 0, pruned: 0 };
  }

  // Ensure absolute or well-formed target URL
  const appBaseUrl = originUrl || process.env.APP_URL || 'https://adsblog.app/page/reg.php?reg=Cp3';
  const resolvedPayload = {
    ...payload,
    url: payload.url.startsWith('http') ? payload.url : `${appBaseUrl}${payload.url.startsWith('/') ? '' : '/'}${payload.url}`,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
  };

  const payloadString = JSON.stringify(resolvedPayload);
  let sentCount = 0;
  let failedCount = 0;
  const invalidEndpoints = new Set<string>();

  console.log(`[PUSH] Broadcasting "${payload.title}" to ${subscriptions.length} subscriber(s)...`);

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          payloadString,
          {
            TTL: 60 * 60 * 24, // 24 hours
            urgency: 'high',
          }
        );
        sentCount++;
      } catch (err: any) {
        failedCount++;
        // Prune expired or unregistered endpoints
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log(`[PUSH] Sub expired/unregistered (HTTP ${err.statusCode}): ${sub.endpoint.slice(0, 45)}...`);
          invalidEndpoints.add(sub.endpoint);
        } else {
          console.warn('[PUSH] Delivery error:', err.message || err);
        }
      }
    })
  );

  let prunedCount = 0;
  if (invalidEndpoints.size > 0) {
    const freshSubs = subscriptions.filter((s) => !invalidEndpoints.has(s.endpoint));
    saveSubscriptions(freshSubs);
    prunedCount = invalidEndpoints.size;
    console.log(`[PUSH] Pruned ${prunedCount} stale subscription(s). Active remaining: ${freshSubs.length}`);
  }

  console.log(`[PUSH] Broadcast result: sent=${sentCount}, failed=${failedCount}, pruned=${prunedCount}`);
  return { sent: sentCount, failed: failedCount, pruned: prunedCount };
}

// -------------------------------------------------------------
// 4. SCHEDULER: 08:00, 13:00, 19:00 (Africa/Dar_es_Salaam)
// -------------------------------------------------------------
let morningIndex = 0;
let afternoonIndex = 0;
let eveningIndex = 0;

// 08:00 EAT Morning schedule
cron.schedule(
  '0 8 * * *',
  () => {
    console.log('[CRON] Executing 08:00 EAT Morning Notification...');
    const item = MORNING_MESSAGES[morningIndex % MORNING_MESSAGES.length];
    morningIndex++;
    broadcastNotification({
      title: item.title,
      body: item.body,
      url: '/?tab=account',
      tag: 'gix-morning-ai-jobs',
      target: 'account',
    });
  },
  {
    timezone: 'Africa/Dar_es_Salaam',
  }
);

// 13:00 EAT Afternoon schedule
cron.schedule(
  '0 13 * * *',
  () => {
    console.log('[CRON] Executing 13:00 EAT Afternoon Notification...');
    const item = AFTERNOON_MESSAGES[afternoonIndex % AFTERNOON_MESSAGES.length];
    afternoonIndex++;
    broadcastNotification({
      title: item.title,
      body: item.body,
      url: '/?tab=account',
      tag: 'gix-afternoon-ai-jobs',
      target: 'account',
    });
  },
  {
    timezone: 'Africa/Dar_es_Salaam',
  }
);

// 19:00 EAT Evening schedule
cron.schedule(
  '0 19 * * *',
  () => {
    console.log('[CRON] Executing 19:00 EAT Evening Notification...');
    const item = EVENING_MESSAGES[eveningIndex % EVENING_MESSAGES.length];
    eveningIndex++;
    broadcastNotification({
      title: item.title,
      body: item.body,
      url: '/?tab=account',
      tag: 'gix-evening-ai-jobs',
      target: 'account',
    });
  },
  {
    timezone: 'Africa/Dar_es_Salaam',
  }
);

console.log('[CRON] Scheduled push notifications registered: 08:00, 13:00, 19:00 (Africa/Dar_es_Salaam).');

// -------------------------------------------------------------
// 5. REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Get Public VAPID Key
app.get('/api/push/public-key', (_req, res) => {
  res.json({
    publicKey: vapid.publicKey,
    success: true,
  });
});

// 2. Subscribe user/device
app.post('/api/push/subscribe', (req, res) => {
  try {
    const { subscription, userAgent, language } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return res.status(400).json({ error: 'Invalid PushSubscription payload' });
    }

    const currentSubs = loadSubscriptions();
    const existingIndex = currentSubs.findIndex((s) => s.endpoint === subscription.endpoint);

    const now = new Date().toISOString();
    const subRecord: PushSub = {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime ?? null,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      updatedAt: now,
      userAgent: userAgent || req.headers['user-agent'] || '',
      language: language || 'sw',
    };

    if (existingIndex >= 0) {
      // Update existing record
      subRecord.createdAt = currentSubs[existingIndex].createdAt || now;
      currentSubs[existingIndex] = subRecord;
      console.log(`[PUSH] Updated subscription: ${subscription.endpoint.slice(0, 45)}...`);
    } else {
      // Add new record
      subRecord.createdAt = now;
      currentSubs.push(subRecord);
      console.log(`[PUSH] Registered new subscription (total: ${currentSubs.length})`);
    }

    saveSubscriptions(currentSubs);

    res.json({
      success: true,
      count: currentSubs.length,
      isNew: existingIndex < 0,
    });
  } catch (err: any) {
    console.error('[PUSH] Subscribe error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// 3. Unsubscribe user/device
app.post('/api/push/unsubscribe', (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required to unsubscribe' });
    }

    const currentSubs = loadSubscriptions();
    const filtered = currentSubs.filter((s) => s.endpoint !== endpoint);
    const removed = currentSubs.length - filtered.length;

    saveSubscriptions(filtered);
    console.log(`[PUSH] Unsubscribed ${removed} device(s). Remaining: ${filtered.length}`);

    res.json({
      success: true,
      removed,
      count: filtered.length,
    });
  } catch (err: any) {
    console.error('[PUSH] Unsubscribe error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// 4. Send Welcome First Notification (triggered upon granting permission)
app.post('/api/push/send-welcome', async (req, res) => {
  try {
    const { subscription } = req.body;

    const payload: NotificationPayload = {
      title: '🤖 GIX CHATS',
      body: 'Karibu GIX CHATS! Fungua account yako na uanze AI Jobs kwa Kiswahili. 💰',
      url: '/?tab=account',
      tag: 'gix-welcome-first',
      target: 'account',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
    };

    if (subscription && subscription.endpoint) {
      // Send directly to the requesting subscription
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
          JSON.stringify(payload),
          { TTL: 60 * 60, urgency: 'high' }
        );
        return res.json({ success: true, message: 'Welcome notification sent directly.' });
      } catch (sendErr: any) {
        console.warn('[PUSH] Direct welcome push failed, will try broadcast fallback:', sendErr.message);
      }
    }

    // Broadcast fallback
    const result = await broadcastNotification(payload);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[PUSH] Welcome error:', err);
    res.status(500).json({ error: err.message || 'Failed to send welcome notification' });
  }
});

// 5. Send Test Notification (for settings panel testing)
app.post('/api/push/send-test', async (req, res) => {
  try {
    const { subscription } = req.body;

    const payload: NotificationPayload = {
      title: '🔔 GIX CHATS (Majaribio)',
      body: 'Hongera! Notifications zinafanya kazi vizuri. Fungua account yako kwa 15,000 TSh uanze AI Jobs! 🚀',
      url: '/?tab=account',
      tag: 'gix-test-' + Date.now(),
      target: 'account',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
    };

    if (subscription && subscription.endpoint) {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        JSON.stringify(payload),
        { TTL: 60 * 60, urgency: 'high' }
      );
      return res.json({ success: true, message: 'Test notification sent directly to device.' });
    }

    const result = await broadcastNotification(payload);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[PUSH] Test error:', err);
    res.status(500).json({ error: err.message || 'Failed to send test push' });
  }
});

// 6. Manual trigger for scheduled broadcasts (for testing or admin)
app.post('/api/push/trigger-scheduled', async (req, res) => {
  try {
    const { slot } = req.body; // 'morning', 'afternoon', 'evening'
    let messageItem;
    if (slot === 'morning') {
      messageItem = MORNING_MESSAGES[morningIndex++ % MORNING_MESSAGES.length];
    } else if (slot === 'afternoon') {
      messageItem = AFTERNOON_MESSAGES[afternoonIndex++ % AFTERNOON_MESSAGES.length];
    } else {
      messageItem = EVENING_MESSAGES[eveningIndex++ % EVENING_MESSAGES.length];
    }

    const result = await broadcastNotification({
      title: messageItem.title,
      body: messageItem.body,
      url: '/?tab=account',
      tag: `gix-manual-${slot || 'scheduled'}-${Date.now()}`,
      target: 'account',
    });

    res.json({ success: true, item: messageItem, ...result });
  } catch (err: any) {
    console.error('[PUSH] Trigger error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. System Push Status
app.get('/api/push/status', (_req, res) => {
  const subs = loadSubscriptions();
  res.json({
    activeSubscribers: subs.length,
    timezone: 'Africa/Dar_es_Salaam (EAT, UTC+3)',
    schedules: [
      { name: 'Asubuhi', time: '08:00 EAT', cron: '0 8 * * *' },
      { name: 'Mchana', time: '13:00 EAT', cron: '0 13 * * *' },
      { name: 'Jioni', time: '19:00 EAT', cron: '0 19 * * *' },
    ],
    serverTimeEAT: new Date().toLocaleString('en-US', { timeZone: 'Africa/Dar_es_Salaam' }),
  });
});

// -------------------------------------------------------------
// 6. VITE MIDDLEWARE (Dev) OR STATIC SERVE (Prod)
// -------------------------------------------------------------
async function startServer() {
  if (!IS_PROD) {
    // Dynamic import vite in dev to mount middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] GIX CHATS server listening on http://0.0.0.0:${PORT} (mode: ${IS_PROD ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[SERVER] Failed to start server:', err);
  process.exit(1);
});
