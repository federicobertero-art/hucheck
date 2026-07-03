import { useNavigate } from 'react-router-dom';

import { IconArrowLeft, IconChevronRight } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Title from '@material-hu/components/design-system/Title';
import { useProcesses } from "../useProcesses";

const FREQUENCY_LABEL: Record<string, string> = {
  daily: 'Diario',
  weekly: 'Semanal',
  none: 'Sin frecuencia',
};

const CompliancePage = () => {
    const { data: processes = [] } = useProcesses();
  const navigate = useNavigate();
  return (
    <Stack sx={{ p: 3, gap: 3 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/procesos')}>
          <IconArrowLeft size={20} />
        </IconButton>
        <Title
          title="Cumplimiento"
          variant="L"
        />
      </Stack>
      <Stack sx={{ gap: 1.5 }}>
        {processes.map(process => (
          <Stack
            key={process.id}
            onClick={() => navigate(`/procesos/cumplimiento/${process.id}`)}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2.5,
                py: 2,
                gap: 2,
              }}
            >
              <Stack sx={{ gap: 0.5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600 }}
                >
                  {process.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  {process.area} · {FREQUENCY_LABEL[process.frequency]}
                </Typography>
              </Stack>
              <IconChevronRight size={20} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default CompliancePage;
