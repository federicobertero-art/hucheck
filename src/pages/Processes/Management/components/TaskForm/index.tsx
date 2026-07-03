import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stack from '@material-hu/mui/Stack';

import FormInputClassic from '@material-hu/components/design-system/Inputs/Classic/form';

const schema = z.object({
  name: z.string().min(1, 'Requerido').max(100),
});

export type TaskFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: TaskFormValues;
  onSubmit: (data: TaskFormValues) => void;
};

const TaskForm = ({ defaultValues, onSubmit }: Props) => {
  const methods = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: '' },
  });
  return (
    <FormProvider {...methods}>
      <form
        id="task-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Stack sx={{ gap: 2 }}>
          <FormInputClassic
            name="name"
            inputProps={{
              label: 'Nombre de la tarea',
              placeholder: 'Ej: Verificar iluminación del local',
              maxLength: 100,
              hasCounter: true,
            }}
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export default TaskForm;
