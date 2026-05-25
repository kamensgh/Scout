import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { format } from 'date-fns';
import { calculateStreak, getMilestoneReached, todayStr, isCheckedInToday } from '../lib/streaks.js';
import { verifyGitHub } from '../lib/github.js';
import { verifyDuolingo } from '../lib/duolingo.js';
import { verifyStrava } from '../lib/strava.js';
import { verifyScreenshot } from '../lib/screenshot.js';
import Selector from '../components/Selector.js';
import type { AppData, CheckIn as CheckInType, Habit, ScreenName, Trophy } from '../types.js';

interface Props {
  data: AppData;
  habitId?: string;
  navigate: (screen: ScreenName, params?: { habitId?: string }) => void;
  updateData: (updater: (prev: AppData) => AppData) => void;
}

type Phase =
  | 'select-habit'
  | 'already-done'
  | 'verifying'
  | 'screenshot-path'
  | 'manual-confirm'
  | 'result';

interface Result {
  verified: boolean;
  detail: string;
  milestone?: 7 | 30 | 100 | 365;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function CheckIn({ data, habitId, navigate, updateData }: Props) {
  const [phase, setPhase] = useState<Phase>(() => {
    if (habitId) return 'verifying';
    return 'select-habit';
  });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [screenshotPath, setScreenshotPath] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const pendingHabits = data.habits.filter(h => !isCheckedInToday(h));
  const activeHabit: Habit | undefined = habitId
    ? data.habits.find(h => h.id === habitId)
    : pendingHabits[selectedIdx];

  // Start verification as soon as we have a habit (auto-integrations)
  useEffect(() => {
    if (phase === 'verifying' && activeHabit) {
      runVerification(activeHabit);
    }
  }, [phase, activeHabit?.id]);

  async function runVerification(habit: Habit) {
    const { type, username, token } = habit.integration;

    if (type === 'manual') {
      setPhase('manual-confirm');
      return;
    }
    if (type === 'screenshot') {
      setPhase('screenshot-path');
      return;
    }

    setLoading(true);
    setLoadingMsg(`Checking ${type} activity...`);

    let verif: { verified: boolean; detail: string };

    if (type === 'github') {
      const ghToken = token || data.settings.githubToken;
      verif = await verifyGitHub(username ?? '', ghToken);
    } else if (type === 'duolingo') {
      verif = await verifyDuolingo(username ?? '');
    } else if (type === 'strava') {
      const stravaToken = token || data.settings.stravaToken;
      verif = await verifyStrava(stravaToken ?? '');
    } else {
      verif = { verified: false, detail: 'Unknown integration' };
    }

    setLoading(false);

    if (verif.verified) {
      finalize(habit, verif.detail);
    } else {
      setResult({ verified: false, detail: verif.detail });
      setPhase('result');
    }
  }

  function finalize(habit: Habit, detail: string) {
    const today = todayStr();
    const oldStreak = calculateStreak(habit);

    const checkIn: CheckInType = {
      id: randomId(),
      date: today,
      verified: true,
      method: habit.integration.type,
      notes: detail,
    };

    let milestone: 7 | 30 | 100 | 365 | undefined;

    updateData(prev => {
      const updated = prev.habits.map(h => {
        if (h.id !== habit.id) return h;
        return { ...h, checkIns: [...h.checkIns, checkIn] };
      });
      const updatedHabit = updated.find(h => h.id === habit.id)!;
      const newStreak = calculateStreak(updatedHabit);
      milestone = getMilestoneReached(oldStreak, newStreak) ?? undefined;

      const newTrophies: Trophy[] = milestone
        ? [
            ...prev.trophies,
            {
              id: randomId(),
              habitId: habit.id,
              habitName: habit.name,
              habitEmoji: habit.emoji,
              milestone,
              unlockedAt: new Date().toISOString(),
            },
          ]
        : prev.trophies;

      return { ...prev, habits: updated, trophies: newTrophies };
    });

    setResult({ verified: true, detail, milestone });
    setPhase('result');
  }

  useInput((input, key) => {
    if (key.escape || input === 'b') { navigate('dashboard'); return; }

    if (phase === 'select-habit') {
      if (key.upArrow) setSelectedIdx(i => Math.max(0, i - 1));
      if (key.downArrow) setSelectedIdx(i => Math.min(pendingHabits.length - 1, i + 1));
      if (key.return && pendingHabits[selectedIdx]) setPhase('verifying');
    }

    if (phase === 'manual-confirm') {
      if (input === 'y') { finalize(activeHabit!, 'Manual check-in confirmed'); }
      if (input === 'n') { setResult({ verified: false, detail: 'You indicated you didn\'t complete the habit today.' }); setPhase('result'); }
    }

    if (phase === 'result') {
      if (key.return || input === 'q' || input === 'b') navigate('dashboard');
      if (input === 't' && result?.milestone) navigate('trophy-room');
    }
  });

  return (
    <Box flexDirection="column" width={62} borderStyle="round" borderColor="green" paddingX={2} paddingY={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold color="green">✅ Check In</Text>
        <Text dimColor>[Esc] back</Text>
      </Box>

      {phase === 'select-habit' && (
        <Box flexDirection="column" gap={1}>
          {pendingHabits.length === 0 ? (
            <Box flexDirection="column" alignItems="center" paddingY={2}>
              <Text bold color="green">All habits checked in today! 🎉</Text>
              <Text dimColor>Come back tomorrow to keep your streaks.</Text>
            </Box>
          ) : (
            <>
              <Text>Which habit are you checking in?</Text>
              <Selector
                options={pendingHabits.map(h => ({
                  label: `${h.emoji} ${h.name}`,
                  value: h.id,
                  hint: `🔥 ${calculateStreak(h)}d`,
                }))}
                selectedIndex={selectedIdx}
                onChange={setSelectedIdx}
                onSelect={() => setPhase('verifying')}
              />
              <Text dimColor>[↑↓] select  [Enter] verify</Text>
            </>
          )}
        </Box>
      )}

      {phase === 'verifying' && (
        <Box flexDirection="column" gap={1}>
          {activeHabit && (
            <Text>{activeHabit.emoji} <Text bold>{activeHabit.name}</Text></Text>
          )}
          {loading && <Text color="yellow">⟳  {loadingMsg}</Text>}
        </Box>
      )}

      {phase === 'screenshot-path' && (
        <Box flexDirection="column" gap={1}>
          <Text>{activeHabit?.emoji} <Text bold>{activeHabit?.name}</Text></Text>
          <Text>Enter the path to your screenshot:</Text>
          <TextInput
            value={screenshotPath}
            onChange={setScreenshotPath}
            onSubmit={async path => {
              if (!path.trim()) return;
              const apiKey = data.settings.anthropicKey || process.env['ANTHROPIC_API_KEY'] || '';
              if (!apiKey) {
                setResult({ verified: false, detail: 'Anthropic API key not set. Add it in [s] Settings.' });
                setPhase('result');
                return;
              }
              setLoading(true);
              setLoadingMsg('Analyzing screenshot with AI...');
              const verif = await verifyScreenshot(path.trim(), activeHabit!.name, apiKey);
              setLoading(false);
              if (verif.verified) {
                finalize(activeHabit!, verif.explanation);
              } else {
                setResult({ verified: false, detail: verif.explanation });
                setPhase('result');
              }
            }}
            placeholder="/path/to/screenshot.png"
          />
          {loading && <Text color="yellow">⟳  {loadingMsg}</Text>}
          <Text dimColor>[Enter] analyze  [Esc] back</Text>
        </Box>
      )}

      {phase === 'manual-confirm' && (
        <Box flexDirection="column" gap={1}>
          <Text>{activeHabit?.emoji} <Text bold>{activeHabit?.name}</Text></Text>
          <Box marginTop={1}>
            <Text>Did you complete this habit today?  </Text>
            <Text bold color="green">[y] Yes  </Text>
            <Text bold color="red">[n] No</Text>
          </Box>
        </Box>
      )}

      {phase === 'result' && result && (
        <Box flexDirection="column" gap={1}>
          {result.verified ? (
            <>
              <Text bold color="green">✅ Verified!</Text>
              <Text dimColor>{result.detail}</Text>
              {result.milestone && (
                <Box
                  flexDirection="column"
                  borderStyle="double"
                  borderColor="yellow"
                  padding={1}
                  marginTop={1}
                >
                  <Text bold color="yellow">
                    🏆 MILESTONE REACHED: {result.milestone} DAY STREAK!
                  </Text>
                  <Text>{result.milestone === 7 ? '🥉 Bronze' : result.milestone === 30 ? '🥈 Silver' : result.milestone === 100 ? '🥇 Gold' : '💎 Platinum'} trophy unlocked!</Text>
                  <Text dimColor>Press [t] to see your trophy room</Text>
                </Box>
              )}
            </>
          ) : (
            <>
              <Text bold color="red">❌ Not verified</Text>
              <Text dimColor>{result.detail}</Text>
            </>
          )}
          <Box marginTop={1}>
            <Text dimColor>[Enter] or [b] back to dashboard{result.milestone ? '  [t] trophy room' : ''}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
