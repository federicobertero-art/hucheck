import { useMutation, useQueryClient } from '@tanstack/react-query';

import useSnackbar from '@material-hu/components/design-system/Snackbar';

import { provider } from '../../data/provider';
import { type Employee } from '../Processes/employees';

type UpdateEmployeeBranchInput = {
  id: string;
  branchId: string;
};

/** Saves an employee's assigned branch. */
export const useUpdateEmployeeBranchMutation = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, branchId }: UpdateEmployeeBranchInput) =>
      provider.update<Employee>('employees', id, { branchId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      enqueueSnackbar({ variant: 'success', title: 'Sucursal actualizada' });
    },
    onError: () => {
      enqueueSnackbar({
        variant: 'error',
        title: 'No pudimos guardar el cambio. Intentá de nuevo.',
      });
    },
  });
};
