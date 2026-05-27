import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stack from '@material-hu/mui/Stack';

import FormInputClassic from '@material-hu/components/design-system/Inputs/Classic/form';

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(100),
  area: z.string().min(1, 'Requerido').max(50),
});

export type ProcessFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: ProcessFormValues;
  onSubmit: (data: ProcessFormValues) => void;
};

const ProcessForm = ({ defaultValues, onSubmit }: Props) => {
  const methods = useForm<ProcessFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: '', area: '' },
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
        </Stack>
      </form>
    </FormProvider>
  );
};

export default ProcessForm;
