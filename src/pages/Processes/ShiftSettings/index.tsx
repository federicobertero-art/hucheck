import { useNavigate } from 'react-router-dom';

import { IconArrowLeft } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';

import Button from '@material-hu/components/design-system/Buttons/Button';
import Title from '@material-hu/components/design-system/Title';

import { useBranch } from '../../../contexts/BranchContext';
import { useShiftSchedules } from '../useShiftSchedules';

import ShiftScheduleForm from './components/ShiftScheduleForm';
import { useUpdateShiftScheduleMutation } from './hooks/useUpdateShiftScheduleMutation';
import { timeStringToDate } from './utils';

const ShiftSettingsPage = () => {
  const navigate = useNavigate();
  const { branchId } = useBranch();
  const { data: schedules = [] } = useShiftSchedules();
  const updateShiftSchedule = useUpdateShiftScheduleMutation();

  const schedule = schedules.find(s => s.branchId === branchId);

  return (
    <Stack sx={{ p: 2, gap: 2 }}>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/procesos/gestion')}>
            <IconArrowLeft size={20} />
          </IconButton>
          <Title
            title="Configuración de turnos"
            description="Definí el rango horario de cada turno para la sucursal seleccionada."
            variant="L"
          />
        </Stack>
        <Button
          variant="primary"
          size="large"
          type="submit"
          form="shift-schedule-form"
        >
          Guardar cambios
        </Button>
      </Stack>
      {schedule && (
        <ShiftScheduleForm
          values={{
            morningStart: timeStringToDate(schedule.morningStart),
            morningEnd: timeStringToDate(schedule.morningEnd),
            afternoonStart: timeStringToDate(schedule.afternoonStart),
            afternoonEnd: timeStringToDate(schedule.afternoonEnd),
            nightStart: timeStringToDate(schedule.nightStart),
            nightEnd: timeStringToDate(schedule.nightEnd),
          }}
          onSubmit={data =>
            updateShiftSchedule.mutate({ id: schedule.id, values: data })
          }
        />
      )}
    </Stack>
  );
};

export default ShiftSettingsPage;
