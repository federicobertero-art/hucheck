import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import FormTimePicker from '@material-hu/components/composed-components/TimePicker/form';

const schema = z.object({
  morningStart: z.date({ required_error: 'Requerido' }),
  morningEnd: z.date({ required_error: 'Requerido' }),
  afternoonStart: z.date({ required_error: 'Requerido' }),
  afternoonEnd: z.date({ required_error: 'Requerido' }),
  nightStart: z.date({ required_error: 'Requerido' }),
  nightEnd: z.date({ required_error: 'Requerido' }),
});

export type ShiftScheduleFormValues = z.infer<typeof schema>;

type Props = {
  values: ShiftScheduleFormValues;
  onSubmit: (data: ShiftScheduleFormValues) => void;
};

const ShiftScheduleForm = ({ values, onSubmit }: Props) => {
  const methods = useForm<ShiftScheduleFormValues>({
    resolver: zodResolver(schema),
    values,
  });
  return (
    <FormProvider {...methods}>
      <form
        id="shift-schedule-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Stack sx={{ gap: 2 }}>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="subtitle2">Mañana</Typography>
            <Stack sx={{ flexDirection: 'row', gap: 2 }}>
              <FormTimePicker
                name="morningStart"
                inputProps={{ label: 'Hora de inicio', fullWidth: true }}
              />
              <FormTimePicker
                name="morningEnd"
                inputProps={{ label: 'Hora de fin', fullWidth: true }}
              />
            </Stack>
          </Stack>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="subtitle2">Tarde</Typography>
            <Stack sx={{ flexDirection: 'row', gap: 2 }}>
              <FormTimePicker
                name="afternoonStart"
                inputProps={{ label: 'Hora de inicio', fullWidth: true }}
              />
              <FormTimePicker
                name="afternoonEnd"
                inputProps={{ label: 'Hora de fin', fullWidth: true }}
              />
            </Stack>
          </Stack>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="subtitle2">Noche</Typography>
            <Stack sx={{ flexDirection: 'row', gap: 2 }}>
              <FormTimePicker
                name="nightStart"
                inputProps={{ label: 'Hora de inicio', fullWidth: true }}
              />
              <FormTimePicker
                name="nightEnd"
                inputProps={{ label: 'Hora de fin', fullWidth: true }}
              />
            </Stack>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default ShiftScheduleForm;
