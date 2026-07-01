import { type TaskShift } from '../Detail/types';

export interface HistoryTaskEntry {
  id: string;
  name: string;
  completed: boolean;
  completedBy?: string;
  shift?: TaskShift;
  notes?: string;
}

export interface HistoryEntry {
  id: string;
  label: string;
  completed: boolean;
  completedBy: string[];
  tasks: HistoryTaskEntry[];
}
