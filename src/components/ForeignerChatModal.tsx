import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Send,
  CheckCheck,
  Clock,
  Shield,
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

// Accurate, intelligent Swahili conversational responder for foreigner profiles
function getAccurateForeignerAnswer(userText: string, foreigner: ForeignerProfile): string {
  const clean = userText.toLowerCase().trim();

  // Swahili Country Translation Helper
  const countrySwahiliMap: Record<string, string> = {
    USA: 'Marekani (USA) 🇺🇸',
    Germany: 'Ujerumani (Germany) 🇩🇪',
    UK: 'Uingereza (United Kingdom) 🇬🇧',
    Canada: 'Kanada (Canada) 🇨🇦',
    Australia: 'Australia 🇦🇺',
    France: 'Ufaransa (France) 🇫🇷',
    Italy: 'Italia (Italy) 🇮🇹',
    Spain: 'Hispania (Spain) 🇪🇸',
    Sweden: 'Sweden 🇸🇪',
    Norway: 'Norway 🇳🇴',
    Japan: 'Japan 🇯🇵',
    Netherlands: 'Uholanzi (Netherlands) 🇳🇱',
  };

  const countryDisplay =
    countrySwahiliMap[foreigner.country] || `${foreigner.country} ${foreigner.flag}`;

  // 1. Where are you from? (Unatokea wapi / Unatoka wapi / Wapi / Nchi gani)
  if (
    clean.includes('unatokea wapi') ||
    clean.includes('unatoka wapi') ||
    clean.includes('wapi unatoka') ||
    clean.includes('wapi unatokea') ||
    clean.includes('unakaa wapi') ||
    clean.includes('unaishi wapi') ||
    clean.includes('nchi gani') ||
    clean.includes('nchi yako') ||
    clean.includes('unatokea') ||
    clean.includes('unatoka') ||
    clean.includes('where are you from') ||
    clean.includes('where do you live') ||
    clean.endsWith('wapi?') ||
    clean === 'wapi'
  ) {
    return `Mimi ninatokea nchini ${countryDisplay}. Nimefurahi sana kuwasiliana nawe! Na wewe je, unatokea mkoa gani huko Tanzania?`;
  }

  // 2. Who are you / What is your name? (Unaitwa nani / Jina lako / Wewe nani)
  if (
    clean.includes('unaitwa nani') ||
    clean.includes('jina lako') ||
    clean.includes('jina nani') ||
    clean.includes('wewe nani') ||
    clean.includes('who are you') ||
    clean.includes('what is your name') ||
    clean.includes('unaitwa')
  ) {
    return `Jina langu naitwa ${foreigner.name}. Nina umri wa miaka ${foreigner.age} na ninatokea ${countryDisplay}. Wewe jina lako zuri nani?`;
  }

  // 3. What do you do / Job / Profession? (Kazi yako / Unafanya kazi gani / Unafanya nini)
  if (
    clean.includes('kazi') ||
    clean.includes('unafanya nini') ||
    clean.includes('unajishughulisha') ||
    clean.includes('ajira') ||
    clean.includes('profession') ||
    clean.includes('what do you do') ||
    clean.includes('unafanya')
  ) {
    return `Mimi ninafanya kazi kama ${foreigner.profession} huku ${countryDisplay}. Kazi yangu inahusu sana ${foreigner.topic}! Wewe unajishughulisha na kazi gani?`;
  }

  // 4. Age / Umri? (Una miaka mingapi / Umri wako)
  if (
    clean.includes('miaka mingapi') ||
    clean.includes('umri') ||
    clean.includes('una miaka') ||
    clean.includes('how old') ||
    clean.includes('age')
  ) {
    return `Nina umri wa miaka ${foreigner.age}. Wewe una umri wa miaka mingapi rafiki yangu?`;
  }

  // 5. Why Swahili / Why learning? (Kwanini Kiswahili / Sababu ya kujifunza)
  if (
    clean.includes('kwanini') ||
    clean.includes('kwa nini') ||
    clean.includes('sababu') ||
    clean.includes('why') ||
    clean.includes('kujifunza')
  ) {
    return `Ninajifunza Kiswahili kwa sababu ninapanga kutembelea Tanzania hivi karibuni kuhusu mada ya ${foreigner.topic}. Kiswahili ni lugha nzuri sana!`;
  }

  // 6. Greetings / Salamu (Mambo / Habari / Shikamoo / Vipi / Hujambo / Hello / Hi)
  if (clean.includes('shikamoo')) {
    return `Marahaba! Asante sana kwa heshima na salamu nzuri rafiki yangu. Habari za leo huko Tanzania?`;
  }
  if (
    clean.includes('habari') ||
    clean.includes('mambo') ||
    clean.includes('hujambo') ||
    clean.includes('vipi') ||
    clean.includes('salama') ||
    clean.includes('hello') ||
    clean.includes('hi') ||
    clean.includes('hey')
  ) {
    return `Habari nzuri sana rafiki yangu! Mimi niko mzima kabisa huku ${countryDisplay}. Hali yako ikoje huko Tanzania leo?`;
  }

  // 7. Weather / Hali ya hewa
  if (
    clean.includes('hewa') ||
    clean.includes('baridi') ||
    clean.includes('joto') ||
    clean.includes('mvua') ||
    clean.includes('jua') ||
    clean.includes('weather')
  ) {
    return `Huku ${countryDisplay} kwa sasa hali ya hewa ni tulivu na ya kupendeza sana. Vipi huko Tanzania leo kuna joto au mvua?`;
  }

  // 8. Payment / Pesa / Kulipa
  if (
    clean.includes('pesa') ||
    clean.includes('malipo') ||
    clean.includes('kulipa') ||
    clean.includes('utalipa') ||
    clean.includes('dola') ||
    clean.includes('shilingi') ||
    clean.includes('tsh') ||
    clean.includes('money') ||
    clean.includes('pay')
  ) {
    return `Usijali kabisa rafiki yangu! Ninalipa TZS ${foreigner.ratePerChat.toLocaleString()} ($${foreigner.usdRate} USD) papo hapo baada ya mazungumzo yetu!`;
  }

  // 9. Thanks / Gratitude
  if (
    clean.includes('asante') ||
    clean.includes('shukrani') ||
    clean.includes('nashukuru') ||
    clean.includes('thank')
  ) {
    return `Karibu sana rafiki yangu! Unanifundisha vizuri sana na ninajifunza haraka kutoka kwako.`;
  }

  // 10. Agreement / Sawa / Poa / Fresh
  if (
    clean.includes('sawa') ||
    clean.includes('poa') ||
    clean.includes('fresh') ||
    clean.includes('safi') ||
    clean.includes('vizuri') ||
    clean.includes('ok') ||
    clean.includes('vyema')
  ) {
    return `Safii sana! Nieleze neno lingine zuri la Kiswahili ninaloweza kutumia nikiwa Tanzania.`;
  }

  // 11. Family / Marriage
  if (
    clean.includes('mke') ||
    clean.includes('mume') ||
    clean.includes('kuoa') ||
    clean.includes('kuolewa') ||
    clean.includes('familia') ||
    clean.includes('watoto') ||
    clean.includes('married')
  ) {
    return `Nina familia nzuri sana huku ${countryDisplay}, na wote wanafurahia nikiwafundisha maneno ya Kiswahili ninayojifunza hapa!`;
  }

  // 12. Food / Chakula
  if (
    clean.includes('chakula') ||
    clean.includes('kula') ||
    clean.includes('ugali') ||
    clean.includes('wali') ||
    clean.includes('nyama') ||
    clean.includes('samaki') ||
    clean.includes('food')
  ) {
    return `Ninapenda sana kujaribu vyakula mbalimbali! Nimesikia Tanzania kuna ugali na samaki mtamu sana, nina hamu ya kuonja nikija!`;
  }

  // 13. Teaching specific words
  if (
    clean.includes('sema') ||
    clean.includes('tamka') ||
    clean.includes('nena') ||
    clean.includes('ongea')
  ) {
    return `Aha, asante sana! Nitaikariri hiyo maneno kwa usahihi. Nifundishe neno lingine pia!`;
  }

  // 14. Check foreigner's unique conversation flow
  for (const exchange of foreigner.conversationFlow) {
    const matches = exchange.triggerKeywords.some((kw) => clean.includes(kw.toLowerCase()));
    if (matches) {
      return exchange.replyText;
    }
  }

  // 15. Contextual fallback
  const fallbacks = [
    `Nimekuelewa vizuri sana! Mimi ni ${foreigner.name} kutoka ${countryDisplay}, nifundishe neno lingine zaidi la Kiswahili.`,
    `Asante kwa maelezo mazuri! Ninafurahia sana kujifunza Kiswahili na wewe kwa ajili ya safari yangu ya ${foreigner.topic}.`,
    `Hilo ni jambo zuri sana. Nieleze zaidi kuhusu maisha na ukarimu wa watu wa Tanzania!`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
  const [hasCompleted, setHasCompleted] = useState(false);
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const TARGET_SECONDS = 60; // Max 1 minute (dakika 1 haizidi kamwe)

  // Initialize chat when opened with this foreigner
  useEffect(() => {
    if (isOpen && foreigner) {
      setSecondsElapsed(0);
      setIsTimerActive(false);
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

  // Once user sends at least 1 SMS, timer starts and runs continuously up to max 60s (1 min)
  // When it hits 60s, it automatically finishes and pops up the payment modal!
  useEffect(() => {
    if (!isOpen || !isTimerActive || hasCompleted) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prevSec) => {
        const nextSec = prevSec + 1;
        if (nextSec >= TARGET_SECONDS) {
          // Haizidi dakika 1 kamwe: Inakamilisha na kutoa pop-up ya kulipwa mara moja!
          setIsTimerActive(false);
          setHasCompleted(true);
          setTimeout(() => {
            onCompleteChat(foreigner);
          }, 300);
          return TARGET_SECONDS;
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isTimerActive, hasCompleted, foreigner, onCompleteChat]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !foreigner) return null;

  const handleSendMessage = () => {
    const text = inputText.trim();
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

    // KEY REQUIREMENT: mtu akituma sms moja tu mda uanze kusoma (isizidi dakika moja)
    if (!isTimerActive) {
      setIsTimerActive(true);
    }

    // Fast, responsive typing delay (0.5s - 0.8s) for very short chats
    setIsTyping(true);
    const typingDelay = 500 + Math.random() * 300;

    setTimeout(() => {
      const matchedReply = getAccurateForeignerAnswer(text, foreigner);

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

      // Auto-trigger completion after 3 short SMS exchanges or when 60s completes
      if (userMessagesCount + 1 >= 3) {
        setTimeout(() => {
          setHasCompleted(true);
          setIsTimerActive(false);
          onCompleteChat(foreigner);
        }, 1400);
      }
    }, typingDelay);
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
                {Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:{(secondsElapsed % 60).toString().padStart(2, '0')} / 01:00
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

          {/* Real-time explanation: Timer starts when user sends first SMS */}
          <div className="flex items-center gap-1.5 text-[10px]">
            {isTimerActive ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <PlayCircle size={11} className="animate-spin text-emerald-400" />
                Muda unahesabu! (Isizidi dakika 1, inamaliza: {Math.max(0, TARGET_SECONDS - secondsElapsed)}s)
              </span>
            ) : (
              <span className="text-amber-300 flex items-center gap-1 font-semibold">
                <PauseCircle size={11} className="text-amber-400" />
                Muda umesimama: Tuma SMS moja tu hapa chini ili muda uanze kusoma!
              </span>
            )}
          </div>
        </div>

        {/* Unique Topic Banner */}
        <div className="bg-[#151c2e] px-3.5 py-1 text-[10px] text-gray-300 border-b border-[#6C3BFF]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] shrink-0" />
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

        {/* Input Bar */}
        <div className="p-2.5 sm:p-3 bg-[#121829] border-t border-gray-800 shrink-0">
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
              placeholder="Andika SMS fupi hapa (muda utaanza kuhesabu ukisend)..."
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
        </div>
      </motion.div>
    </div>
  );
};
