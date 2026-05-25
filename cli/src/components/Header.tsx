import React from 'react';
import { Box, Text } from 'ink';

interface Props {
  title: string;
  hint?: string;
}

export default function Header({ title, hint }: Props) {
  return (
    <Box justifyContent="space-between" marginBottom={1}>
      <Text bold color="yellow">
        🔥 {title}
      </Text>
      {hint && <Text dimColor>{hint}</Text>}
    </Box>
  );
}
