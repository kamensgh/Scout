import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import type { AppData, ScreenName } from '../types.js';

interface Props {
  data: AppData;
  navigate: (screen: ScreenName, params?: { habitId?: string }) => void;
  updateData: (updater: (prev: AppData) => AppData) => void;
}

type Field = 'github' | 'strava' | 'anthropic' | null;

export default function Settings({ data, navigate, updateData }: Props) {
  const [editing, setEditing] = useState<Field>(null);
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  const { settings } = data;

  useInput((input, key) => {
    if (key.escape) {
      if (editing) { setEditing(null); setValue(''); }
      else navigate('dashboard');
    }
    if (!editing) {
      if (input === '1') { setEditing('github'); setValue(settings.githubToken ?? ''); }
      if (input === '2') { setEditing('strava'); setValue(settings.stravaToken ?? ''); }
      if (input === '3') { setEditing('anthropic'); setValue(settings.anthropicKey ?? ''); }
      if (input === 'b') navigate('dashboard');
    }
  });

  function saveField() {
    if (!editing) return;
    updateData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...(editing === 'github' ? { githubToken: value || undefined } : {}),
        ...(editing === 'strava' ? { stravaToken: value || undefined } : {}),
        ...(editing === 'anthropic' ? { anthropicKey: value || undefined } : {}),
      },
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setEditing(null);
    setValue('');
  }

  function mask(v?: string) {
    if (!v) return '(not set)';
    return v.slice(0, 6) + '••••••••' + v.slice(-4);
  }

  const fieldLabels: Record<NonNullable<Field>, string> = {
    github: 'GitHub personal access token',
    strava: 'Strava access token',
    anthropic: 'Anthropic API key (for screenshot verification)',
  };

  return (
    <Box flexDirection="column" width={62} borderStyle="round" borderColor="blue" paddingX={2} paddingY={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold color="blue">⚙  Settings</Text>
        <Text dimColor>[Esc] back</Text>
      </Box>

      {saved && <Text color="green">✓ Saved!</Text>}

      {!editing ? (
        <Box flexDirection="column" gap={1}>
          <Text dimColor>API tokens are stored locally in ~/.streakup/data.json</Text>
          <Box marginTop={1} flexDirection="column" gap={1}>
            <Box>
              <Text color="cyan">[1] </Text>
              <Text>GitHub token:  </Text>
              <Text dimColor>{mask(settings.githubToken)}</Text>
            </Box>
            <Box>
              <Text color="cyan">[2] </Text>
              <Text>Strava token:  </Text>
              <Text dimColor>{mask(settings.stravaToken)}</Text>
            </Box>
            <Box>
              <Text color="cyan">[3] </Text>
              <Text>Anthropic key: </Text>
              <Text dimColor>{mask(settings.anthropicKey)}</Text>
            </Box>
          </Box>

          <Box marginTop={2} flexDirection="column">
            <Text dimColor bold>How to get tokens:</Text>
            <Text dimColor>  GitHub: github.com/settings/tokens → Generate new token</Text>
            <Text dimColor>  Strava: strava.com/settings/api → My API Application</Text>
            <Text dimColor>  Anthropic: console.anthropic.com/settings/api-keys</Text>
          </Box>

          <Box marginTop={1}>
            <Text dimColor>Note: ANTHROPIC_API_KEY env var is also supported</Text>
          </Box>

          <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
            <Text dimColor>[1][2][3] edit  [b] back</Text>
          </Box>
        </Box>
      ) : (
        <Box flexDirection="column" gap={1}>
          <Text>{fieldLabels[editing]}:</Text>
          <TextInput
            value={value}
            onChange={setValue}
            onSubmit={saveField}
            placeholder="paste token here (Enter to save, Esc to cancel)"
          />
          <Text dimColor>[Enter] save  [Esc] cancel</Text>
        </Box>
      )}
    </Box>
  );
}
