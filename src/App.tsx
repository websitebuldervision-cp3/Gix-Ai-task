import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { TaskEngine } from './components/TaskEngine';
import { SuccessModal } from './components/SuccessModal';
import { LockedTaskModal } from './components/LockedTaskModal';
import { PwaModal } from './components/PwaModal';
import { LivePayoutToast } from './components/LivePayoutToast';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { NotificationPromptModal } from './components/NotificationPromptModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { pushService } from './services/pushNotificationService';

import { HomeView } from './views/HomeView';
import { TasksView } from './views/TasksView';
import { MyTasksView } from './views/MyTasksView';
import { RewardsView } from './views/RewardsView';
import { LeaderboardView } from './views/LeaderboardView';
import { AccountView } from './views/AccountView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="mx-auto max-w-7xl px-3 pt-4 sm:px-6 sm:pt-6">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'tasks' && <TasksView />}
      {activeTab === 'my-tasks' && <MyTasksView />}
      {activeTab === 'rewards' && <RewardsView />}
      {activeTab === 'leaderboard' && <LeaderboardView />}
      {activeTab === 'account' && <AccountView />}
    </main>
  );
};

const GlobalModals: React.FC = () => {
  const { isNotificationSettingsOpen, closeNotificationSettings, language } = useApp();

  React.useEffect(() => {
    // If user already granted permission, ensure they are synced and receive entry alert
    pushService.syncOnEntry(language);
  }, [language]);

  return (
    <>
      <TaskEngine />
      <SuccessModal />
      <LockedTaskModal />
      <PwaModal />
      <LivePayoutToast />
      <FloatingWhatsApp />
      <NotificationPromptModal />
      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={closeNotificationSettings}
      />
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 antialiased">
          <Header />
          <div className="flex-1">
            <MainContent />
          </div>
          <Footer />
          <BottomNav />

          {/* Global Floating Modals & Push Widgets */}
          <GlobalModals />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}
