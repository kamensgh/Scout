import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type { AppData } from './types.js';

const DATA_DIR = join(homedir(), '.streakup');
const DATA_FILE = join(DATA_DIR, 'data.json');

const DEFAULT: AppData = {
  habits: [],
  trophies: [],
  settings: {},
};

export function loadData(): AppData {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) {
    saveData(DEFAULT);
    return structuredClone(DEFAULT);
  }
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as AppData;
  } catch {
    return structuredClone(DEFAULT);
  }
}

export function saveData(data: AppData): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
