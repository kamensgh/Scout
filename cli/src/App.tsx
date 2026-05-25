import React, { useState, useCallback } from 'react';
import { useApp } from 'ink';
import { loadData, saveData } from './store.js';
import type { AppData, ScreenName, ScreenState } from './types.js';
import Dashboard from './screens/Dashboard.js';
import HabitDetail from './screens/HabitDetail.js';
import NewHabit from './screens/NewHabit.js';
import CheckIn from './screens/CheckIn.js';
import TrophyRoom from './screens/TrophyRoom.js';
import Settings from './screens/Settings.js';

export default function App() {
  const { exit } = useApp();
  const [data, setData] = useState<AppData>(() => loadData());
  const [screen, setScreen] = useState<ScreenState>({ name: 'dashboard' });

  const navigate = useCallback((name: ScreenName, params?: { habitId?: string }) => {
    setScreen({ name, habitId: params?.habitId });
  }, []);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const common = { data, navigate, updateData };

  switch (screen.name) {
    case 'dashboard':
      return <Dashboard data={data} navigate={navigate} onExit={exit} />;
    case 'habit-detail':
      return <HabitDetail {...common} habitId={screen.habitId!} />;
    case 'new-habit':
      return <NewHabit {...common} />;
    case 'check-in':
      return <CheckIn {...common} habitId={screen.habitId} />;
    case 'trophy-room':
      return <TrophyRoom data={data} navigate={navigate} />;
    case 'settings':
      return <Settings {...common} />;
    default:
      return <Dashboard data={data} navigate={navigate} onExit={exit} />;
  }
}
