import { useMutation, useQueryClient } from '@tanstack/react-query';

import useSnackbar from '@material-hu/components/design-system/Snackbar';

import { provider } from '../../../../data/provider';
import { type ShiftSchedule } from '../types';
import { dateToTimeString } from '../utils';

type UpdateShiftScheduleInput = {
  id: string;
  values: {
    morningStart: Date;
    morningEnd: Date;
    afternoonStart: Date;
    afternoonEnd: Date;
    nightStart: Date;
    nightEnd: Date;
  };
};

/** Saves a branch's shift schedule, converting form `Date` values to `"HH:mm"` strings. */
export const useUpdateShiftScheduleMutation = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, values }: UpdateShiftScheduleInput) =>
      provider.update<ShiftSchedule>('shiftSchedules', id, {
        morningStart: dateToTimeString(values.morningStart),
        morningEnd: dateToTimeString(values.morningEnd),
        afternoonStart: dateToTimeString(values.afternoonStart),
        afternoonEnd: dateToTimeString(values.afternoonEnd),
        nightStart: dateToTimeString(values.nightStart),
        nightEnd: dateToTimeString(values.nightEnd),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shiftSchedules'] });
      enqueueSnackbar({
        variant: 'success',
        title: 'Horarios guardados correctamente',
      });
    },
    onError: () => {
      enqueueSnackbar({
        variant: 'error',
        title: 'No pudimos guardar los cambios. Intentá de nuevo.',
      });
    },
  });
};
