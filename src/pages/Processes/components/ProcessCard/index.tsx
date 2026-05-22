import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import CardContainer from '@material-hu/components/design-system/CardContainer';
import Pills from '@material-hu/components/design-system/Pills';
import ProgressBar from '@material-hu/components/design-system/ProgressIndicators/ProgressBar';

import { STATUS_CONFIG } from '../../constants';
import { type DailyProcess } from '../../types';

type Props = { process: DailyProcess; onClick: () => void };

const ProcessCard = ({ process, onClick }: Props) => {
  const { label, type } = STATUS_CONFIG[process.status];
  return (
    <CardContainer
      fullWidth
      onClick={onClick}
      padding={16}
      hasShadow
    >
      <Stack sx={{ gap: 1.5 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Stack sx={{ gap: 0.25, flex: 1 }}>
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
          <Pills
            label={label}
            type={type}
            size="small"
          />
        </Stack>
        <ProgressBar
          variant="determinate"
          current={process.completedTasks}
          total={process.totalTasks}
          description={`${process.completedTasks} de ${process.totalTasks} tareas`}
          hasPercentage
          decimalPrecision={0}
        />
      </Stack>
    </CardContainer>
  );
};

export default ProcessCard;
