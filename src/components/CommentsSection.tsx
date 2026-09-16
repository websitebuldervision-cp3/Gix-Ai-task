import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Globe2,
  Calendar,
  Check,
} from 'lucide-react';
import { getDailyDynamicComments, UserComment } from '../data/commentsData';
import { useApp } from '../context/AppContext';

const STORAGE_COMMENTS_KEY = 'gix_user_comments_v2';

export const CommentsSection: React.FC = () => {
  const { language } = useApp();
  const isSw = language === 'sw';

  const [comments, setComments] = useState<UserComment[]>(() => {
    const dynamicInitial = getDailyDynamicComments();
    const saved = localStorage.getItem(STORAGE_COMMENTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...dynamicInitial];
      } catch (e) {
        console.error(e);
      }
    }
    return dynamicInitial;
  });

  // Form states
  const [userName, setUserName] = useState('');
  const [userCountry, setUserCountry] = useState(isSw ? 'Tanzania' : 'USA');
  const [userCommentText, setUserCommentText] = useState('');
  const [userPayoutAmount, setUserPayoutAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(false);

  const countryFlags: Record<string, string> = {
    Tanzania: '🇹🇿',
    Kenya: '🇰🇪',
    Uganda: '🇺🇬',
    USA: '🇺🇸',
    UK: '🇬🇧',
    Ghana: '🇬🇭',
    Nigeria: '🇳🇬',
    Germany: '🇩🇪',
    Canada: '🇨🇦',
    'South Africa': '🇿🇦',
    Other: '🌍',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userCommentText.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const today = new Date();
      const newComment: UserComment = {
        id: `user_comm_${Date.now()}`,
        name: userName.trim(),
        country: userCountry,
        flag: countryFlags[userCountry] || '🌍',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
        dateEn: `Today • Just now`,
        dateSw: `Leo • Hivi punde`,
        comment: userCommentText.trim(),
        earningsMentioned: userPayoutAmount.trim() ? userPayoutAmount.trim() : (isSw ? 'Mtumiaji Aliyehakikiwa' : 'Verified User'),
        verified: true,
        tag: isSw ? 'Leo Hivi Punde' : 'Just Now',
      };

      const updated = [newComment, ...comments];
      setComments(updated);

      // Save user comment to localStorage
      try {
        const existingCustom = JSON.parse(localStorage.getItem(STORAGE_COMMENTS_KEY) || '[]');
        localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify([newComment, ...existingCustom]));
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      setSubmittedStatus(true);
      setUserCommentText('');
      setUserName('');
      setUserPayoutAmount('');

      setTimeout(() => {
        setSubmittedStatus(false);
      }, 5000);
    }, 600);
  };

  return (
    <section className="mt-14 border-t border-slate-800/80 pt-12 pb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
            <Globe2 className="h-3.5 w-3.5" />
            <span>
              {isSw
                ? 'Maoni na Shuhuda za Watumiaji Ulimwenguni'
                : 'Global Contributor Community Reviews'}
            </span>
          </div>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-white">
            {isSw
              ? 'Watumiaji Wanasemaje Kuhusu GIX AI TASKS'
              : 'What Global Users Say About GIX AI TASKS'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
            {isSw
              ? 'Shuhuda halisi kutoka kwa watumiaji wanaokamilisha kazi za AI na kupokea malipo kila siku.'
              : 'Real feedback from contributors who completed AI microtasks and received payouts worldwide.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl shrink-0 shadow-sm">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span className="text-white font-display">
            {isSw ? 'Maoni ya Leo Yaliyohuishwa' : 'Refreshed Today'}
          </span>
          <span className="text-emerald-400 font-medium">
            ({comments.length}+ {isSw ? 'Shuhuda' : 'Reviews'})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comments Stream */}
        <div className="lg:col-span-2 space-y-3.5 max-h-[580px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
          {comments.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display font-bold text-white text-sm">
                        {item.name}
                      </span>
                      <span className="text-xs">{item.flag}</span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({item.country})
                      </span>
                      {item.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="h-3 w-3" />
                          <span>{isSw ? 'Mtumiaji Rasmi' : 'Verified'}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <Calendar className="h-3 w-3 text-emerald-400/80" />
                      <span className="text-slate-300 font-medium">{isSw ? item.dateSw : item.dateEn}</span>
                    </div>
                  </div>
                </div>

                {item.earningsMentioned && (
                  <span className="hidden sm:inline-block rounded-lg bg-emerald-950/40 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-800/40">
                    {item.earningsMentioned}
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                "{item.comment}"
              </p>
            </div>
          ))}
        </div>

        {/* Right Col: Write a Comment Form */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-5 shadow-xl sticky top-20 backdrop-blur-md">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-display text-base font-bold text-white">
                {isSw ? 'Acha Maoni Yako Hapa' : 'Write Your Review'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {isSw
                ? 'Toa ushuhuda wako kuhusu kazi za AI na huduma ya malipo ya jukwaa.'
                : 'Share your genuine experience with AI tasks, payout speed, and customer care.'}
            </p>

            {submittedStatus && (
              <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  {isSw
                    ? 'Maoni yako yametumwa na kuongezwa kikamilifu!'
                    : 'Your review was submitted and posted successfully!'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isSw ? 'Jina Lako / Name:' : 'Your Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={isSw ? 'Mfano: Juma Baraka' : 'e.g. John Doe'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isSw ? 'Nchi Yako / Country:' : 'Country:'}
                </label>
                <select
                  value={userCountry}
                  onChange={(e) => setUserCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Tanzania">🇹🇿 Tanzania</option>
                  <option value="Kenya">🇰🇪 Kenya</option>
                  <option value="Uganda">🇺🇬 Uganda</option>
                  <option value="USA">🇺🇸 USA</option>
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="Germany">🇩🇪 Germany</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="South Africa">🇿🇦 South Africa</option>
                  <option value="Other">🌍 Other Countries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isSw ? 'Kiasi Ulichotoa (Hiari):' : 'Amount Withdrawn (Optional):'}
                </label>
                <input
                  type="text"
                  value={userPayoutAmount}
                  onChange={(e) => setUserPayoutAmount(e.target.value)}
                  placeholder={isSw ? 'Mfano: TSh 65,000 M-Pesa' : 'e.g. $45 PayPal / TSh 60,000'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isSw ? 'Maoni Yako / Comment:' : 'Your Feedback / Comment:'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={userCommentText}
                  onChange={(e) => setUserCommentText(e.target.value)}
                  placeholder={
                    isSw
                      ? 'Eleza jinsi unavyopata rewards na uzoefu wako kwenye GIX AI TASKS...'
                      : 'Share how easily you complete AI tasks and receive rewards...'
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-indigo-600 to-indigo-700 py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 active:scale-95 disabled:opacity-50 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {isSubmitting
                    ? isSw
                      ? 'Inatuma...'
                      : 'Posting...'
                    : isSw
                    ? 'TUMA MAONI / SUBMIT COMMENT'
                    : 'SUBMIT COMMENT'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
