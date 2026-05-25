import React from 'react';
import { Box, Text, useInput } from 'ink';
import { format } from 'date-fns';
import {
  calculateStreak,
  calculateLongestStreak,
  isCheckedInToday,
} from '../lib/streaks.js';
import CalendarHeatmap from '../components/CalendarHeatmap.js';
import type { AppData, AppData as AD, ScreenName } from '../types.js';

interface Props {
  data: AppData;
  habitId: string;
  navigate: (screen: ScreenName, params?: { habitId?: string }) => void;
  updateData: (updater: (prev: AD) => AD) => void;
}

export default function HabitDetail({ data, habitId, navigate, updateData }: Props) {
  const habit = data.habits.find(h => h.id === habitId);

  useInput((input, key) => {
    if (input === 'b' || key.escape) { navigate('dashboard'); return; }
    if (input === 'c') { navigate('check-in', { habitId }); return; }
    if (input === 'd') {
      updateData(prev => ({
        ...prev,
        habits: prev.habits.filter(h => h.id !== habitId),
        trophies: prev.trophies.filter(t => t.habitId !== habitId),
      }));
      navigate('dashboard');
    }
  });

  if (!habit) {
    return (
      <Box>
        <Text color="red">Habit not found.</Text>
      </Box>
    );
  }

  const streak = calculateStreak(habit);
  const longest = calculateLongestStreak(habit);
  const done = isCheckedInToday(habit);
  const totalCheckIns = habit.checkIns.filter(c => c.verified).length;
  const intType = habit.integration.type;

  const integrationDisplay: Record<string, string> = {
    github: `GitHub (@${habit.integration.username || '?'})`,
    duolingo: `Duolingo (@${habit.integration.username || '?'})`,
    strava: 'Strava (OAuth)',
    manual: 'Manual check-in',
    screenshot: 'Screenshot (AI verified)',
  };

  return (
    <Box flexDirection="column" width={62} borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold color="cyan">
          {habit.emoji} {habit.name}
        </Text>
        <Text dimColor>[b] back  [d] delete</Text>
      </Box>

      {habit.description && (
        <Box marginBottom={1}>
          <Text dimColor>{habit.description}</Text>
        </Box>
      )}

      {/* Stats row */}
      <Box marginBottom={1} gap={4}>
        <Box flexDirection="column" alignItems="center">
          <Text bold color="yellow">🔥 {streak}</Text>
          <Text dimColor>streak</Text>
        </Box>
        <Box flexDirection="column" alignItems="center">
          <Text bold color="green">🏆 {longest}</Text>
          <Text dimColor>best</Text>
        </Box>
        <Box flexDirection="column" alignItems="center">
          <Text bold>{totalCheckIns}</Text>
          <Text dimColor>total</Text>
        </Box>
        <Box flexDirection="column" alignItems="center">
          <Text bold color={done ? 'green' : 'red'}>{done ? '✅' : '⏳'}</Text>
          <Text dimColor>today</Text>
        </Box>
      </Box>

      {/* Calendar */}
      <Box marginBottom={1}>
        <CalendarHeatmap habit={habit} />
      </Box>

      {/* Integration */}
      <Box marginBottom={1}>
        <Text dimColor>Verified via: </Text>
        <Text>{integrationDisplay[intType] ?? intType}</Text>
      </Box>

      {/* Recent check-ins */}
      <Box flexDirection="column" marginBottom={1}>
        <Text dimColor bold>Recent check-ins:</Text>
        {habit.checkIns
          .filter(c => c.verified)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5)
          .map(c => (
            <Text key={c.id} dimColor>
              {'  '}✓ {c.date}  via {c.method}{c.notes ? `  — ${c.notes.slice(0, 30)}` : ''}
            </Text>
          ))}
        {habit.checkIns.filter(c => c.verified).length === 0 && (
          <Text dimColor>  No check-ins yet</Text>
        )}
      </Box>

      <Box borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>[c] check in today  [b] back  [d] delete habit</Text>
      </Box>
    </Box>
  );
}
