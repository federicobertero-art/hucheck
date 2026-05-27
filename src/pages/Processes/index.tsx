import { IconClipboardList } from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Title from '@material-hu/components/design-system/Title';

import ProcessCard from './components/ProcessCard';
import { MOCK_PROCESSES } from './constants';

const ProcessesPage = () => (
  <Stack sx={{ p: 2, gap: 2 }}>
    <Title
      title="Procesos del día"
      variant="L"
    />
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

export default ProcessesPage;
