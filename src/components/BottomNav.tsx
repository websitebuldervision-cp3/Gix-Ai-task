import React from 'react';
import { Home, BrainCircuit, ClipboardList, Wallet, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { t, activeTab, setActiveTab } = useApp();

  const items = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'tasks', label: t.nav.tasks, icon: BrainCircuit },
    { id: 'my-tasks', label: t.nav.myTasks, icon: ClipboardList },
    { id: 'rewards', label: t.nav.rewards, icon: Wallet },
    { id: 'account', label: t.nav.account, icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-[#080B11]/95 px-2 py-1.5 backdrop-blur-lg lg:hidden">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center rounded-xl py-1 px-3 transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-3 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
