export type Language = 'sw' | 'en';

export type AccountStatus = 'not_activated' | 'pending_activation' | 'activated';

export type TaskGroup =
  | 'image'
  | 'audio'
  | 'video'
  | 'text'
  | 'ai'
  | 'product'
  | 'data'
  | 'ui'
  | 'survey'
  | 'location';

export interface LocalizedText {
  en: string;
  sw: string;
}

export interface TaskCategory {
  id: string;
  group: TaskGroup;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  image?: string;
  availableCount: number;
  rewardMin: number;
  rewardMax: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEst: string;
}

export interface TaskOption {
  id: string;
  label: LocalizedText;
  subLabel?: LocalizedText;
}

export interface TaskMedia {
  type: 'image_duo' | 'image_single' | 'audio_duo' | 'video_duo' | 'text_duo' | 'ai_chat_duo' | 'product_duo' | 'map_duo' | 'data_table' | 'none';
  itemA?: {
    label?: LocalizedText;
    url?: string;
    text?: string;
    speechText?: LocalizedText;
    voiceStyle?: 'natural' | 'robotic' | 'female' | 'male' | 'fast';
    meta?: string;
    details?: Record<string, string>;
  };
  itemB?: {
    label?: LocalizedText;
    url?: string;
    text?: string;
    speechText?: LocalizedText;
    voiceStyle?: 'natural' | 'robotic' | 'female' | 'male' | 'fast';
    meta?: string;
    details?: Record<string, string>;
  };
  promptOrContext?: LocalizedText;
  tags?: string[];
}

export interface TaskItem {
  id: string;
  categoryId: string;
  categoryName: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  instructions: LocalizedText[];
  media: TaskMedia;
  options: TaskOption[];
  rewardUSD: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedSeconds: number;
  correctOptionId?: string;
  wrongAnswerFeedback?: LocalizedText;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: LocalizedText;
  categoryName: LocalizedText;
  submittedAt: string;
  rewardUSD: number;
  rewardTZS: number;
  status: 'pending' | 'under_review' | 'accepted';
  selectedOptionLabel: LocalizedText;
  isIncorrect?: boolean;
  rewardPercentage?: number;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  tasksCompleted: number;
  acceptedRewardsUSD: number;
  acceptedRewardsTZS: number;
  badge?: string;
  country: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  accountStatus: AccountStatus;
  balancePendingUSD: number;
  balanceAvailableUSD: number;
  totalEarnedUSD: number;
  completedTasksCount: number;
  joinedDate: string;
}
