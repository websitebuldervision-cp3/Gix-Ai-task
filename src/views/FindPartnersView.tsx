import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_PARTNERS } from '../data/defaultPartners';
import { ChatPartner, PresenceStatus } from '../types';
import {
  Users,
  Search,
  Filter,
  MessageSquare,
  Globe,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const FindPartnersView: React.FC = () => {
  const { openChatWithPartner, language, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [onlineOnly, setOnlineOnly] = useState(false);

  // Filter partners
  const filteredPartners = useMemo(() => {
    return DEFAULT_PARTNERS.filter((partner) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = partner.name.toLowerCase().includes(q);
        const matchesCountry = partner.country.toLowerCase().includes(q);
        const matchesBio = partner.bio[language].toLowerCase().includes(q);
        const matchesInterests = partner.interests.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesCountry && !matchesBio && !matchesInterests) {
          return false;
        }
      }

      // Country filter
      if (selectedCountry !== 'all' && partner.country !== selectedCountry) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && partner.kiswahiliLevel !== selectedLevel) {
        return false;
      }

      // Online only
      if (onlineOnly && partner.status !== 'online') {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCountry, selectedLevel, onlineOnly, language]);

  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(DEFAULT_PARTNERS.map((p) => p.country)));
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Users className="h-4 w-4" />
              <span>{t.findPartners.title}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'sw' ? 'Wageni Wanaotaka Kujifunza Kiswahili' : 'International Learners Seeking Practice'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.findPartners.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 shrink-0 text-right sm:text-center">
            <div className="text-[11px] font-bold text-emerald-300 uppercase">
              {language === 'sw' ? 'Malipo kwa Dakika' : 'Chat Earning Rate'}
            </div>
            <div className="font-display text-xl font-black text-white">
              $0.50 <span className="text-xs font-medium text-slate-400">/ 1 min</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              ≈ TSh 1,300 (Pending)
            </div>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.findPartners.searchPlaceholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Country Dropdown */}
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">{t.findPartners.allCountries}</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Kiswahili Level Dropdown */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">{t.findPartners.allLevels}</option>
              <option value="beginner">{t.findPartners.beginner}</option>
              <option value="intermediate">{t.findPartners.intermediate}</option>
              <option value="advanced">{t.findPartners.advanced}</option>
            </select>
          </div>

          {/* Online Toggle */}
          <button
            onClick={() => setOnlineOnly(!onlineOnly)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              onlineOnly
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                : 'border-slate-700 bg-slate-950/90 text-slate-300 hover:border-slate-600'
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>{t.findPartners.onlineOnly}</span>
          </button>
        </div>
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          <Users className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {t.findPartners.noResults}
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            {language === 'sw'
              ? 'Jaribu kuweka vichujio vingine au kutoa maneno ya utafutaji.'
              : 'Try clearing your search query or relaxing your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => {
            const isOnline = partner.status === 'online';
            const isAway = partner.status === 'away';

            return (
              <div
                key={partner.id}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-emerald-500/40 hover:bg-slate-900 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={partner.avatarUrl}
                          alt={partner.name}
                          className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-emerald-500/50 transition-colors"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ring-2 ring-slate-900 ${
                            isOnline
                              ? 'bg-emerald-500'
                              : isAway
                              ? 'bg-amber-400'
                              : 'bg-slate-500'
                          }`}
                          title={partner.status}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {partner.name}
                          </h3>
                          <span className="text-base" title={partner.country}>
                            {partner.countryFlag}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          @{partner.username} • {partner.country}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 uppercase tracking-wide">
                            {partner.kiswahiliLevel}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Lugha: {partner.nativeLanguage}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="mt-3.5 text-xs text-slate-300 leading-relaxed">
                    {partner.bio[language]}
                  </p>

                  {/* Learning Goal */}
                  <div className="mt-3 rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-[11px] text-slate-300">
                    <span className="font-semibold text-emerald-400 block mb-0.5">
                      🎯 {t.findPartners.learningLabel}
                    </span>
                    <span>{partner.learningGoals[language]}</span>
                  </div>

                  {/* Interests Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {partner.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        #{interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom action row */}
                <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] font-medium">
                    {isOnline && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {t.findPartners.statusOnline}
                      </span>
                    )}
                    {isAway && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {t.findPartners.statusAway}
                      </span>
                    )}
                    {!isOnline && !isAway && (
                      <span className="text-slate-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                        {t.findPartners.statusOffline}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openChatWithPartner(partner)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{t.findPartners.startChat}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
