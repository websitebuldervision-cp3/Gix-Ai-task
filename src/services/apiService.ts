import { UserProfile, ChatRoom, Message, EarningRecord, WithdrawalRequest, PlatformSettings } from '../types';

const API_BASE = '/api';

export const apiService = {
  // 1. Current user
  async getCurrentUser(userId?: string): Promise<UserProfile | null> {
    try {
      const headers: Record<string, string> = {};
      if (userId) headers['x-user-id'] = userId;
      const res = await fetch(`${API_BASE}/auth/me`, { headers });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch (e) {
      console.error('Failed to get current user:', e);
      return null;
    }
  },

  // 2. Register user
  async registerUser(userData: {
    fullName: string;
    username: string;
    emailOrPhone: string;
    password?: string;
    country?: string;
    age?: number;
    languagesSpoken?: string[];
    kiswahiliLevel?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Usajili umeshindwa' };
      }
      return { success: true, user: data.user };
    } catch (e: any) {
      return { success: false, error: e.message || 'Hitilafu ya mtandao' };
    }
  },

  // 3. Login
  async loginUser(identifier: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Akaunti haikupatikana' };
      }
      return { success: true, user: data.user };
    } catch (e: any) {
      return { success: false, error: e.message || 'Hitilafu ya mtandao' };
    }
  },

  // 4. Update profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch (e) {
      console.error('Update profile error:', e);
      return null;
    }
  },

  // 5. Start / open chat room
  async startChatRoom(
    userId: string,
    partner: {
      partnerId: string;
      partnerName: string;
      partnerUsername: string;
      partnerAvatar: string;
      partnerCountry: string;
      partnerFlag: string;
      partnerLevel: 'beginner' | 'intermediate' | 'advanced';
    }
  ): Promise<ChatRoom | null> {
    try {
      const res = await fetch(`${API_BASE}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(partner),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.room;
    } catch (e) {
      console.error('Start chat error:', e);
      return null;
    }
  },

  // 6. Get user rooms
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/rooms`, {
        headers: { 'x-user-id': userId },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.rooms || [];
    } catch (e) {
      console.error('Get rooms error:', e);
      return [];
    }
  },

  // 7. Get messages
  async getRoomMessages(roomId: string, currentUserId: string): Promise<Message[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/rooms/${roomId}/messages`);
      if (!res.ok) return [];
      const data = await res.json();
      const list = data.messages || [];
      return list.map((m: any) => ({
        ...m,
        isMine: m.senderId === currentUserId,
      }));
    } catch (e) {
      console.error('Get messages error:', e);
      return [];
    }
  },

  // 8. Send message
  async sendMessage(
    roomId: string,
    userId: string,
    text: string
  ): Promise<{ userMessage?: Message; partnerReply?: Message } | null> {
    try {
      const res = await fetch(`${API_BASE}/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        userMessage: { ...data.userMessage, isMine: true },
        partnerReply: { ...data.partnerReply, isMine: false },
      };
    } catch (e) {
      console.error('Send message error:', e);
      return null;
    }
  },

  // 9. Session Heartbeat (Tracks 1 minute active chat duration and awards pending earnings)
  async sendSessionHeartbeat(
    userId: string,
    sessionData: {
      roomId: string;
      partnerId: string;
      partnerName: string;
      elapsedSeconds: number;
    }
  ): Promise<{
    earned: boolean;
    amountUSD?: number;
    amountTZS?: number;
    newPendingUSD?: number;
    completedChatsCount?: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/chat/session/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(sessionData),
      });
      if (!res.ok) return { earned: false };
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Heartbeat error:', e);
      return { earned: false };
    }
  },

  // 10. Get earnings ledger
  async getEarnings(userId: string): Promise<{
    balances: {
      pendingUSD: number;
      pendingTZS: number;
      availableUSD: number;
      availableTZS: number;
      totalEarnedUSD: number;
      totalEarnedTZS: number;
      completedChatsCount: number;
      chatMinutesCount: number;
      accountStatus: string;
    };
    history: EarningRecord[];
  } | null> {
    try {
      const res = await fetch(`${API_BASE}/earnings`, {
        headers: { 'x-user-id': userId },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('Get earnings error:', e);
      return null;
    }
  },

  // 11. Withdrawals
  async getWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
    try {
      const res = await fetch(`${API_BASE}/withdrawals`, {
        headers: { 'x-user-id': userId },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.withdrawals || [];
    } catch (e) {
      console.error('Get withdrawals error:', e);
      return [];
    }
  },

  async requestWithdrawal(
    userId: string,
    withdrawalData: {
      amountUSD: number;
      method: string;
      phoneOrAccount: string;
      accountName: string;
    }
  ): Promise<{
    success: boolean;
    requireActivation?: boolean;
    activationUrl?: string;
    error?: string;
    withdrawal?: WithdrawalRequest;
  }> {
    try {
      const res = await fetch(`${API_BASE}/withdrawals/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(withdrawalData),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          requireActivation: data.requireActivation,
          activationUrl: data.activationUrl,
          error: data.message || data.error || 'Ombi la kutoa pesa limeshindwa',
        };
      }
      return { success: true, withdrawal: data.withdrawal };
    } catch (e: any) {
      return { success: false, error: e.message || 'Hitilafu ya mtandao' };
    }
  },

  // 12. Moderation: Report & Block
  async reportUser(userId: string, roomId: string, reportedUserId: string, reason: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/chat/rooms/${roomId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ reportedUserId, reason }),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async blockUser(userId: string, roomId: string, blockedUserId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/chat/rooms/${roomId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ blockedUserId }),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // 13. Settings
  async getSettings(): Promise<PlatformSettings | null> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.settings;
    } catch (e) {
      return null;
    }
  },
};
