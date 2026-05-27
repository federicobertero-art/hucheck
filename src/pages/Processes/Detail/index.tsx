import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { IconArrowLeft } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';

import Checkbox from '@material-hu/components/design-system/Checkbox/Checkbox';
import ProgressBar from '@material-hu/components/design-system/ProgressIndicators/ProgressBar';
import Title from '@material-hu/components/design-system/Title';

import { MOCK_PROCESSES } from '../constants';

import { getTasksForProcess, toggleTaskInStore } from './store';
import { type Task } from './types';

const ProcessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const process = MOCK_PROCESSES.find(p => p.id === id);
  const [tasks, setTasks] = useState<Task[]>(() => getTasksForProcess(id ?? ''));

  if (!process) return <Navigate to="/procesos" />;

  const completedCount = tasks.filter(t => t.completed).length;

  const toggleTask = (taskId: string) => {
    toggleTaskInStore(id ?? '', taskId);
    setTasks([...getTasksForProcess(id ?? '')]);
  };

  return (
    <Stack sx={{ p: 2, gap: 2 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/procesos')}>
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
        total={tasks.length}
        description={`${completedCount} de ${tasks.length} tareas completadas`}
        hasPercentage
        decimalPrecision={0}
      />
      <Stack sx={{ gap: 0.5 }}>
        {tasks.map(task => (
          <Checkbox
            key={task.id}
            label={task.name}
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default ProcessDetail;
