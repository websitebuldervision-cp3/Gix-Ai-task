export type Language = 'sw' | 'en';

export type AccountStatus = 'not_activated' | 'pending_activation' | 'activated';

export type KiswahiliLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';

export type PresenceStatus = 'online' | 'away' | 'offline';

export interface LocalizedText {
  en: string;
  sw: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  emailOrPhone: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  age?: number;
  languagesSpoken: string[];
  kiswahiliLevel: KiswahiliLevel;
  bio?: string;
  avatarUrl: string;
  accountStatus: AccountStatus;
  balancePendingUSD: number;
  balanceAvailableUSD: number;
  totalEarnedUSD: number;
  completedChatsCount: number;
  chatMinutesCount: number;
  joinedDate: string;
  status: PresenceStatus;
}

export interface ChatPartner {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  nativeLanguage: string;
  kiswahiliLevel: 'beginner' | 'intermediate' | 'advanced';
  bio: LocalizedText;
  status: PresenceStatus;
  interests: string[];
  learningGoals: LocalizedText;
  promptStarters: LocalizedText[];
  sampleResponses?: { trigger: string; reply: LocalizedText }[];
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  status: 'sent' | 'delivered' | 'read';
  isTip?: boolean;
}

export interface ChatRoom {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerUsername: string;
  partnerAvatar: string;
  partnerCountry: string;
  partnerFlag: string;
  partnerStatus: PresenceStatus;
  partnerLevel: 'beginner' | 'intermediate' | 'advanced';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  createdAt: string;
  activeSessionDuration?: number; // In seconds
}

export interface ChatSession {
  id: string;
  roomId: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  startedAt: string;
  durationSeconds: number;
  isEligible: boolean;
  amountUSD: number;
  amountTZS: number;
  status: 'in_progress' | 'completed' | 'credited';
}

export interface EarningRecord {
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
  notes?: LocalizedText;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amountUSD: number;
  amountTZS: number;
  method: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'bank';
  methodName: string;
  phoneOrAccount: string;
  accountName: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

export interface PlatformSettings {
  chatDurationEligibleSeconds: number; // default: 60 (1 minute)
  rewardPerMinuteUSD: number; // default: 0.50
  minWithdrawalUSD: number; // default: 10.0
  activationFeeTZS: number; // default: 15000
  supportPhone: string; // default: '0624542565'
  activationUrl: string; // 'https://moxeraagencies.com/register?ref=Cp3'
  announcement?: LocalizedText;
}

export interface ReportSubmission {
  id: string;
  reportedUserId: string;
  reportedByUserId: string;
  reason: string;
  details?: string;
  submittedAt: string;
}
