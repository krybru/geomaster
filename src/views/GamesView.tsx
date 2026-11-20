import React, { useState, useEffect } from 'react';
import {
  Layers,
  Flag,
  MapPin,
  Gamepad2,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FlagGame } from '../components/games/FlagGame';
import { CapitalsGame } from '../components/games/CapitalsGame';
import { ShapesGame } from '../components/games/ShapesGame';

type ActiveGameMode = 'flags' | 'capitals' | 'shapes' | 'memory' | null;

interface GameItem {
  id: 'flags' | 'capitals' | 'shapes' | 'memory';
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  itemsCount: string;
  isAvailable: boolean;
  accentColor: string;
}

interface GamesViewProps {
  initialMode?: ActiveGameMode;
  onResetMode?: () => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ initialMode = null, onResetMode }) => {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setActiveGame(initialMode);
    }
  }, [initialMode]);

  const handleBack = () => {
    setActiveGame(null);
    onResetMode?.();
  };

  const games: GameItem[] = [
    {
      id: 'flags',
      title: 'Zgadnij flagę',
      subtitle: 'Flagi narodowe świata',
      description: 'Rozpoznawaj kraje na podstawie wektorowych barw narodowych w trybie 4 opcji lub wpisywania tekstu.',
      icon: Flag,
      itemsCount: '197 flag',
      isAvailable: true,
      accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      id: 'capitals',
      title: 'Stolice świata',
      subtitle: 'Metropolie i stolice',
      description: 'Quiz dwukierunkowy: wskaż stolicę dla danego państwa lub odgadnij kraj na podstawie nazwy stolicy.',
      icon: MapPin,
      itemsCount: '197 stolic',
      isAvailable: true,
      accentColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50',
    },
    {
      id: 'shapes',
      title: 'Zgadnij państwo',
      subtitle: 'Rozpoznawanie kształtów',
      description: 'Identyfikuj kraje po wyizolowanych wektorowych konturach granic SVG bez sąsiednich państw.',
      icon: Layers,
      itemsCount: '167 konturów',
      isAvailable: true,
      accentColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
      id: 'memory',
      title: 'Memory geograficzne',
      subtitle: 'Pamięć wzrokowa',
      description: 'Dopasowywanie par państwo-flaga w siatce kafelków. Ćwicz pamięć skojarzeniową.',
      icon: Gamepad2,
      itemsCount: 'W przygotowaniu',
      isAvailable: false,
      accentColor: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
    },
  ];

  // Widok aktywnej gry
  if (activeGame === 'flags') {
    return <FlagGame onBack={handleBack} />;
  }
  if (activeGame === 'capitals') {
    return <CapitalsGame onBack={handleBack} />;
  }
  if (activeGame === 'shapes') {
    return <ShapesGame onBack={handleBack} />;
  }

  // Widok wyboru trybów
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Tryby quizowe
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Wybierz moduł quizowy. Każdy tryb korzysta ze wspólnego algorytmu ważonego losowania pytań na podstawie Twoich postępów.
        </p>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 transition-all duration-200 flex flex-col justify-between shadow-xs ${
                game.isAvailable
                  ? 'hover:border-emerald-500/60 dark:hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5'
                  : 'opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-2xs ${game.accentColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      game.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {game.itemsCount}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {game.title}
                </h3>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {game.subtitle}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                {game.isAvailable ? (
                  <button
                    onClick={() => setActiveGame(game.id as ActiveGameMode)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Rozpocznij quiz</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium cursor-not-allowed text-center"
                  >
                    W przygotowaniu
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
