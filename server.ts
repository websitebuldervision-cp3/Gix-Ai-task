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
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = IS_PROD && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// -------------------------------------------------------------
// 1. DATA DIRECTORY & PERSISTENCE HELPERS
// -------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, 'data_storage');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJsonFile<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    saveJsonFile(filename, defaultValue);
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[DB] Error loading ${filename}:`, err);
    return defaultValue;
  }
}

function saveJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[DB] Error saving ${filename}:`, err);
  }
}

// -------------------------------------------------------------
// 2. VAPID KEYS SETUP FOR WEB PUSH
// -------------------------------------------------------------
const VAPID_FILE = 'vapid-keys.json';
const SUBS_FILE = 'subscriptions.json';

interface VapidKeys {
  publicKey: string;
  privateKey: string;
  subject: string;
}

function isValidVapidKey(key: string | undefined): boolean {
  if (!key || typeof key !== 'string') return false;
  return key.trim().length >= 40;
}

function getOrGenerateVapidKeys(): VapidKeys {
  const envSubject = process.env.VAPID_SUBJECT;
  const validSubject =
    envSubject && (envSubject.startsWith('mailto:') || envSubject.startsWith('https://') || envSubject.startsWith('http://'))
      ? envSubject
      : 'mailto:support@gixchat.com';

  if (isValidVapidKey(process.env.VAPID_PUBLIC_KEY) && isValidVapidKey(process.env.VAPID_PRIVATE_KEY)) {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY!,
      privateKey: process.env.VAPID_PRIVATE_KEY!,
      subject: validSubject,
    };
  }

  const existing = loadJsonFile<VapidKeys | null>(VAPID_FILE, null);
  if (existing && isValidVapidKey(existing.publicKey) && isValidVapidKey(existing.privateKey)) {
    existing.subject =
      existing.subject && (existing.subject.startsWith('mailto:') || existing.subject.startsWith('https://'))
        ? existing.subject
        : validSubject;
    return existing;
  }

  const keys = webpush.generateVAPIDKeys();
  const vapidData: VapidKeys = {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    subject: validSubject,
  };

  saveJsonFile(VAPID_FILE, vapidData);
  console.log('[VAPID] Generated new valid VAPID keys for GIX CHATS');
  return vapidData;
}

const vapid = getOrGenerateVapidKeys();
webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);

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
  return loadJsonFile<PushSub[]>(SUBS_FILE, []);
}

function saveSubscriptions(subs: PushSub[]): void {
  saveJsonFile(SUBS_FILE, subs);
}

interface NotificationPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
  icon?: string;
  badge?: string;
  target?: string;
}

async function broadcastNotification(
  payload: NotificationPayload,
  originUrl?: string
): Promise<{ sent: number; failed: number; pruned: number }> {
  const subscriptions = loadSubscriptions();
  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, pruned: 0 };
  }

  const appBaseUrl = originUrl || process.env.APP_URL || 'https://moxeraagencies.com/register?ref=Cp3';
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
            TTL: 60 * 60 * 24,
            urgency: 'high',
          }
        );
        sentCount++;
      } catch (err: any) {
        failedCount++;
        if (err.statusCode === 404 || err.statusCode === 410) {
          invalidEndpoints.add(sub.endpoint);
        }
      }
    })
  );

  let prunedCount = 0;
  if (invalidEndpoints.size > 0) {
    const freshSubs = subscriptions.filter((s) => !invalidEndpoints.has(s.endpoint));
    saveSubscriptions(freshSubs);
    prunedCount = invalidEndpoints.size;
  }

  return { sent: sentCount, failed: failedCount, pruned: prunedCount };
}

// -------------------------------------------------------------
// 3. SCHEDULED NOTIFICATIONS (Africa/Dar_es_Salaam)
// -------------------------------------------------------------
const MORNING_MESSAGES = [
  {
    title: '🌅 GIX CHATS',
    body: 'Wazungu wapya wanatafuta wa kuwafundisha Kiswahili leo! Ungana nao sasa uanze kuchat na kulipwa. 🌍',
  },
  {
    title: '🔔 GIX CHATS',
    body: 'Muda wa kupata mapato! Wageni wapo hewani tayari kwa mazungumzo ya Kiswahili. 💬',
  },
];

const AFTERNOON_MESSAGES = [
  {
    title: '☀️ GIX CHATS',
    body: 'Chat mpya zinakusubiri. Saidia wageni kujifunza Kiswahili na uongeze salio lako leo. 💰',
  },
  {
    title: '🚀 GIX CHATS',
    body: 'Kila dakika 1 ya chat inalipwa moja kwa moja kwenye pending balance yako. Fungua account yako leo!',
  },
];

