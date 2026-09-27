import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Users,
  MessageSquare,
  Wallet,
  ArrowUpRight,
  User,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, activeChatRoom } = useApp();

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'find', label: t.nav.find, icon: Users },
    {
      id: 'chats',
      label: t.nav.chats,
      icon: MessageSquare,
      badge: activeChatRoom ? '1' : undefined,
    },
    { id: 'earnings', label: t.nav.earnings, icon: Wallet },
    { id: 'withdraw', label: t.nav.withdraw, icon: ArrowUpRight },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/80 bg-[#080B11]/95 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-6 items-center px-1 py-1.5 safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`mt-1 text-[10px] font-medium leading-none truncate max-w-[55px] ${
                isActive ? 'font-bold text-emerald-400' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
