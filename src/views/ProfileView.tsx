import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Check, Lock } from 'lucide-react';
import { db, resetDatabase } from '../db';

export const ProfileView: React.FC = () => {
  const userStats = useLiveQuery(() => db.userStats.get('default'));
  const totalAnswers = useLiveQuery(() => db.answerHistory.count()) ?? 0;

  const xp = userStats?.xp ?? 0;
  const level = userStats?.level ?? 1;
  const totalCorrect = userStats?.totalCorrect ?? 0;
  const xpInCurrentLevel = xp % 100;

  const achievements = [
    {
      id: 1,
      title: 'Pierwsza flaga',
      desc: 'Odpowiedz poprawnie na co najmniej 1 pytanie w quizie flag.',
      unlocked: totalCorrect >= 1,
      progress: `${Math.min(1, totalCorrect)} / 1`,
    },
    {
      id: 2,
      title: 'Adept geografii',
      desc: 'Zdobądź 10 poprawnych odpowiedzi w aplikacji.',
      unlocked: totalCorrect >= 10,
      progress: `${Math.min(10, totalCorrect)} / 10`,
    },
    {
      id: 3,
      title: 'Mistrz flag',
      desc: 'Udziel 50 poprawnych odpowiedzi w trybie flag.',
      unlocked: totalCorrect >= 50,
      progress: `${Math.min(50, totalCorrect)} / 50`,
    },
    {
      id: 4,
      title: 'Eksplorator świata',
      desc: 'Osiągnij Poziom 5 w profilu użytkownika.',
      unlocked: level >= 5,
      progress: `Poziom ${level} / 5`,
    },
  ];

  const handleResetData = async () => {
    if (confirm('Czy na pewno chcesz zresetować wszystkie lokalne dane i postępy w aplikacji?')) {
      await resetDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          Profil użytkownika
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Lokalne dane konta, postęp poziomu i odznaki (IndexedDB).
        </p>
      </div>

      {/* User Info Card */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Konto lokalne
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Łącznie rozegranych pytań: <strong>{totalAnswers}</strong> • Poprawne: <strong>{totalCorrect}</strong>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            Poziom {level}
          </span>
        </div>

        {/* XP progress */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Postęp do poziomu {level + 1}</span>
            <span>
              <strong>{xpInCurrentLevel}</strong> / 100 XP (Łącznie: {xp} XP)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Osiągnięcia
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Odblokowano: {achievements.filter((a) => a.unlocked).length} / {achievements.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-md border transition-colors flex items-start gap-3 ${
                item.unlocked
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center text-xs shrink-0 ${
                  item.unlocked
                    ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {item.unlocked ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      item.unlocked
                        ? 'text-emerald-900 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {item.progress}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings / Reset */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div>
          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Resetowanie danych aplikacji
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Czyści historię odpowiedzi, zeruje punkty i przywraca domyślne wagi państw.
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="px-3 py-1.5 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-medium transition-colors cursor-pointer"
        >
          Resetuj dane
        </button>
      </div>
    </div>
  );
};
