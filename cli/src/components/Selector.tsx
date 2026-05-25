import React from 'react';
import { Box, Text, useInput } from 'ink';

interface Option<T> {
  label: string;
  value: T;
  hint?: string;
}

interface Props<T> {
  options: Option<T>[];
  selectedIndex: number;
  onSelect: (value: T) => void;
  onChange: (index: number) => void;
  isActive?: boolean;
}

export default function Selector<T>({ options, selectedIndex, onSelect, onChange, isActive = true }: Props<T>) {
  useInput(
    (_input, key) => {
      if (key.upArrow) onChange(Math.max(0, selectedIndex - 1));
      if (key.downArrow) onChange(Math.min(options.length - 1, selectedIndex + 1));
      if (key.return) onSelect(options[selectedIndex]!.value);
    },
    { isActive },
  );

  return (
    <Box flexDirection="column">
      {options.map((opt, idx) => {
        const active = idx === selectedIndex;
        return (
          <Box key={idx}>
            <Text color={active ? 'cyan' : undefined}>
              {active ? '▶ ' : '  '}
              {opt.label}
              {opt.hint ? <Text dimColor>  {opt.hint}</Text> : null}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
