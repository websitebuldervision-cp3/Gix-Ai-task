import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { X, LogIn, AlertCircle } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginOpen, closeLogin, setUser, openRegistration, language } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await apiService.loginUser(identifier);
    setIsLoading(false);

    if (res.success && res.user) {
      setUser(res.user);
      closeLogin();
    } else {
      setErrorMsg(res.error || 'Akaunti haikupatikana.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl">
        <button
          onClick={closeLogin}
          className="absolute right-4 top-4 rounded-xl bg-slate-800 p-1.5 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <LogIn className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              {language === 'sw' ? 'Ingia Kwenye Akaunti' : 'Log In to GIX CHATS'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'sw' ? 'Weka jina lako la mtumiaji au simu' : 'Enter your username or phone'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-950/50 border border-red-500/30 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {language === 'sw' ? 'Jina la Mtumiaji au Simu:' : 'Username or Phone:'}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username au Simu"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {language === 'sw' ? 'Nenosiri:' : 'Password:'}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 active:scale-98 transition disabled:opacity-50"
          >
            {isLoading ? (language === 'sw' ? 'Inaingia...' : 'Logging in...') : (language === 'sw' ? 'INGIA SASA' : 'LOG IN NOW')}
          </button>

          <div className="pt-2 text-center text-xs text-slate-400">
            {language === 'sw' ? 'Huna akaunti bado? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                closeLogin();
                openRegistration();
              }}
              className="text-emerald-400 font-bold hover:underline"
            >
              {language === 'sw' ? 'Jisajili Hapa' : 'Sign Up Here'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
