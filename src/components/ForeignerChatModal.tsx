import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  CheckCheck,
  Clock,
  Shield,
  Award,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { ForeignerProfile } from '../data/foreignersData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'foreigner';
  text: string;
  time: string;
}

interface Props {
  foreigner: ForeignerProfile;
  isOpen: boolean;
  onClose: () => void;
  onCompleteChat: (foreigner: ForeignerProfile) => void;
}

export const ForeignerChatModal: React.FC<Props> = ({
  foreigner,
  isOpen,
  onClose,
  onCompleteChat,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeRemaining, setActiveRemaining] = useState(0); // active burst seconds remaining
  const [hasCompleted, setHasCompleted] = useState(false);
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const TARGET_SECONDS = 30; // 30 active seconds of texting (3-4 user messages)

  // Initialize chat when opened with this foreigner
  useEffect(() => {
    if (isOpen && foreigner) {
      setSecondsElapsed(0);
      setIsTimerActive(false);
      setActiveRemaining(0);
      setHasCompleted(false);
      setUserMessagesCount(0);
      setInputText('');

      const initialTime = new Date().toLocaleTimeString('sw-TZ', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Short initial greeting
      setMessages([
        {
          id: 'msg-init-1',
          sender: 'foreigner',
          text: foreigner.initialMessage,
          time: initialTime,
        },
      ]);
    }
  }, [isOpen, foreigner]);

  // Timer only counts down when isTimerActive is TRUE (i.e. User sent an SMS!)
  // If user does not send SMS, time DOES NOT count!
  useEffect(() => {
    if (!isOpen || !isTimerActive || activeRemaining <= 0) return;

    const interval = setInterval(() => {
      setActiveRemaining((prevActive) => {
        if (prevActive <= 1) {
          setIsTimerActive(false); // Pause timer until user sends next SMS!
          return 0;
        }
        return prevActive - 1;
      });

      setSecondsElapsed((prevSec) => {
        if (prevSec >= TARGET_SECONDS - 1) {
          return TARGET_SECONDS;
        }
        return prevSec + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isTimerActive, activeRemaining]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !foreigner) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const currentTime = new Date().toLocaleTimeString('sw-TZ', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newUserMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      time: currentTime,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setUserMessagesCount((c) => c + 1);

    // KEY REQUIREMENT: Timer ONLY advances when user sends an SMS!
    // Each SMS activates the timer for 10 active seconds. If user stops sending, timer pauses!
    setActiveRemaining((prev) => prev + 10);
    setIsTimerActive(true);

    // Fast, responsive typing delay (0.6s - 1.0s)
    setIsTyping(true);
    const typingDelay = 650 + Math.random() * 400;

    setTimeout(() => {
      const lower = text.toLowerCase();
      let matchedReply: string | null = null;

      // Find matching response in foreigner's unique conversation flow
      for (const exchange of foreigner.conversationFlow) {
        const matches = exchange.triggerKeywords.some((kw) => lower.includes(kw.toLowerCase()));
        if (matches) {
          matchedReply = exchange.replyText;
          break;
        }
      }

      // If no keyword match, pick from foreigner's topic-specific fallbacks
      if (!matchedReply) {
        const fallbacks = foreigner.fallbackResponses;
        matchedReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      const replyTime = new Date().toLocaleTimeString('sw-TZ', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newReply: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'foreigner',
        text: matchedReply,
        time: replyTime,
      };

      setMessages((prev) => [...prev, newReply]);
      setIsTyping(false);
    }, typingDelay);
  };

  const isEligibleToClaim = secondsElapsed >= TARGET_SECONDS || userMessagesCount >= 3;

  const handleFinishAndClaim = () => {
    if (hasCompleted || !isEligibleToClaim) return;
    setHasCompleted(true);
    onCompleteChat(foreigner);
  };

  const progressPercent = Math.min(100, Math.round((secondsElapsed / TARGET_SECONDS) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[#0e1322] border-2 border-[#00E5FF]/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col h-[90vh] max-h-[700px]"
      >
        {/* Header with foreigner details */}
        <div className="bg-[#121829] px-3.5 py-2.5 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={foreigner.avatar}
                alt={foreigner.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#00E5FF]/60 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#121829] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-black text-white leading-none">
                  {foreigner.name}
                </h3>
                <span className="text-xs">{foreigner.flag}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-gray-400">
                  {foreigner.country} • {foreigner.profession}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                  {foreigner.usdRate}$ = {foreigner.ratePerChat.toLocaleString()} TSH
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
              title="Funga"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Active Chat Timer & Status Banner */}
        <div className="bg-[#090d18] px-3.5 py-2 border-b border-gray-800/80 flex flex-col gap-1 text-[11px] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Clock size={13} className={isTimerActive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'} />
              <span>Muda Uliohesabiwa:</span>
              <span className="font-mono font-bold text-white">
                00:{secondsElapsed.toString().padStart(2, '0')} / 00:{TARGET_SECONDS}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400 font-bold">
                Malipo: TZS {foreigner.ratePerChat.toLocaleString()}
              </span>
              <div className="w-14 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#ec4899] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-time explanation: Timer only advances when user sends SMS */}
          <div className="flex items-center gap-1.5 text-[10px]">
            {isTimerActive ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <PlayCircle size={11} className="animate-spin text-emerald-400" />
                Muda unahesabu sasa! ({activeRemaining}s zilizobaki kwa ujumbe huu)
              </span>
            ) : (
              <span className="text-amber-300 flex items-center gap-1 font-semibold">
                <PauseCircle size={11} className="text-amber-400" />
                Muda umesimama: Tuma ujumbe ili sekunde ziendelee!
              </span>
            )}
          </div>
        </div>

        {/* Unique Topic Banner */}
        <div className="bg-[#151c2e] px-3.5 py-1 text-[10px] text-gray-300 border-b border-[#6C3BFF]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 truncate">
            <Sparkles size={11} className="text-[#ec4899] shrink-0" />
            <span className="text-gray-400">Mada:</span>
            <span className="text-[#00E5FF] font-bold truncate">{foreigner.topic}</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-semibold shrink-0 ml-2">
            SMS {userMessagesCount}/3
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#0a0d17]/80">
          <div className="text-center my-0.5">
            <span className="px-2 py-0.5 rounded-full bg-[#121829] border border-gray-800 text-[9px] text-gray-400 inline-flex items-center gap-1">
              <Shield size={9} className="text-emerald-400" />
              Tuma ujumbe ili muda uhesabu na uweze kulipwa!
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#6C3BFF]/30 border border-[#00E5FF]/50 text-white rounded-br-none'
                    : 'bg-[#151d33] border border-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`mt-0.5 flex items-center gap-1 text-[8px] ${
                    msg.sender === 'user' ? 'justify-end text-cyan-300' : 'text-gray-500'
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck size={10} className="text-cyan-300" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#151d33] p-2 rounded-2xl rounded-bl-none w-24 border border-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="text-[9px] text-gray-400">anaandika</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Swahili Quick Teaching Chips (Specific to this Foreigner) */}
        <div className="p-2 bg-[#101626] border-t border-gray-800/80 shrink-0">
          <div className="text-[9px] text-gray-400 font-semibold mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles size={10} className="text-[#ec4899]" />
              Gusa SMS Hizi Utume Haraka (Ili Muda Uhesabu):
            </span>
            <span className="text-[#00E5FF]">{foreigner.flag}</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {foreigner.quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-xl bg-[#182138] border border-[#00E5FF]/25 text-[11px] text-gray-200 hover:text-white hover:border-[#00E5FF] hover:bg-[#202c4b] whitespace-nowrap transition cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar & Finish Chat Button */}
        <div className="p-2 sm:p-2.5 bg-[#121829] border-t border-gray-800 shrink-0 space-y-1.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Andika SMS hapa (muda utahesabu ukianza kutuma)..."
              className="flex-1 bg-[#090d18] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#6C3BFF] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition shadow-[0_0_12px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>

          {/* Finish & Claim Button */}
          <button
            onClick={handleFinishAndClaim}
            disabled={!isEligibleToClaim}
            className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md ${
              isEligibleToClaim
                ? 'bg-gradient-to-r from-[#ec4899] via-pink-600 to-[#6C3BFF] text-white shadow-[0_0_20px_rgba(236,72,153,0.65)] hover:scale-[1.02] active:scale-95'
                : 'bg-gray-800/80 text-gray-500 border border-gray-700/60 cursor-not-allowed'
            }`}
          >
            <Award size={14} className={isEligibleToClaim ? 'text-amber-300 animate-bounce' : ''} />
            <span>
              {isEligibleToClaim
                ? `Kamilisha Chat & Weka TZS ${foreigner.ratePerChat.toLocaleString()} Kwenye Salio Lako`
                : `Tuma SMS ${Math.max(1, 3 - userMessagesCount)} Zaidi Ili Ufungue Malipo (Sekunde ${Math.max(0, TARGET_SECONDS - secondsElapsed)})`}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
