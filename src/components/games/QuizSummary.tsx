import React from 'react';
import { Trophy, RotateCcw, Check, X } from 'lucide-react';
import type { SessionQuestionResult } from '../../hooks/useQuizEngine';

interface QuizSummaryProps {
  title: string;
  subtitle: string;
  sessionLimit: 'infinite' | 10 | 20;
  results: SessionQuestionResult[];
  onRestart: () => void;
  onBack?: () => void;
  renderItemExtra?: (item: SessionQuestionResult) => React.ReactNode;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  title,
  subtitle,
  sessionLimit,
  results,
  onRestart,
  onBack,
  renderItemExtra,
}) => {
  const total = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const totalTimeMs = results.reduce((acc, curr) => acc + curr.timeMs, 0);
  const avgTime = total > 0 ? (totalTimeMs / total / 1000).toFixed(1) : '0';
  const totalGainedXp = correctCount * 15 + (total - correctCount) * 2;

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
      {/* Header podsumowania */}
      <div className="p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Trophy className="w-5 h-5" />
        </div>

        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>

        {/* Podsumowanie w 3 kafelkach */}
        <div className="grid grid-cols-3 gap-2.5 pt-3">
          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Wynik</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {correctCount} / {total}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
              {accuracy}% celności
            </span>
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Punkty</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              +{totalGainedXp} XP
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
              Zapisano w bazie
            </span>
          </div>

          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Średni czas</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{avgTime}s</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
              na pytanie
            </span>
          </div>
        </div>

        {/* Przyciski akcji */}
        <div className="flex gap-2.5 justify-center pt-3">
          <button
            onClick={onRestart}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Zagraj ponownie ({sessionLimit} pytań)
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              Powrót do menu
            </button>
          )}
        </div>
      </div>

      {/* Lista pytań */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Przegląd pytań z tej sesji
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((r, i) => (
            <div key={i} className="py-2 flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono w-4">{i + 1}.</span>
                <span
                  className={`fi fi-${r.country.iso2.toLowerCase()} text-base rounded-xs shadow-2xs`}
                />
                <div>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {r.country.namePl}
                  </span>
                  {renderItemExtra ? (
                    renderItemExtra(r)
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">
                      Stolica: {r.country.capital}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-mono">
                  {(r.timeMs / 1000).toFixed(1)}s
                </span>
                {r.isCorrect ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    <Check className="w-3.5 h-3.5" /> Dobrze
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 text-xs font-medium">
                    <X className="w-3.5 h-3.5" /> Błąd
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
