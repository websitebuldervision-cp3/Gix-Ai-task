import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { ChatRoom, Message } from '../types';
import { DEFAULT_PARTNERS } from '../data/defaultPartners';
import {
  MessageSquare,
  Send,
  Timer,
  ShieldAlert,
  Ban,
  Check,
  CheckCheck,
  Sparkles,
  ArrowLeft,
  Smile,
  X,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { formatTZS, formatUSD } from '../data/translations';

export const ChatsView: React.FC = () => {
  const {
    user,
    activeChatRoom,
    closeChatRoom,
    openChatWithPartner,
    setChatRewardModalData,
    refreshUserData,
    language,
    t,
  } = useApp();

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(activeChatRoom || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // 1-minute Session duration timer
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [hasCompletedMinute, setHasCompletedMinute] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Moderation state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Spam or inappropriate behavior');
  const [reportDetails, setReportDetails] = useState('');
  const [moderationNotice, setModerationNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync activeChatRoom from context
  useEffect(() => {
    if (activeChatRoom) {
      setSelectedRoom(activeChatRoom);
      setSessionSeconds(0);
      setHasCompletedMinute(false);
    }
  }, [activeChatRoom]);

  // Load chat rooms from backend
  const loadRooms = async () => {
    const list = await apiService.getChatRooms(user.id);
    setRooms(list);
    if (!selectedRoom && list.length > 0) {
      setSelectedRoom(list[0]);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [user.id]);

  // Load messages when selectedRoom changes
  useEffect(() => {
    if (!selectedRoom) return;

    let isMounted = true;
    setIsLoadingMessages(true);

    apiService.getRoomMessages(selectedRoom.id, user.id).then((msgs) => {
      if (isMounted) {
        setMessages(msgs);
        setIsLoadingMessages(false);
        scrollToBottom();
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedRoom?.id, user.id]);

  // 1-minute Active Chat Timer & Server Heartbeat
  useEffect(() => {
    if (!selectedRoom || hasCompletedMinute) return;

    const interval = setInterval(async () => {
      setSessionSeconds((prev) => {
        const next = prev + 1;

        // When 60 seconds (1 minute) is reached:
        if (next === 60) {
          apiService
            .sendSessionHeartbeat(user.id, {
              roomId: selectedRoom.id,
              partnerId: selectedRoom.partnerId,
              partnerName: selectedRoom.partnerName,
              elapsedSeconds: 60,
            })
            .then((res) => {
              if (res.earned) {
                setHasCompletedMinute(true);
                refreshUserData();

                // Trigger celebration modal
                setChatRewardModalData({
                  amountUSD: res.amountUSD || 0.50,
                  amountTZS: res.amountTZS || 1300,
                  partnerName: selectedRoom.partnerName,
                  totalPendingUSD: res.newPendingUSD || user.balancePendingUSD + 0.50,
                });
              }
            });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedRoom?.id, hasCompletedMinute, user.id, selectedRoom?.partnerId, selectedRoom?.partnerName]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || !selectedRoom) return;

    setInputText('');
    setShowEmojiPicker(false);

    // Optimistically add user's message
    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      roomId: selectedRoom.id,
      senderId: user.id,
      senderName: user.fullName || user.username,
      senderAvatar: user.avatarUrl,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      status: 'delivered',
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    scrollToBottom();

    // Trigger typing indicator for realistic foreign learner response
    setIsTyping(true);

    try {
      const res = await apiService.sendMessage(selectedRoom.id, user.id, textToSend);
      if (res && res.partnerReply) {
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, res.partnerReply!]);
          scrollToBottom();
          loadRooms();
        }, 1200); // 1.2s delay simulating reading & typing
      } else {
        setIsTyping(false);
      }
    } catch (e) {
      setIsTyping(false);
    }
  };

  const handleTopicChipClick = (phrase: string) => {
    handleSendMessage(phrase);
  };

  const handleReport = async () => {
    if (!selectedRoom) return;
    await apiService.reportUser(user.id, selectedRoom.id, selectedRoom.partnerId, `${reportReason}: ${reportDetails}`);
    setShowReportModal(false);
    setModerationNotice(
      language === 'sw'
        ? 'Ripoti imepokelewa. Timu ya usalama inakagua mazungumzo haya.'
        : 'Report received. The safety team is reviewing this chat.'
    );
    setTimeout(() => setModerationNotice(null), 4000);
  };

  const handleBlock = async () => {
    if (!selectedRoom) return;
    if (
      window.confirm(
        language === 'sw'
          ? `Je, una uhakika unataka kumzuia ${selectedRoom.partnerName}?`
          : `Are you sure you want to block ${selectedRoom.partnerName}?`
      )
    ) {
      await apiService.blockUser(user.id, selectedRoom.id, selectedRoom.partnerId);
      setSelectedRoom(null);
      closeChatRoom();
      loadRooms();
    }
  };

  const handleEndChat = () => {
    if (window.confirm(t.chat.confirmEndChat)) {
      setSelectedRoom(null);
      closeChatRoom();
    }
  };

  const emojis = ['👋', '🇹🇿', '🦁', '🙏', '❤️', '👍', '😊', '🌍', '☕', '🔥'];

  // Topic prompt chips
  const suggestedPrompts = [
    t.chat.topic1,
    t.chat.topic2,
    t.chat.topic3,
    t.chat.topic4,
    t.chat.topic5,
  ];

  return (
    <div className="space-y-4 pb-16">
      {moderationNotice && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCheck className="h-4 w-4" />
          <span>{moderationNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-175px)] min-h-[580px]">
        {/* LEFT COLUMN: CONVERSATION LIST */}
        <div
          className={`lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 flex flex-col ${
            selectedRoom ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
              <h2 className="font-display text-sm font-bold text-white">
                {language === 'sw' ? 'Mazungumzo Yako' : 'Conversations'}
              </h2>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
              {rooms.length}
            </span>
          </div>

          {/* Rooms list */}
          <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
            {rooms.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="text-xs mb-3">
                  {language === 'sw'
                    ? 'Bado haujaanza chat na mgeni yeyote.'
                    : 'You have not started chatting with anyone yet.'}
                </p>
                <button
                  onClick={() => openChatWithPartner(DEFAULT_PARTNERS[0])}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                >
                  {language === 'sw' ? 'Anza na Sarah Jenkins (USA)' : 'Start with Sarah Jenkins (USA)'}
                </button>
              </div>
            ) : (
              rooms.map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoom(room);
                      setSessionSeconds(0);
                      setHasCompletedMinute(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={room.partnerAvatar}
                        alt={room.partnerName}
                        className="h-11 w-11 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">
                          {room.partnerName} {room.partnerFlag}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {room.lastMessageTime || ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {room.lastMessage || 'Anza mazungumzo...'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT ROOM */}
        <div
          className={`lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/90 flex flex-col overflow-hidden ${
            !selectedRoom ? 'hidden lg:flex items-center justify-center' : 'flex'
          }`}
        >
          {!selectedRoom ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">
                {language === 'sw' ? 'Chagua Mwenzi wa Kuchat Naye' : 'Select a Chat Partner'}
              </h3>
              <p className="text-xs max-w-sm mx-auto">
                {language === 'sw'
                  ? 'Chagua mazungumzo upande wa kushoto au nenda kwenye "Wageni" uanze chat mpya.'
                  : 'Select an existing conversation on the left or go to "Find People" to start a new chat.'}
              </p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="lg:hidden p-1 text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className="relative">
                    <img
                      src={selectedRoom.partnerAvatar}
                      alt={selectedRoom.partnerName}
                      className="h-10 w-10 rounded-full object-cover border border-slate-700"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-xs sm:text-sm font-bold text-white truncate">
                        {selectedRoom.partnerName}
                      </h3>
                      <span className="text-sm">{selectedRoom.partnerFlag}</span>
                      <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.2 text-[9px] font-semibold text-slate-300 uppercase">
                        {selectedRoom.partnerLevel}
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      {isTyping ? (
                        <span className="animate-pulse">
                          {selectedRoom.partnerName} {t.chat.typing}
                        </span>
                      ) : (
                        <span>🟢 Online now</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 1-Minute Session Progress Bar & Actions */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <Timer className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                      <span className="text-white">
                        {Math.floor(sessionSeconds / 60)}:
                        {String(sessionSeconds % 60).padStart(2, '0')} / 01:00
                      </span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${Math.min(100, (sessionSeconds / 60) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Moderation Dropdown / Buttons */}
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    title={t.chat.reportUser}
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleBlock}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    title={t.chat.blockUser}
                  >
                    <Ban className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleEndChat}
                    className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    {t.chat.endChat}
                  </button>
                </div>
              </div>

              {/* PURPOSE BANNER & MINUTE TARGET */}
              <div className="bg-emerald-950/30 border-b border-emerald-500/20 px-3.5 py-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1 font-medium">
                    {t.chat.purposeDesc}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold shrink-0">
                  {hasCompletedMinute ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCheck className="h-3.5 w-3.5" />
                      {language === 'sw' ? 'Dakika 1 imethibitishwa ($0.50 Pending)' : '1 Min verified ($0.50 Pending)'}
                    </span>
                  ) : (
                    <span>⏱️ Lengo: Dakika 1 ya chat = TSh 1,300 ($0.50)</span>
                  )}
                </div>
              </div>

              {/* MESSAGES THREAD */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#080B11]/50">
                {isLoadingMessages ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    {language === 'sw' ? 'Inapakia ujumbe...' : 'Loading messages...'}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <p>Anza mazungumzo kwa kumsalimia mwenzi wako hapa chini!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.isMine;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-md leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                              : 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-tl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                              isMe ? 'text-emerald-200' : 'text-slate-400'
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="h-3 w-3 text-emerald-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Live typing bubble */}
                {isTyping && (
                  <div className="flex items-start">
                    <div className="rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs text-slate-300 flex items-center gap-1.5 shadow">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* SUGGESTED CONVERSATION TOPICS CHIPS */}
              <div className="border-t border-slate-800 bg-slate-950/80 px-3 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none">
                <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                  💡 {language === 'sw' ? 'Mfundishe:' : 'Teach:'}
                </span>
                {suggestedPrompts.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleTopicChipClick(topic.replace(/^[^\s]+\s/, ''))}
                    className="shrink-0 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-emerald-500 hover:text-emerald-400 hover:bg-slate-850 transition"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 relative">
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-3 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl flex gap-1 z-20">
                    {emojis.map((e, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputText((prev) => prev + e);
                          setShowEmojiPicker(false);
                        }}
                        className="p-1.5 text-lg hover:scale-125 transition-transform"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition"
                  >
                    <Smile className="h-5 w-5" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.chat.typeMessage}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 text-slate-950 hover:brightness-110 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>{t.chat.reportUser}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ripoti tabia isiyofaa au ombi la fedha/utapeli kutoka kwa mwenzi wako.
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white mb-3"
            >
              <option value="Spam / Solicitation">Kuomba pesa au miamala</option>
              <option value="Inappropriate Content">Lugha chafu au matusi</option>
              <option value="Harassment">Unyanyasaji au vitisho</option>
              <option value="Other">Sababu Nyingine</option>
            </select>
            <textarea
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Maelezo ya ziada..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white mb-4 placeholder-slate-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="w-1/2 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-300"
              >
                Ghairi
              </button>
              <button
                onClick={handleReport}
                className="w-1/2 rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                Tuma Ripoti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
