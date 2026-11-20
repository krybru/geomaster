import React from 'react';
import {
  LayoutDashboard,
  Gamepad2,
  Globe,
  Dumbbell,
  Calendar,
  BarChart2,
  User,
} from 'lucide-react';
import type { TabId } from '../../types/navigation';

interface SidebarProps {
  currentTab: TabId;
  onNavigate: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'games', label: 'Gry i quizy', icon: Gamepad2 },
  { id: 'world-map', label: 'Mapa świata', icon: Globe },
  { id: 'training', label: 'Trening', icon: Dumbbell },
  { id: 'daily-challenge', label: 'Wyzwanie dnia', icon: Calendar },
  { id: 'stats', label: 'Statystyki', icon: BarChart2 },
  { id: 'profile', label: 'Profil gracza', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-slate-950 min-h-screen sticky top-0 h-screen select-none transition-colors shadow-xs">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800/90 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-xs">
          <Globe className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
            GeoMaster
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Nauka geografii świata
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/70 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Clean minimal footer */}
      <div className="p-5 border-t border-slate-200/80 dark:border-slate-800/90 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>GeoMaster v0.2</span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-[10px] font-mono">
          Web App
        </span>
      </div>
    </aside>
  );
};
