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

interface BottomNavProps {
  currentTab: TabId;
  onNavigate: (tab: TabId) => void;
}

const MOBILE_ITEMS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Start', icon: LayoutDashboard },
  { id: 'games', label: 'Gry', icon: Gamepad2 },
  { id: 'world-map', label: 'Mapa', icon: Globe },
  { id: 'training', label: 'Trening', icon: Dumbbell },
  { id: 'daily-challenge', label: 'Dzień', icon: Calendar },
  { id: 'stats', label: 'Staty', icon: BarChart2 },
  { id: 'profile', label: 'Profil', icon: User },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 transition-colors shadow-lg">
      <div className="flex items-center justify-around">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-emerald-50 dark:bg-emerald-950/50' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
