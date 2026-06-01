import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stack from '@material-hu/mui/Stack';

import FormInputClassic from '@material-hu/components/design-system/Inputs/Classic/form';
import FormInputSelect from '@material-hu/components/design-system/Inputs/Select/form';

const FREQUENCY_OPTIONS = [
  { label: 'Diario', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Sin frecuencia', value: 'none' },
];

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(100),
  area: z.string().min(1, 'Requerido').max(50),
  frequency: z.enum(['daily', 'weekly', 'none']),
});

export type ProcessFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: ProcessFormValues;
  onSubmit: (data: ProcessFormValues) => void;
};

const ProcessForm = ({ defaultValues, onSubmit }: Props) => {
  const methods = useForm<ProcessFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: '', area: '', frequency: 'daily' },
  });
  return (
    <FormProvider {...methods}>
      <form
        id="process-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Stack sx={{ gap: 2 }}>
          <FormInputClassic
            name="name"
            inputProps={{
              label: 'Nombre del proceso',
              placeholder: 'Ej: Apertura de local',
              maxLength: 100,
              hasCounter: true,
            }}
          />
          <FormInputClassic
            name="area"
            inputProps={{
              label: 'Área',
              placeholder: 'Ej: Operaciones',
              maxLength: 50,
            }}
          />
          <FormInputSelect
            name="frequency"
            inputProps={{
              label: 'Frecuencia',
              options: FREQUENCY_OPTIONS,
            }}
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export default ProcessForm;
