import { useNavigate } from 'react-router-dom';

import { IconArrowLeft } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Pills from '@material-hu/components/design-system/Pills';
import ProgressBar from '@material-hu/components/design-system/ProgressIndicators/ProgressBar';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';
import Title from '@material-hu/components/design-system/Title';

import { MOCK_PROCESSES, STATUS_CONFIG } from '../constants';
import { getTasksForProcess } from '../Detail/store';

const CompliancePage = () => {
  const navigate = useNavigate();
  return (
    <Stack sx={{ p: 2, gap: 2 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/procesos')}>
          <IconArrowLeft size={20} />
        </IconButton>
        <Title
          title="Cumplimiento del día"
          variant="L"
        />
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow headerRow>
              <TableCell headerCell>Proceso</TableCell>
              <TableCell headerCell>Progreso</TableCell>
              <TableCell headerCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_PROCESSES.map(process => {
              const tasks = getTasksForProcess(process.id);
              const completed = tasks.filter(t => t.completed).length;
              const total = tasks.length;
              const { label, type } = STATUS_CONFIG[process.status];
              return (
                <TableRow key={process.id}>
                  <TableCell>
                    <Stack sx={{ gap: 0.25 }}>
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
                        {process.area}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <ProgressBar
                      variant="determinate"
                      current={completed}
                      total={total}
                      description={`${completed}/${total}`}
                      hasPercentage
                      decimalPrecision={0}
                    />
                  </TableCell>
                  <TableCell>
                    <Pills
                      label={label}
                      type={type}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default CompliancePage;
