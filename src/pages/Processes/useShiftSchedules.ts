import { useQuery } from '@tanstack/react-query';

import { provider } from '../../data/provider';

import { type ShiftSchedule } from './ShiftSettings/types';

export const useShiftSchedules = () =>
  useQuery({
    queryKey: ['shiftSchedules'],
    queryFn: () => provider.list<ShiftSchedule>('shiftSchedules'),
  });
