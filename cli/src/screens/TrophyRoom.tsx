import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { format } from 'date-fns';
import TrophyArt from '../components/TrophyArt.js';
import { milestoneLabel, trophyTier } from '../lib/streaks.js';
import type { AppData, ScreenName, Trophy } from '../types.js';

interface Props {
  data: AppData;
  navigate: (screen: ScreenName, params?: { habitId?: string }) => void;
}

const LOCKED_MILESTONES: Array<7 | 30 | 100 | 365> = [7, 30, 100, 365];

export default function TrophyRoom({ data, navigate }: Props) {
  const [frame, setFrame] = useState(0);
  const { trophies } = data;

  // Simple shimmer animation for trophy room
  useEffect(() => {
    const timer = setInterval(() => setFrame(f => (f + 1) % 4), 400);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (input === 'b' || key.escape) navigate('dashboard');
  });

  const shimmer = ['✦', '✧', '✦', '·'][frame] ?? '✦';

  const SHELF_ART = [
    '╔══════════════════════════════════════════════════════╗',
    '║  ⠀⠀⠀⠀⠀⠀⠀  T R O P H Y   R O O M  ⠀⠀⠀⠀⠀⠀⠀  ║',
    '╠══════════════════════════════════════════════════════╣',
  ];

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold color="yellow">🏆 Trophy Room  <Text color="yellow">{shimmer}</Text></Text>
        <Text dimColor>[b] back</Text>
      </Box>

      {trophies.length === 0 ? (
        <Box
          flexDirection="column"
          alignItems="center"
          borderStyle="round"
          borderColor="gray"
          padding={3}
          width={58}
        >
          <Text dimColor>No trophies yet...</Text>
          <Box marginTop={1} flexDirection="column" alignItems="center">
            <Text dimColor>Reach these milestones to unlock trophies:</Text>
            <Box marginTop={1} gap={3}>
              {LOCKED_MILESTONES.map(m => (
                <Box key={m} flexDirection="column" alignItems="center">
                  <Text color="gray">🔒</Text>
                  <Text dimColor>{milestoneLabel(m)}</Text>
                  <Text dimColor>{trophyTier(m)}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          {/* Shelf */}
          <Box
            borderStyle="round"
            borderColor="yellow"
            padding={2}
            width={58}
            flexDirection="column"
          >
            <Box gap={0} flexWrap="wrap">
              {trophies.map(trophy => (
                <TrophyArt key={trophy.id} trophy={trophy} />
              ))}
            </Box>

            <Box marginTop={1} borderStyle="single" borderColor="gray" />

            <Box marginTop={1} flexDirection="column">
              <Text dimColor bold>EARNED ({trophies.length})</Text>
              {trophies.map(t => (
                <Text key={t.id} dimColor>
                  {'  '}🏆 {milestoneLabel(t.milestone)} — {t.habitEmoji} {t.habitName}
                  {'  '}<Text color="gray">{format(new Date(t.unlockedAt), 'MMM d, yyyy')}</Text>
                </Text>
              ))}
            </Box>

            {/* Locked trophies */}
            {(() => {
              const earnedKeys = new Set(trophies.map(t => `${t.habitId}-${t.milestone}`));
              const lockedMilestones = LOCKED_MILESTONES.filter(
                m => !data.habits.some(h => earnedKeys.has(`${h.id}-${m}`)),
              );
              if (lockedMilestones.length === 0) return null;
              return (
                <Box marginTop={1} flexDirection="column">
                  <Text dimColor bold>LOCKED</Text>
                  {lockedMilestones.map(m => (
                    <Text key={m} dimColor>
                      {'  '}🔒 {milestoneLabel(m)} — {trophyTier(m)} trophy
                    </Text>
                  ))}
                </Box>
              );
            })()}
          </Box>

          <Box marginTop={1}>
            <Text dimColor>{trophies.length} trophy{trophies.length !== 1 ? 'ies' : ''} earned</Text>
          </Box>
        </>
      )}
    </Box>
  );
}
