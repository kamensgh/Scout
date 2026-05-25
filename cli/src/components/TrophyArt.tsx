import React from 'react';
import { Box, Text } from 'ink';
import { trophyTier, trophyColor, milestoneLabel } from '../lib/streaks.js';
import type { Trophy } from '../types.js';

const TROPHY_ART = [
  '   ___  ',
  '  /   \\ ',
  ' |     |',
  '  \\___/ ',
  '   | |  ',
  ' __|_|__',
  '|_______|',
];

interface Props {
  trophy: Trophy;
}

export default function TrophyArt({ trophy }: Props) {
  const color = trophyColor(trophy.milestone);
  const tier = trophyTier(trophy.milestone);
  const label = milestoneLabel(trophy.milestone);

  return (
    <Box flexDirection="column" alignItems="center" marginRight={3}>
      {TROPHY_ART.map((line, i) => (
        <Text key={i} color={color}>
          {line}
        </Text>
      ))}
      <Text bold color={color}>{label}</Text>
      <Text dimColor>{tier}</Text>
      <Text>{trophy.habitEmoji} {trophy.habitName.slice(0, 10)}</Text>
    </Box>
  );
}
