import { useState } from 'react';

import {
  IconChecklist,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Button from '@material-hu/components/design-system/Buttons/Button';
import CardContainer from '@material-hu/components/design-system/CardContainer';
import { useDialogLayer } from '@material-hu/components/layers/Dialogs';
import { useDrawerLayer } from '@material-hu/components/layers/Drawers';
import { useMenuLayer } from '@material-hu/components/layers/Menus';

import { type Task } from '../../../Detail/types';
import { addTask, getProcessList, removeTask, updateTask } from '../../store';
import TaskForm, { type TaskFormValues } from '../TaskForm';

type Props = {
  processId: string;
};

const ProcessTasksDrawerContent = ({ processId }: Props) => {
  const { openDrawer, closeDrawer } = useDrawerLayer();
  const { openDialog, closeDialog } = useDialogLayer();
  const { openMenu } = useMenuLayer();

  const getTasks = () =>
    getProcessList().find(p => p.id === processId)?.tasks ?? [];

  const [tasks, setTasks] = useState<Task[]>(() => getTasks());

  const refresh = () => setTasks([...getTasks()]);

  const handleCreate = () => {
    openDrawer({
      title: 'Nueva tarea',
      size: 'medium',
      children: (
        <TaskForm
          onSubmit={(data: TaskFormValues) => {
            addTask(processId, data.name);
            refresh();
            closeDrawer();
          }}
        />
      ),
      primaryButtonProps: {
        children: 'Crear',
        form: 'task-form',
        type: 'submit',
      },
      secondaryButtonProps: {
        children: 'Cancelar',
        onClick: () => closeDrawer(),
      },
    });
  };

  const handleEdit = (task: Task) => {
    openDrawer({
      title: 'Editar tarea',
      size: 'medium',
      children: (
        <TaskForm
          defaultValues={{ name: task.name }}
          onSubmit={(data: TaskFormValues) => {
            updateTask(processId, task.id, data.name);
            refresh();
            closeDrawer();
          }}
        />
      ),
      primaryButtonProps: {
        children: 'Guardar',
        form: 'task-form',
        type: 'submit',
      },
      secondaryButtonProps: {
        children: 'Cancelar',
        onClick: () => closeDrawer(),
      },
    });
  };

  const handleDelete = (task: Task) => {
    openDialog({
      title: '¿Eliminar tarea?',
      textBody: `Se eliminará "${task.name}" de forma permanente.`,
      primaryButtonProps: {
        children: 'Eliminar',
        color: 'error',
        onClick: () => {
          removeTask(processId, task.id);
          refresh();
          closeDialog();
        },
      },
      secondaryButtonProps: {
        children: 'Cancelar',
        onClick: () => closeDialog(),
      },
    });
  };

  const handleMenu = (e: React.MouseEvent<HTMLElement>, task: Task) => {
    openMenu({
      anchorEl: e.currentTarget,
      items: [
        {
          id: 'edit',
          title: 'Editar',
          icon: IconEdit,
          onSelect: () => handleEdit(task),
        },
        {
          id: 'delete',
          title: 'Eliminar',
          icon: IconTrash,
          onSelect: () => handleDelete(task),
        },
      ],
    });
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Button
        variant="primary"
        startIcon={<IconPlus size={20} />}
        onClick={handleCreate}
      >
        Nueva tarea
      </Button>
      {tasks.length === 0 ? (
        <StateCard
          slotProps={{
            title: {
              title: 'Sin tareas',
              description: 'Agregá la primera usando el botón de arriba',
              variant: 'M',
            },
            avatar: { Icon: IconChecklist, color: 'default' },
          }}
        />
      ) : (
        <Stack sx={{ gap: 1.5 }}>
          {tasks.map(task => (
            <CardContainer
              key={task.id}
              fullWidth
              padding={16}
              hasShadow
              noHover
            >
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600 }}
                >
                  {task.name}
                </Typography>
                <IconButton
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleMenu(e, task)
                  }
                >
                  <IconDotsVertical size={20} />
                </IconButton>
              </Stack>
            </CardContainer>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ProcessTasksDrawerContent;
