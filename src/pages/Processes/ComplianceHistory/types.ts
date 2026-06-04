export interface HistoryTaskEntry {
  id: string;
  name: string;
  completed: boolean;
  completedBy?: string;
}

export interface HistoryEntry {
  id: string;
  label: string;
  completed: boolean;
  completedBy: string[];
  tasks: HistoryTaskEntry[];
}
