import { format } from 'date-fns';

interface GitHubEvent {
  type: string;
  created_at: string;
}

export async function verifyGitHub(username: string, token?: string): Promise<{ verified: boolean; detail: string }> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const headers: Record<string, string> = {
    'User-Agent': 'StreakUp/1.0',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers['Authorization'] = `token ${token}`;

  try {
    const res = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, { headers });
    if (!res.ok) {
      if (res.status === 404) return { verified: false, detail: `GitHub user "${username}" not found` };
      if (res.status === 401) return { verified: false, detail: 'Invalid GitHub token' };
      return { verified: false, detail: `GitHub API error: ${res.status}` };
    }
    const events = (await res.json()) as GitHubEvent[];
    const activityToday = events.filter(e => {
      const d = format(new Date(e.created_at), 'yyyy-MM-dd');
      return (
        d === today &&
        ['PushEvent', 'PullRequestEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestReviewEvent'].includes(e.type)
      );
    });
    if (activityToday.length > 0) {
      return { verified: true, detail: `Found ${activityToday.length} GitHub event(s) today ✓` };
    }
    return { verified: false, detail: 'No GitHub coding activity found for today' };
  } catch (e) {
    return { verified: false, detail: `Network error: ${String(e)}` };
  }
}
