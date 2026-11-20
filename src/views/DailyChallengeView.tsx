import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';

export const DailyChallengeView: React.FC = () => {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Wyzwanie dnia
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jednolity zestaw 10 pytań generowany automatycznie każdego dnia.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>Kolejne wyzwanie za: <strong>14 godz.</strong></span>
        </div>
      </div>

      {/* Main card */}
      <div className="p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Calendar className="w-4 h-4" />
          <span>Wyzwanie: 20 Listopada</span>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Zestaw mieszany: Państwa i Stolice Świata
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Zestaw składa się z 10 pytań o zróżnicowanym stopniu trudności (flagi, stolice i kontury).
            Każdy użytkownik otrzymuje identyczne pytania w danym dniu kalendarzowym.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-400 dark:text-slate-500 block">Liczba pytań</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">10 pytań</span>
          </div>
          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-400 dark:text-slate-500 block">Czas na podejście</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">Bez limitu</span>
          </div>
          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-400 dark:text-slate-500 block">Status podejścia</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">
              {completed ? 'Ukończono' : 'Dostępne'}
            </span>
          </div>
        </div>

        <div className="pt-2">
          {!completed ? (
            <button
              onClick={() => {
                alert('Rozpoczęto wyzwanie dnia.');
                setCompleted(true);
              }}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Rozpocznij wyzwanie
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <Check className="w-3.5 h-3.5" />
              Dzisiejsze wyzwanie zostało zaliczone.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
