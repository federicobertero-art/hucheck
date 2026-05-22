export type ProcessStatus = 'pending' | 'in_progress' | 'completed';

export interface DailyProcess {
  id: string;
  name: string;
  area: string;
  completedTasks: number;
  totalTasks: number;
  status: ProcessStatus;
}
