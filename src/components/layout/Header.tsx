import React from 'react';
import { Sun, Moon, Globe, Award } from 'lucide-react';
import type { TabId } from '../../types/navigation';
import type { Theme } from '../../hooks/useTheme';

interface HeaderProps {
  currentTab: TabId;
  theme: Theme;
  onToggleTheme: () => void;
  userLevel?: number;
  userXp?: number;
}

const TAB_TITLES: Record<TabId, string> = {
  dashboard: 'Panel główny',
  games: 'Gry i quizy',
  'world-map': 'Mapa świata',
  training: 'Generator treningów',
  'daily-challenge': 'Wyzwanie dnia',
  stats: 'Statystyki',
  profile: 'Profil gracza',
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  theme,
  onToggleTheme,
  userLevel = 1,
  userXp = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors shadow-xs">
      {/* Current page breadcrumb */}
      <div className="flex items-center gap-2.5 text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400">
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline font-semibold text-slate-800 dark:text-slate-200">GeoMaster</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
          {TAB_TITLES[currentTab] || 'Panel główny'}
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* User level indicator - clean badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-2xs">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Poziom <strong className="text-slate-900 dark:text-slate-100 font-bold">{userLevel}</strong></span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{userXp} XP</span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
          title={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Jasny</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Ciemny</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
