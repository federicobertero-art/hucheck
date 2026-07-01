import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import {
  IconArrowLeft,
  IconCamera,
  IconChevronLeft,
  IconChevronRight,
  IconMessage,
  IconUserPlus,
  IconX,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Checkbox from '@material-hu/components/design-system/Checkbox/Checkbox';
import ProgressBar from '@material-hu/components/design-system/ProgressIndicators/ProgressBar';
import Tabs from '@material-hu/components/design-system/Tabs';
import Title from '@material-hu/components/design-system/Title';
import { useDrawerLayer } from '@material-hu/components/layers/Drawers';

import { useBranch } from '../../../contexts/BranchContext';
import { MOCK_PROCESSES } from '../constants';
import { MOCK_EMPLOYEES, type Employee } from '../employees';

import {
  getShiftCompletions,
  getTaskTemplate,
  toggleTaskCompletion,
  updateEntryImage,
  updateEntryNotes,
  updateTaskAssignees,
} from './store';
import { type TaskShift } from './types';

type AssignPickerProps = {
  initial: string[];
  onChange: (ids: string[]) => void;
};

const AssignPicker = ({ initial, onChange }: AssignPickerProps) => {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = (emp: Employee) => {
    const next = selected.includes(emp.id)
      ? selected.filter(s => s !== emp.id)
      : [...selected, emp.id];
    setSelected(next);
    onChange(next);
  };
  return (
    <Stack sx={{ gap: 1 }}>
      {MOCK_EMPLOYEES.map(emp => (
        <Checkbox
          key={emp.id}
          label={`${emp.name} · ${emp.area}`}
          checked={selected.includes(emp.id)}
          onChange={() => toggle(emp)}
        />
      ))}
    </Stack>
  );
};

const SHIFT_TABS = [
  { label: 'Mañana', value: 'morning' },
  { label: 'Tarde', value: 'afternoon' },
  { label: 'Noche', value: 'night' },
];

const todayStr = new Date().toISOString().slice(0, 10);

const shiftDate = (dateStr: string, delta: number): string => {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
};

const CURRENT_USER = 'Federico B.';

const ProcessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openDrawer, closeDrawer } = useDrawerLayer();
  const { branchId } = useBranch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetTaskId = useRef<string | null>(null);

  const process = MOCK_PROCESSES.find(p => p.id === id);

  const [currentDateStr, setCurrentDateStr] = useState(todayStr);
  const [shift, setShift] = useState<TaskShift>('morning');
  const [tick, setTick] = useState(0);
  const [editingNoteFor, setEditingNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  if (!process) return <Navigate to="/procesos" />;

  const tasks = getTaskTemplate(id ?? '');
  const completions = getShiftCompletions(branchId, id ?? '', currentDateStr, shift);
  const completedCount = tasks.filter(t => completions[t.id]?.completed).length;
  const isPastDay = currentDateStr < todayStr;

  const refresh = () => setTick(t => t + 1);

  const handleToggle = (taskId: string) => {
    if (isPastDay) return;
    toggleTaskCompletion(branchId, id ?? '', currentDateStr, shift, taskId, CURRENT_USER);
    refresh();
  };

  const openNoteEditor = (taskId: string) => {
    setEditingNoteFor(taskId);
    setNoteText(completions[taskId]?.notes ?? '');
  };

  const saveNote = (taskId: string) => {
    updateEntryNotes(branchId, id ?? '', currentDateStr, shift, taskId, noteText);
    setEditingNoteFor(null);
    refresh();
  };

  const openImagePicker = (taskId: string) => {
    targetTaskId.current = taskId;
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetTaskId.current) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateEntryImage(
        branchId,
        id ?? '',
        currentDateStr,
        shift,
        targetTaskId.current!,
        reader.result as string,
      );
      refresh();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImage = (taskId: string) => {
    updateEntryImage(branchId, id ?? '', currentDateStr, shift, taskId, undefined);
    refresh();
  };

  const pendingAssignees = useRef<string[]>([]);

  const openAssignDrawer = (task: { id: string; assignedTo: string[] }) => {
    pendingAssignees.current = [...task.assignedTo];
    openDrawer({
      title: 'Asignar personas',
      size: 'medium',
      children: (
        <AssignPicker
          initial={task.assignedTo}
          onChange={ids => {
            pendingAssignees.current = ids;
          }}
        />
      ),
      primaryButtonProps: {
        children: 'Guardar',
        onClick: () => {
          updateTaskAssignees(id ?? '', task.id, pendingAssignees.current);
          closeDrawer();
          refresh();
        },
      },
      secondaryButtonProps: {
        children: 'Cancelar',
        onClick: () => closeDrawer(),
      },
    });
  };

  const getAssigneeNames = (assignedTo: string[]) =>
    assignedTo
      .map(eid => MOCK_EMPLOYEES.find(e => e.id === eid)?.name)
      .filter(Boolean)
      .join(', ');

  return (
    <Stack sx={{ p: 2, gap: 2 }}>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      {/* Header */}
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/procesos')}>
          <IconArrowLeft size={20} />
        </IconButton>
        <Title title={process.name} variant="L" />
      </Stack>

      {/* Date navigation */}
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <IconButton onClick={() => setCurrentDateStr(d => shiftDate(d, -1))}>
          <IconChevronLeft size={20} />
        </IconButton>
        <input
          type="date"
          value={currentDateStr}
          max={todayStr}
          onChange={e => e.target.value && setCurrentDateStr(e.target.value)}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            outline: 'none',
            background: 'transparent',
          }}
        />
        <IconButton
          onClick={() => setCurrentDateStr(d => shiftDate(d, 1))}
          disabled={currentDateStr >= todayStr}
        >
          <IconChevronRight size={20} />
        </IconButton>
      </Stack>

      {/* Progress */}
      <ProgressBar
        variant="determinate"
        current={completedCount}
        total={tasks.length || 1}
        description={`${completedCount} de ${tasks.length} tareas completadas`}
        hasPercentage
        decimalPrecision={0}
      />

      {/* Shift tabs */}
      <Tabs
        tabs={SHIFT_TABS}
        value={shift}
        onTabChange={value => setShift(value as TaskShift)}
      />

      {/* Past-day notice */}
      {isPastDay && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          Vista de solo lectura — día pasado.
        </Typography>
      )}

      {/* Task list */}
      <Stack sx={{ gap: 1 }}>
        {tasks.map(task => {
          const entry = completions[task.id];
          const isChecked = entry?.completed ?? false;
          const taskNotes = entry?.notes;
          const taskImage = entry?.imageBase64;

          return (
            <Stack key={task.id}>
              <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  label={task.name}
                  checked={isChecked}
                  onChange={() => handleToggle(task.id)}
                  sx={{ flex: 1 }}
                  disabled={isPastDay}
                />
                <IconButton
                  size="small"
                  onClick={() => openAssignDrawer(task)}
                  sx={{
                    color: task.assignedTo.length > 0 ? 'primary.main' : 'text.disabled',
                  }}
                >
                  <IconUserPlus size={18} />
                </IconButton>
                {!isPastDay && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => openNoteEditor(task.id)}
                      sx={{ color: taskNotes ? 'primary.main' : 'text.disabled' }}
                    >
                      <IconMessage size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openImagePicker(task.id)}
                      sx={{ color: taskImage ? 'primary.main' : 'text.disabled' }}
                    >
                      <IconCamera size={18} />
                    </IconButton>
                  </>
                )}
              </Stack>

              {task.assignedTo.length > 0 && editingNoteFor !== task.id && (
                <Typography variant="caption" sx={{ color: 'text.secondary', pl: 4 }}>
                  {getAssigneeNames(task.assignedTo)}
                </Typography>
              )}

              {taskNotes && editingNoteFor !== task.id && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', pl: 4, fontStyle: 'italic', pb: 0.5 }}
                >
                  "{taskNotes}"
                </Typography>
              )}

              {editingNoteFor === task.id && (
                <Stack sx={{ pl: 4, pt: 0.5, pb: 1 }}>
                  <textarea
                    rows={2}
                    placeholder="Agregar nota..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onBlur={() => saveNote(task.id)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      resize: 'none',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </Stack>
              )}

              {taskImage && (
                <Stack sx={{ pl: 4, pt: 0.5, pb: 1, position: 'relative', display: 'inline-flex', width: 'fit-content' }}>
                  <img
                    src={taskImage}
                    alt="Evidencia"
                    style={{
                      maxWidth: 160,
                      maxHeight: 120,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '1px solid #e0e0e0',
                    }}
                  />
                  {!isPastDay && (
                    <IconButton
                      size="small"
                      onClick={() => removeImage(task.id)}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        bgcolor: 'rgba(0,0,0,0.45)',
                        color: '#fff',
                        width: 20,
                        height: 20,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
                      }}
                    >
                      <IconX size={12} />
                    </IconButton>
                  )}
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ProcessDetail;