const EVENING_MESSAGES = [
  {
    title: '🌙 GIX CHATS',
    body: 'Kamilisha session zako za kuchat leo. Fungua account yako kwa TZS 15,000 uweze kutoa malipo yako! 💰',
  },
  {
    title: '💬 GIX CHATS',
    body: 'Wageni wengi wapo hewani jioni hii. Anza kuchat na uwafundishe salamu za Kiswahili sasa.',
  },
];

let morningIndex = 0;
let afternoonIndex = 0;
let eveningIndex = 0;

cron.schedule(
  '0 8 * * *',
  () => {
    const item = MORNING_MESSAGES[morningIndex++ % MORNING_MESSAGES.length];
    broadcastNotification({
      title: item.title,
      body: item.body,
      url: '/?tab=find',
      tag: 'gix-morning-chat',
      target: 'find',
    });
  },
  { timezone: 'Africa/Dar_es_Salaam' }
);

cron.schedule(
  '0 13 * * *',
  () => {
    const item = AFTERNOON_MESSAGES[afternoonIndex++ % AFTERNOON_MESSAGES.length];
    broadcastNotification({
      title: item.title,
      body: item.body,
      url: '/?tab=chats',
      tag: 'gix-afternoon-chat',
      target: 'chats',
    });
  },
  { timezone: 'Africa/Dar_es_Salaam' }
);

cron.schedule(
  '0 19 * * *',
  () => {
    const item = EVENING_MESSAGES[eveningIndex++ % EVENING_MESSAGES.length];
    broadcastNotification({
      title: item.title,
      body: item.body,
      url: '/?tab=earnings',
      tag: 'gix-evening-chat',
      target: 'earnings',
    });
  },
  { timezone: 'Africa/Dar_es_Salaam' }
);

// -------------------------------------------------------------
// 4. DATA MODELS & SEEDING (GIX CHATS ARCHITECTURE)
// -------------------------------------------------------------
const USERS_FILE = 'users.json';
const ROOMS_FILE = 'chat_rooms.json';
const MESSAGES_FILE = 'messages.json';
const SESSIONS_FILE = 'chat_sessions.json';
const EARNINGS_FILE = 'earnings.json';
const WITHDRAWALS_FILE = 'withdrawals.json';
const REPORTS_FILE = 'reports.json';
const BLOCKS_FILE = 'blocks.json';
const SETTINGS_FILE = 'platform_settings.json';

const USD_TO_TZS = 2600;

interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  emailOrPhone: string;
  passwordHash?: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  age?: number;
  languagesSpoken: string[];
  kiswahiliLevel: 'beginner' | 'intermediate' | 'advanced' | 'native';
  bio?: string;
  avatarUrl: string;
  accountStatus: 'not_activated' | 'pending_activation' | 'activated';
  balancePendingUSD: number;
  balanceAvailableUSD: number;
  totalEarnedUSD: number;
  completedChatsCount: number;
  chatMinutesCount: number;
  joinedDate: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
}

interface MessageRecord {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isTip?: boolean;
}

interface ChatRoomRecord {
  id: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  partnerUsername: string;
  partnerAvatar: string;
  partnerCountry: string;
  partnerFlag: string;
  partnerStatus: 'online' | 'away' | 'offline';
  partnerLevel: 'beginner' | 'intermediate' | 'advanced';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  activeSessionSeconds: number;
}

interface EarningRecordBackend {
  id: string;
  userId: string;
  chatSessionId: string;
  partnerName: string;
  partnerFlag: string;
  durationSeconds: number;
  amountUSD: number;
  amountTZS: number;
  status: 'pending' | 'available' | 'paid';
  date: string;
  notes?: { en: string; sw: string };
}

