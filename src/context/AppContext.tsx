import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, UserProfile, ChatRoom, ChatPartner } from '../types';
import { translations, ACTIVATION_URL, getWhatsAppLink, USD_TO_TZS_RATE } from '../data/translations';
import { apiService } from '../services/apiService';
import {
  detectVisitorCountry,
  getCountryMeta,
  GEO_STORAGE_KEYS,
  resolveLanguageFromCountry,
} from '../services/geoService';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  detectedCountry: string | null;
  detectedCountryMeta: ReturnType<typeof getCountryMeta>;
  t: typeof translations.sw;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  refreshUserData: () => Promise<void>;

  // Chat Room
  activeChatRoom: ChatRoom | null;
  openChatWithPartner: (partner: ChatPartner) => Promise<void>;
  closeChatRoom: () => void;

  // Reward Popups & Modals
  chatRewardModalData: {
    amountUSD: number;
    amountTZS: number;
    partnerName: string;
    totalPendingUSD: number;
  } | null;
  setChatRewardModalData: (data: any) => void;
  closeChatRewardModal: () => void;

  // Modals
  isRegistrationOpen: boolean;
  openRegistration: () => void;
  closeRegistration: () => void;

  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;

  isSafetyModalOpen: boolean;
  openSafetyModal: () => void;
  closeSafetyModal: () => void;

  isNotificationSettingsOpen: boolean;
  openNotificationSettings: () => void;
  closeNotificationSettings: () => void;

  // Actions
  openActivationLink: () => void;
  openWhatsAppSupport: () => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'gix_chats_active_user',
  LANG: 'gix_chats_lang_pref',
  IS_MANUAL_LANG: 'gix_chats_is_manual_lang',
};

const DEFAULT_USER: UserProfile = {
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
  balancePendingUSD: 18.0,
  balanceAvailableUSD: 0.0,
  totalEarnedUSD: 18.0,
  completedChatsCount: 36,
  chatMinutesCount: 36,
  joinedDate: 'Agosti 2026',
  status: 'online',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    if (saved === 'sw' || saved === 'en') return saved;
    const cachedCountry = localStorage.getItem(GEO_STORAGE_KEYS.DETECTED_COUNTRY);
    if (cachedCountry) return resolveLanguageFromCountry(cachedCountry);
    return 'sw'; // Default Swahili for East African audience
  });

  const [detectedCountry, setDetectedCountry] = useState<string | null>(() => {
    return localStorage.getItem(GEO_STORAGE_KEYS.DETECTED_COUNTRY) || null;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    localStorage.setItem(STORAGE_KEYS.IS_MANUAL_LANG, 'true');
  };

  useEffect(() => {
    const isManual = localStorage.getItem(STORAGE_KEYS.IS_MANUAL_LANG) === 'true';
    if (isManual) return;

    detectVisitorCountry(3000)
      .then((res) => {
        if (res.countryCode) {
          setDetectedCountry(res.countryCode);
          localStorage.setItem(GEO_STORAGE_KEYS.DETECTED_COUNTRY, res.countryCode);
        }
        if (!localStorage.getItem(STORAGE_KEYS.IS_MANUAL_LANG)) {
          setLanguageState(res.resolvedLanguage);
          localStorage.setItem(STORAGE_KEYS.LANG, res.resolvedLanguage);
        }
      })
      .catch(() => {});
  }, []);

  const detectedCountryMeta = getCountryMeta(detectedCountry);
  const t = translations[language];

  // 2. Navigation Tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['home', 'find', 'chats', 'earnings', 'withdraw', 'profile'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'home';
  });

  // 3. User profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USER;
  });

  // Sync user from backend
  const refreshUserData = useCallback(async () => {
    try {
      const liveUser = await apiService.getCurrentUser(user.id);
      if (liveUser) {
        setUser(liveUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(liveUser));
      }
    } catch (e) {
      console.warn('Could not sync user from server:', e);
    }
  }, [user.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // 4. Active Chat Room
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);

  const openChatWithPartner = async (partner: ChatPartner) => {
    const room = await apiService.startChatRoom(user.id, {
      partnerId: partner.id,
      partnerName: partner.name,
      partnerUsername: partner.username,
      partnerAvatar: partner.avatarUrl,
      partnerCountry: partner.country,
      partnerFlag: partner.countryFlag,
      partnerLevel: partner.kiswahiliLevel,
    });

    if (room) {
      setActiveChatRoom(room);
      setActiveTab('chats');
    }
  };

  const closeChatRoom = () => {
    setActiveChatRoom(null);
  };

  // 5. Chat Reward Modal
  const [chatRewardModalData, setChatRewardModalData] = useState<{
    amountUSD: number;
    amountTZS: number;
    partnerName: string;
    totalPendingUSD: number;
  } | null>(null);

  const closeChatRewardModal = () => {
    setChatRewardModalData(null);
  };

  // 6. Modals
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const openRegistration = () => setIsRegistrationOpen(true);
  const closeRegistration = () => setIsRegistrationOpen(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const openSafetyModal = () => setIsSafetyModalOpen(true);
  const closeSafetyModal = () => setIsSafetyModalOpen(false);

  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const openNotificationSettings = () => setIsNotificationSettingsOpen(true);
  const closeNotificationSettings = () => setIsNotificationSettingsOpen(false);

  // 7. External Actions
  const openActivationLink = () => {
    window.open(ACTIVATION_URL, '_blank', 'noopener,noreferrer');
  };

  const openWhatsAppSupport = () => {
    const url = getWhatsAppLink(language);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const logoutUser = () => {
    setUser(DEFAULT_USER);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        detectedCountry,
        detectedCountryMeta,
        t,
        activeTab,
        setActiveTab,
        user,
        setUser,
        refreshUserData,
        activeChatRoom,
        openChatWithPartner,
        closeChatRoom,
        chatRewardModalData,
        setChatRewardModalData,
        closeChatRewardModal,
        isRegistrationOpen,
        openRegistration,
        closeRegistration,
        isLoginOpen,
        openLogin,
        closeLogin,
        isSafetyModalOpen,
        openSafetyModal,
        closeSafetyModal,
        isNotificationSettingsOpen,
        openNotificationSettings,
        closeNotificationSettings,
        openActivationLink,
        openWhatsAppSupport,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const fallbackContext: AppContextType = {
  language: 'sw',
  setLanguage: () => {},
  detectedCountry: 'TZ',
  detectedCountryMeta: getCountryMeta('TZ'),
  t: translations.sw,
  activeTab: 'home',
  setActiveTab: () => {},
  user: DEFAULT_USER,
  setUser: () => {},
  refreshUserData: async () => {},
  activeChatRoom: null,
  openChatWithPartner: async () => {},
  closeChatRoom: () => {},
  chatRewardModalData: null,
  setChatRewardModalData: () => {},
  closeChatRewardModal: () => {},
  isRegistrationOpen: false,
  openRegistration: () => {},
  closeRegistration: () => {},
  isLoginOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  isSafetyModalOpen: false,
  openSafetyModal: () => {},
  closeSafetyModal: () => {},
  isNotificationSettingsOpen: false,
  openNotificationSettings: () => {},
  closeNotificationSettings: () => {},
  openActivationLink: () => {
    window.open(ACTIVATION_URL, '_blank', 'noopener,noreferrer');
  },
  openWhatsAppSupport: () => {
    const url = getWhatsAppLink('sw');
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  logoutUser: () => {},
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    return fallbackContext;
  }
  return context;
};
