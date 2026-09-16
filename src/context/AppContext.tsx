import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  AccountStatus,
  TaskItem,
  TaskSubmission,
  UserProfile,
  LocalizedText,
} from '../types';
import {
  translations,
  ACTIVATION_URL,
  getWhatsAppLink,
  USD_TO_TZS_RATE,
} from '../data/translations';
import { getRotatingTask, TASK_DATABASE } from '../data/taskDatabase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  submissions: TaskSubmission[];
  currentTask: TaskItem | null;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  successModalData: {
    taskTitle: LocalizedText;
    rewardUSD: number;
    rewardTZS: number;
    isIncorrect?: boolean;
    originalRewardUSD?: number;
    originalRewardTZS?: number;
    feedbackMessage?: LocalizedText;
    expectedOptionLabel?: LocalizedText;
  } | null;
  isPwaModalOpen: boolean;
  isPwaInstalled: boolean;
  canInstallPwa: boolean;
  startTask: (categoryId?: string) => void;
  closeTask: () => void;
  submitTask: (optionId: string) => void;
  closeSuccessModal: () => void;
  openPwaModal: () => void;
  closePwaModal: () => void;
  installPwa: () => Promise<void>;
  openWhatsAppSupport: () => void;
  redirectToActivation: () => void;
  resetSessionData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'gix_ai_tasks_lang',
  USER: 'gix_ai_tasks_user',
  SUBMISSIONS: 'gix_ai_tasks_submissions',
  COMPLETED_IDS: 'gix_ai_tasks_completed_ids',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return saved === 'sw' || saved === 'en' ? saved : 'sw'; // Default to Kiswahili / Tanzanian context
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const t = translations[language];

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // 3. User profile & balances (as per prompt specification: initial default displays matching examples)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return {
      id: 'GIX-99482',
      username: 'User_Tanzania_77',
      email: 'annotator77@gix-tasks.ai',
      accountStatus: 'not_activated', // Default not activated as requested
      balancePendingUSD: 18.0, // Matches prompt sample: $18.00
      balanceAvailableUSD: 42.0, // Matches prompt sample: $42.00
      totalEarnedUSD: 120.0, // Matches prompt sample: $120.00
      completedTasksCount: 156, // Matches prompt sample: 156
      joinedDate: 'August 2026',
    };
  });

  // 4. Submissions history
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse submissions', e);
      }
    }
    // Seed with realistic submissions
    return [
      {
        id: 'sub_001',
        taskId: 'task_img_comp_01',
        taskTitle: { en: 'Image Comparison (Mountain Clarity)', sw: 'Ulinganishaji wa Picha (Mandhari)' },
        categoryName: { en: 'Image Comparison', sw: 'Ulinganishaji wa Picha' },
        submittedAt: 'Today, 09:14 AM',
        rewardUSD: 6.0,
        rewardTZS: 6.0 * USD_TO_TZS_RATE,
        status: 'pending',
        selectedOptionLabel: { en: 'Image A', sw: 'Picha A' },
      },
      {
        id: 'sub_002',
        taskId: 'task_ai_comp_01',
        taskTitle: { en: 'AI Response Comparison (Solar Tech)', sw: 'Ulinganishaji wa Majibu ya AI' },
        categoryName: { en: 'AI Response Comparison', sw: 'Ulinganishaji wa Majibu ya AI' },
        submittedAt: 'Today, 08:30 AM',
        rewardUSD: 5.0,
        rewardTZS: 5.0 * USD_TO_TZS_RATE,
        status: 'under_review',
        selectedOptionLabel: { en: 'Response A', sw: 'Jibu A' },
      },
      {
        id: 'sub_003',
        taskId: 'task_audio_comp_01',
        taskTitle: { en: 'Audio Quality Checking (Speech Clarity)', sw: 'Ukaguzi wa Ubora wa Sauti' },
        categoryName: { en: 'Audio Quality Checking', sw: 'Ukaguzi wa Ubora wa Sauti' },
        submittedAt: 'Yesterday, 04:20 PM',
        rewardUSD: 4.5,
        rewardTZS: 4.5 * USD_TO_TZS_RATE,
        status: 'accepted',
        selectedOptionLabel: { en: 'Audio Track A', sw: 'Sauti Sampuli A' },
      },
      {
        id: 'sub_004',
        taskId: 'task_trans_eval_01',
        taskTitle: { en: 'Translation Evaluation (Tech Announcement)', sw: 'Tathmini ya Tafsiri' },
        categoryName: { en: 'Translation Evaluation', sw: 'Tathmini ya Tafsiri' },
        submittedAt: 'Yesterday, 02:11 PM',
        rewardUSD: 3.5,
        rewardTZS: 3.5 * USD_TO_TZS_RATE,
        status: 'accepted',
        selectedOptionLabel: { en: 'Excellent & Natural', sw: 'Tafsiri Bora na ya Kiasili' },
      },
    ];
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_IDS);
    return saved ? JSON.parse(saved) : ['task_trans_eval_01'];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_IDS, JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  // 5. Active Task Modal / State
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  const [successModalData, setSuccessModalData] = useState<{
    taskTitle: LocalizedText;
    rewardUSD: number;
    rewardTZS: number;
    isIncorrect?: boolean;
    originalRewardUSD?: number;
    originalRewardTZS?: number;
    feedbackMessage?: LocalizedText;
    expectedOptionLabel?: LocalizedText;
  } | null>(null);

  // 6. PWA Installation Handler
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsPwaInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPwaPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPwaPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const openPwaModal = () => setIsPwaModalOpen(true);
  const closePwaModal = () => setIsPwaModalOpen(false);

  const installPwa = async () => {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      const choiceResult = await deferredPwaPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setDeferredPwaPrompt(null);
    }
  };

  // 7. Task Actions
  const startTask = (categoryId?: string) => {
    const nextTask = getRotatingTask(categoryId, completedTaskIds);
    setCurrentTask(nextTask);
  };

  const closeTask = () => {
    setCurrentTask(null);
  };

  const submitTask = (optionId: string) => {
    if (!currentTask) return;

    const task = currentTask;
    const selectedOpt = task.options.find((o) => o.id === optionId) || task.options[0];
    
    // Check if the answer matches the expected benchmark answer
    const expectedOptionId = task.correctOptionId || task.options[0]?.id || 'opt_a';
    const isCorrect = optionId === expectedOptionId;
    const expectedOpt = task.options.find((o) => o.id === expectedOptionId) || task.options[0];

    const fullRewardUSD = task.rewardUSD;
    const fullRewardTZS = Math.round(fullRewardUSD * USD_TO_TZS_RATE);

    // Mtu akikosea swal alipwe asilimia 15 tu ya ela aliyopaswa kulipwa (15% payment on incorrect answers)
    const finalRewardUSD = isCorrect
      ? fullRewardUSD
      : Number((fullRewardUSD * 0.15).toFixed(2));
    const finalRewardTZS = Math.round(finalRewardUSD * USD_TO_TZS_RATE);

    const feedbackMessage: LocalizedText = isCorrect
      ? {
          sw: 'Hongera! Umejibu swali kwa usahihi wa 100% na kupewa malipo kamili ya kazi hii.',
          en: 'Congratulations! You answered the benchmark question correctly with 100% full payout.',
        }
      : {
          sw: task.wrongAnswerFeedback?.sw || `Umekosea swali hili! Chaguo sahihi kulingana na vigezo vya AI lilikuwa "${expectedOpt.label.sw}". Kwa mujibu wa kanuni, umelipwa asilimia 15% tu ya malipo ($${finalRewardUSD.toFixed(2)} / TSh ${finalRewardTZS.toLocaleString()}) badala ya 100%.`,
          en: task.wrongAnswerFeedback?.en || `Incorrect answer! The benchmark standard answer was "${expectedOpt.label.en}". Under quality guidelines, you have been awarded 15% partial payout ($${finalRewardUSD.toFixed(2)} / TSh ${finalRewardTZS.toLocaleString()}) instead of 100%.`,
        };

    // Prevent duplicate credit
    const newSubmission: TaskSubmission = {
      id: `sub_${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      categoryName: task.categoryName,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rewardUSD: finalRewardUSD,
      rewardTZS: finalRewardTZS,
      status: 'pending',
      selectedOptionLabel: selectedOpt.label,
      isIncorrect: !isCorrect,
      rewardPercentage: isCorrect ? 100 : 15,
    };

    // Update balances securely with the actual awarded reward (full or 15%)
    setUser((prev) => ({
      ...prev,
      balancePendingUSD: Number((prev.balancePendingUSD + finalRewardUSD).toFixed(2)),
      completedTasksCount: prev.completedTasksCount + 1,
    }));

    setSubmissions((prev) => [newSubmission, ...prev]);
    setCompletedTaskIds((prev) => [...prev, task.id]);

    // Close task engine and trigger animated success/result modal
    setCurrentTask(null);
    setSuccessModalData({
      taskTitle: task.categoryName,
      rewardUSD: finalRewardUSD,
      rewardTZS: finalRewardTZS,
      isIncorrect: !isCorrect,
      originalRewardUSD: fullRewardUSD,
      originalRewardTZS: fullRewardTZS,
      feedbackMessage,
      expectedOptionLabel: expectedOpt.label,
    });
  };

  const closeSuccessModal = () => {
    setSuccessModalData(null);
  };

  // 8. Navigation & External Actions
  const openWhatsAppSupport = () => {
    const url = getWhatsAppLink(language);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const redirectToActivation = () => {
    window.open(ACTIVATION_URL, '_blank', 'noopener,noreferrer');
  };

  const resetSessionData = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_IDS);
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        user,
        submissions,
        currentTask,
        selectedCategoryId,
        setSelectedCategoryId,
        successModalData,
        isPwaModalOpen,
        isPwaInstalled,
        canInstallPwa: !!deferredPwaPrompt,
        startTask,
        closeTask,
        submitTask,
        closeSuccessModal,
        openPwaModal,
        closePwaModal,
        installPwa,
        openWhatsAppSupport,
        redirectToActivation,
        resetSessionData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