interface WithdrawalBackend {
  id: string;
  userId: string;
  amountUSD: number;
  amountTZS: number;
  method: string;
  methodName: string;
  phoneOrAccount: string;
  accountName: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

interface PlatformSettingsBackend {
  chatDurationEligibleSeconds: number; // 60s
  rewardPerMinuteUSD: number; // $0.50
  minWithdrawalUSD: number; // $10.00
  activationFeeTZS: number; // 15,000 TZS
  supportPhone: string;
  activationUrl: string;
  announcement?: { en: string; sw: string };
}

// Seed initial default settings if missing
const defaultSettings: PlatformSettingsBackend = {
  chatDurationEligibleSeconds: 60,
  rewardPerMinuteUSD: 0.50,
  minWithdrawalUSD: 10.0,
  activationFeeTZS: 15000,
  supportPhone: '0624542565',
  activationUrl: 'https://moxeraagencies.com/register?ref=Cp3',
  announcement: {
    sw: 'Karibu GIX CHATS! Ungana na wageni wanaojifunza Kiswahili. Kila dakika 1 ya chat inalipwa moja kwa moja.',
    en: 'Welcome to GIX CHATS! Connect with foreign learners. Every 1 minute of chat is eligible for rewards.',
  },
};

if (!fs.existsSync(path.join(DATA_DIR, SETTINGS_FILE))) {
  saveJsonFile(SETTINGS_FILE, defaultSettings);
}

// Seed default demo user if empty
const defaultUsers: UserRecord[] = [
  {
    id: 'user_tanzania_demo',
    username: 'Baraka_Mswahili',
    fullName: 'Baraka Emmanuel',
    emailOrPhone: 'baraka@gixchats.com',
    country: 'Tanzania',
    countryCode: 'TZ',
    countryFlag: '🇹🇿',
    age: 24,
    languagesSpoken: ['Kiswahili (Native)', 'English (Fluent)'],
    kiswahiliLevel: 'native',
    bio: 'Mzawa wa Tanzania, mwalimu wa Kiswahili wa vitendo. Karibu tujifunze pamoja!',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    accountStatus: 'not_activated',
    balancePendingUSD: 18.0, // Existing sample pending balance
    balanceAvailableUSD: 0.0,
    totalEarnedUSD: 18.0,
    completedChatsCount: 36,
    chatMinutesCount: 36,
    joinedDate: 'Agosti 2026',
    status: 'online',
  },
];

if (!fs.existsSync(path.join(DATA_DIR, USERS_FILE))) {
  saveJsonFile(USERS_FILE, defaultUsers);
}

// Seed initial sample earnings
const defaultEarnings: EarningRecordBackend[] = [
  {
    id: 'earn_01',
    userId: 'user_tanzania_demo',
    chatSessionId: 'sess_sarah_01',
    partnerName: 'Sarah Jenkins',
    partnerFlag: '🇺🇸',
    durationSeconds: 60,
    amountUSD: 0.50,
    amountTZS: 1300,
    status: 'pending',
    date: 'Leo, 10:15 AM',
    notes: {
      sw: 'Mazungumzo ya dakika 1 ya salamu za Kiswahili na Sarah (Marekani).',
      en: '1-minute Kiswahili greetings conversation with Sarah (USA).',
    },
  },
  {
    id: 'earn_02',
    userId: 'user_tanzania_demo',
    chatSessionId: 'sess_michael_01',
    partnerName: 'Michael Sterling',
    partnerFlag: '🇬🇧',
    durationSeconds: 60,
    amountUSD: 0.50,
    amountTZS: 1300,
    status: 'pending',
    date: 'Leo, 09:30 AM',
    notes: {
      sw: 'Kufundisha maneno ya bei na namba na Michael (Uingereza).',
      en: 'Teaching numbers and market bargaining with Michael (UK).',
    },
  },
];

if (!fs.existsSync(path.join(DATA_DIR, EARNINGS_FILE))) {
  saveJsonFile(EARNINGS_FILE, defaultEarnings);
}

// -------------------------------------------------------------
// 5. REST APIS: AUTH & USER PROFILES
// -------------------------------------------------------------

// 1. Current user session / profile
app.get('/api/auth/me', (req, res) => {
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
  const userId = (req.headers['x-user-id'] as string) || users[0].id;
  const user = users.find((u) => u.id === userId) || users[0];

  res.json({ success: true, user });
});

// 2. User Registration
app.post('/api/auth/register', (req, res) => {
  try {
    const {
      fullName,
      username,
      emailOrPhone,
      password,
      country,
      age,
      languagesSpoken,
      kiswahiliLevel,
      avatarUrl,
    } = req.body;

    if (!fullName || !username || !emailOrPhone) {
      return res.status(400).json({ error: 'Jaza taarifa zote zinazohitajika' });
    }

    const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
    const existing = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.emailOrPhone.toLowerCase() === emailOrPhone.toLowerCase()
    );

    if (existing) {
      return res.status(400).json({ error: 'Jina la mtumiaji au barua pepe/simu tayari imetumika.' });
    }

    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      username: username.trim(),
      fullName: fullName.trim(),
      emailOrPhone: emailOrPhone.trim(),
      passwordHash: password ? 'hashed_' + password : '',
      country: country || 'Tanzania',
      countryCode: country === 'Tanzania' ? 'TZ' : 'KE',
      countryFlag: country === 'Tanzania' ? '🇹🇿' : '🌍',
      age: age ? parseInt(age, 10) : 22,
      languagesSpoken: Array.isArray(languagesSpoken) ? languagesSpoken : ['Kiswahili', 'English'],
      kiswahiliLevel: kiswahiliLevel || 'native',
      bio: 'Mwanachama mpya wa GIX CHATS tayari kuongea na wageni.',
      avatarUrl:
        avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      accountStatus: 'not_activated',
      balancePendingUSD: 0.0,
      balanceAvailableUSD: 0.0,
      totalEarnedUSD: 0.0,
      completedChatsCount: 0,
      chatMinutesCount: 0,
      joinedDate: new Date().toLocaleDateString('sw-TZ', { month: 'long', year: 'numeric' }),
      status: 'online',
    };

    users.push(newUser);
    saveJsonFile(USERS_FILE, users);

    console.log(`[AUTH] Registered new user: ${newUser.username} (${newUser.id})`);
    res.json({ success: true, user: newUser });
  } catch (err: any) {
    console.error('[AUTH] Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. User Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);

  const user = users.find(
    (u) =>
      u.username.toLowerCase() === (identifier || '').toLowerCase() ||
      u.emailOrPhone.toLowerCase() === (identifier || '').toLowerCase()
  );

  if (!user) {
    return res.status(404).json({ error: 'Akaunti haikupatikana. Tafadhali jisajili kwanza.' });
  }

  // Update status to online
  user.status = 'online';
  saveJsonFile(USERS_FILE, users);

  res.json({ success: true, user });
});

// 4. Update Profile
app.put('/api/auth/profile', (req, res) => {
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
  const userId = (req.headers['x-user-id'] as string) || users[0].id;
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'Mtumiaji hakupatikana.' });
  }

  const updates = req.body;
  // Protect sensitive financial fields from client tampering
  delete updates.balancePendingUSD;
  delete updates.balanceAvailableUSD;
  delete updates.totalEarnedUSD;

  users[index] = { ...users[index], ...updates };
  saveJsonFile(USERS_FILE, users);

  res.json({ success: true, user: users[index] });
});

