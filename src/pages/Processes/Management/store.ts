import { MOCK_PROCESSES } from '../constants';
import { MOCK_TASKS } from '../Detail/constants';

import { type ManageableProcess } from './types';

let store: ManageableProcess[] | null = null;

const init = (): ManageableProcess[] => {
  if (!store) {
    store = MOCK_PROCESSES.map(p => ({
      id: p.id,
      name: p.name,
      area: p.area,
      tasks: (MOCK_TASKS[p.id] ?? []).map(t => ({ ...t })),
    }));
  }
  return store;
};

export const getProcessList = (): ManageableProcess[] => init();

export const addProcess = (name: string, area: string): void => {
  const id = String(Date.now());
  init().push({ id, name, area, tasks: [] });
};

export const updateProcess = (id: string, name: string, area: string): void => {
  const p = init().find(proc => proc.id === id);
  if (p) {
    p.name = name;
    p.area = area;
  }
};

export const removeProcess = (id: string): void => {
  store = init().filter(p => p.id !== id);
};
