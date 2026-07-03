import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IconChartBar,
  IconClipboardList,
  IconSettings,
} from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Button from '@material-hu/components/design-system/Buttons/Button';
import Switcher from '@material-hu/components/design-system/Switcher';
import Title from '@material-hu/components/design-system/Title';

import ProcessCard from './components/ProcessCard';
import { getProcessList } from './Management/store';
import { useProcesses } from "./useProcesses";

const ProcessesPage = () => {
    const { data: processesData = [] } = useProcesses();
  const navigate = useNavigate();
  const [isManagerMode, setIsManagerMode] = useState(false);

  const processes = processesData.map(process => {
    const managed = getProcessList().find(p => p.id === process.id);
    return managed ? { ...process, totalTasks: managed.tasks.length } : process;
  });

  return (
    <Stack sx={{ p: 2, gap: 2 }}>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title
          title="Procesos del día"
          variant="L"
        />
        <Switcher
          title="Encargado"
          value={isManagerMode}
          onChange={setIsManagerMode}
          sx={{ width: 'auto' }}
        />
      </Stack>
      {isManagerMode && (
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <Button
            variant="secondary"
            size="large"
            startIcon={<IconChartBar size={20} />}
            onClick={() => navigate('/procesos/cumplimiento')}
            sx={{ flex: 1 }}
          >
            Cumplimiento
          </Button>
          <Button
            variant="secondary"
            size="large"
            startIcon={<IconSettings size={20} />}
            onClick={() => navigate('/procesos/gestion')}
            sx={{ flex: 1 }}
          >
            Configurar
          </Button>
        </Stack>
      )}
      {processes.length === 0 ? (
        <StateCard
          slotProps={{
            title: {
              title: 'Sin procesos para hoy',
              description: 'No tenés procesos asignados para el día de hoy',
              variant: 'M',
            },
            avatar: {
              Icon: IconClipboardList,
              color: 'default',
            },
          }}
        />
      ) : (
        <Stack sx={{ gap: 1.5 }}>
          {processes.map(process => (
            <ProcessCard
              key={process.id}
              process={process}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ProcessesPage;
