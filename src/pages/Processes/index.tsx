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
import { MOCK_PROCESSES } from './constants';

const ProcessesPage = () => {
  const navigate = useNavigate();
  const [isManagerMode, setIsManagerMode] = useState(false);

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
      {MOCK_PROCESSES.length === 0 ? (
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
          {MOCK_PROCESSES.map(process => (
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
