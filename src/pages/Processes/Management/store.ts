import { MOCK_PROCESSES } from '../constants';
import { MOCK_TASKS } from '../Detail/constants';
import { type Task } from '../Detail/types';

import { type ManageableProcess, type ProcessFrequency } from './types';

let store: ManageableProcess[] | null = null;

const init = (): ManageableProcess[] => {
  if (!store) {
    store = MOCK_PROCESSES.map(p => ({
      id: p.id,
      name: p.name,
      area: p.area,
      frequency: p.frequency,
      tasks: (MOCK_TASKS[p.id] ?? []).map(t => ({ ...t })),
    }));
  }
  return store;
};

export const getProcessList = (): ManageableProcess[] => init();

export const addProcess = (
  name: string,
  area: string,
  frequency: ProcessFrequency,
): void => {
  const id = String(Date.now());
  init().push({ id, name, area, frequency, tasks: [] });
};

export const updateProcess = (
  id: string,
  name: string,
  area: string,
  frequency: ProcessFrequency,
): void => {
  const p = init().find(proc => proc.id === id);
  if (p) {
    p.name = name;
    p.area = area;
    p.frequency = frequency;
  }
};

export const removeProcess = (id: string): void => {
  store = init().filter(p => p.id !== id);
};

export const addTask = (processId: string, name: string): void => {
  const process = init().find(p => p.id === processId);
  if (!process) return;
  const task: Task = { id: `${processId}-${Date.now()}`, name, assignedTo: [] };
  process.tasks.push(task);
};

export const updateTask = (
  processId: string,
  taskId: string,
  name: string,
): void => {
  const process = init().find(p => p.id === processId);
  const task = process?.tasks.find(t => t.id === taskId);
  if (task) {
    task.name = name;
  }
};

export const removeTask = (processId: string, taskId: string): void => {
  const process = init().find(p => p.id === processId);
  if (!process) return;
  process.tasks = process.tasks.filter(t => t.id !== taskId);
};
