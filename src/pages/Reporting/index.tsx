import { useState } from 'react';

import * as XLSX from 'xlsx';

import { IconDownload } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Pills from '@material-hu/components/design-system/Pills';
import Title from '@material-hu/components/design-system/Title';

import { useBranch } from '../../contexts/BranchContext';
import { MOCK_TASKS } from '../Processes/Detail/constants';
import { getShiftCompletions } from '../Processes/Detail/store';
import { type TaskShift } from '../Processes/Detail/types';
import { useBranches } from "../Processes/useBranches";
import { useProcesses } from "../Processes/useProcesses";
import { useEmployees } from "../Processes/useEmployees";

const SHIFTS: TaskShift[] = ['morning', 'afternoon', 'night'];
const SHIFT_LABEL: Record<TaskShift, string> = {
  morning: 'Mañana',
  afternoon: 'Tarde',
  night: 'Noche',
};

const getLast7Days = (): string[] => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

const ReportingPage = () => {
    const { data: employees = [] } = useEmployees();
    const { data: processes = [] } = useProcesses();
    const { data: branches = [] } = useBranches();
  const { branchId } = useBranch();
  const [processId, setProcessId] = useState(processes[0]?.id ?? '1');
  const [shiftFilter, setShiftFilter] = useState<TaskShift | 'all'>('all');

  const days = getLast7Days();
  const tasks = MOCK_TASKS[processId] ?? [];
  const shifts = shiftFilter === 'all' ? SHIFTS : [shiftFilter];

  // Build data: for each employee, for each task, count completions across last 7 days
  const employeeRows = employees.map(emp => {
    const taskCounts = tasks.map(task => {
      let completed = 0;
      let total = 0;
      for (const day of days) {
        for (const s of shifts) {
          const completions = getShiftCompletions(branchId, processId, day, s);
          total++;
          if (completions[task.id]?.completedBy === emp.name) completed++;
        }
      }
      return { completed, total };
    });
    const totalCompleted = taskCounts.reduce((acc, c) => acc + c.completed, 0);
    return { emp, taskCounts, totalCompleted };
  });

  // Build task summary: % completed across all employees + days
  const taskSummary = tasks.map(task => {
    let completed = 0;
    let total = 0;
    for (const day of days) {
      for (const s of shifts) {
        const completions = getShiftCompletions(branchId, processId, day, s);
        total++;
        if (completions[task.id]?.completed) completed++;
      }
    }
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { task, completed, total, pct };
  });

  const exportExcel = () => {
    const rows = employeeRows.flatMap(({ emp, taskCounts }) =>
      tasks.map((task, ti) => ({
        Sucursal: branches.find(b => b.id === branchId)?.name ?? branchId,
        Proceso: processes.find(p => p.id === processId)?.name ?? processId,
        Turno: shiftFilter === 'all' ? 'Todos' : SHIFT_LABEL[shiftFilter],
        Empleado: emp.name,
        Área: emp.area,
        Tarea: task.name,
        'Veces completada': taskCounts[ti].completed,
        'Total registros': taskCounts[ti].total,
        '% completado': taskCounts[ti].total > 0
          ? `${Math.round((taskCounts[ti].completed / taskCounts[ti].total) * 100)}%`
          : '0%',
      })),
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `reporte_${branchId}_${processId}.xlsx`);
  };

  const branch = branches.find(b => b.id === branchId);

  return (
    <Stack sx={{ gap: 3 }}>
      {/* Header */}
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <Stack sx={{ flex: 1 }}>
          <Title title="Reportería" variant="L" />
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Últimos 7 días · {branch?.name}
          </Typography>
        </Stack>
        <IconButton onClick={exportExcel} title="Descargar Excel">
          <IconDownload size={20} />
        </IconButton>
      </Stack>

      {/* Filters */}
      <Stack sx={{ gap: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Proceso
        </Typography>
        <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          {processes.map(p => (
            <Pills
              key={p.id}
              label={p.name}
              type={processId === p.id ? 'highlight' : 'neutral'}
              size="small"
              onClick={() => setProcessId(p.id)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mt: 0.5 }}>
          Turno
        </Typography>
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          {(['all', ...SHIFTS] as const).map(s => (
            <Pills
              key={s}
              label={s === 'all' ? 'Todos' : SHIFT_LABEL[s]}
              type={shiftFilter === s ? 'highlight' : 'neutral'}
              size="small"
              onClick={() => setShiftFilter(s)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>
      </Stack>

      {/* Task completion summary */}
      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Cumplimiento por tarea
        </Typography>
        <Stack sx={{ gap: 0.75 }}>
          {taskSummary.map(({ task, completed, total, pct }) => (
            <Stack
              key={task.id}
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                px: 2,
                py: 1.25,
              }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {task.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 60, textAlign: 'right' }}>
                {completed}/{total}
              </Typography>
              <Stack
                sx={{
                  minWidth: 48,
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor:
                    pct >= 80
                      ? 'success.light'
                      : pct >= 50
                        ? 'warning.light'
                        : 'error.light',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color:
                      pct >= 80
                        ? 'success.dark'
                        : pct >= 50
                          ? 'warning.dark'
                          : 'error.dark',
                  }}
                >
                  {pct}%
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* People × tasks table */}
      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Personas × tareas
        </Typography>
        <Stack sx={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 500 }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Empleado
                </th>
                {tasks.map(task => (
                  <th
                    key={task.id}
                    style={{
                      padding: '8px 8px',
                      fontSize: 11,
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb',
                      maxWidth: 90,
                      verticalAlign: 'bottom',
                    }}
                  >
                    <div
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        whiteSpace: 'nowrap',
                        maxHeight: 100,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.name}
                    </div>
                  </th>
                ))}
                <th
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeRows.map(({ emp, taskCounts, totalCompleted }) => (
                <tr key={emp.id}>
                  <td
                    style={{
                      padding: '8px 12px',
                      fontSize: 13,
                      borderBottom: '1px solid #f3f4f6',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{emp.area}</div>
                  </td>
                  {taskCounts.map((count, ti) => (
                    <td
                      key={ti}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        borderBottom: '1px solid #f3f4f6',
                        fontSize: 12,
                        color: count.completed > 0 ? '#16a34a' : '#9ca3af',
                        fontWeight: count.completed > 0 ? 600 : 400,
                      }}
                    >
                      {count.completed > 0 ? count.completed : '—'}
                    </td>
                  ))}
                  <td
                    style={{
                      padding: '8px 12px',
                      textAlign: 'right',
                      borderBottom: '1px solid #f3f4f6',
                      fontSize: 13,
                      fontWeight: 600,
                      color: totalCompleted > 0 ? '#111827' : '#9ca3af',
                    }}
                  >
                    {totalCompleted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ReportingPage;
