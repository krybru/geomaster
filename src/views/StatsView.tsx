import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Target, BarChart2, Check, X, Clock } from 'lucide-react';
import { db } from '../db';

const CONTINENT_NAMES = [
  'Europa',
  'Azja',
  'Afryka',
  'Ameryka Północna',
  'Ameryka Południowa',
  'Oceania',
] as const;

export const StatsView: React.FC = () => {
  const userStats = useLiveQuery(() => db.userStats.get('default'));
  const allAnswers = useLiveQuery(() => db.answerHistory.orderBy('id').reverse().toArray());
  const allCountries = useLiveQuery(() => db.countries.toArray());

  const countryMap = React.useMemo(() => {
    const map = new Map<string, { namePl: string; continent: string }>();
    allCountries?.forEach((c) => map.set(c.iso2, { namePl: c.namePl, continent: c.continent }));
    return map;
  }, [allCountries]);

  const totalAnswered = userStats?.totalAnswered ?? 0;
  const totalCorrect = userStats?.totalCorrect ?? 0;
  const accuracy = totalAnswered > 0 ? `${Math.round((totalCorrect / totalAnswered) * 100)}%` : '—';

  // Compute total time in minutes
  const totalMs = allAnswers?.reduce((acc, curr) => acc + (curr.responseTimeMs || 0), 0) ?? 0;
  const totalSeconds = Math.round(totalMs / 1000);
  const timeFormatted = totalSeconds > 60 ? `${Math.floor(totalSeconds / 60)} min ${totalSeconds % 60} s` : `${totalSeconds} s`;

  // Compute stats per continent
  const continentStats = React.useMemo(() => {
    const counts: Record<string, { total: number; correct: number }> = {};
    CONTINENT_NAMES.forEach((name) => {
      counts[name] = { total: 0, correct: 0 };
    });

    allAnswers?.forEach((ans) => {
      const info = countryMap.get(ans.countryIso2);
      if (info && counts[info.continent]) {
        counts[info.continent].total += 1;
        if (ans.isCorrect) {
          counts[info.continent].correct += 1;
        }
      }
    });

    return CONTINENT_NAMES.map((name) => {
      const data = counts[name];
      const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      return {
        name,
        total: data.total,
        correct: data.correct,
        accuracy: acc,
      };
    });
  }, [allAnswers, countryMap]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          Statystyki
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rzeczywiste podsumowanie wyników, celności oraz historii podejść (Dexie.js).
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400">Rozegrane pytania</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
            {totalAnswered}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Poprawne: {totalCorrect}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400">Średnia celność</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
            {accuracy}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {totalAnswered > 0 ? `${totalCorrect} / ${totalAnswered} trafień` : 'Brak danych'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400">Łączny czas odpowiedzi</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
            {timeFormatted}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Średnio:{' '}
            {totalAnswered > 0 ? `${(totalMs / totalAnswered / 1000).toFixed(1)}s na pytanie` : '—'}
          </div>
        </div>
      </div>

      {/* Regions breakdown */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Celność według regionów
          </h2>
        </div>

        <div className="space-y-3">
          {continentStats.map((r) => (
            <div key={r.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{r.name}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {r.total > 0 ? (
                    <>
                      <strong>{r.accuracy}%</strong> ({r.correct}/{r.total} poprawnych)
                    </>
                  ) : (
                    'Brak prób'
                  )}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${r.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History table */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Historia rozgrywek (Ostatnie 20 pytań)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Zapisano w IndexedDB ({allAnswers?.length ?? 0})
          </span>
        </div>

        {allAnswers && allAnswers.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {allAnswers.slice(0, 20).map((ans) => {
              const country = countryMap.get(ans.countryIso2);
              const dateStr = new Date(ans.timestamp).toLocaleTimeString('pl-PL', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={ans.id}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`fi fi-${ans.countryIso2.toLowerCase()} text-base shadow-2xs rounded-xs`}
                    />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {country?.namePl || ans.countryIso2}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        Tryb: {ans.mode === 'flags' ? 'Flagi' : ans.mode === 'capitals' ? 'Stolice' : ans.mode === 'shapes' ? 'Kształty' : ans.mode} • {country?.continent}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {(ans.responseTimeMs / 1000).toFixed(1)}s
                    </span>

                    <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono hidden sm:inline">
                      {dateStr}
                    </span>

                    {ans.isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                        <Check className="w-3 h-3" /> Poprawna
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-medium">
                        <X className="w-3 h-3" /> Błąd
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Brak historii podejść.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Ukończone quizy pojawią się w tym zestawieniu w czasie rzeczywistym.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
