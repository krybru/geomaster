import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Gamepad2,
  Layers,
  Flag,
  MapPin,
  Calendar,
  ArrowRight,
  Target,
  Zap,
  Flame,
  Check,
  X,
  Play,
  Dumbbell,
  Compass,
} from 'lucide-react';
import { db } from '../db';
import type { TabId } from '../types/navigation';

interface DashboardViewProps {
  onNavigate: (tab: TabId, gameMode?: 'flags' | 'capitals' | 'shapes' | 'memory') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  // Live reactive data from Dexie
  const userStats = useLiveQuery(() => db.userStats.get('default'));
  const recentAnswers = useLiveQuery(() =>
    db.answerHistory.orderBy('id').reverse().limit(6).toArray()
  );
  const countries = useLiveQuery(() => db.countries.toArray());

  const countryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    countries?.forEach((c) => map.set(c.iso2, c.namePl));
    return map;
  }, [countries]);

  const totalAnswered = userStats?.totalAnswered ?? 0;
  const totalCorrect = userStats?.totalCorrect ?? 0;
  const accuracy = totalAnswered > 0 ? `${Math.round((totalCorrect / totalAnswered) * 100)}%` : '—';
  const xp = userStats?.xp ?? 0;
  const streak = userStats?.streakDays ?? 0;

  const stats = [
    {
      label: 'Rozegrane pytania',
      value: totalAnswered.toString(),
      subtext: totalAnswered > 0 ? `${totalCorrect} poprawnych` : 'Rozpocznij pierwszy quiz',
      icon: Target,
      color: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
    },
    {
      label: 'Średnia celność',
      value: accuracy,
      subtext: totalAnswered > 0 ? 'Skuteczność ogólna' : 'Brak odpowiedzi',
      icon: Target,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      label: 'Zdobyte punkty',
      value: `${xp} XP`,
      subtext: `Poziom ${userStats?.level ?? 1}`,
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
    },
    {
      label: 'Aktualna seria',
      value: `${streak} dni`,
      subtext: streak > 0 ? 'Utrzymuj nawyk!' : 'Zagraj dzisiaj',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
    },
  ];

  const modes = [
    {
      id: 'flags' as const,
      title: 'Zgadnij flagę',
      subtitle: '197 flag narodowych',
      desc: 'Rozpoznawaj kraje na podstawie barw narodowych w trybie 4 opcji lub wpisywania tekstu.',
      icon: Flag,
      active: true,
      badge: 'Dostępne',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    },
    {
      id: 'capitals' as const,
      title: 'Stolice świata',
      subtitle: '197 stolic i metropolii',
      desc: 'Dwukierunkowy quiz sprawdzający wiedzę: kraj → stolica oraz stolica → państwo.',
      icon: MapPin,
      active: true,
      badge: 'Dostępne',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
    },
    {
      id: 'shapes' as const,
      title: 'Zgadnij państwo',
      subtitle: '167 konturów SVG',
      desc: 'Identyfikuj kraje po wyizolowanych wektorowych konturach granic bez sąsiednich państw.',
      icon: Layers,
      active: true,
      badge: 'Dostępne',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300',
    },
    {
      id: 'memory' as const,
      title: 'Memory geograficzne',
      subtitle: 'Ćwiczenie pamięci',
      desc: 'Dopasowywanie par państw i symboli w minimalistycznej siatce kafelków.',
      icon: Gamepad2,
      active: false,
      badge: 'Wkrótce',
      badgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Panel główny
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Rozwijaj wiedzę geograficzną poprzez interaktywne quizy i mapę świata.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('training')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Szybki trening</span>
          </button>
          <button
            onClick={() => onNavigate('world-map')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Otwórz mapę</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 transition-all shadow-xs hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {s.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bgColor} ${s.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {s.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {s.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Game Modes (Interactive Cards directly launching the quiz) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Moduły gier i quizów
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Wybierz tryb, aby od razu rozpocząć sesję quizową.
            </p>
          </div>
          <button
            onClick={() => onNavigate('games')}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            Wszystkie tryby
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (m.active) {
                    onNavigate('games', m.id);
                  } else {
                    onNavigate('games');
                  }
                }}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs group ${
                  m.active
                    ? 'hover:border-emerald-500/60 dark:hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5'
                    : 'opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-950/60 dark:group-hover:text-emerald-400 transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${m.badgeColor}`}
                    >
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {m.title}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {m.subtitle}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                  <span
                    className={
                      m.active
                        ? 'text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5'
                        : 'text-slate-400 dark:text-slate-500'
                    }
                  >
                    {m.active && <Play className="w-3.5 h-3.5 fill-current" />}
                    {m.active ? 'Zagraj teraz' : 'Zobacz szczegóły'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Daily Challenge & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daily Challenge Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-all shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2.5">
              <Calendar className="w-4 h-4" />
              <span>Wyzwanie dzisiejsze</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Codzienny zestaw 10 pytań
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-xl">
              Sprawdź wiedzę ze stolic, flag i konturów w codziennej rundzie. Każdy dzień przynosi unikalny, powtarzalny zestaw pytań do utrzymania passy dni.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Punkty doświadczenia:{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-bold">+150 XP</strong> za komplet
            </div>
            <button
              onClick={() => onNavigate('daily-challenge')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Rozpocznij wyzwanie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Answers Log */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-all shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ostatnie odpowiedzi
              </h3>
              <button
                onClick={() => onNavigate('stats')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                Historia
              </button>
            </div>

            {recentAnswers && recentAnswers.length > 0 ? (
              <div className="space-y-2.5">
                {recentAnswers.map((ans) => {
                  const countryName = countryMap.get(ans.countryIso2) || ans.countryIso2;
                  return (
                    <div
                      key={ans.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`fi fi-${ans.countryIso2.toLowerCase()} text-sm rounded-xs shadow-2xs`}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {countryName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(ans.responseTimeMs / 1000).toFixed(1)}s
                        </span>
                        {ans.isCorrect ? (
                          <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <X className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                Brak zarejestrowanych odpowiedzi. Rozpocznij grę, aby zobaczyć historię!
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 text-center">
            Zapisywane lokalnie w IndexedDB
          </div>
        </div>
      </div>
    </div>
  );
};
