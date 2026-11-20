import Dexie, { type Table } from 'dexie';
import { COUNTRIES_DATA, type Country } from '../data/countries';

export type { Country } from '../data/countries';

export interface AnswerHistory {
  id?: number;
  countryIso2: string;
  mode: string;
  isCorrect: boolean;
  timestamp: Date;
  responseTimeMs: number;
}

export interface UserStats {
  id: string; // 'default'
  xp: number;
  level: number;
  streakDays: number;
  lastChallengeDate?: string;
  totalAnswered: number;
  totalCorrect: number;
}

export class GeoMasterDatabase extends Dexie {
  countries!: Table<Country, string>;
  answerHistory!: Table<AnswerHistory, number>;
  userStats!: Table<UserStats, string>;

  constructor() {
    super('GeoMasterDatabase');
    this.version(1).stores({
      countries: 'iso2, isoNumeric, namePl, nameEn, capital, continent, difficultyWeight',
      answerHistory: '++id, countryIso2, mode, isCorrect, timestamp',
      userStats: 'id',
    });
  }
}

export const db = new GeoMasterDatabase();

export async function initializeDatabase(): Promise<UserStats> {
  // 1. Seed countries if table is empty
  const count = await db.countries.count();
  if (count === 0) {
    await db.countries.bulkAdd(COUNTRIES_DATA);
  }

  // 2. Initialize user stats if not exists
  let stats = await db.userStats.get('default');
  if (!stats) {
    stats = {
      id: 'default',
      xp: 0,
      level: 1,
      streakDays: 0,
      totalAnswered: 0,
      totalCorrect: 0,
    };
    await db.userStats.put(stats);
  }

  return stats;
}

export async function recordAnswer(
  countryIso2: string,
  mode: string,
  isCorrect: boolean,
  responseTimeMs: number
): Promise<{ gainedXp: number; newLevel: number }> {
  // 1. Add record to answerHistory
  await db.answerHistory.add({
    countryIso2,
    mode,
    isCorrect,
    timestamp: new Date(),
    responseTimeMs,
  });

  // 2. Update country difficultyWeight (błąd zwiększa o +0.5, sukces zmniejsza o -0.2, min 0.2)
  const country = await db.countries.get(countryIso2);
  if (country) {
    const currentWeight = country.difficultyWeight ?? 1.0;
    const newWeight = isCorrect
      ? Math.max(0.2, Number((currentWeight - 0.2).toFixed(2)))
      : Number((currentWeight + 0.5).toFixed(2));
    await db.countries.update(countryIso2, { difficultyWeight: newWeight });
  }

  // 3. Update userStats
  const stats = (await db.userStats.get('default')) || {
    id: 'default',
    xp: 0,
    level: 1,
    streakDays: 0,
    totalAnswered: 0,
    totalCorrect: 0,
  };

  const gainedXp = isCorrect ? 15 : 2;
  const newXp = stats.xp + gainedXp;
  const newLevel = Math.max(1, Math.floor(newXp / 100) + 1);

  await db.userStats.put({
    ...stats,
    xp: newXp,
    level: newLevel,
    totalAnswered: stats.totalAnswered + 1,
    totalCorrect: stats.totalCorrect + (isCorrect ? 1 : 0),
  });

  return { gainedXp, newLevel };
}

export async function resetDatabase() {
  await db.answerHistory.clear();
  await db.userStats.put({
    id: 'default',
    xp: 0,
    level: 1,
    streakDays: 0,
    totalAnswered: 0,
    totalCorrect: 0,
  });
  // Reset weights
  await db.countries.clear();
  await db.countries.bulkAdd(COUNTRIES_DATA);
}
