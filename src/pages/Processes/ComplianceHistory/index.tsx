import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import {
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconX,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Pills from '@material-hu/components/design-system/Pills';
import ProgressBar from '@material-hu/components/design-system/ProgressIndicators/ProgressBar';
import Title from '@material-hu/components/design-system/Title';

import { getProcessList } from '../Management/store';

import { generateHistory, PERIOD_LABEL } from './constants';

const ComplianceHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const process = getProcessList().find(p => p.id === id);
  if (!process) return <Navigate to="/procesos/cumplimiento" />;

  const entries = generateHistory(id ?? '', process.frequency);
  const completedCount = entries.filter(e => e.completed).length;
  const total = entries.length;
  const periodLabel = PERIOD_LABEL[process.frequency];

  return (
    <Stack sx={{ p: 3, gap: 3 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/procesos/cumplimiento')}>
          <IconArrowLeft size={20} />
        </IconButton>
        <Title
          title={process.name}
          variant="L"
        />
      </Stack>

      <ProgressBar
        variant="determinate"
        current={completedCount}
        total={total}
        description={`${completedCount} de ${total} ${periodLabel} completados`}
        hasPercentage
        decimalPrecision={0}
      />

      <Stack sx={{ gap: 1.5 }}>
        {entries.map(entry => {
          const isExpanded = expandedId === entry.id;
          return (
            <Stack
              key={entry.id}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden',
              }}
            >
              {/* Accent bar */}
              <Stack
                sx={{
                  height: 4,
                  bgcolor: entry.completed
                    ? 'success.light'
                    : 'action.disabledBackground',
                }}
              />

              {/* Header row */}
              <Stack
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2.5,
                  py: 2,
                  cursor: 'pointer',
                  gap: 2,
                }}
              >
                <Stack sx={{ gap: 0.5, flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                  >
                    {entry.label}
                  </Typography>
                  {entry.completedBy.length > 0 && (
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {entry.completedBy.join(' · ')}
                    </Typography>
                  )}
                </Stack>
                <Stack
                  sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}
                >
                  <Pills
                    label={entry.completed ? 'Completado' : 'Incompleto'}
                    type={entry.completed ? 'success' : 'neutral'}
                    size="small"
                  />
                  {isExpanded ? (
                    <IconChevronUp size={18} />
                  ) : (
                    <IconChevronDown size={18} />
                  )}
                </Stack>
              </Stack>

              {/* Expanded task list */}
              {isExpanded && (
                <Stack
                  sx={{
                    px: 2.5,
                    pb: 2,
                    pt: 0.5,
                    gap: 1.25,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {entry.tasks.map(task => (
                    <Stack
                      key={task.id}
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        pt: 1,
                      }}
                    >
                      <Stack sx={{ pt: 0.25, flexShrink: 0 }}>
                        {task.completed ? (
                          <IconCheck
                            size={18}
                            style={{ color: '#22c55e' }}
                          />
                        ) : (
                          <IconX
                            size={18}
                            style={{ color: '#9ca3af' }}
                          />
                        )}
                      </Stack>
                      <Stack sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: task.completed
                              ? 'text.primary'
                              : 'text.secondary',
                          }}
                        >
                          {task.name}
                        </Typography>
                        {task.completedBy && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary' }}
                          >
                            {task.completedBy}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ComplianceHistoryPage;
