import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Shield, HelpCircle, PhoneCall, ExternalLink } from 'lucide-react';
import { WHATSAPP_PHONE } from '../data/translations';

export const Footer: React.FC = () => {
  const { language, openWhatsAppSupport, openActivationLink, openSafetyModal, setActiveTab } = useApp();

  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/70 pb-20 pt-8 sm:pb-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-white">GIX CHATS</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-md">
              {language === 'sw'
                ? 'Jukwaa rasmi la kuunganisha watu duniani kote na wazawa wa lugha ya Kiswahili. Fundisha Kiswahili kupitia mazungumzo halisi na ulipwe kwa muda wako wa chat.'
                : 'The official global platform connecting international learners with native Swahili speakers. Teach Kiswahili through real-time conversations and earn for your chat time.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
                <Shield className="h-3 w-3 text-emerald-400" />
                <span>Verified Moderation</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-slate-300">
                <span>Earning Rate: $0.50 / min</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {language === 'sw' ? 'Kurasa Kuu' : 'Navigation'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-emerald-400 transition">
                  {language === 'sw' ? 'Mwanzo' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('find')} className="hover:text-emerald-400 transition">
                  {language === 'sw' ? 'Tafuta Wageni' : 'Find Partners'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('earnings')} className="hover:text-emerald-400 transition">
                  {language === 'sw' ? 'Mapato Yako' : 'Earnings Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('withdraw')} className="hover:text-emerald-400 transition">
                  {language === 'sw' ? 'Kutoa Pesa' : 'Withdrawal Center'}
                </button>
              </li>
              <li>
                <button onClick={openActivationLink} className="text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1">
                  <span>{language === 'sw' ? 'Fungua Akaunti' : 'Open Account'}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Customer Care */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {language === 'sw' ? 'Msaada & Usalama' : 'Support & Safety'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={openWhatsAppSupport}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition font-medium"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Customer Care ({WHATSAPP_PHONE})</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openSafetyModal}
                  className="hover:text-slate-200 transition text-left"
                >
                  {language === 'sw' ? 'Kanuni za Usalama na Ulinzi' : 'Community Safety Guidelines'}
                </button>
              </li>
              <li>
                <button
                  onClick={openSafetyModal}
                  className="hover:text-slate-200 transition text-left"
                >
                  {language === 'sw' ? 'Sera ya Faragha & Vigezo' : 'Terms & Privacy Policy'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 border-t border-slate-900 pt-6 text-center text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} GIX CHATS. All rights reserved. Platform rules apply to all eligible chat sessions.
          </p>
        </div>
      </div>
    </footer>
  );
};
