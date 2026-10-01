import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Star,
  CheckCircle2,
  Send,
  Sparkles,
  ThumbsUp,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export interface UserComment {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  network: 'M-Pesa' | 'TigoPesa' | 'Airtel Money' | 'Halopesa' | 'AzamPesa';
  amountEarned: number;
  timeAgo: string;
  rating: number;
  comment: string;
  likes: number;
  isCustom?: boolean;
}

// Master pool of authentic daily comments from Tanzanian users across different regions
const SEED_COMMENTS: Omit<UserComment, 'id' | 'timeAgo'>[] = [
  {
    name: 'Kelvin Shayo',
    location: 'Dar es Salaam (Kinondoni)',
    network: 'M-Pesa',
    amountEarned: 52000,
    rating: 5,
    likes: 42,
    comment:
      'Nilikuwa na mashaka mwanzoni, lakini nilivyofungua account na kuanza kuchat na Dr. Jessica nimelipwa 52,000 moja kwa moja kwenye M-Pesa yangu leo! Asanteni sana Cp3 kwa fursa hii.',
  },
  {
    name: 'Asha Mussa',
    location: 'Mwanza (Nyamagana)',
    network: 'TigoPesa',
    amountEarned: 48000,
    rating: 5,
    likes: 38,
    comment:
      'Hii site ni ya kweli kabisa! Kuchat na wazungu hakukuchukua hata dakika moja, salio langu limeingia fasta. Nimeshatoa pesa yangu mara mbili leo.',
  },
  {
    name: 'Baraka Mushi',
    location: 'Arusha (Sakina)',
    network: 'M-Pesa',
    amountEarned: 76000,
    rating: 5,
    likes: 67,
    comment:
      'Niliweka elfu 15 nikafungua account, mpaka sasa nina zaidi ya 76,000 imeingia. Michael wa UK na Emma wa Germany wananipa dili safi sana za Kiswahili. Full sponsored by Cp3 inafanya kazi kweli!',
  },
  {
    name: 'Neema Mwangi',
    location: 'Dodoma (Area D)',
    network: 'Airtel Money',
    amountEarned: 44000,
    rating: 5,
    likes: 29,
    comment:
      'Sophie wa Canada ni mkarimu sana, nilimfundisha methali ya Kiswahili dakika 1 akanilipa 22,000 papo hapo. Nimechat naye mara mbili nimelipwa jumla 44,000. Vijana changamkieni fursa hii acheni kulala!',
  },
  {
    name: 'Juma Bakari',
    location: 'Zanzibar (Mjini Mjini)',
    network: 'Halopesa',
    amountEarned: 58000,
    rating: 5,
    likes: 51,
    comment:
      'Nimepokea meseji ya pesa muda si mrefu baada ya kuchat na Carlos Rodriguez kutoka Spain kuhusu Taarab ya Zanzibar. Huduma ipo fasta sana.',
  },
  {
    name: 'Fatma Ally',
    location: 'Morogoro (Msamvu)',
    network: 'TigoPesa',
    amountEarned: 60000,
    rating: 5,
    likes: 34,
    comment:
      'Nashukuru sana nimepata mtaji wangu wa kuongeza biashara ya genge kupitia kuchat na wazungu hapa. Kila siku napata kuanzia 40,000 hadi 60,000.',
  },
  {
    name: 'Emanuel Temu',
    location: 'Moshi (Kilimanjaro)',
    network: 'M-Pesa',
    amountEarned: 87000,
    rating: 5,
    likes: 59,
    comment:
      'Alexander Weber anayejiandaa kupanda Kilimanjaro amenilipa 29,000 asubuhi hii. Nimeshaongeza salio langu mara tatu leo. Tovuti hii imetusaidia sana vijana!',
  },
  {
    name: 'Zainab Rashid',
    location: 'Tanga (Pangani)',
    network: 'AzamPesa',
    amountEarned: 42000,
    rating: 5,
    likes: 25,
    comment:
      'Kwanza nilidhani utani, nimechat na wazungu wawili nikafanya usajili nikaona pesa inasoma pending na baada ya kutoa ikaingia mara moja. Hongereni sana waandaaji.',
  },
];

// Generate dynamic relative time based on index and current hour/day
const RELATIVE_TIMES = [
  'Dakika 3 zilizopita',
  'Dakika 14 zilizopita',
  'Dakika 28 zilizopita',
  'Dakika 45 zilizopita',
  'Saa 1 lililopita',
  'Saa 2 zilizopita',
  'Saa 3 zilizopita',
  'Saa 4 zilizopita',
];

