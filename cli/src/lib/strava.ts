import { startOfDay, getUnixTime } from 'date-fns';

interface StravaActivity {
  name: string;
  type: string;
  start_date: string;
}

export async function verifyStrava(token: string): Promise<{ verified: boolean; detail: string }> {
  const afterTs = getUnixTime(startOfDay(new Date()));

  try {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${afterTs}&per_page=5`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      if (res.status === 401) return { verified: false, detail: 'Invalid Strava token — regenerate in Strava API settings' };
      return { verified: false, detail: `Strava API error: ${res.status}` };
    }
    const activities = (await res.json()) as StravaActivity[];
    if (activities.length > 0) {
      const names = activities.map(a => `${a.type}: ${a.name}`).join(', ');
      return { verified: true, detail: `Strava activity today: ${names} ✓` };
    }
    return { verified: false, detail: 'No Strava activities found for today' };
  } catch (e) {
    return { verified: false, detail: `Network error: ${String(e)}` };
  }
}
