import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Selector from '../components/Selector.js';
import type { AppData, Habit, Integration, IntegrationType, ScreenName } from '../types.js';

interface Props {
  data: AppData;
  navigate: (screen: ScreenName, params?: { habitId?: string }) => void;
  updateData: (updater: (prev: AppData) => AppData) => void;
}

type Step =
  | 'name'
  | 'description'
  | 'emoji'
  | 'integration-type'
  | 'integration-config'
  | 'confirm';

const INTEGRATION_OPTIONS = [
  { label: '🐙 GitHub — verifies by checking today\'s commits/pushes', value: 'github' as IntegrationType },
  { label: '🦉 Duolingo — checks today\'s XP/lessons', value: 'duolingo' as IntegrationType },
  { label: '🚴 Strava — verifies today\'s workout activity', value: 'strava' as IntegrationType },
  { label: '📸 Screenshot — AI verifies a screenshot you upload', value: 'screenshot' as IntegrationType },
  { label: '✋ Manual — just tap to confirm (honour system)', value: 'manual' as IntegrationType },
];

const EMOJI_OPTIONS = [
  { label: '💻 Coding', value: '💻' },
  { label: '📚 Reading', value: '📚' },
  { label: '🏃 Running', value: '🏃' },
  { label: '🧘 Meditation', value: '🧘' },
  { label: '🇫🇷 Language', value: '🗣️' },
  { label: '💪 Workout', value: '💪' },
  { label: '✍️  Writing', value: '✍️' },
  { label: '🎵 Music', value: '🎵' },
];

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function NewHabit({ navigate, updateData }: Props) {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('💻');
  const [emojiIdx, setEmojiIdx] = useState(0);
  const [intType, setIntType] = useState<IntegrationType>('github');
  const [intTypeIdx, setIntTypeIdx] = useState(0);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  useInput((input, key) => {
    if (key.escape) { navigate('dashboard'); return; }
  });

  const configLabel: Record<IntegrationType, { userLabel?: string; tokenLabel?: string }> = {
    github: { userLabel: 'GitHub username', tokenLabel: 'Personal access token (optional, for private activity)' },
    duolingo: { userLabel: 'Duolingo username' },
    strava: { tokenLabel: 'Strava access token (from strava.com/settings/api)' },
    screenshot: {},
    manual: {},
  };

  const conf = configLabel[intType];
  const needsUsername = !!conf.userLabel;
  const needsToken = !!conf.tokenLabel;

  function buildIntegration(): Integration {
    return {
      type: intType,
      username: username || undefined,
      token: token || undefined,
    };
  }

  function save() {
    const habit: Habit = {
      id: randomId(),
      name,
      description,
      emoji,
      integration: buildIntegration(),
      checkIns: [],
      createdAt: new Date().toISOString(),
    };
    updateData(prev => ({ ...prev, habits: [...prev.habits, habit] }));
    navigate('dashboard');
  }

  return (
    <Box flexDirection="column" width={62} borderStyle="round" borderColor="green" paddingX={2} paddingY={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text bold color="green">✨ New Habit</Text>
        <Text dimColor>[Esc] cancel</Text>
      </Box>

      {/* Progress dots */}
      <Box marginBottom={1} gap={1}>
        {(['name', 'description', 'emoji', 'integration-type', 'integration-config', 'confirm'] as Step[]).map((s, i) => (
          <Text key={s} color={s === step ? 'green' : 'gray'}>
            {s === step ? '●' : '○'}
          </Text>
        ))}
        <Text dimColor>  {step.replace('-', ' ')}</Text>
      </Box>

      {step === 'name' && (
        <Box flexDirection="column" gap={1}>
          <Text>Habit name:</Text>
          <TextInput
            value={name}
            onChange={setName}
            onSubmit={() => { if (name.trim()) setStep('description'); }}
            placeholder="e.g. Daily coding, Morning run..."
          />
          <Text dimColor>[Enter] to continue</Text>
        </Box>
      )}

      {step === 'description' && (
        <Box flexDirection="column" gap={1}>
          <Text>Short description (optional):</Text>
          <TextInput
            value={description}
            onChange={setDescription}
            onSubmit={() => setStep('emoji')}
            placeholder="e.g. At least 1 commit per day"
          />
          <Text dimColor>[Enter] to continue</Text>
        </Box>
      )}

      {step === 'emoji' && (
        <Box flexDirection="column" gap={1}>
          <Text>Choose an icon:</Text>
          <Selector
            options={EMOJI_OPTIONS}
            selectedIndex={emojiIdx}
            onChange={setEmojiIdx}
            onSelect={v => { setEmoji(v); setStep('integration-type'); }}
          />
          <Text dimColor>[↑↓] navigate  [Enter] select</Text>
        </Box>
      )}

      {step === 'integration-type' && (
        <Box flexDirection="column" gap={1}>
          <Text>How should StreakUp <Text bold>verify</Text> this habit?</Text>
          <Selector
            options={INTEGRATION_OPTIONS}
            selectedIndex={intTypeIdx}
            onChange={setIntTypeIdx}
            onSelect={v => {
              setIntType(v);
              if (v === 'manual' || v === 'screenshot') {
                setStep('confirm');
              } else {
                setStep('integration-config');
              }
            }}
          />
          <Text dimColor>[↑↓] navigate  [Enter] select</Text>
        </Box>
      )}

      {step === 'integration-config' && (
        <Box flexDirection="column" gap={1}>
          <Text bold>Configure {intType} integration</Text>
          {needsUsername && (
            <>
              <Text dimColor>{conf.userLabel}:</Text>
              <TextInput
                value={username}
                onChange={setUsername}
                onSubmit={() => {
                  if (!needsToken) setStep('confirm');
                  else setStep('integration-config');
                }}
                placeholder="your username"
              />
            </>
          )}
          {needsToken && !needsUsername && (
            <>
              <Text dimColor>{conf.tokenLabel}:</Text>
              <TextInput
                value={token}
                onChange={setToken}
                onSubmit={() => setStep('confirm')}
                placeholder="paste token here"
              />
            </>
          )}
          {needsToken && needsUsername && username && (
            <>
              <Text dimColor>{conf.tokenLabel}:</Text>
              <TextInput
                value={token}
                onChange={setToken}
                onSubmit={() => setStep('confirm')}
                placeholder="optional — paste token"
              />
            </>
          )}
          <Text dimColor>[Enter] continue  [Esc] cancel</Text>
        </Box>
      )}

      {step === 'confirm' && (
        <Box flexDirection="column" gap={1}>
          <Text bold color="green">Ready to create!</Text>
          <Text>  {emoji} <Text bold>{name}</Text></Text>
          {description && <Text dimColor>  {description}</Text>}
          <Text>  Verified via: <Text color="cyan">{intType}</Text>
            {username ? ` (@${username})` : ''}
          </Text>
          <Box marginTop={1} gap={3}>
            <Text color="green" bold>[Enter] Create habit</Text>
            <Text dimColor>[Esc] Cancel</Text>
          </Box>
          {/* Capture Enter on confirm step */}
          <ConfirmCapture onConfirm={save} onCancel={() => navigate('dashboard')} />
        </Box>
      )}
    </Box>
  );
}

function ConfirmCapture({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  useInput((_input, key) => {
    if (key.return) onConfirm();
    if (key.escape) onCancel();
  });
  return null;
}
