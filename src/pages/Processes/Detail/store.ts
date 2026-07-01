import { MOCK_BRANCHES } from '../branches';
import { MOCK_TASKS } from './constants';
import { type Task, type TaskEntry, type TaskShift } from './types';

// key: `${branchId}|${processId}|${dateStr}|${shift}` → Record<taskId, TaskEntry>
const completionStore: Record<string, Record<string, TaskEntry>> = {};

// assignees live on the template (shared across branches for simplicity)
const assigneeStore: Record<string, Record<string, string[]>> = {};

const storeKey = (
  branchId: string,
  processId: string,
  dateStr: string,
  shift: TaskShift,
) => `${branchId}|${processId}|${dateStr}|${shift}`;

export const getTaskTemplate = (processId: string): Task[] => {
  const base = MOCK_TASKS[processId] ?? [];
  if (!assigneeStore[processId]) {
    assigneeStore[processId] = Object.fromEntries(
      base.map(t => [t.id, [...t.assignedTo]]),
    );
  }
  return base.map(t => ({
    ...t,
    assignedTo: assigneeStore[processId][t.id] ?? t.assignedTo,
  }));
};

export const getShiftCompletions = (
  branchId: string,
  processId: string,
  dateStr: string,
  shift: TaskShift,
): Record<string, TaskEntry> => {
  const key = storeKey(branchId, processId, dateStr, shift);
  if (!completionStore[key]) completionStore[key] = {};
  return completionStore[key];
};

export const toggleTaskCompletion = (
  branchId: string,
  processId: string,
  dateStr: string,
  shift: TaskShift,
  taskId: string,
  completedBy: string,
): void => {
  const key = storeKey(branchId, processId, dateStr, shift);
  if (!completionStore[key]) completionStore[key] = {};
  const entry = completionStore[key][taskId];
  if (entry?.completed) {
    completionStore[key][taskId] = {
      ...entry,
      completed: false,
      completedBy: undefined,
    };
  } else {
    completionStore[key][taskId] = {
      ...(entry ?? {}),
      completed: true,
      completedBy,
    };
  }
};

export const updateEntryNotes = (
  branchId: string,
  processId: string,
  dateStr: string,
  shift: TaskShift,
  taskId: string,
  notes: string,
): void => {
  const key = storeKey(branchId, processId, dateStr, shift);
  if (!completionStore[key]) completionStore[key] = {};
  completionStore[key][taskId] = {
    ...(completionStore[key][taskId] ?? { completed: false }),
    notes: notes || undefined,
  };
};

export const updateEntryImage = (
  branchId: string,
  processId: string,
  dateStr: string,
  shift: TaskShift,
  taskId: string,
  imageBase64: string | undefined,
): void => {
  const key = storeKey(branchId, processId, dateStr, shift);
  if (!completionStore[key]) completionStore[key] = {};
  completionStore[key][taskId] = {
    ...(completionStore[key][taskId] ?? { completed: false }),
    imageBase64,
  };
};

export const updateTaskAssignees = (
  processId: string,
  taskId: string,
  assignedTo: string[],
): void => {
  if (!assigneeStore[processId]) assigneeStore[processId] = {};
  assigneeStore[processId][taskId] = assignedTo;
};

// For reporting: iterate all stored completions
export const getAllCompletions = (): Record<string, Record<string, TaskEntry>> =>
  completionStore;

// Pre-populate mock historical data (last 7 days, all branches)
const seedHistory = () => {
  const today = new Date();
  const SHIFTS: TaskShift[] = ['morning', 'afternoon', 'night'];
  const COMPLETERS = ['Federico B.', 'Ana G.', 'Marcos L.', 'Sofía R.'];

  for (const branch of MOCK_BRANCHES) {
    for (let d = 1; d <= 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      const dateStr = date.toISOString().slice(0, 10);

      for (const processId of Object.keys(MOCK_TASKS)) {
        for (const shift of SHIFTS) {
          const key = storeKey(branch.id, processId, dateStr, shift);
          completionStore[key] = {};
          const tasks = MOCK_TASKS[processId];
          tasks.forEach((task, idx) => {
            const branchSeed = MOCK_BRANCHES.indexOf(branch);
            const complete =
              (d + idx + SHIFTS.indexOf(shift) + branchSeed) % 3 !== 0;
            if (complete) {
              completionStore[key][task.id] = {
                completed: true,
                completedBy: COMPLETERS[(idx + d + branchSeed) % COMPLETERS.length],
              };
            }
          });
        }
      }
    }
  }
};

seedHistory();
