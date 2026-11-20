import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check,
  X,
  ArrowRight,
  Keyboard,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import { geoMercator, geoPath } from 'd3-geo';
import {
  useQuizEngine,
  type AnswerMode,
  type ContinentFilter,
  type SessionLimit,
} from '../../hooks/useQuizEngine';
import { QuizSummary } from './QuizSummary';
import { getGeoFeatureForCountry, hasCountryShape } from '../../data/geoShapes';
import type { Country } from '../../db';

const CONTINENTS: ContinentFilter[] = [
  'Wszystkie',
  'Europa',
  'Azja',
  'Afryka',
  'Ameryka Północna',
  'Ameryka Południowa',
  'Oceania',
];

interface ShapesGameProps {
  onBack?: () => void;
}

export const ShapesGame: React.FC<ShapesGameProps> = ({ onBack }) => {
  const [continent, setContinent] = useState<ContinentFilter>('Wszystkie');
  const [answerMode, setAnswerMode] = useState<AnswerMode>('choice');
  const [sessionLimit, setSessionLimit] = useState<SessionLimit>(10);

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter out micro-states that don't have geometries in 110m resolution
  const customFilter = useCallback((country: Country) => {
    return hasCountryShape(country);
  }, []);

  const {
    pool,
    currentCountry,
    options,
    selectedOption,
    textInput,
    setTextInput,
    isSubmitted,
    isCorrect,
    streak,
    sessionResults,
    isSessionFinished,
    currentQuestionNumber,
    progressPercent,
    submitAnswer,
    handleProceed,
    restartSession,
  } = useQuizEngine({
    mode: 'shapes',
    continent,
    sessionLimit,
    customFilter,
  });

  // Calculate isolated SVG vector path for current country
  const width = 320;
  const height = 240;

  const currentGeo = useMemo(() => {
    return getGeoFeatureForCountry(currentCountry);
  }, [currentCountry]);

  const pathData = useMemo(() => {
    if (!currentGeo) return '';
    try {
      const projection = geoMercator().fitExtent(
        [
          [20, 20],
          [width - 20, height - 20],
        ],
        currentGeo
      );
      const pathGenerator = geoPath().projection(projection);
      return pathGenerator(currentGeo) || '';
    } catch (e) {
      console.error('Error calculating path for country:', e);
      return '';
    }
  }, [currentGeo]);

  // Focus input when input mode is enabled and new question starts
  useEffect(() => {
    if (answerMode === 'input' && !isSubmitted) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [answerMode, currentCountry, isSubmitted]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSessionFinished) return;

      if (isSubmitted) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleProceed();
        }
        return;
      }

      if (answerMode === 'choice' && !isSubmitted) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (options[idx]) {
            submitAnswer(options[idx].iso2, false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, isSessionFinished, answerMode, options, handleProceed, submitAnswer]);

  // Podsumowanie sesji
  if (isSessionFinished) {
    return (
      <QuizSummary
        title="Podsumowanie: Kształty państw"
        subtitle={`Rozegrano serię ${sessionResults.length} pytań (${continent}).`}
        sessionLimit={sessionLimit}
        results={sessionResults}
        onRestart={restartSession}
        onBack={onBack}
        renderItemExtra={(r) => (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">
            Stolica: {r.country.capital} • {r.country.continent}
          </span>
        )}
      />
    );
  }

  if (!currentCountry) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
        Ładowanie bazy konturów państw...
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Top Bar / Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer mr-1"
            >
              ← Tryby
            </button>
          )}
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Zgadnij państwo (Kształty)
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {sessionLimit === 'infinite'
              ? `Pytanie #${currentQuestionNumber}`
              : `Pytanie ${Math.min(currentQuestionNumber, sessionLimit)} z ${sessionLimit}`}
          </span>
        </div>

        {/* Controls: Długość sesji, Tryb odpowiedzi & Streak */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {streak > 0 && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Seria: {streak}
            </span>
          )}

          {/* Długość sesji */}
          <div className="inline-flex rounded-md bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
            {(['infinite', 10, 20] as SessionLimit[]).map((lim) => (
              <button
                key={String(lim)}
                onClick={() => {
                  setSessionLimit(lim);
                  restartSession();
                }}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  sessionLimit === lim
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-medium'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title={lim === 'infinite' ? 'Tryb nieskończony' : `Seria ${lim} pytań`}
              >
                {lim === 'infinite' ? '∞' : `${lim}`}
              </button>
            ))}
          </div>

          {/* Tryb odpowiedzi */}
          <div className="inline-flex rounded-md bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setAnswerMode('choice')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                answerMode === 'choice'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-medium'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Wybór spośród 4 opcji"
            >
              <ListFilter className="w-3 h-3" />
              <span>4 opcje</span>
            </button>
            <button
              onClick={() => setAnswerMode('input')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                answerMode === 'input'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-medium'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Wpisywanie nazwy z klawiatury"
            >
              <Keyboard className="w-3 h-3" />
              <span>Wpis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pasek postępu dla sesji */}
      {sessionLimit !== 'infinite' && (
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Regiony */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 dark:text-slate-500 text-[11px] mr-1">Region:</span>
        {CONTINENTS.map((c) => (
          <button
            key={c}
            onClick={() => {
              setContinent(c);
              restartSession();
            }}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer text-xs ${
              continent === c
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Karta z Wyizolowanym Konturem SVG */}
      <div className="p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center transition-colors shadow-xs">
        <div className="text-xs text-slate-400 dark:text-slate-500 mb-2">
          Rozpoznaj państwo po jego wyizolowanym konturze:
        </div>

        <div className="w-full max-w-[340px] h-[240px] flex items-center justify-center p-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
          {pathData ? (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
            >
              <path
                d={pathData}
                className="fill-slate-200 stroke-slate-700 dark:fill-slate-800 dark:stroke-emerald-400 transition-colors"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <div className="text-xs text-slate-400 text-center">
              Ładowanie konturu...
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 font-mono flex items-center gap-2">
          <span>Region: {currentCountry.continent}</span>
          <span>•</span>
          <span>Pula w tym trybie: {pool.length} państw</span>
        </div>
      </div>

      {/* Opcje odpowiedzi */}
      {answerMode === 'choice' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt, idx) => {
            const isTarget = opt.iso2 === currentCountry.iso2;
            const isUserChoice = selectedOption === opt.iso2;

            let btnClass =
              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800';

            if (isSubmitted) {
              if (isTarget) {
                btnClass =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
              } else if (isUserChoice && !isTarget) {
                btnClass =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
              } else {
                btnClass = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={opt.iso2}
                disabled={isSubmitted}
                onClick={() => submitAnswer(opt.iso2, false)}
                className={`p-3 rounded-md border text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${btnClass}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span>{opt.namePl}</span>
                </div>

                {isSubmitted && isTarget && (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                {isSubmitted && isUserChoice && !isTarget && (
                  <X className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Wpisywanie z klawiatury */
        <div className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (textInput.trim() && !isSubmitted) {
                submitAnswer(textInput, true);
              }
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              disabled={isSubmitted}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Wpisz nazwę państwa (np. Francja)..."
              className="flex-1 px-3.5 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 dark:focus:border-slate-600 disabled:opacity-60 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitted || !textInput.trim()}
              className="px-4 py-2 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Sprawdź
            </button>
          </form>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Wskazówka: wielkość liter i polskie znaki diakrytyczne nie są ściśle wymagane.
          </div>
        </div>
      )}

      {/* Karta Feedbacku */}
      {isSubmitted && (
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Prawidłowa odpowiedź! (+15 XP)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <X className="w-4 h-4" />
                  <span>Niepoprawna odpowiedź (+2 XP)</span>
                </div>
              )}
            </div>

            <button
              onClick={handleProceed}
              className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>
                {sessionLimit !== 'infinite' && sessionResults.length >= sessionLimit
                  ? 'Zobacz podsumowanie'
                  : 'Następne'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="text-[10px] opacity-70 hidden sm:inline">(Enter)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Państwo:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className={`fi fi-${currentCountry.iso2.toLowerCase()} text-xs rounded-2xs`} />
                {currentCountry.namePl}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Stolica:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {currentCountry.capital}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Kontynent:</span>
              <span className="text-slate-700 dark:text-slate-300">{currentCountry.continent}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Waga trudności:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {currentCountry.difficultyWeight.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
