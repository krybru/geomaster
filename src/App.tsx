import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './views/DashboardView';
import { GamesView } from './views/GamesView';
import { WorldMapView } from './views/WorldMapView';
import { TrainingView } from './views/TrainingView';
import { DailyChallengeView } from './views/DailyChallengeView';
import { StatsView } from './views/StatsView';
import { ProfileView } from './views/ProfileView';
import { db, initializeDatabase } from './db';
import { useTheme } from './hooks/useTheme';
import type { TabId } from './types/navigation';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [selectedGameMode, setSelectedGameMode] = useState<'flags' | 'capitals' | 'shapes' | 'memory' | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Reactive user stats for the header
  const userStats = useLiveQuery(() => db.userStats.get('default'));

  useEffect(() => {
    initializeDatabase();
  }, []);

  const handleNavigate = (tab: TabId, gameMode?: 'flags' | 'capitals' | 'shapes' | 'memory') => {
    setCurrentTab(tab);
    if (tab === 'games' && gameMode) {
      setSelectedGameMode(gameMode);
    } else if (tab !== 'games') {
      setSelectedGameMode(null);
    }
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'games':
        return (
          <GamesView
            initialMode={selectedGameMode}
            onResetMode={() => setSelectedGameMode(null)}
          />
        );
      case 'world-map':
        return <WorldMapView />;
      case 'training':
        return <TrainingView />;
      case 'daily-challenge':
        return <DailyChallengeView />;
      case 'stats':
        return <StatsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased font-sans transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar currentTab={currentTab} onNavigate={(tab) => handleNavigate(tab)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-8">
        {/* Top Header with Theme Switcher & Live Level/XP */}
        <Header
          currentTab={currentTab}
          theme={theme}
          onToggleTheme={toggleTheme}
          userLevel={userStats?.level ?? 1}
          userXp={userStats?.xp ?? 0}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onNavigate={(tab) => handleNavigate(tab)} />
    </div>
  );
};

export default App;
