import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import * as XLSX from 'xlsx';

import {
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconMoon,
  IconSun,
  IconSunrise,
  IconX,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Pills from '@material-hu/components/design-system/Pills';
import ProgressBar from '@material-hu/components/design-system/ProgressIndicators/ProgressBar';
import Title from '@material-hu/components/design-system/Title';

import { type TaskShift } from '../Detail/types';
import { getProcessList } from '../Management/store';

import { generateHistory, PERIOD_LABEL } from './constants';

const SHIFT_ICON: Record<TaskShift, React.ElementType> = {
  morning: IconSunrise,
  afternoon: IconSun,
  night: IconMoon,
};

const SHIFT_LABEL: Record<TaskShift, string> = {
  morning: 'Mañana',
  afternoon: 'Tarde',
  night: 'Noche',
};

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

  const exportExcel = () => {
    const rows = entries.flatMap(entry =>
      entry.tasks.map(task => ({
        Fecha: entry.label,
        'Período completado': entry.completed ? 'Sí' : 'No',
        Tarea: task.name,
        Turno: task.shift ? SHIFT_LABEL[task.shift] : '',
        'Tarea completada': task.completed ? 'Sí' : 'No',
        'Completado por': task.completedBy ?? '',
        Notas: task.notes ?? '',
      })),
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cumplimiento');
    XLSX.writeFile(wb, `${process.name}_cumplimiento.xlsx`);
  };

  return (
    <Stack sx={{ p: 3, gap: 3 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/procesos/cumplimiento')}>
          <IconArrowLeft size={20} />
        </IconButton>
        <Stack sx={{ flex: 1 }}>
          <Title
            title={process.name}
            variant="L"
          />
        </Stack>
        <IconButton onClick={exportExcel}>
          <IconDownload size={20} />
        </IconButton>
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
                  {entry.tasks.map(task => {
                    const ShiftIcon = task.shift ? SHIFT_ICON[task.shift] : null;
                    return (
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
                        <Stack sx={{ flex: 1, gap: 0.25 }}>
                          <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.75 }}>
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
                            {ShiftIcon && (
                              <Stack
                                component="span"
                                title={SHIFT_LABEL[task.shift!]}
                                sx={{ color: 'text.disabled', lineHeight: 0 }}
                              >
                                <ShiftIcon size={13} />
                              </Stack>
                            )}
                          </Stack>
                          {task.completedBy && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary' }}
                            >
                              {task.completedBy}
                            </Typography>
                          )}
                          {task.notes && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                            >
                              "{task.notes}"
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    );
                  })}
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