// -------------------------------------------------------------
// 6. REST APIS: CHAT ROOMS & REAL-TIME MESSAGING
// -------------------------------------------------------------

// Start or open a chat room with a partner
app.post('/api/chat/start', (req, res) => {
  try {
    const { partnerId, partnerName, partnerUsername, partnerAvatar, partnerCountry, partnerFlag, partnerLevel } = req.body;
    const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
    const userId = (req.headers['x-user-id'] as string) || users[0].id;

    if (!partnerId) {
      return res.status(400).json({ error: 'Partner ID is required' });
    }

    const rooms = loadJsonFile<ChatRoomRecord[]>(ROOMS_FILE, []);
    let room = rooms.find((r) => r.userId === userId && r.partnerId === partnerId);

    const now = new Date().toISOString();

    if (!room) {
      room = {
        id: `room_${userId}_${partnerId}`,
        userId,
        partnerId,
        partnerName: partnerName || 'Foreign Learner',
        partnerUsername: partnerUsername || 'learner',
        partnerAvatar: partnerAvatar || '',
        partnerCountry: partnerCountry || 'International',
        partnerFlag: partnerFlag || '🌍',
        partnerStatus: 'online',
        partnerLevel: partnerLevel || 'beginner',
        lastMessage: 'Habari! I am excited to practice Kiswahili with you.',
        lastMessageTime: 'Sasa hivi',
        unreadCount: 0,
        createdAt: now,
        updatedAt: now,
        activeSessionSeconds: 0,
      };
      rooms.unshift(room);
      saveJsonFile(ROOMS_FILE, rooms);

      // Seed initial welcoming message from partner
      const messages = loadJsonFile<Record<string, MessageRecord[]>>(MESSAGES_FILE, {});
      messages[room.id] = [
        {
          id: `msg_welcome_${Date.now()}`,
          roomId: room.id,
          senderId: partnerId,
          senderName: partnerName || 'Foreign Learner',
          senderAvatar: partnerAvatar,
          text: `Hello! Habari! I am so glad to connect with you from ${partnerCountry || 'abroad'}. Can you help me learn some Kiswahili greetings and phrases?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        },
      ];
      saveJsonFile(MESSAGES_FILE, messages);
    }

    res.json({ success: true, room });
  } catch (err: any) {
    console.error('[CHAT] Start error:', err);
    res.status(500).json({ error: err.message });
  }
});

// List user's rooms
app.get('/api/chat/rooms', (req, res) => {
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
  const userId = (req.headers['x-user-id'] as string) || users[0].id;
  const rooms = loadJsonFile<ChatRoomRecord[]>(ROOMS_FILE, []);
  const userRooms = rooms.filter((r) => r.userId === userId);

  res.json({ success: true, rooms: userRooms });
});

// Get room messages
app.get('/api/chat/rooms/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  const messages = loadJsonFile<Record<string, MessageRecord[]>>(MESSAGES_FILE, {});
  const roomMessages = messages[roomId] || [];

  res.json({ success: true, messages: roomMessages });
});

// Send message & generate responsive conversational reply
app.post('/api/chat/rooms/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text } = req.body;
    const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
    const userId = (req.headers['x-user-id'] as string) || users[0].id;
    const user = users.find((u) => u.id === userId) || users[0];

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Ujumbe hauwezi kuwa mtupu' });
    }

    const rooms = loadJsonFile<ChatRoomRecord[]>(ROOMS_FILE, []);
    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    const messages = loadJsonFile<Record<string, MessageRecord[]>>(MESSAGES_FILE, {});
    if (!messages[roomId]) {
      messages[roomId] = [];
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Save user's message
    const userMsg: MessageRecord = {
      id: `msg_u_${Date.now()}`,
      roomId,
      senderId: userId,
      senderName: user.fullName || user.username,
      senderAvatar: user.avatarUrl,
      text: text.trim(),
      timestamp: nowTime,
      status: 'delivered',
    };

    messages[roomId].push(userMsg);

    // Update room snippet
    if (roomIndex >= 0) {
      rooms[roomIndex].lastMessage = text.trim();
      rooms[roomIndex].lastMessageTime = nowTime;
      rooms[roomIndex].updatedAt = new Date().toISOString();
      saveJsonFile(ROOMS_FILE, rooms);
    }
    saveJsonFile(MESSAGES_FILE, messages);

    // 2. Generate contextual response from the foreign learner
    const room = roomIndex >= 0 ? rooms[roomIndex] : null;
    const partnerName = room ? room.partnerName : 'Partner';
    const partnerId = room ? room.partnerId : 'partner';
    const partnerAvatar = room ? room.partnerAvatar : '';

    const lower = text.toLowerCase();
    let replyText = 'Asante sana! How do you pronounce that correctly?';

    if (lower.includes('habari') || lower.includes('hujambo') || lower.includes('mambo')) {
      replyText = 'Nzuri sana! Na wewe je, unaendeleaje? I am practicing writing: "Jina langu ni ' + partnerName + '"!';
    } else if (lower.includes('shikamoo')) {
      replyText = 'Marahaba! I learned that is a very polite and respectful greeting. Asante sana!';
    } else if (lower.includes('jina')) {
      replyText = `Jina langu ni ${partnerName}! Nimefurahi kukufahamu sana. Where are you chatting from in Tanzania?`;
    } else if (lower.includes('karibu')) {
      replyText = 'Asante sana rafiki yangu! I truly hope to visit East Africa soon. What food should I try first?';
    } else if (lower.includes('asante')) {
      replyText = 'Karibu sana! Could you teach me how to say "I would like to drink water" in Kiswahili?';
    } else if (lower.includes('maji')) {
      replyText = '"Ninataka maji ya kunywa!" Did I say it well? You are such a helpful teacher!';
    } else if (lower.includes('safari') || lower.includes('mnyama') || lower.includes('serengeti')) {
      replyText = 'Simba, tembo, twiga na chui! I am memorizing the animal names. Kiswahili sounds so beautiful!';
    } else {
      const genericReplies = [
        'That is very interesting! Can you give me an example of how to use that in a sentence?',
        'Asante sana! I am writing this down in my language notebook right now.',
        'Wonderful! How would you say "See you tomorrow" in Swahili?',
        'I appreciate your time teaching me! What is your favorite Swahili saying or methali?',
        'Sawa kabisa! You explain things so clearly. Let us keep chatting!',
      ];
      replyText = genericReplies[Math.floor(Math.random() * genericReplies.length)];
    }

    const partnerMsg: MessageRecord = {
      id: `msg_p_${Date.now() + 1}`,
      roomId,
      senderId: partnerId,
      senderName: partnerName,
      senderAvatar: partnerAvatar,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    messages[roomId].push(partnerMsg);
    saveJsonFile(MESSAGES_FILE, messages);

    res.json({
      success: true,
      userMessage: userMsg,
      partnerReply: partnerMsg,
    });
  } catch (err: any) {
    console.error('[CHAT] Send error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. VERIFIED CHAT SESSION & EARNINGS ENGINE (SERVER-SIDE)
// -------------------------------------------------------------
// Tracks active chat time. When 60 seconds (1 minute) of verified chat
// has elapsed, calculates eligible earnings, credits to Pending Balance,
// and records an EarningRecord.
app.post('/api/chat/session/heartbeat', (req, res) => {
  try {
    const { roomId, partnerId, partnerName, elapsedSeconds } = req.body;
    const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
    const userId = (req.headers['x-user-id'] as string) || users[0].id;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const settings = loadJsonFile<PlatformSettingsBackend>(SETTINGS_FILE, defaultSettings);
    const targetSeconds = settings.chatDurationEligibleSeconds || 60; // 60s / 1 min

    // Validate active seconds from payload
    const seconds = Math.max(0, parseInt(elapsedSeconds || '0', 10));

    // If session has reached the verified target (e.g. 60 seconds)
    if (seconds >= targetSeconds) {
      const rewardUSD = settings.rewardPerMinuteUSD || 0.50;
      const rewardTZS = Math.round(rewardUSD * USD_TO_TZS);

      const earnings = loadJsonFile<EarningRecordBackend[]>(EARNINGS_FILE, defaultEarnings);
      const newEarningId = `earn_${Date.now()}`;

      const newRecord: EarningRecordBackend = {
        id: newEarningId,
        userId,
        chatSessionId: `sess_${roomId}_${Date.now()}`,
        partnerName: partnerName || 'Foreign Learner',
        partnerFlag: '🌍',
        durationSeconds: seconds,
        amountUSD: rewardUSD,
        amountTZS: rewardTZS,
        status: 'pending', // PENDING until account is activated
        date: `Leo, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        notes: {
          sw: `Umekamilisha dakika 1 ya chat na kumfundisha ${partnerName || 'mgeni'} Kiswahili.`,
          en: `Completed 1 minute of language exchange teaching Kiswahili to ${partnerName || 'partner'}.`,
        },
      };

      earnings.unshift(newRecord);
      saveJsonFile(EARNINGS_FILE, earnings);

      // Update user balances server-side
      users[userIndex].balancePendingUSD = Number(
        (users[userIndex].balancePendingUSD + rewardUSD).toFixed(2)
      );
      users[userIndex].totalEarnedUSD = Number(
        (users[userIndex].totalEarnedUSD + rewardUSD).toFixed(2)
      );
      users[userIndex].completedChatsCount += 1;
      users[userIndex].chatMinutesCount += 1;
      saveJsonFile(USERS_FILE, users);

      console.log(
        `[EARNINGS] Verified 1-min chat for ${users[userIndex].username}: Credited $${rewardUSD} (Pending: $${users[userIndex].balancePendingUSD})`
      );

      return res.json({
        success: true,
        earned: true,
        amountUSD: rewardUSD,
        amountTZS: rewardTZS,
        newPendingUSD: users[userIndex].balancePendingUSD,
        completedChatsCount: users[userIndex].completedChatsCount,
        sessionRecord: newRecord,
      });
    }

    res.json({
      success: true,
      earned: false,
      currentSeconds: seconds,
      targetSeconds,
    });
  } catch (err: any) {
    console.error('[EARNINGS] Heartbeat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's verified earnings ledger
app.get('/api/earnings', (req, res) => {
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
  const userId = (req.headers['x-user-id'] as string) || users[0].id;
  const user = users.find((u) => u.id === userId) || users[0];

  const earnings = loadJsonFile<EarningRecordBackend[]>(EARNINGS_FILE, defaultEarnings);
  const userEarnings = earnings.filter((e) => e.userId === userId);

  res.json({
    success: true,
    balances: {
      pendingUSD: user.balancePendingUSD,
      pendingTZS: Math.round(user.balancePendingUSD * USD_TO_TZS),
      availableUSD: user.balanceAvailableUSD,
      availableTZS: Math.round(user.balanceAvailableUSD * USD_TO_TZS),
      totalEarnedUSD: user.totalEarnedUSD,
      totalEarnedTZS: Math.round(user.totalEarnedUSD * USD_TO_TZS),
      completedChatsCount: user.completedChatsCount,
      chatMinutesCount: user.chatMinutesCount,
      accountStatus: user.accountStatus,
    },
    history: userEarnings,
  });
});

// -------------------------------------------------------------
// 8. REST APIS: WITHDRAWALS (SERVER VERIFIED)
// -------------------------------------------------------------
app.get('/api/withdrawals', (req, res) => {
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
  const userId = (req.headers['x-user-id'] as string) || users[0].id;
  const withdrawals = loadJsonFile<WithdrawalBackend[]>(WITHDRAWALS_FILE, []);
  const userWithdrawals = withdrawals.filter((w) => w.userId === userId);

  res.json({ success: true, withdrawals: userWithdrawals });
});

app.post('/api/withdrawals/request', (req, res) => {
  try {
    const { amountUSD, method, phoneOrAccount, accountName } = req.body;
    const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
    const userId = (req.headers['x-user-id'] as string) || users[0].id;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];
    const settings = loadJsonFile<PlatformSettingsBackend>(SETTINGS_FILE, defaultSettings);

    // Rule: Account must be activated to withdraw
    if (user.accountStatus !== 'activated') {
      return res.status(403).json({
        success: false,
        requireActivation: true,
        activationUrl: settings.activationUrl || 'https://moxeraagencies.com/register?ref=Cp3',
        message:
          'Akaunti yako haija-activatiwa bado! Ili uweze kutoa pesa kwenye M-Pesa, Tigo Pesa au Benki, unapaswa kufungua na ku-activate akaunti yako kwanza.',
      });
    }

    const requestedAmount = parseFloat(amountUSD);
    const minAmount = settings.minWithdrawalUSD || 10.0;

    if (isNaN(requestedAmount) || requestedAmount < minAmount) {
      return res.status(400).json({
        error: `Kiwango cha chini cha kutoa ni $${minAmount.toFixed(2)} (TSh ${(minAmount * USD_TO_TZS).toLocaleString()}).`,
      });
    }

    if (user.balanceAvailableUSD < requestedAmount) {
      return res.status(400).json({
        error: `Salio lako la Available ($${user.balanceAvailableUSD.toFixed(2)}) halitoshi kutoa $${requestedAmount.toFixed(2)}. Kumbuka salio la Pending linahitaji ukamilishe vigezo vya akaunti.`,
      });
    }

    // Deduct from available balance
    users[userIndex].balanceAvailableUSD = Number(
      (users[userIndex].balanceAvailableUSD - requestedAmount).toFixed(2)
    );
    saveJsonFile(USERS_FILE, users);

    const withdrawals = loadJsonFile<WithdrawalBackend[]>(WITHDRAWALS_FILE, []);
    const newWithdrawal: WithdrawalBackend = {
      id: `wth_${Date.now()}`,
      userId,
      amountUSD: requestedAmount,
      amountTZS: Math.round(requestedAmount * USD_TO_TZS),
      method: method || 'mpesa',
      methodName: method?.toUpperCase() || 'M-PESA',
      phoneOrAccount: phoneOrAccount || '',
      accountName: accountName || '',
      status: 'pending', // Pending human/automated review
      submittedAt: new Date().toLocaleDateString('sw-TZ', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    withdrawals.unshift(newWithdrawal);
    saveJsonFile(WITHDRAWALS_FILE, withdrawals);

    res.json({
      success: true,
      withdrawal: newWithdrawal,
      remainingAvailableUSD: users[userIndex].balanceAvailableUSD,
    });
  } catch (err: any) {
    console.error('[WITHDRAW] Request error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. REST APIS: REPORTING, BLOCKING & SETTINGS
// -------------------------------------------------------------
app.post('/api/chat/rooms/:roomId/report', (req, res) => {
  const { roomId } = req.params;
  const { reportedUserId, reason, details } = req.body;
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
  const reportedBy = (req.headers['x-user-id'] as string) || users[0].id;

  const reports = loadJsonFile<any[]>(REPORTS_FILE, []);
  reports.push({
    id: `rep_${Date.now()}`,
    roomId,
    reportedUserId,
    reportedBy,
    reason: reason || 'Inappropriate behavior',
    details: details || '',
    submittedAt: new Date().toISOString(),
  });
  saveJsonFile(REPORTS_FILE, reports);

  res.json({ success: true, message: 'Ripoti yako imepokelewa na timu yetu ya usalama inashughulikia.' });
});

app.post('/api/chat/rooms/:roomId/block', (req, res) => {
  const { roomId } = req.params;
  const { blockedUserId } = req.body;
  const users = loadJsonFile<UserRecord[]>(USERS_FILE, defaultUsers);
  const blockedBy = (req.headers['x-user-id'] as string) || users[0].id;

  const blocks = loadJsonFile<any[]>(BLOCKS_FILE, []);
  blocks.push({
    id: `blk_${Date.now()}`,
    roomId,
    blockedUserId,
    blockedBy,
    createdAt: new Date().toISOString(),
  });
  saveJsonFile(BLOCKS_FILE, blocks);

  res.json({ success: true, message: 'Mtumiaji amezuiwa kufanya mawasiliano nawe.' });
});

app.get('/api/settings', (_req, res) => {
  const settings = loadJsonFile<PlatformSettingsBackend>(SETTINGS_FILE, defaultSettings);
  res.json({ success: true, settings });
});

app.put('/api/settings', (req, res) => {
  const current = loadJsonFile<PlatformSettingsBackend>(SETTINGS_FILE, defaultSettings);
  const updated = { ...current, ...req.body };
  saveJsonFile(SETTINGS_FILE, updated);
  res.json({ success: true, settings: updated });
});

// -------------------------------------------------------------
// 10. WEB PUSH NOTIFICATION ENDPOINTS
// -------------------------------------------------------------
app.get('/api/push/public-key', (_req, res) => {
  res.json({
    publicKey: vapid.publicKey,
    success: true,
  });
});

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
      subRecord.createdAt = currentSubs[existingIndex].createdAt || now;
      currentSubs[existingIndex] = subRecord;
    } else {
      subRecord.createdAt = now;
      currentSubs.push(subRecord);
    }

    saveSubscriptions(currentSubs);
    res.json({ success: true, count: currentSubs.length, isNew: existingIndex < 0 });
  } catch (err: any) {
    console.error('[PUSH] Subscribe error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

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
    res.json({ success: true, removed, count: filtered.length });
  } catch (err: any) {
    console.error('[PUSH] Unsubscribe error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

app.post('/api/push/send-welcome', async (req, res) => {
  try {
    const { subscription } = req.body;

    const payload: NotificationPayload = {
      title: '💬 GIX CHATS',
      body: 'Karibu GIX CHATS! Ungana na watu duniani, wafundishe Kiswahili na upokee malipo yako ya chat. 💰',
      url: '/?tab=find',
      tag: 'gix-welcome-first',
      target: 'find',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
    };

    if (subscription && subscription.endpoint) {
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

    const result = await broadcastNotification(payload);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[PUSH] Welcome error:', err);
    res.status(500).json({ error: err.message || 'Failed to send welcome notification' });
  }
});

app.post('/api/push/send-test', async (req, res) => {
  try {
    const { subscription } = req.body;

    const payload: NotificationPayload = {
      title: '🔔 GIX CHATS (Majaribio)',
      body: 'Hongera! Notifications zinafanya kazi kikamilifu kwenye simu yako. Fungua uanze kuchat na wazungu sasa! 🚀',
      url: '/?tab=chats',
      tag: 'gix-test-' + Date.now(),
      target: 'chats',
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
// 10.5. SEO & ROBOTS / SITEMAP ROUTES
// -------------------------------------------------------------
app.get('/sitemap.xml', (_req, res) => {
  res.header('Content-Type', 'application/xml');
  const sitemapPublic = path.resolve(__dirname, 'public', 'sitemap.xml');
  const sitemapDist = path.resolve(__dirname, 'dist', 'sitemap.xml');
  if (fs.existsSync(sitemapPublic)) {
    return res.sendFile(sitemapPublic);
  }
  if (fs.existsSync(sitemapDist)) {
    return res.sendFile(sitemapDist);
  }
  res.status(404).send('Sitemap not found');
});

app.get('/robots.txt', (_req, res) => {
  res.header('Content-Type', 'text/plain');
  const robotsPublic = path.resolve(__dirname, 'public', 'robots.txt');
  const robotsDist = path.resolve(__dirname, 'dist', 'robots.txt');
  if (fs.existsSync(robotsPublic)) {
    return res.sendFile(robotsPublic);
  }
  if (fs.existsSync(robotsDist)) {
    return res.sendFile(robotsDist);
  }
  res.status(404).send('Robots.txt not found');
});

// -------------------------------------------------------------
// 11. VITE MIDDLEWARE (Dev) OR STATIC SERVE (Prod)
// -------------------------------------------------------------
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[SERVER] GIX CHATS backend server listening on http://0.0.0.0:${PORT} (mode: ${
        IS_PROD ? 'production' : 'development'
      })`
    );
  });
}

startServer().catch((err) => {
  console.error('[SERVER] Failed to start server:', err);
  process.exit(1);
});
