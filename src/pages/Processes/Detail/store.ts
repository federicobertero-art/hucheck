import { MOCK_TASKS } from './constants';
import type { Task } from './types';

const taskStore: Record<string, Task[]> = {};

export const getTasksForProcess = (processId: string): Task[] => {
  if (!taskStore[processId]) {
    taskStore[processId] = (MOCK_TASKS[processId] ?? []).map(t => ({ ...t }));
  }
  return taskStore[processId];
};

export const toggleTaskInStore = (processId: string, taskId: string): void => {
  const tasks = getTasksForProcess(processId);
  const task = tasks.find(t => t.id === taskId);
  if (task) task.completed = !task.completed;
};
