import { format } from 'date-fns';

export async function verifyDuolingo(username: string): Promise<{ verified: boolean; detail: string }> {
  try {
    const res = await fetch(
      `https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(username)}`,
      { headers: { 'User-Agent': 'StreakUp/1.0' } },
    );
    if (!res.ok) return { verified: false, detail: `Duolingo API error: ${res.status}` };

    const data = (await res.json()) as { users?: Array<{ streak_data?: { currentStreak?: { endDate?: string } }; xpGains?: Array<{ time?: number }> }> };
    const user = data.users?.[0];
    if (!user) return { verified: false, detail: `Duolingo user "${username}" not found` };

    const today = format(new Date(), 'yyyy-MM-dd');

    // Check streak endDate
    const streakEnd = user.streak_data?.currentStreak?.endDate;
    if (streakEnd && format(new Date(streakEnd), 'yyyy-MM-dd') === today) {
      return { verified: true, detail: 'Duolingo lesson completed today ✓' };
    }

    // Check XP gains
    const xpToday = user.xpGains?.some(g => g.time && format(new Date(g.time * 1000), 'yyyy-MM-dd') === today);
    if (xpToday) {
      return { verified: true, detail: 'XP gained on Duolingo today ✓' };
    }

    return { verified: false, detail: 'No Duolingo activity found for today' };
  } catch (e) {
    return { verified: false, detail: `Network error: ${String(e)}` };
  }
}
