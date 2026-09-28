import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  X,
  AlertTriangle,
  Lock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { REG_URL } from '../data/foreignersData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  foreignerName: string;
  foreignerFlag: string;
  amountTsh: number;
  usdRate: number;
  totalPending: number;
  onContinueChatting: () => void;
  onOpenWithdraw: () => void;
}

export const ChatRewardPendingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  foreignerName,
  foreignerFlag,
  amountTsh,
  usdRate,
  totalPending,
  onContinueChatting,
  onOpenWithdraw,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        className="w-full max-w-md bg-[#13182b] border-2 border-[#ec4899] rounded-3xl p-5 sm:p-6 text-center relative shadow-[0_0_50px_rgba(236,72,153,0.35)] my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
          title="Funga"
        >
          <X size={18} />
        </button>

        {/* Celebration icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#ec4899] via-pink-600 to-[#6C3BFF] p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center justify-center mb-2">
          <div className="w-full h-full bg-[#0e1322] rounded-[14px] flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={32} className="animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-xl font-black text-white leading-tight tracking-tight">
          HONGERA! UMELIPWA KWA KUCHAT NA {foreignerFlag} {foreignerName.toUpperCase()}!
        </h3>

        {/* Amount Box */}
        <div className="my-3 p-3 rounded-2xl bg-[#0b0f19] border border-[#00E5FF]/40 shadow-inner">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            Kiasi Ulicholipwa kwenye Chat Hii:
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#00E5FF] mt-0.5 tracking-tight">
            TZS {amountTsh.toLocaleString()}
          </div>
          <span className="text-xs text-gray-400 font-semibold block mt-0.5">
            Sawa na ${usdRate} USD
          </span>
        </div>

        {/* PENDING Status Banner */}
        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs text-left flex items-start gap-2 mb-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-amber-200 uppercase tracking-wide block">
              Hali ya Malipo: PENDING
            </span>
            <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
              Malipo haya yapo <strong>PENDING (Jumla: TZS {totalPending.toLocaleString()})</strong>. Ili yaweze kuingia kwenye Salio la Kutoa (Withdrawal) na kuhamishiwa kwenye simu yako, unapaswa kufungua na ku-activate akaunti yako kwanza.
            </p>
          </div>
        </div>

        {/* Mobile network benefits */}
        <div className="bg-[#0b0f19] p-2.5 rounded-xl border border-gray-800 text-[11px] text-gray-300 space-y-1 text-left mb-3.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Smartphone size={13} className="shrink-0" />
            <span>Inatumiwa moja kwa moja M-Pesa, TigoPesa, Airtel Money, Halopesa</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck size={13} className="shrink-0" />
            <span>Ada ya usajili ni TZS 15,000 pekee na utaanza kutoa papo hapo</span>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTON: GUSA HAPA KUFUNGUA ACCOUNT pointing to registration link */}
        <a
          id="reward-modal-register-btn"
          href={REG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#6C3BFF] to-[#ec4899] text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(0,229,255,0.7)] hover:scale-[1.02] active:scale-95 transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-2 border border-white/20 cursor-pointer block"
        >
          <ExternalLink size={15} />
          <span>GUSA HAPA KUFUNGUA ACCOUNT</span>
        </a>

        {/* Secondary Navigation */}
        <div className="mt-3 flex items-center justify-center gap-3 text-xs">
          <button
            onClick={() => {
              onClose();
              onContinueChatting();
            }}
            className="text-[#00E5FF] font-bold hover:underline flex items-center gap-1 py-1"
          >
            <span>Chat na Mzungu Mwingine</span>
            <ArrowRight size={12} />
          </button>

          <span className="text-gray-600">•</span>

          <button
            onClick={() => {
              onClose();
              onOpenWithdraw();
            }}
            className="text-emerald-400 font-bold hover:underline py-1"
          >
            Angalia Salio Lako
          </button>
        </div>

        <p className="text-[10px] text-gray-500 mt-2.5 flex items-center justify-center gap-1">
          <Lock size={10} className="text-emerald-500" />
          <span>Usajili salama na ulinzi wa taarifa zako 100%</span>
        </p>
      </motion.div>
    </div>
  );
};