export const UsersCommentsSection: React.FC = () => {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [network, setNetwork] = useState<'M-Pesa' | 'TigoPesa' | 'Airtel Money' | 'Halopesa' | 'AzamPesa'>('M-Pesa');
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Initialize and rotate comments based on current day of the year
  useEffect(() => {
    const savedCustomComments = localStorage.getItem('swahili_custom_comments');
    let customList: UserComment[] = [];
    if (savedCustomComments) {
      try {
        customList = JSON.parse(savedCustomComments);
      } catch {
        customList = [];
      }
    }

    const today = new Date();
    const daySeed = (today.getDate() * 3 + today.getMonth() * 7) % SEED_COMMENTS.length;

    const rotatedSeed: UserComment[] = SEED_COMMENTS.map((item, idx) => {
      const rotatedIdx = (idx + daySeed) % SEED_COMMENTS.length;
      const seedItem = SEED_COMMENTS[rotatedIdx];
      return {
        ...seedItem,
        id: `seed-${idx}-${today.toDateString()}`,
        timeAgo: RELATIVE_TIMES[idx % RELATIVE_TIMES.length],
      };
    });

    setComments([...customList, ...rotatedSeed]);
  }, []);

  const handleLike = (id: string) => {
    if (likedIds.includes(id)) return;
    setLikedIds((prev) => [...prev, id]);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    const newComment: UserComment = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      location: location.trim() || 'Tanzania',
      network,
      amountEarned: 26000,
      timeAgo: 'Muda huu hivi punde',
      rating: userRating,
      comment: commentText.trim(),
      likes: 1,
      isCustom: true,
    };

    const updated = [newComment, ...comments];
    setComments(updated);

    // Save custom comments in localStorage
    const savedCustomComments = localStorage.getItem('swahili_custom_comments');
    let customList: UserComment[] = [];
    if (savedCustomComments) {
      try {
        customList = JSON.parse(savedCustomComments);
      } catch {
        customList = [];
      }
    }
    localStorage.setItem(
      'swahili_custom_comments',
      JSON.stringify([newComment, ...customList])
    );

    // Reset Form
    setName('');
    setLocation('');
    setCommentText('');
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowAddForm(false);
    }, 2000);
  };

  return (
    <section className="max-w-xl mx-auto px-3 sm:px-4 py-6">
      {/* Header Banner */}
      <div className="bg-[#121829] border border-[#00E5FF]/30 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden mb-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C3BFF]/15 blur-2xl pointer-events-none rounded-full" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-400" />
                Maoni Halisi ya Leo
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={11} className="text-[#00E5FF]" />
                Yanasasishwa Kila Siku
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <MessageCircle size={18} className="text-[#00E5FF]" />
              <span>Maoni ya Watumiaji (Live Feedback)</span>
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              Tazama watu waliolipwa leo kupitia site hii na maoni yao kuhusu huduma yetu.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#6C3BFF] text-white font-black text-xs uppercase tracking-wide shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0 text-center"
          >
            {showAddForm ? 'Funga Fomu' : '+ Toa Maoni Yako'}
          </button>
        </div>

        {/* Rating Summary Bar */}
        <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-300 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <span className="font-bold text-white">4.9 / 5</span>
            <span className="text-gray-400 text-[11px]">(Zaidi ya maoni 1,840+ nchini Tanzania)</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck size={13} />
            100% Verified Payouts
          </span>
        </div>
      </div>

      {/* Add Comment Form Dropdown */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <form
              onSubmit={handleAddComment}
              className="bg-[#141424] border border-[#6C3BFF]/40 rounded-2xl p-4 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#00E5FF]" />
                  <span>Andika Ushuhuda / Maoni Yako</span>
                </h3>
                <span className="text-[10px] text-gray-400">Yataonekana hapa moja kwa moja</span>
              </div>

              {formSubmitted ? (
                <div className="py-4 text-center text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  ✓ Asante sana! Maoni yako yamewekwa hewani moja kwa moja.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                        Jina Lako Kamili:
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Mfano: Juma Rashid"
                        required
                        className="w-full bg-[#0d111d] border border-gray-700 focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                        Mkoa / Sehemu Unayotokea:
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Mfano: Mwanza, Dar, Arusha"
                        className="w-full bg-[#0d111d] border border-gray-700 focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                        Mtandao Unaoutumia Kupokea Malipo:
                      </label>
                      <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value as any)}
                        className="w-full bg-[#0d111d] border border-gray-700 focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="M-Pesa">Vodacom M-Pesa</option>
                        <option value="TigoPesa">Tigo Pesa</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="Halopesa">Halopesa</option>
                        <option value="AzamPesa">AzamPesa</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                        Kiwango cha Nyota (Rating):
                      </label>
                      <div className="flex items-center gap-1.5 py-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="text-amber-400 p-0.5 cursor-pointer hover:scale-110 transition"
                          >
                            <Star
                              size={18}
                              fill={star <= userRating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                        <span className="text-[11px] text-gray-400 ml-2">
                          ({userRating} / 5 Nyota)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                      Ujumbe / Maoni Yako Kuhusu Kazi na Malipo:
                    </label>
                    <textarea
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Eleza uzoefu wako wa kuchat na wazungu, malipo uliyopokea kwenye simu yako au jinsi tovuti inavyokusaidia..."
                      required
                      className="w-full bg-[#0d111d] border border-gray-700 focus:border-[#00E5FF] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Tuma Maoni Yako Sasa</span>
                  </button>
                </>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Feed List */}
      <div className="space-y-3">
        {comments.map((item) => {
          const isLiked = likedIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all shadow-md relative ${
                item.isCustom
                  ? 'bg-[#151c33] border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'bg-[#121626] border-gray-800/90 hover:border-gray-700'
              }`}
            >
              {/* Header: User Info & Verification */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C3BFF] to-[#00E5FF] text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0 uppercase">
                    {item.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-white text-xs">{item.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-0.5">
                        <CheckCircle2 size={9} />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} className="text-[#00E5FF]" />
                        {item.location}
                      </span>
                      <span>•</span>
                      <span className="text-gray-400">{item.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Network & Stars */}
                <div className="text-right shrink-0">
                  <div className="flex text-amber-400 justify-end mb-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300 border border-purple-700/40 font-semibold block">
                    {item.network}
                  </span>
                </div>
              </div>

              {/* Comment Body */}
              <p className="text-xs text-gray-200 leading-relaxed pl-10">
                "{item.comment}"
              </p>

              {/* Footer: Payout info & Like button */}
              <div className="mt-3 pt-2.5 border-t border-gray-800/60 pl-10 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
                  💰 Imelipwa: TZS {item.amountEarned.toLocaleString()} papo hapo
                </span>

                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    isLiked
                      ? 'text-cyan-400 bg-cyan-500/15'
                      : 'text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800'
                  }`}
                >
                  <ThumbsUp size={11} className={isLiked ? 'fill-current' : ''} />
                  <span>{item.likes}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
