export type TaskShift = 'morning' | 'afternoon' | 'night';

export interface Task {
  id: string;
  name: string;
  assignedTo: string[];
}

export interface TaskEntry {
  completed: boolean;
  completedBy?: string;
  notes?: string;
  imageBase64?: string;
}
