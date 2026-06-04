import { type PillsProps } from '@material-hu/components/design-system/Pills/types';

import { type DailyProcess, type ProcessStatus } from './types';

export const STATUS_CONFIG: Record<
  ProcessStatus,
  { label: string; type: PillsProps['type'] }
> = {
  pending: { label: 'PENDIENTE', type: 'neutral' },
  in_progress: { label: 'EN PROGRESO', type: 'warning' },
  completed: { label: 'COMPLETADO', type: 'success' },
};

export const MOCK_PROCESSES: DailyProcess[] = [
  {
    id: '1',
    name: 'Apertura de local',
    area: 'Operaciones',
    completedTasks: 3,
    totalTasks: 8,
    status: 'in_progress',
    frequency: 'daily',
  },
  {
    id: '2',
    name: 'Control de temperatura',
    area: 'Calidad',
    completedTasks: 0,
    totalTasks: 4,
    status: 'pending',
    frequency: 'daily',
  },
  {
    id: '3',
    name: 'Inventario diario',
    area: 'Logística',
    completedTasks: 6,
    totalTasks: 6,
    status: 'completed',
    frequency: 'daily',
  },
  {
    id: '4',
    name: 'Limpieza de área de trabajo',
    area: 'Higiene',
    completedTasks: 1,
    totalTasks: 5,
    status: 'in_progress',
    frequency: 'weekly',
  },
];
