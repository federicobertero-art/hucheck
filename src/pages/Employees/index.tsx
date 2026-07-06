import { IconUsers } from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';

import StateCard from '@material-hu/components/composed-components/StateCard';
import InputSelect from '@material-hu/components/design-system/Inputs/Select';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';
import Title from '@material-hu/components/design-system/Title';

import { useBranches } from '../Processes/useBranches';
import { useEmployees } from '../Processes/useEmployees';

import { useUpdateEmployeeBranchMutation } from './useUpdateEmployeeBranchMutation';

const EmployeesPage = () => {
  const { data: employees = [] } = useEmployees();
  const { data: branches = [] } = useBranches();
  const updateEmployeeBranch = useUpdateEmployeeBranchMutation();

  const branchOptions = branches.map(branch => ({
    label: branch.name,
    value: branch.id,
  }));

  return (
    <Stack sx={{ gap: 3 }}>
      <Title
        title="Empleados"
        description="Asigná o reasigná la sucursal de cada empleado."
        variant="L"
      />
      {employees.length === 0 ? (
        <StateCard
          slotProps={{
            title: {
              title: 'Sin empleados',
              description: 'Todavía no hay empleados registrados',
              variant: 'M',
            },
            avatar: { Icon: IconUsers, color: 'default' },
          }}
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow headerRow>
                <TableCell headerCell>Nombre</TableCell>
                <TableCell headerCell>Área</TableCell>
                <TableCell headerCell>Sucursal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.area}</TableCell>
                  <TableCell>
                    <InputSelect
                      value={employee.branchId}
                      options={branchOptions}
                      onChange={branchId =>
                        updateEmployeeBranch.mutate({
                          id: employee.id,
                          branchId,
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default EmployeesPage;
