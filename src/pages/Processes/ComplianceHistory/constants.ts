import { MOCK_TASKS } from '../Detail/constants';

import { type HistoryEntry, type HistoryTaskEntry } from './types';

const MOCK_USERS = ['Federico B.', 'Ana G.', 'Marcos L.', 'Sofía R.'];

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const processIdToSeed = (processId: string): number =>
  processId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

const pickUser = (seed: number): string =>
  MOCK_USERS[Math.floor(seededRandom(seed) * MOCK_USERS.length)];

const pickCompletedBy = (seed: number, i: number): string[] => {
  const userCount = Math.floor(seededRandom(seed + i + 200) * 2) + 1;
  return Array.from({ length: userCount }, (_, u) =>
    pickUser(seed + i + u + 300),
  ).filter((v, i2, a) => a.indexOf(v) === i2);
};

const generateTasks = (
  processId: string,
  entryIndex: number,
  entryCompleted: boolean,
): HistoryTaskEntry[] => {
  const rawTasks = MOCK_TASKS[processId] ?? [];
  const seed = processIdToSeed(processId) + entryIndex * 100;
  const threshold = entryCompleted ? 0.25 : 0.65;
  return rawTasks.map((task, ti) => {
    const completed = seededRandom(seed + ti + 400) > threshold;
    return {
      id: `${task.id}-h${entryIndex}`,
      name: task.name,
      completed,
      completedBy: completed ? pickUser(seed + ti + 500) : undefined,
    };
  });
};

export const generateDailyHistory = (processId: string): HistoryEntry[] => {
  const today = new Date();
  const seed = processIdToSeed(processId);
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - i));
    const completed = seededRandom(seed + i) > 0.3;
    const label = date.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return {
      id: `${processId}-d${i}`,
      label,
      completed,
      completedBy: completed ? pickCompletedBy(seed, i) : [],
      tasks: generateTasks(processId, i, completed),
    };
  });
};

export const generateWeeklyHistory = (processId: string): HistoryEntry[] => {
  const today = new Date();
  const seed = processIdToSeed(processId);
  return Array.from({ length: 12 }, (_, i) => {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7 * (11 - i));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const completed = seededRandom(seed + i + 50) > 0.25;
    const startLabel = weekStart.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
    });
    const endLabel = weekEnd.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
    });
    return {
      id: `${processId}-w${i}`,
      label: `${startLabel} – ${endLabel}`,
      completed,
      completedBy: completed ? pickCompletedBy(seed, i + 50) : [],
      tasks: generateTasks(processId, i + 100, completed),
    };
  });
};

export const generateHistory = (
  processId: string,
  frequency: 'daily' | 'weekly' | 'none',
): HistoryEntry[] => {
  if (frequency === 'weekly') return generateWeeklyHistory(processId);
  if (frequency === 'none') return generateDailyHistory(processId).slice(-10);
  return generateDailyHistory(processId);
};

export const PERIOD_LABEL: Record<'daily' | 'weekly' | 'none', string> = {
  daily: 'días',
  weekly: 'semanas',
  none: 'registros',
};
