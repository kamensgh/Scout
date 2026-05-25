import React from 'react';
import { Box, Text } from 'ink';
import { getLast12WeeksGrid } from '../lib/streaks.js';
import type { Habit } from '../types.js';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface Props {
  habit: Habit;
}

export default function CalendarHeatmap({ habit }: Props) {
  const grid = getLast12WeeksGrid(habit); // 12 columns × 7 rows

  return (
    <Box flexDirection="column">
      <Text dimColor>Last 12 weeks</Text>
      {DAYS.map((day, rowIdx) => (
        <Box key={day}>
          <Text dimColor>{day} </Text>
          {grid.map((week, colIdx) => (
            <Text key={colIdx} color={week[rowIdx] ? 'green' : undefined}>
              {week[rowIdx] ? '■' : '·'}{' '}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
}
