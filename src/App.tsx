import React, { useState, useMemo, useEffect } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  UserPlus,
  MessageCircle,
  CheckCircle2,
  Search,
  Lock,
  AlertCircle,
  ArrowRight,
  Check,
  MessageSquare,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { NotificationPromptModal } from './components/NotificationPromptModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { ForeignerChatModal } from './components/ForeignerChatModal';
import { ChatRewardPendingModal } from './components/ChatRewardPendingModal';
import { pushService } from './services/pushNotificationService';
import { AppProvider } from './context/AppContext';
import { UsersCommentsSection } from './components/UsersCommentsSection';
import {
  ForeignerProfile,
  Network,
  REG_URL,
  WHATSAPP_URL,
  getDailyForeigners,
  getSwahiliDateString,
  ALL_FOREIGNERS,
} from './data/foreignersData';

// ==========================================
// 1. HELPERS & STORAGE
// ==========================================
const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const getStoredPaidIds = (): string[] => {
  try {
    const raw = localStorage.getItem(`gix_paid_${getTodayKey()}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getStoredBalance = (): number => {
  try {
    const raw = localStorage.getItem(`gix_bal_${getTodayKey()}`);
    return raw ? JSON.parse(raw) : 0;
  } catch {
    return 0;
  }
};

export interface WithdrawalRecord {
  id: string;
  amount: number;
  phone: string;
  network: Network;
  date: string;
  status: 'Inashughulikiwa' | 'Imekamilika';
}

export interface TickerItem {
  id: string;
  name: string;
  amount: number;
  network: string;
  message: string;
  timeAgo?: string;
}

const LOGO_IMG =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

const NAMES = [
  'Aisha M.',
  'John K.',
  'Neema S.',
  'Baraka D.',
  'Zawadi E.',
  'Hassan R.',
  'Mariam T.',
  'Juma L.',
  'Rehema P.',
  'Frank M.',
  'Lucy N.',
  'Omar B.',
  'Emmanuel J.',
  'Grace M.',
  'Kelvin P.',
  'Salma A.',
];

const NETWORKS: Network[] = ['M-Pesa', 'TigoPesa', 'Airtel Money', 'Halopesa', 'AzamPesa'];

export function generateTickerItem(): TickerItem {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const amount = (Math.floor(Math.random() * 27) + 10) * 5000;
  const net = NETWORKS[Math.floor(Math.random() * NETWORKS.length)];
  const minutesAgo = Math.floor(Math.random() * 12) + 1;

  return {
    id: Math.random().toString(36).slice(2),
    name,
    amount,
    network: net,
    message: `${name} ametoa TZS ${amount.toLocaleString()} kwa kuchat na wazungu [${net}]`,
    timeAgo: `${minutesAgo}m ago`,
  };
}

// Authentic Real WhatsApp Logo SVG Component
function RealWhatsAppIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.2 8.24zm4.52-6.18c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.06s.88 2.39 1 2.56c.12.17 1.74 2.65 4.21 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

// ==========================================
// 2. GLOBAL STORE (Zustand)
// ==========================================
interface AppState {
  balance: number;
  pendingBalance: number;
  withdrawOpen: boolean;
  registerOpen: boolean;
  notifModalOpen: boolean;
  selectedForeigner: ForeignerProfile | null;
  activeChatForeigner: ForeignerProfile | null;
  chatModalOpen: boolean;
  rewardModalOpen: boolean;
  lastReward: { foreigner: ForeignerProfile; amountTsh: number; usdRate: number } | null;
  withdrawals: WithdrawalRecord[];
  paidForeignerIds: string[]; // Foreigners already paid today
  paidAlertForeigner: ForeignerProfile | null; // For already-paid popup notification

  setWithdrawOpen: (open: boolean) => void;
  setRegisterOpen: (open: boolean) => void;
  openWithdraw: () => void;
  closeWithdraw: () => void;
  openRegister: (foreigner?: ForeignerProfile) => void;
  closeRegister: () => void;
  openNotifModal: () => void;
  closeNotifModal: () => void;

  openChat: (foreigner: ForeignerProfile) => void;
  closeChat: () => void;
  completeChat: (foreigner: ForeignerProfile) => void;
  closeRewardModal: () => void;
  setPaidAlertForeigner: (foreigner: ForeignerProfile | null) => void;

  submitWithdraw: (amount: number, phone: string, network: Network) => { ok: boolean; error?: string };
}

export const useAppStore = create<AppState>((set, get) => ({
  balance: getStoredBalance(),
  pendingBalance: getStoredBalance(),
  withdrawOpen: false,
  registerOpen: false,
  notifModalOpen: false,
  selectedForeigner: null,
  activeChatForeigner: null,
  chatModalOpen: false,
  rewardModalOpen: false,
  lastReward: null,
  withdrawals: [],
  paidForeignerIds: getStoredPaidIds(),
  paidAlertForeigner: null,

  setWithdrawOpen: (open) => set({ withdrawOpen: open }),
  setRegisterOpen: (open) => set({ registerOpen: open }),
  openWithdraw: () => set({ withdrawOpen: true }),
  closeWithdraw: () => set({ withdrawOpen: false }),
  openRegister: (foreigner) => set({ registerOpen: true, selectedForeigner: foreigner || null }),
  closeRegister: () => set({ registerOpen: false, selectedForeigner: null }),
  openNotifModal: () => set({ notifModalOpen: true }),
  closeNotifModal: () => set({ notifModalOpen: false }),

  openChat: (foreigner) => {
    // If already paid today, do not allow chatting again
    if (get().paidForeignerIds.includes(foreigner.id)) {
      set({ paidAlertForeigner: foreigner });
      return;
    }
    set({ activeChatForeigner: foreigner, chatModalOpen: true });
  },

  closeChat: () => set({ chatModalOpen: false, activeChatForeigner: null }),

  // When chat completes: mark as PAID for today, put money in balance, show pending reward
  completeChat: (foreigner) => {
    set((state) => {
      const newPaid = state.paidForeignerIds.includes(foreigner.id)
        ? state.paidForeignerIds
        : [...state.paidForeignerIds, foreigner.id];
      const newBalance = state.balance + foreigner.ratePerChat;
      const newPending = state.pendingBalance + foreigner.ratePerChat;

      try {
        localStorage.setItem(`gix_paid_${getTodayKey()}`, JSON.stringify(newPaid));
        localStorage.setItem(`gix_bal_${getTodayKey()}`, JSON.stringify(newBalance));
      } catch {}

      return {
        chatModalOpen: false,
        activeChatForeigner: null,
        balance: newBalance, // Put in balance as requested!
        pendingBalance: newPending,
        paidForeignerIds: newPaid, // Marked as paid for today!
        rewardModalOpen: true,
        lastReward: {
          foreigner,
          amountTsh: foreigner.ratePerChat,
          usdRate: foreigner.usdRate,
        },
      };
    });
  },

  closeRewardModal: () => set({ rewardModalOpen: false, lastReward: null }),
  setPaidAlertForeigner: (foreigner) => set({ paidAlertForeigner: foreigner }),

  submitWithdraw: (amount, phone, network) => {
    // REQUIREMENT: When user wants to withdraw, require opening account first!
    return {
      ok: false,
      error: `Akaunti yako inahitaji kufunguliwa kwanza! Ili utoe salio lako la TZS ${get().balance.toLocaleString()} kwenye ${network} (${phone}), gusa kitufe cha 'Fungua Account' kujiunga rasmi.`,
    };
  },
}));

// ==========================================
// 3. COMPONENTS
// ==========================================

function Navbar() {
  const openWithdraw = useAppStore((s) => s.openWithdraw);
  const openRegister = useAppStore((s) => s.openRegister);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'sw' | 'en'>('sw');
  const balance = useAppStore((s) => s.balance);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090b14]/95 border-b border-[#00E5FF]/15 shadow-xl">
        <div className="max-w-4xl mx-auto px-3 sm:px-5 h-15 sm:h-16 flex items-center justify-between">
          {/* Brand Logo matching screenshot */}
          <div
            id="navbar-brand-btn"
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#00E5FF] via-[#6C3BFF] to-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.6)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0b0f19] overflow-hidden p-0.5 flex items-center justify-center">
                  <img
                    src={LOGO_IMG}
                    alt="GIX CHAT Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              {/* Online Green Badge Indicator at bottom right */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#22c55e] border-2 border-[#090b14] shadow-[0_0_8px_#22c55e] animate-pulse" />
            </div>

            <div className="flex items-center tracking-tight">
              <span className="text-base sm:text-xl font-black text-white">GIX</span>
              <span className="text-base sm:text-xl font-black text-[#00E5FF] ml-1.5 drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]">
                CHAT
              </span>
            </div>
          </div>

          {/* Right Controls: Language, Salio Lako, Msaada, Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Salio Lako Button (shows live earnings from chats) */}
            <button
              id="nav-balance-btn"
              onClick={openWithdraw}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#111726] border border-[#22c55e]/60 text-white hover:border-[#22c55e] hover:bg-[#15232a] transition shadow-[0_0_10px_rgba(34,197,94,0.25)] cursor-pointer"
            >
              <Wallet size={14} className="text-[#22c55e] shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[7px] uppercase tracking-wider text-gray-400 font-bold leading-none">
                  Salio Lako
                </span>
                <span className="text-[11px] sm:text-xs font-black text-[#22c55e] leading-tight">
                  TZS {balance.toLocaleString()}
                </span>
              </div>
            </button>

            {/* Language dropdown */}
            <div className="relative">
              <button
                id="language-select-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#111726] border border-[#00E5FF]/25 text-gray-200 text-[11px] font-semibold hover:border-[#00E5FF] transition shadow-inner cursor-pointer"
              >
                <span className="text-xs">🌐</span>
                <span className="text-[10px] sm:text-[11px]">{currentLang === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span>
                <span className="text-[8px] text-gray-400">⌵</span>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-1 w-32 bg-[#121829] border border-[#00E5FF]/30 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                  >
                    <button
                      onClick={() => {
                        setCurrentLang('sw');
                        setLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-[#1f2942] flex items-center gap-2 cursor-pointer"
                    >
                      <span>🇹🇿</span> <span>Kiswahili</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLang('en');
                        setLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-[#1f2942] flex items-center gap-2 cursor-pointer"
                    >
                      <span>🇬🇧</span> <span>English</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger menu button */}
            <button
              id="hamburger-menu-btn"
              onClick={() => setSideMenuOpen(true)}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#111726] border border-gray-700/60 text-gray-200 hover:text-white hover:border-[#00E5FF] transition cursor-pointer"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1 w-3.5 sm:w-4">
                <span className="h-0.5 w-full bg-gray-200 rounded-full" />
                <span className="h-0.5 w-full bg-gray-200 rounded-full" />
                <span className="h-0.5 w-full bg-gray-200 rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {sideMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 bg-[#0e1322] h-full p-5 border-l border-[#00E5FF]/30 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white">GIX</span>
                    <span className="text-lg font-black text-[#00E5FF]">CHAT</span>
                  </div>
                  <button
                    onClick={() => setSideMenuOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-2.5">
                  {/* Salio Lako Card */}
                  <div
                    onClick={() => {
                      setSideMenuOpen(false);
                      openWithdraw();
                    }}
                    className="p-3 rounded-xl bg-[#151d33] border border-[#22c55e]/40 cursor-pointer hover:border-[#22c55e] transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Salio Lako la Chat</span>
                      <Wallet size={16} className="text-[#22c55e]" />
                    </div>
                    <p className="text-base font-black text-[#22c55e] mt-0.5">
                      TZS {balance.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-[#00E5FF] font-semibold mt-1 inline-block">
                      Gusa hapa kutoa pesa →
                    </span>
                  </div>

                  <a
                    href={REG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#151d33] border border-gray-800 text-xs font-bold text-white hover:border-[#00E5FF] flex items-center gap-2.5 cursor-pointer block"
                  >
                    <UserPlus size={15} className="text-[#ec4899]" />
                    <span>Fungua Account (15,000 Tsh)</span>
                  </a>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#151d33] border border-gray-800 text-xs font-bold text-white hover:border-[#22c55e] flex items-center gap-2.5 cursor-pointer block"
                  >
                    <MessageCircle size={15} className="text-[#22c55e]" />
                    <span>Customer Care (WhatsApp)</span>
                  </a>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 text-center pt-4 border-t border-gray-800">
                GIX CHAT • Mazungumzo & Mapato Mtandaoni
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroSection() {
  const openRegister = useAppStore((s) => s.openRegister);
  const [showInstallToast, setShowInstallToast] = useState(false);

  // Dynamic Swahili Date that changes every day automatically
  const swahiliDate = useMemo(() => getSwahiliDateString(), []);

  const handleInstallApp = () => {
    setShowInstallToast(true);
    setTimeout(() => setShowInstallToast(false), 5000);
  };

  return (
    <section className="w-full bg-[#0b0b12] py-2.5 sm:py-3.5 px-3">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Centered INSTALL APP Button matching screenshot (compact) */}
        <div className="mb-2 sm:mb-2.5">
          <button
            id="install-app-btn"
            onClick={handleInstallApp}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#7928CA] via-[#6C3BFF] to-[#0070F3] text-white text-[11px] sm:text-xs font-black shadow-[0_0_15px_rgba(121,40,202,0.5)] hover:shadow-[0_0_20px_rgba(121,40,202,0.8)] hover:scale-105 active:scale-95 transition-all uppercase tracking-wider cursor-pointer border border-white/20"
          >
            <span className="text-sm">📥</span>
            <span>INSTALL APP</span>
          </button>
        </div>

        {showInstallToast && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 p-2 bg-[#151c2e] border border-[#00E5FF]/50 rounded-xl text-center text-[11px] text-[#00E5FF]"
          >
            Ili ku-install: Gusa alama ya <span className="font-bold">Share/Menu</span> ya kivinjari chako kisha chagua <span className="font-bold">"Add to Home screen"</span>!
          </motion.div>
        )}

        {/* Main Glowing Hero Card (compact & sleek) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full rounded-2xl p-3 sm:p-4 bg-[#0d1424]/90 border border-[#00E5FF]/35 shadow-[0_0_25px_rgba(0,229,255,0.12)] backdrop-blur-xl relative"
        >
          {/* Main Headline */}
          <div className="text-center">
            <h2 className="text-xs sm:text-sm font-bold text-white leading-tight tracking-tight">
              Anza Kuchat na Wazungu Mbalimbali na
            </h2>
            <div className="mt-0.5 flex items-center justify-center gap-1.5 text-sm sm:text-base font-black tracking-tight">
              <span className="text-[#ec4899] drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]">
                Kulipwa
              </span>
              <span className="text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]">
                Hapo Hapo
              </span>
            </div>
          </div>

          {/* Sub-banner Highlight Box with teal border */}
          <div className="my-2 sm:my-2.5 p-2 sm:p-2.5 rounded-xl bg-[#09111e] border border-emerald-500/40 text-center">
            <p className="text-[10px] sm:text-[11px] text-emerald-300 font-semibold leading-snug">
              <span className="mr-1">💰</span>
              Tengeneza kuanzia TSh 50,000/= na kuendelea kwa siku kwa kuchat na wazungu, fungua account yako uweze kuanza leo kwa 15,000 pekee
            </p>
          </div>

          {/* Glowing Pink/Red Button: GUSA HAPA FUNGUA ACCOUNT */}
          <div className="mt-1.5">
            <button
              id="gusa-hapa-fungua-account-main-btn"
              onClick={() => openRegister()}
              className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-[#ec4899] via-pink-600 to-[#ec4899] text-white font-black text-[11px] sm:text-xs shadow-[0_0_20px_rgba(236,72,153,0.75)] hover:shadow-[0_0_28px_#ec4899] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
            >
              <span className="text-sm">↗</span>
              <span className="whitespace-nowrap font-black">GUSA HAPA FUNGUA ACCOUNT</span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic Date Badge that updates every single day */}
        <div className="mt-3.5 sm:mt-4 w-full flex flex-col items-start gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] sm:text-[11px] font-bold">
            <Sparkles size={12} className="text-emerald-400 animate-pulse" />
            <span>Wazungu wa Kuchat Nao Leo • {swahiliDate.fullDate}</span>
          </div>

          <div className="flex items-center justify-between w-full mt-0.5 flex-wrap gap-2">
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
              Wazungu wa Kuchat Nao Leo ({swahiliDate.shortDate})
            </h3>

            <button
              id="anza-kuchat-header-btn"
              onClick={() => openRegister()}
              className="text-[#ec4899] font-black uppercase text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg bg-[#ec4899]/20 border border-[#ec4899]/50 hover:bg-[#ec4899]/30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_10px_#ec489940] animate-pulse cursor-pointer flex items-center gap-1"
            >
              <MessageSquare size={12} className="text-[#ec4899]" />
              <span>ANZA KUCHAT</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ForeignersSection() {
  const [query, setQuery] = useState('');
  const openChat = useAppStore((s) => s.openChat);
  const paidForeignerIds = useAppStore((s) => s.paidForeignerIds);
  const setPaidAlertForeigner = useAppStore((s) => s.setPaidAlertForeigner);

  // Show all 16 foreigners on the site, with live search filtering
  const filtered = useMemo(() => {
    if (!query) return ALL_FOREIGNERS;
    const q = query.toLowerCase();
    return ALL_FOREIGNERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.topic.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="max-w-xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
      {/* Wazungu Header Count */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-black text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Wazungu {filtered.length} Wapo Online Tayari Kuchat</span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/30">
          Dakika 1 tu Kila Mmoja
        </span>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="search-foreigners-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tafuta mzungu (k.m. Jessica, Michael, Sweden, Zanzibar)..."
            className="w-full bg-[#121829] border border-[#00E5FF]/25 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] shadow-inner transition"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2 Columns on Mobile & Desktop */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-3.5">
        {filtered.map((client) => {
          const isPaid = paidForeignerIds.includes(client.id);

          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl p-2 sm:p-3 border flex flex-col justify-between transition-all duration-200 shadow-md relative overflow-hidden group cursor-pointer ${
                isPaid
                  ? 'bg-[#101b1b] border-emerald-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                  : 'bg-[#141424] border-[#6C3BFF]/30 hover:border-[#00E5FF]/60'
              }`}
              onClick={() => {
                if (isPaid) {
                  setPaidAlertForeigner(client);
                } else {
                  openChat(client);
                }
              }}
            >
              {/* Top Tag & Country */}
              <div className="flex items-center justify-between gap-1 mb-1">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-emerald-300 bg-emerald-500/25 border border-emerald-500/50 px-1.5 py-0.5 rounded-full">
                    <Check size={10} className="text-emerald-400" />
                    <span>PAID</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{client.badge || 'ONLINE'}</span>
                  </span>
                )}
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold truncate">
                  {client.country}
                </span>
              </div>

              {/* Profile Avatar & Details */}
              <div className="flex flex-col items-center text-center mb-1.5">
                <div className="relative mb-1">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className={`w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-xl object-cover border shadow-md group-hover:scale-105 transition-transform duration-200 ${
                      isPaid ? 'border-emerald-500/60' : 'border-[#00E5FF]/50'
                    }`}
                    loading="eager"
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs sm:text-sm drop-shadow">
                    {client.flag}
                  </span>
                </div>

                <h4 className="font-black text-white text-[11px] sm:text-sm leading-tight truncate max-w-full">
                  {client.name}
                </h4>

                <span className="text-[8px] sm:text-[9px] text-cyan-300 font-medium truncate max-w-full mt-0.5">
                  Mada: {client.topic}
                </span>

                <p className="text-[8px] sm:text-[9px] text-gray-300 italic line-clamp-1 mt-0.5 px-0.5 leading-tight">
                  "{client.bio}"
                </p>
              </div>

              {/* Payout & Start Chats Action */}
              <div className="pt-1.5 border-t border-gray-800/80 mt-auto flex flex-col gap-1">
                <div className="text-center">
                  <span className={`text-[7px] sm:text-[8px] uppercase font-semibold block leading-none ${isPaid ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {isPaid ? 'Umelipwa Leo:' : 'Anayolipa kwa Chat:'}
                  </span>
                  <span className={`font-black text-[10px] sm:text-xs block leading-tight mt-0.5 tracking-tight ${isPaid ? 'text-emerald-300' : 'text-[#00E5FF]'}`}>
                    {client.usdRate}$ = {client.ratePerChat.toLocaleString()} TSH {isPaid && '(Paid)'}
                  </span>
                </div>

                {isPaid ? (
                  <button
                    id={`chat-btn-${client.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPaidAlertForeigner(client);
                    }}
                    className="w-full bg-[#12241e] border border-emerald-500/50 py-1.5 sm:py-2 px-1 rounded-xl text-emerald-300 font-black text-[9px] sm:text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-inner"
                  >
                    <Check size={11} className="text-emerald-400" />
                    <span className="whitespace-nowrap font-black">PAID (UMELIPWA LEO)</span>
                  </button>
                ) : (
                  <button
                    id={`chat-btn-${client.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openChat(client);
                    }}
                    className="w-full bg-gradient-to-r from-[#ec4899] via-pink-600 to-[#6C3BFF] py-1.5 sm:py-2 px-1 rounded-xl text-white font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-95 transition shadow-[0_0_12px_#ec489960] hover:shadow-[0_0_18px_#ec4899] uppercase tracking-wide cursor-pointer border border-white/20"
                  >
                    <MessageSquare size={12} className="shrink-0 animate-bounce" />
                    <span className="whitespace-nowrap font-black">START CHATS</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function RegisterModal() {
  const open = useAppStore((s) => s.registerOpen);
  const close = useAppStore((s) => s.closeRegister);
  const selectedForeigner = useAppStore((s) => s.selectedForeigner);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#151524] rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full border-2 border-[#00E5FF] relative shadow-[0_0_40px_#00E5FF40] text-center my-auto"
      >
        <button
          id="close-register-modal-btn"
          onClick={close}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <CheckCircle2 size={42} className="text-[#22c55e] mx-auto mb-1.5 animate-pulse" />

        <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug px-1">
          ILI KUANZA KUCHAT <span className="text-[#00E5FF]">GUSA HAPA</span> KUFUNGUA ACCOUNT
        </h3>

        {selectedForeigner && (
          <div className="my-2.5 p-2 rounded-xl bg-[#0b0b12] border border-[#6C3BFF]/40 flex items-center gap-2.5 text-left">
            <img
              src={selectedForeigner.avatar}
              alt={selectedForeigner.name}
              className="w-10 h-10 rounded-lg object-cover border border-[#00E5FF]/40 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">
                Kuchat na: {selectedForeigner.flag} {selectedForeigner.name}
              </p>
              <p className="text-[10px] text-[#00E5FF] font-semibold">
                Anayolipa: {selectedForeigner.usdRate}$ = {selectedForeigner.ratePerChat.toLocaleString()} TSH
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-300 mt-1.5 leading-relaxed px-1">
          Ada ya usajili ni <span className="text-[#00E5FF] font-black text-sm">TZS 15,000</span> pekee na utaunganishwa moja kwa moja kuanza kuchat na kulipwa papo hapo!
        </p>

        <div className="bg-[#0b0b12] p-2.5 rounded-xl border border-gray-800 mt-3 text-left space-y-1.5 text-[11px] text-gray-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Check size={13} className="shrink-0" />
            <span>Malipo yanatumwa moja kwa moja kwenye simu yako</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Check size={13} className="shrink-0" />
            <span>M-Pesa, TigoPesa, Airtel Money, Halopesa, AzamPesa</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Check size={13} className="shrink-0" />
            <span>Ulinzi na usalama wa taarifa zako 100%</span>
          </div>
        </div>

        {/* Primary Action Button - Directed to https://moxeraagencies.com/register?ref=Cp3 */}
        <div className="mt-4 px-1">
          <a
            id="direct-register-link-btn"
            href={REG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-[#00E5FF] via-[#6C3BFF] to-[#ec4899] py-3 px-3 rounded-xl text-white font-black text-xs sm:text-sm shadow-[0_0_20px_#00E5FF60] hover:scale-[1.02] active:scale-95 transition tracking-wide uppercase flex items-center justify-center text-center border border-white/20 cursor-pointer block"
          >
            <span className="leading-snug">GUSA HAPA KUFUNGUA ACCOUNT</span>
          </a>
        </div>

        <p className="text-[10px] text-gray-400 mt-2.5 flex items-center justify-center gap-1">
          <Lock size={11} className="text-emerald-400 shrink-0" />
          <span>Usajili salama na ulinzi wa taarifa zako 100%</span>
        </p>
      </motion.div>
    </div>
  );
}

// Modal alerting user that they already completed chat with this foreigner for today
function PaidAlertModal() {
  const foreigner = useAppStore((s) => s.paidAlertForeigner);
  const setPaidAlertForeigner = useAppStore((s) => s.setPaidAlertForeigner);
  const openWithdraw = useAppStore((s) => s.openWithdraw);

  if (!foreigner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#121929] rounded-3xl p-5 max-w-sm w-full border-2 border-emerald-500 relative shadow-[0_0_35px_rgba(34,197,94,0.3)] text-center"
      >
        <button
          onClick={() => setPaidAlertForeigner(null)}
          className="absolute top-3.5 right-3.5 p-1 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-2">
          <CheckCircle2 size={28} />
        </div>

        <h3 className="text-base font-black text-white">
          UMEKWISHA LIPWA NA {foreigner.name.toUpperCase()} LEO!
        </h3>

        <div className="my-2.5 p-2 rounded-xl bg-[#09111c] border border-emerald-500/30 text-emerald-300 font-bold text-xs">
          Malipo: TZS {foreigner.ratePerChat.toLocaleString()} tayari yapo kwenye salio lako!
        </div>

        <p className="text-[11px] text-gray-300 leading-relaxed">
          Kila mzungu analipa mara moja kwa siku. Unaweza kuchat na wazungu wengine wanaosubiri, au urudi kesho kwa zamu mpya ya {foreigner.name}.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={REG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#6C3BFF] to-[#ec4899] text-white font-black text-xs uppercase shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer block text-center border border-white/20"
          >
            GUSA HAPA KUFUNGUA ACCOUNT
          </a>

          <button
            onClick={() => setPaidAlertForeigner(null)}
            className="w-full py-2 rounded-xl bg-[#19243a] text-gray-300 font-semibold text-xs border border-gray-700 hover:text-white cursor-pointer"
          >
            Chagua Mzungu Mwingine
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function WithdrawModal() {
  const open = useAppStore((s) => s.withdrawOpen);
  const close = useAppStore((s) => s.closeWithdraw);
  const balance = useAppStore((s) => s.balance);
  const submitWithdraw = useAppStore((s) => s.submitWithdraw);
  const withdrawals = useAppStore((s) => s.withdrawals);

  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState<Network>('M-Pesa');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedback({ ok: false, msg: 'Tafadhali ingiza kiasi sahihi cha pesa unachotaka kutoa' });
      return;
    }
    const res = submitWithdraw(numAmount, phone, network);
    if (!res.ok) {
      setFeedback({ ok: false, msg: res.error || 'Akaunti inahitaji kufunguliwa kwanza!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#151524] rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full border-2 border-[#22c55e] relative shadow-[0_0_35px_#22c55e35] my-auto"
      >
        <button
          id="close-withdraw-modal-btn"
          onClick={close}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e] shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">TOA PESA KWENYE SIMU</h3>
            <p className="text-[11px] text-gray-400">
              Salio Lako la Chat: <span className="text-[#22c55e] font-black text-sm">TZS {balance.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* REQUIREMENT: When user wants to withdraw, explicitly demand opening account first! */}
        <div className="mb-3.5 p-3 bg-[#0d1624] border-2 border-amber-500/50 rounded-2xl text-xs text-amber-200">
          <div className="flex items-center gap-2 font-black text-amber-300">
            <Lock size={16} className="text-amber-400 shrink-0" />
            <span>AKAUNTI INAHITAJI KUFUNGULIWA KWANZA</span>
          </div>
          <p className="mt-1 text-[11px] text-gray-300 leading-snug">
            Salio lako la <strong className="text-emerald-400">TZS {balance.toLocaleString()}</strong> lipo PENDING. Ili kuhamisha fedha hizi kwenye namba yako ya simu (M-Pesa, TigoPesa, Airtel Money, Halopesa au AzamPesa), unapaswa kufungua akaunti yako kwanza.
          </p>
          <a
            href={REG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#6C3BFF] to-[#ec4899] text-white font-black text-xs uppercase shadow-[0_0_20px_rgba(0,229,255,0.6)] flex items-center justify-center gap-1.5 cursor-pointer block text-center border border-white/20"
          >
            <span>GUSA HAPA KUFUNGUA ACCOUNT</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {feedback && (
          <div
            className={`mb-3 p-2.5 rounded-xl text-[11px] font-semibold ${
              feedback.ok
                ? 'bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e]'
                : 'bg-red-500/20 border border-red-500/40 text-red-300'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Chagua Mtandao wa Malipo:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {NETWORKS.map((net) => (
                <button
                  type="button"
                  key={net}
                  onClick={() => setNetwork(net)}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                    network === net
                      ? 'bg-[#22c55e] text-black border-[#22c55e]'
                      : 'bg-[#0b0b12] text-gray-300 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Namba ya Simu ya Kupokelea (Tanzania):
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mfano: 0712345678"
              className="w-full bg-[#0b0b12] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Kiasi cha Kutoa (TZS):
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={balance > 0 ? `Salio lako: TZS ${balance.toLocaleString()}` : 'Kiasi cha chini ni 5,000'}
              className="w-full bg-[#0b0b12] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#22c55e] to-emerald-600 py-2.5 rounded-xl text-black font-black text-xs sm:text-sm shadow-[0_0_15px_#22c55e40] hover:scale-[1.02] active:scale-95 transition mt-1 cursor-pointer uppercase"
          >
            Thibitisha Kutoa Pesa
          </button>
        </form>

        {withdrawals.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-gray-800">
            <h4 className="text-[11px] font-bold text-gray-300 mb-1.5">Historia ya Maombi Yako:</h4>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="bg-[#0b0b12] p-2 rounded-lg flex items-center justify-between text-[10px] border border-gray-800"
                >
                  <div>
                    <span className="font-bold text-white">TZS {w.amount.toLocaleString()}</span>
                    <span className="text-gray-400 ml-1">
                      ({w.network} • {w.phone})
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ONLY ONE WHATSAPP WIDGET (ON THE RIGHT SIDE), LEFT SIDE COMPLETELY REMOVED
function WhatsAppWidgets() {
  const [showRightTooltip, setShowRightTooltip] = useState(true);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    const interval = setInterval(() => {
      setShowRightTooltip(true);
      hideTimer = setTimeout(() => {
        setShowRightTooltip(false);
      }, 7000);
    }, 17000);

    hideTimer = setTimeout(() => {
      setShowRightTooltip(false);
    }, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    /* Right-side ONLY floating WhatsApp widget with tooltip directly above it */
    <div className="fixed bottom-12 sm:bottom-14 right-3 sm:right-5 z-40 flex flex-col items-end">
      {/* Tooltip positioned directly above right WhatsApp button */}
      <AnimatePresence>
        {showRightTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="mb-2.5 max-w-[220px] sm:max-w-[250px] p-2.5 rounded-2xl bg-[#0d1527]/98 border-2 border-[#25D366] shadow-[0_0_25px_rgba(37,211,102,0.5)] backdrop-blur-xl relative"
          >
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#25D366] shadow-[0_0_10px_#25D366] flex items-center justify-center text-white shrink-0 mt-0.5">
                <RealWhatsAppIcon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-[11px] font-medium text-emerald-100 leading-snug">
                  Kama una swali lolote wasiliana na <span className="text-[#25D366] font-black">Customer Care</span> kwa msaada zaidi kwa kugusa hapa WhatsApp!
                </p>
              </div>
            </div>

            {/* Pointer arrow pointing directly down to the circular button */}
            <div className="absolute -bottom-2 right-6 w-3.5 h-3.5 bg-[#0d1527] border-r-2 border-b-2 border-[#25D366] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circled WhatsApp button with pulsating glowing rings */}
      <div className="relative group">
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-60 blur-md animate-pulse pointer-events-none" />

        <a
          id="floating-whatsapp-btn"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] w-13 h-13 sm:w-15 sm:h-15 rounded-full shadow-[0_0_25px_#25D366,0_0_45px_rgba(37,211,102,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40 cursor-pointer"
          aria-label="Customer Care WhatsApp"
        >
          <RealWhatsAppIcon size={30} className="text-white drop-shadow-md" />

          <span className="absolute -top-7 right-0 bg-[#0d1624]/95 px-2 py-0.5 rounded-full text-[9px] font-black text-[#25D366] whitespace-nowrap border border-[#25D366]/60 shadow-[0_0_10px_rgba(37,211,102,0.4)]">
            CUSTOMER CARE
          </span>
        </a>
      </div>
    </div>
  );
}

function WithdrawalTicker() {
  const [items, setItems] = useState<TickerItem[]>(() =>
    Array.from({ length: 12 }, () => generateTickerItem())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => [...prev.slice(1), generateTickerItem()]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const displayItems = [...items, ...items];

  return (
    <aside
      aria-label="Taarifa za Malipo ya Live"
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#0c0c1a]/95 backdrop-blur-lg border-t border-emerald-500/40 shadow-[0_-4px_20px_rgba(0,0,0,0.7)] py-1.5 overflow-hidden"
    >
      <div className="flex items-center">
        <div className="px-2.5 sm:px-3 py-0.5 text-emerald-400 font-black text-[10px] sm:text-[11px] shrink-0 flex items-center gap-1.5 bg-[#0c0c1a] z-10 border-r border-gray-800 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wider uppercase text-white font-extrabold flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" />
            MALIPO LIVE
          </span>
        </div>

        {/* Slowed-down marquee speed */}
        <div className="overflow-hidden whitespace-nowrap flex gap-5 sm:gap-7 text-xs text-gray-300 animate-[marquee_85s_linear_infinite] pl-3">
          {displayItems.map((item, idx) => (
            <div
              key={item.id + idx}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#15152a] border border-gray-800 text-[10px] sm:text-[11px] shrink-0 hover:border-emerald-500/40 transition"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">{item.name}</span>
              <span className="text-gray-400">ametoa</span>
              <span className="font-black text-emerald-400">
                TZS {item.amount.toLocaleString()}
              </span>
              <span className="text-emerald-300/90 font-medium">
                kwa kuchat na wazungu
              </span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                {item.network}
              </span>
              <span className="text-[9px] text-gray-500">
                {item.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const notifModalOpen = useAppStore((s) => s.notifModalOpen);
  const closeNotifModal = useAppStore((s) => s.closeNotifModal);

  // Active chat state
  const chatModalOpen = useAppStore((s) => s.chatModalOpen);
  const activeChatForeigner = useAppStore((s) => s.activeChatForeigner);
  const closeChat = useAppStore((s) => s.closeChat);
  const completeChat = useAppStore((s) => s.completeChat);

  // Reward modal state
  const rewardModalOpen = useAppStore((s) => s.rewardModalOpen);
  const lastReward = useAppStore((s) => s.lastReward);
  const closeRewardModal = useAppStore((s) => s.closeRewardModal);
  const pendingBalance = useAppStore((s) => s.pendingBalance);
  const openWithdraw = useAppStore((s) => s.openWithdraw);

  useEffect(() => {
    pushService.syncOnEntry('sw');
  }, []);

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0b0b12] text-gray-200 pb-20 font-sans selection:bg-[#00E5FF] selection:text-black">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <Navbar />

        <main>
          <HeroSection />
          <ForeignersSection />
          <UsersCommentsSection />
        </main>

        {/* Footer: Full sponsored by Cp3 */}
        <footer className="mt-8 pt-8 pb-24 border-t border-gray-800/80 text-center px-4 bg-[#080811]/95 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent" />

          <div className="max-w-xl mx-auto space-y-3.5">
            {/* Prominent Cp3 Sponsorship Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#6C3BFF]/30 via-[#00E5FF]/20 to-[#ec4899]/30 border border-[#00E5FF]/50 text-xs font-black tracking-wider uppercase shadow-[0_0_25px_rgba(0,229,255,0.35)]">
              <Sparkles size={14} className="text-[#00E5FF] animate-pulse" />
              <span className="text-white">FULL SPONSORED BY <span className="text-[#00E5FF] font-black underline decoration-cyan-400 decoration-2 underline-offset-2">CP3</span></span>
              <Sparkles size={14} className="text-[#ec4899] animate-pulse" />
            </div>

            <p className="text-gray-300 text-xs leading-relaxed max-w-md mx-auto">
              Jukwaa rasmi la mtandaoni linalowaunganisha wageni na Watanzania kwa ajili ya kufundisha Kiswahili na kulipana papo hapo kupitia M-Pesa, TigoPesa, Airtel Money, Halopesa na AzamPesa.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-gray-400 font-medium flex-wrap">
              <span>© {new Date().getFullYear()} SwahiliConnect</span>
              <span>•</span>
              <span className="text-[#00E5FF] font-black uppercase tracking-wide">Full sponsored by Cp3</span>
              <span>•</span>
              <span>Tanzania 🇹🇿</span>
            </div>
          </div>
        </footer>

        <RegisterModal />
        <WithdrawModal />
        <PaidAlertModal />
        <WhatsAppWidgets />
        <WithdrawalTicker />

        {/* Real-time Interactive Chat Room with Selected Foreigner */}
        {activeChatForeigner && (
          <ForeignerChatModal
            foreigner={activeChatForeigner}
            isOpen={chatModalOpen}
            onClose={closeChat}
            onCompleteChat={completeChat}
          />
        )}

        {/* PENDING Chat Reward Celebration Modal */}
        {lastReward && (
          <ChatRewardPendingModal
            isOpen={rewardModalOpen}
            onClose={closeRewardModal}
            foreignerName={lastReward.foreigner.name}
            foreignerFlag={lastReward.foreigner.flag}
            amountTsh={lastReward.amountTsh}
            usdRate={lastReward.usdRate}
            totalPending={pendingBalance}
            onContinueChatting={() => {
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            onOpenWithdraw={() => {
              openWithdraw();
            }}
          />
        )}

        {/* Web Push Prompt & Settings */}
        <NotificationPromptModal />
        <NotificationSettingsModal isOpen={notifModalOpen} onClose={closeNotifModal} />
      </div>
    </AppProvider>
  );
}
