import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Play,
  Layers,
  Flag,
  MapPin,
  Clock,
  Target,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { geoMercator, geoPath } from 'd3-geo';
import { db, recordAnswer, type Country } from '../db';
import { QuizSummary } from '../components/games/QuizSummary';
import { getGeoFeatureForCountry, hasCountryShape } from '../data/geoShapes';
import type { SessionQuestionResult } from '../hooks/useQuizEngine';

type TaskKind = 'flags' | 'capitals' | 'shapes';
type ContinentOption =
  | 'Wszystkie'
  | 'Europa'
  | 'Azja'
  | 'Afryka'
  | 'Ameryka Północna'
  | 'Ameryka Południowa'
  | 'Oceania';
type TimeLimitOption = 'none' | '3m' | '5m' | '10m';

interface TrainingQuestionResult extends SessionQuestionResult {
  kind: TaskKind;
}

const CONTINENTS: ContinentOption[] = [
  'Wszystkie',
  'Europa',
  'Azja',
  'Afryka',
  'Ameryka Północna',
  'Ameryka Południowa',
  'Oceania',
];

const TIME_LIMIT_SECONDS: Record<TimeLimitOption, number> = {
  none: 0,
  '3m': 180,
  '5m': 300,
  '10m': 600,
};

export const TrainingView: React.FC = () => {
  // Configuration state
  const [selectedRegion, setSelectedRegion] = useState<ContinentOption>('Wszystkie');
  const [selectedKinds, setSelectedKinds] = useState<TaskKind[]>(['flags', 'capitals', 'shapes']);
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [timeLimit, setTimeLimit] = useState<TimeLimitOption>('none');
  const [prioritizeWeakPoints, setPrioritizeWeakPoints] = useState<boolean>(true);

  // Active training state
  const [isTrainingActive, setIsTrainingActive] = useState<boolean>(false);
  const [isTrainingFinished, setIsTrainingFinished] = useState<boolean>(false);

  const [pool, setPool] = useState<Country[]>([]);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [currentKind, setCurrentKind] = useState<TaskKind>('flags');
  const [options, setOptions] = useState<Country[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  const [sessionResults, setSessionResults] = useState<TrainingQuestionResult[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  const recentHistoryRef = useRef<string[]>([]);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Toggle question kind (at least 1 must remain active)
  const toggleKind = (kind: TaskKind) => {
    setSelectedKinds((prev) => {
      if (prev.includes(kind)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((k) => k !== kind);
      }
      return [...prev, kind];
    });
  };

  // Timer countdown
  useEffect(() => {
    if (!isTrainingActive || isTrainingFinished || timeLimit === 'none') return;

    if (secondsRemaining <= 0) {
      setIsTrainingFinished(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTrainingFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTrainingActive, isTrainingFinished, timeLimit, secondsRemaining]);

  // Load pool for training
  const loadTrainingPool = useCallback(async () => {
    let countries = await db.countries.toArray();
    if (selectedRegion !== 'Wszystkie') {
      countries = countries.filter((c) => c.continent === selectedRegion);
    }
    setPool(countries);
    return countries;
  }, [selectedRegion]);

  // Pick next question
  const nextTrainingQuestion = useCallback(
    (countriesPool: Country[]) => {
      if (countriesPool.length === 0) return;

      // Pick question kind randomly from selected kinds
      const pickedKind = selectedKinds[Math.floor(Math.random() * selectedKinds.length)];

      // If kind is shapes, candidate must have geometry
      let eligible = countriesPool;
      if (pickedKind === 'shapes') {
        const withShapes = countriesPool.filter(hasCountryShape);
        if (withShapes.length > 0) eligible = withShapes;
      }

      // Exclude recent targets
      const maxExclude = Math.min(recentHistoryRef.current.length, Math.floor(eligible.length / 2), 5);
      const toExclude = recentHistoryRef.current.slice(-maxExclude);
      const candidates = eligible.filter((c) => !toExclude.includes(c.iso2));
      const targetCandidates = candidates.length > 0 ? candidates : eligible;

      // Weighted random selection
      let target: Country;
      if (prioritizeWeakPoints) {
        // Boost weight exponentially for tricky countries
        const totalWeight = targetCandidates.reduce(
          (sum, c) => sum + Math.pow(c.difficultyWeight ?? 1.0, 1.8),
          0
        );
        let r = Math.random() * totalWeight;
        target = targetCandidates[targetCandidates.length - 1];
        for (const c of targetCandidates) {
          r -= Math.pow(c.difficultyWeight ?? 1.0, 1.8);
          if (r <= 0) {
            target = c;
            break;
          }
        }
      } else {
        target = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
      }

      recentHistoryRef.current.push(target.iso2);
      if (recentHistoryRef.current.length > 20) {
        recentHistoryRef.current.shift();
      }

      // 3 distractors
      const distractors: Country[] = [];
      const poolWithoutTarget = eligible.filter((c) => c.iso2 !== target.iso2);

      while (distractors.length < 3 && poolWithoutTarget.length > 0) {
        const idx = Math.floor(Math.random() * poolWithoutTarget.length);
        const picked = poolWithoutTarget.splice(idx, 1)[0];
        distractors.push(picked);
      }

      const allOptions = [target, ...distractors].sort(() => Math.random() - 0.5);

      setCurrentCountry(target);
      setCurrentKind(pickedKind);
      setOptions(allOptions);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      questionStartTimeRef.current = Date.now();
    },
    [selectedKinds, prioritizeWeakPoints]
  );

  // Start training
  const handleStartTraining = async () => {
    const loaded = await loadTrainingPool();
    if (loaded.length === 0) {
      alert('Brak państw w wybranym regionie.');
      return;
    }

    setSessionResults([]);
    setIsTrainingFinished(false);
    recentHistoryRef.current = [];
    setStreak(0);
    setSecondsRemaining(TIME_LIMIT_SECONDS[timeLimit]);
    setIsTrainingActive(true);

    nextTrainingQuestion(loaded);
  };

  // Exit training
  const handleExitTraining = () => {
    setIsTrainingActive(false);
    setIsTrainingFinished(false);
    setSessionResults([]);
    setCurrentCountry(null);
  };

  // Answer submit
  const handleAnswerOption = async (optionIso: string) => {
    if (isSubmitted || !currentCountry) return;

    const timeMs = Date.now() - questionStartTimeRef.current;
    const correct = optionIso === currentCountry.iso2;

    setSelectedOption(optionIso);
    setIsCorrect(correct);
    setIsSubmitted(true);
    setStreak((prev) => (correct ? prev + 1 : 0));

    // Append result
    setSessionResults((prev) => [
      ...prev,
      {
        country: currentCountry,
        isCorrect: correct,
        timeMs,
        kind: currentKind,
      },
    ]);

    // Save to Dexie
    await recordAnswer(currentCountry.iso2, currentKind, correct, timeMs);
  };

  // Next question or finish
  const handleProceed = () => {
    if (sessionResults.length >= questionCount) {
      setIsTrainingFinished(true);
    } else {
      nextTrainingQuestion(pool);
    }
  };

  // Keyboard navigation 1-4, Enter
  useEffect(() => {
    if (!isTrainingActive || isTrainingFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleProceed();
        }
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (options[idx]) {
          handleAnswerOption(options[idx].iso2);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrainingActive, isTrainingFinished, isSubmitted, options, handleProceed]);

  // Shape rendering
  const currentGeo = useMemo(() => {
    if (currentKind !== 'shapes' || !currentCountry) return null;
    return getGeoFeatureForCountry(currentCountry);
  }, [currentKind, currentCountry]);

  const shapePathData = useMemo(() => {
    if (!currentGeo) return '';
    try {
      const proj = geoMercator().fitExtent(
        [
          [18, 18],
          [282, 182],
        ],
        currentGeo
      );
      const generator = geoPath().projection(proj);
      return generator(currentGeo) || '';
    } catch {
      return '';
    }
  }, [currentGeo]);

  // FORMAT TIMER
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // SUMMARY SCREEN
  if (isTrainingActive && isTrainingFinished) {
    return (
      <QuizSummary
        title="Trening zakończony!"
        subtitle={`Zestaw ${sessionResults.length} mieszanych pytań (${selectedRegion}).`}
        sessionLimit={questionCount as any}
        results={sessionResults}
        onRestart={handleStartTraining}
        onBack={handleExitTraining}
        renderItemExtra={(r: any) => {
          const kindLabel =
            r.kind === 'flags' ? 'Flaga' : r.kind === 'capitals' ? 'Stolica' : 'Kształt';
          return (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">
              Tryb: <strong className="text-slate-700 dark:text-slate-300">{kindLabel}</strong> • Stolica: {r.country.capital}
            </span>
          );
        }}
      />
    );
  }

  // ACTIVE TRAINING SESSION SCREEN
  if (isTrainingActive && currentCountry) {
    const currentQuestionNum = sessionResults.length + 1;
    const progressPct = (sessionResults.length / questionCount) * 100;

    return (
      <div className="space-y-5 max-w-2xl mx-auto animate-fadeIn">
        {/* Session Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExitTraining}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer mr-1"
            >
              ✕ Zakończ
            </button>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Sesja treningowa
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Pytanie {currentQuestionNum} z {questionCount}
            </span>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
            {streak > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Seria: {streak}
              </span>
            )}

            {timeLimit !== 'none' && (
              <span className="font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-500" />
                {formatTimer(secondsRemaining)}
              </span>
            )}

            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
              {currentKind === 'flags' ? '🚩 Flaga' : currentKind === 'capitals' ? '🏛️ Stolica' : '🗺️ Kształt'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question Presentation Card */}
        <div className="p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center transition-colors shadow-xs">
          {currentKind === 'flags' && (
            <>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                Do jakiego państwa należy ta flaga?
              </div>
              <div className="py-2">
                <span
                  className={`fi fi-${currentCountry.iso2.toLowerCase()} text-7xl sm:text-8xl shadow-sm rounded-xs border border-slate-200 dark:border-slate-800 block`}
                />
              </div>
            </>
          )}

          {currentKind === 'capitals' && (
            <>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                Jaka jest stolica tego państwa?
              </div>
              <div className="flex items-center gap-3 my-2">
                <span
                  className={`fi fi-${currentCountry.iso2.toLowerCase()} text-4xl shadow-sm rounded-xs border border-slate-200 dark:border-slate-800`}
                />
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {currentCountry.namePl}
                </span>
              </div>
            </>
          )}

          {currentKind === 'shapes' && (
            <>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                Rozpoznaj państwo po wyizolowanym obrysie:
              </div>
              <div className="w-[300px] h-[200px] flex items-center justify-center p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 my-1">
                {shapePathData ? (
                  <svg viewBox="0 0 300 200" className="w-full h-full select-none">
                    <path
                      d={shapePathData}
                      className="fill-slate-200 stroke-slate-700 dark:fill-slate-800 dark:stroke-emerald-400"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="text-xs text-slate-400">Ładowanie konturu...</span>
                )}
              </div>
            </>
          )}

          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 font-mono flex items-center gap-2">
            <span>Kontynent: {currentCountry.continent}</span>
            <span>•</span>
            <span>Waga trudności: {currentCountry.difficultyWeight.toFixed(2)}</span>
          </div>
        </div>

        {/* 4 Options Grid */}
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

            const label = currentKind === 'capitals' ? opt.capital : opt.namePl;

            return (
              <button
                key={opt.iso2}
                disabled={isSubmitted}
                onClick={() => handleAnswerOption(opt.iso2)}
                className={`p-3 rounded-md border text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${btnClass}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span>{label}</span>
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

        {/* Feedback Card */}
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
                <span>{sessionResults.length >= questionCount ? 'Zakończ trening' : 'Następne'}</span>
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
  }

  // CONFIGURATION FORM SCREEN
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          Generator treningów
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Skonfiguruj personalizowaną sesję quizową, łącząc flagi, stolice oraz kontury granic.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Region */}
        <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Wybierz region
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONTINENTS.map((c) => {
              const isSelected = selectedRegion === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedRegion(c)}
                  className={`p-2.5 rounded-md text-left border text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 font-medium'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Typy pytań */}
        <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            2. Rodzaje zadań (Zaznacz co najmniej jeden)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'flags' as TaskKind, label: 'Flagi państw', icon: Flag, desc: 'Rozpoznawanie barw i symboli' },
              { id: 'capitals' as TaskKind, label: 'Stolice świata', icon: MapPin, desc: 'Dopasowywanie stolic i metropolii' },
              { id: 'shapes' as TaskKind, label: 'Kształty granic', icon: Layers, desc: 'Identyfikacja obrysów SVG' },
            ].map((item) => {
              const isChecked = selectedKinds.includes(item.id);
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => toggleKind(item.id)}
                  className={`p-3 rounded-md text-left border transition-colors flex items-start justify-between cursor-pointer ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{item.desc}</div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white dark:text-slate-950'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Liczba pytań & Limit czasu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              3. Liczba pytań
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 25, 40].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 rounded-md border text-xs text-center transition-colors cursor-pointer ${
                    questionCount === count
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 font-medium'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              4. Limit czasu
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'none' as TimeLimitOption, label: 'Brak' },
                { id: '3m' as TimeLimitOption, label: '3 min' },
                { id: '5m' as TimeLimitOption, label: '5 min' },
                { id: '10m' as TimeLimitOption, label: '10 min' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeLimit(t.id)}
                  className={`py-2 rounded-md border text-xs text-center transition-colors cursor-pointer ${
                    timeLimit === t.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 font-medium'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Priorytetyzacja słabych punktów */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div className="space-y-0.5 pr-4">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Priorytetyzacja słabych punktów</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Częściej losuje państwa, w których wcześniej popełniono błąd (na podstawie wagi difficultyWeight z Dexie).
            </p>
          </div>

          <button
            onClick={() => setPrioritizeWeakPoints(!prioritizeWeakPoints)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              prioritizeWeakPoints ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                prioritizeWeakPoints ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Start Button */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Gotowy zestaw: <strong>{questionCount}</strong> pytań • <strong>{selectedRegion}</strong> • {selectedKinds.length} tryby
          </div>

          <button
            onClick={handleStartTraining}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-slate-950 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Rozpocznij trening
          </button>
        </div>
      </div>
    </div>
  );
};
