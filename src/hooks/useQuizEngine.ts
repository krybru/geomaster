import { useState, useEffect, useCallback, useRef } from 'react';
import { db, recordAnswer, type Country } from '../db';

export type QuizMode = 'flags' | 'capitals' | 'shapes';
export type AnswerMode = 'choice' | 'input';
export type ContinentFilter =
  | 'Wszystkie'
  | 'Europa'
  | 'Azja'
  | 'Afryka'
  | 'Ameryka Północna'
  | 'Ameryka Południowa'
  | 'Oceania';
export type SessionLimit = 'infinite' | 10 | 20;

export interface SessionQuestionResult {
  country: Country;
  isCorrect: boolean;
  timeMs: number;
}

export function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'l');
}

/**
 * Ważone losowanie (Weighted Random Sampling):
 * Państwa z wyższą wagą trudności (difficultyWeight) mają większą szansę na wylosowanie.
 */
export function pickWeightedTarget(candidates: Country[]): Country {
  const totalWeight = candidates.reduce((sum, c) => sum + (c.difficultyWeight ?? 1.0), 0);
  if (totalWeight <= 0) return candidates[Math.floor(Math.random() * candidates.length)];

  let randomVal = Math.random() * totalWeight;
  for (const country of candidates) {
    randomVal -= country.difficultyWeight ?? 1.0;
    if (randomVal <= 0) {
      return country;
    }
  }
  return candidates[candidates.length - 1];
}

interface UseQuizEngineOptions {
  mode: QuizMode;
  continent: ContinentFilter;
  sessionLimit: SessionLimit;
  customFilter?: (country: Country) => boolean;
}

export function useQuizEngine({
  mode,
  continent,
  sessionLimit,
  customFilter,
}: UseQuizEngineOptions) {
  const [pool, setPool] = useState<Country[]>([]);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

  // Sesja i bufor unikania powtórzeń
  const [sessionResults, setSessionResults] = useState<SessionQuestionResult[]>([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const recentHistoryRef = useRef<string[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // 1. Ładowanie puli państw z Dexie
  const loadPool = useCallback(async () => {
    let countries = await db.countries.toArray();
    if (continent !== 'Wszystkie') {
      countries = countries.filter((c) => c.continent === continent);
    }
    if (customFilter) {
      countries = countries.filter(customFilter);
    }
    setPool(countries);
  }, [continent, customFilter]);

  useEffect(() => {
    loadPool();
  }, [loadPool]);

  // Restart sesji
  const restartSession = useCallback(() => {
    setSessionResults([]);
    setIsSessionFinished(false);
    recentHistoryRef.current = [];
    setStreak(0);
    setSelectedOption(null);
    setTextInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    loadPool();
  }, [loadPool]);

  // 2. Dobór kolejnego pytania (ważone + unikanie powtórzeń z rzędu)
  const nextQuestion = useCallback(() => {
    if (pool.length === 0) return;

    // Unikanie powtórzeń z rzędu: wykluczamy z losowania do 5 ostatnich pytań
    const maxExclude = Math.min(recentHistoryRef.current.length, Math.floor(pool.length / 2), 5);
    const toExclude = recentHistoryRef.current.slice(-maxExclude);
    const candidates = pool.filter((c) => !toExclude.includes(c.iso2));
    const availableCandidates = candidates.length > 0 ? candidates : pool;

    // Ważone losowanie według difficultyWeight
    const target = pickWeightedTarget(availableCandidates);

    // Zapis do bufora historii ostatnich pytań
    recentHistoryRef.current.push(target.iso2);
    if (recentHistoryRef.current.length > 20) {
      recentHistoryRef.current.shift();
    }

    // Dobór 3 dystraktorów z tej samej puli
    const distractors: Country[] = [];
    const poolWithoutTarget = pool.filter((c) => c.iso2 !== target.iso2);

    while (distractors.length < 3 && poolWithoutTarget.length > 0) {
      const idx = Math.floor(Math.random() * poolWithoutTarget.length);
      const picked = poolWithoutTarget.splice(idx, 1)[0];
      distractors.push(picked);
    }

    // Wymieszanie opcji
    const allOptions = [target, ...distractors].sort(() => Math.random() - 0.5);

    setCurrentCountry(target);
    setOptions(allOptions);
    setSelectedOption(null);
    setTextInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    startTimeRef.current = Date.now();
  }, [pool]);

  // Inicjalizacja pytania przy zmianie puli
  useEffect(() => {
    if (pool.length > 0 && !isSessionFinished) {
      nextQuestion();
    }
  }, [pool, isSessionFinished, nextQuestion]);

  // 3. Sprawdzanie i rejestrowanie odpowiedzi
  const submitAnswer = async (
    userAnswer: string,
    isTextInput = false,
    customCheck?: (input: string, target: Country) => boolean
  ) => {
    if (isSubmitted || !currentCountry) return false;

    const responseTimeMs = Date.now() - startTimeRef.current;
    let correct = false;

    if (customCheck) {
      correct = customCheck(userAnswer, currentCountry);
      if (!isTextInput) setSelectedOption(userAnswer);
    } else if (isTextInput) {
      const normInput = normalizeString(userAnswer);
      const normPl = normalizeString(currentCountry.namePl);
      const normEn = normalizeString(currentCountry.nameEn);
      correct = normInput === normPl || normInput === normEn;
    } else {
      correct = userAnswer === currentCountry.iso2;
      setSelectedOption(userAnswer);
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    setStreak((prev) => (correct ? prev + 1 : 0));

    // Zapis do wyników bieżącej sesji
    setSessionResults((prev) => [
      ...prev,
      {
        country: currentCountry,
        isCorrect: correct,
        timeMs: responseTimeMs,
      },
    ]);

    // Zapis do Dexie.js (difficultyWeight, answerHistory, userStats)
    await recordAnswer(currentCountry.iso2, mode, correct, responseTimeMs);

    return correct;
  };

  // 4. Przejście do kolejnego pytania lub podsumowania
  const handleProceed = () => {
    if (sessionLimit !== 'infinite' && sessionResults.length >= sessionLimit) {
      setIsSessionFinished(true);
    } else {
      nextQuestion();
    }
  };

  const currentQuestionNumber = sessionResults.length + 1;
  const progressPercent =
    sessionLimit === 'infinite' ? 0 : (sessionResults.length / sessionLimit) * 100;

  return {
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
    nextQuestion,
    restartSession,
    normalizeString,
  };
}
