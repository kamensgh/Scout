import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { format } from 'date-fns';
import { calculateStreak, isCheckedInToday } from '../lib/streaks.js';
import Header from '../components/Header.js';
import type { AppData, ScreenName } from '../types.js';

interface Props {
  data: AppData;
  navigate: (screen: ScreenName, params?: { habitId?: string }) => void;
  onExit: () => void;
}

export default function Dashboard({ data, navigate, onExit }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { habits, trophies } = data;

  useInput((input, key) => {
    if (input === 'q') { onExit(); return; }
    if (input === 'n') { navigate('new-habit'); return; }
    if (input === 't') { navigate('trophy-room'); return; }
    if (input === 's') { navigate('settings'); return; }
    if (input === 'c' && habits[selectedIdx]) {
      navigate('check-in', { habitId: habits[selectedIdx]!.id });
      return;
    }
    if (key.upArrow) setSelectedIdx(i => Math.max(0, i - 1));
    if (key.downArrow) setSelectedIdx(i => Math.min(habits.length - 1, i + 1));
    if (key.return && habits[selectedIdx]) {
      navigate('habit-detail', { habitId: habits[selectedIdx]!.id });
    }
  });

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const pendingCount = habits.filter(h => !isCheckedInToday(h)).length;
  const trophyCount = trophies.length;

  return (
    <Box flexDirection="column" width={62} borderStyle="round" borderColor="yellow" paddingX={2} paddingY={1}>
      <Header title="StreakUp" hint={`[q] quit`} />

      <Box marginBottom={1}>
        <Text dimColor>{today}</Text>
        {pendingCount > 0 && <Text color="red">  {pendingCount} pending</Text>}
        {trophyCount > 0 && <Text color="yellow">  🏆 {trophyCount}</Text>}
      </Box>

      {habits.length === 0 ? (
        <Box flexDirection="column" alignItems="center" paddingY={3}>
          <Text bold>Welcome to StreakUp! 🔥</Text>
          <Text dimColor>Build real habits — verified automatically.</Text>
          <Box marginTop={1}>
            <Text color="cyan">Press [n] to create your first habit</Text>
          </Box>
        </Box>
      ) : (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text dimColor bold>  {'HABIT'.padEnd(22)}{'STREAK'.padEnd(10)}TODAY</Text>
          </Box>
          {habits.map((habit, idx) => {
            const streak = calculateStreak(habit);
            const done = isCheckedInToday(habit);
            const selected = idx === selectedIdx;
            const color = selected ? 'cyan' : done ? 'green' : undefined;

            const bar = '█'.repeat(Math.min(streak, 10)) + '░'.repeat(Math.max(0, 10 - streak));

            return (
              <Box key={habit.id} marginBottom={0}>
                <Text color={color}>
                  {selected ? '▶ ' : '  '}
                  {habit.emoji} {habit.name.slice(0, 16).padEnd(18)}
                  {streak.toString().padStart(3)}d {bar.slice(0, 8)}
                  {'  '}{done ? '✅' : '⏳'}
                </Text>
              </Box>
            );
          })}
        </Box>
      )}

      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>
          [n]ew  [c]heck-in  [t]rophies  [s]ettings  [↑↓] select  [↵] detail
        </Text>
      </Box>
    </Box>
  );
}
