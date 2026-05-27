import { type Task } from '../Detail/types';

export interface ManageableProcess {
  id: string;
  name: string;
  area: string;
  tasks: Task[];
}

export interface ProcessFormValues {
  name: string;
  area: string;
}
