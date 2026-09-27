import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { X, UserPlus, Shield, Check, AlertCircle } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
];

export const RegistrationModal: React.FC = () => {
  const { isRegistrationOpen, closeRegistration, setUser, language } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Tanzania');
  const [age, setAge] = useState('23');
  const [kiswahiliLevel, setKiswahiliLevel] = useState<'native' | 'advanced' | 'intermediate'>('native');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isRegistrationOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agreedTerms) {
      setErrorMsg(
        language === 'sw'
          ? 'Tafadhali kubaliana na Vigezo na Masharti na Kanuni za Jumuiya.'
          : 'Please agree to the Terms of Service and Community Rules.'
      );
      return;
    }

    setIsLoading(true);
    const result = await apiService.registerUser({
      fullName,
      username,
      emailOrPhone,
      password,
      country,
      age: parseInt(age, 10) || 20,
      kiswahiliLevel,
      languagesSpoken: ['Kiswahili', 'English'],
      avatarUrl: selectedAvatar,
    });

    setIsLoading(false);

    if (result.success && result.user) {
      setUser(result.user);
      closeRegistration();
    } else {
      setErrorMsg(result.error || 'Hitilafu ya usajili');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl">
        <button
          onClick={closeRegistration}
          className="absolute right-4 top-4 rounded-xl bg-slate-800 p-1.5 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              {language === 'sw' ? 'Fungua Akaunti ya GIX CHATS' : 'Create GIX CHATS Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'sw'
                ? 'Jisajili uanze kuchat na wageni na kupata malipo ya kila dakika.'
                : 'Sign up to connect with international learners and earn per minute.'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-950/50 border border-red-500/30 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {language === 'sw' ? 'Chagua Picha ya Wasifu (Avatar):' : 'Select Profile Avatar:'}
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((url, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative h-12 w-12 rounded-full overflow-hidden shrink-0 border-2 transition ${
                    selectedAvatar === url
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="avatar" className="h-full w-full object-cover" />
                  {selectedAvatar === url && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Jina Kamili:' : 'Full Name:'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="mf. Baraka Emmanuel"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Jina la Mtumiaji (Username):' : 'Username:'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mf. baraka_swahili"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Barua Pepe au Simu:' : 'Email or Phone Number:'}
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="0712345678 au email@domain.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Nenosiri (Password):' : 'Password:'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Nchi:' : 'Country:'}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Tanzania">🇹🇿 Tanzania</option>
                <option value="Kenya">🇰🇪 Kenya</option>
                <option value="Uganda">🇺🇬 Uganda</option>
                <option value="Rwanda">🇷🇼 Rwanda</option>
                <option value="Burundi">🇧🇮 Burundi</option>
                <option value="DRC">🇨🇩 DR Congo</option>
                <option value="Other">🌍 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Umri (Miaka):' : 'Age:'}
              </label>
              <input
                type="number"
                min="18"
                max="80"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Kiwango cha Kiswahili:' : 'Kiswahili Level:'}
              </label>
              <select
                value={kiswahiliLevel}
                onChange={(e) => setKiswahiliLevel(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="native">Native / Mzawa</option>
                <option value="advanced">Advanced / Fasaha Sana</option>
                <option value="intermediate">Intermediate / Wastani</option>
              </select>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-300">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
              />
              <span>
                {language === 'sw'
                  ? 'Ninakubaliana na Vigezo na Masharti, Sera ya Faragha, na ninaahidi kufuata kanuni za kutoa lugha ya heshima, kutoomba fedha binafsi au kufanya utapeli.'
                  : 'I agree to the Terms of Service, Privacy Policy, and promise to uphold respectful communication with zero solicitation or scamming.'}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-slate-950 hover:brightness-110 active:scale-98 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span>{language === 'sw' ? 'Inasajili...' : 'Registering...'}</span>
            ) : (
              <span>{language === 'sw' ? 'KAMILISHA USAJILI' : 'COMPLETE REGISTRATION'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
