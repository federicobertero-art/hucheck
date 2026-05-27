import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IconArrowLeft,
  IconClipboardList,
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
import Title from '@material-hu/components/design-system/Title';
import { useDialogLayer } from '@material-hu/components/layers/Dialogs';
import { useDrawerLayer } from '@material-hu/components/layers/Drawers';
import { useMenuLayer } from '@material-hu/components/layers/Menus';

import ProcessForm, { type ProcessFormValues } from './components/ProcessForm';
import {
  addProcess,
  getProcessList,
  removeProcess,
  updateProcess,
} from './store';
import { type ManageableProcess } from './types';

const ManagementPage = () => {
  const navigate = useNavigate();
  const { openDrawer, closeDrawer } = useDrawerLayer();
  const { openDialog, closeDialog } = useDialogLayer();
  const { openMenu } = useMenuLayer();
  const [processes, setProcesses] = useState<ManageableProcess[]>(() =>
    getProcessList(),
  );

  const refresh = () => setProcesses([...getProcessList()]);

  const handleCreate = () => {
    openDrawer({
      title: 'Nuevo proceso',
      size: 'medium',
      children: (
        <ProcessForm
          onSubmit={(data: ProcessFormValues) => {
            addProcess(data.name, data.area);
            refresh();
            closeDrawer();
          }}
        />
      ),
      primaryButtonProps: {
        children: 'Crear',
        form: 'process-form',
        type: 'submit',
      },
      secondaryButtonProps: {
        children: 'Cancelar',
        onClick: () => closeDrawer(),
      },
    });
  };

  const handleEdit = (process: ManageableProcess) => {
    openDrawer({
      title: 'Editar proceso',
      size: 'medium',
      children: (
        <ProcessForm
          defaultValues={{ name: process.name, area: process.area }}
          onSubmit={(data: ProcessFormValues) => {
            updateProcess(process.id, data.name, data.area);
            refresh();
            closeDrawer();
          }}
        />
      ),
      primaryButtonProps: {
        children: 'Guardar',
        form: 'process-form',
        type: 'submit',
      },
      secondaryButtonProps: {
        children: 'Cancelar',
        onClick: () => closeDrawer(),
      },
    });
  };

  const handleDelete = (process: ManageableProcess) => {
    openDialog({
      title: '¿Eliminar proceso?',
      textBody: `Se eliminará "${process.name}" de forma permanente.`,
      primaryButtonProps: {
        children: 'Eliminar',
        color: 'error',
        onClick: () => {
          removeProcess(process.id);
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

  const handleMenu = (
    e: React.MouseEvent<HTMLElement>,
    process: ManageableProcess,
  ) => {
    openMenu({
      anchorEl: e.currentTarget,
      items: [
        {
          id: 'edit',
          title: 'Editar',
          icon: IconEdit,
          onSelect: () => handleEdit(process),
        },
        {
          id: 'delete',
          title: 'Eliminar',
          icon: IconTrash,
          onSelect: () => handleDelete(process),
        },
      ],
    });
  };

  return (
    <Stack sx={{ p: 2, gap: 2 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/procesos')}>
          <IconArrowLeft size={20} />
        </IconButton>
        <Title
          title="Gestión de procesos"
          variant="L"
        />
      </Stack>
      <Button
        variant="primary"
        size="large"
        startIcon={<IconPlus size={20} />}
        onClick={handleCreate}
      >
        Nuevo proceso
      </Button>
      {processes.length === 0 ? (
        <StateCard
          slotProps={{
            title: {
              title: 'Sin procesos',
              description: 'Creá el primero usando el botón de arriba',
              variant: 'M',
            },
            avatar: { Icon: IconClipboardList, color: 'default' },
          }}
        />
      ) : (
        <Stack sx={{ gap: 1.5 }}>
          {processes.map(process => (
            <CardContainer
              key={process.id}
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
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {process.tasks.length}{' '}
                    {process.tasks.length === 1 ? 'tarea' : 'tareas'}
                  </Typography>
                </Stack>
                <IconButton
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    handleMenu(e, process)
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

export default ManagementPage;
