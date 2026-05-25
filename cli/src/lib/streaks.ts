import { format, subDays, parseISO } from 'date-fns';
import type { Habit, Trophy } from '../types.js';

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function prevDayStr(dateStr: string): string {
  return format(subDays(parseISO(dateStr), 1), 'yyyy-MM-dd');
}

export function isCheckedInOn(habit: Habit, date: string): boolean {
  return habit.checkIns.some(c => c.date === date && c.verified);
}

export function isCheckedInToday(habit: Habit): boolean {
  return isCheckedInOn(habit, todayStr());
}

export function calculateStreak(habit: Habit): number {
  const today = todayStr();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Streak is valid if last check-in was today or yesterday
  const mostRecentVerified = habit.checkIns
    .filter(c => c.verified)
    .map(c => c.date)
    .sort()
    .at(-1);

  if (!mostRecentVerified) return 0;
  if (mostRecentVerified !== today && mostRecentVerified !== yesterday) return 0;

  let streak = 0;
  let current = mostRecentVerified;
  const checkedDates = new Set(habit.checkIns.filter(c => c.verified).map(c => c.date));

  while (checkedDates.has(current)) {
    streak++;
    current = prevDayStr(current);
  }

  return streak;
}

export function calculateLongestStreak(habit: Habit): number {
  const dates = [...new Set(habit.checkIns.filter(c => c.verified).map(c => c.date))].sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = parseISO(dates[i - 1]!);
    const curr = parseISO(dates[i]!);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function getMilestoneReached(
  oldStreak: number,
  newStreak: number,
): 7 | 30 | 100 | 365 | null {
  for (const m of [7, 30, 100, 365] as const) {
    if (oldStreak < m && newStreak >= m) return m;
  }
  return null;
}

export function getLast12WeeksGrid(habit: Habit): boolean[][] {
  const checked = new Set(habit.checkIns.filter(c => c.verified).map(c => c.date));
  // 12 columns (weeks), 7 rows (Mon-Sun)
  const grid: boolean[][] = [];
  const today = new Date();

  for (let week = 11; week >= 0; week--) {
    const col: boolean[] = [];
    for (let day = 0; day < 7; day++) {
      const daysAgo = week * 7 + (6 - day);
      const d = format(subDays(today, daysAgo), 'yyyy-MM-dd');
      col.push(checked.has(d));
    }
    grid.push(col);
  }

  return grid;
}

export function milestoneLabel(m: 7 | 30 | 100 | 365): string {
  return m === 7 ? '7-Day' : m === 30 ? '30-Day' : m === 100 ? '100-Day' : '365-Day';
}

export function trophyTier(m: 7 | 30 | 100 | 365): string {
  return m === 7 ? 'Bronze' : m === 30 ? 'Silver' : m === 100 ? 'Gold' : 'Platinum';
}

export function trophyColor(m: 7 | 30 | 100 | 365): string {
  return m === 7 ? 'yellow' : m === 30 ? 'white' : m === 100 ? 'yellow' : 'cyan';
}
