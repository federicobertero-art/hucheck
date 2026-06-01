import { type Task } from '../Detail/types';

export type ProcessFrequency = 'daily' | 'weekly' | 'none';

export interface ManageableProcess {
  id: string;
  name: string;
  area: string;
  frequency: ProcessFrequency;
  tasks: Task[];
}

export interface ProcessFormValues {
  name: string;
  area: string;
  frequency: ProcessFrequency;
}
