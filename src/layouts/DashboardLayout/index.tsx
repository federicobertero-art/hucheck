import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import {
  IconBell,
  IconBuildingStore,
  IconChecklist,
  IconClipboardCheck,
  IconReportAnalytics,
} from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import HomeHeader from '@material-hu/components/design-system/Header/Home';
import Sidebar from '@material-hu/components/design-system/Sidebar';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
} from '@material-hu/components/design-system/Sidebar/constants';
import { type NavSectionProps } from '@material-hu/components/design-system/Sidebar/types';

import { useBranch } from '../../contexts/BranchContext';
import { MOCK_BRANCHES } from '../../pages/Processes/branches';

import humandLogo from '../../assets/humand.svg';

const SECTIONS: NavSectionProps[] = [
  {
    key: 'main',
    title: 'Principal',
    items: [
      {
        key: 'processes',
        title: 'Procesos',
        path: '/procesos',
        icon: <IconChecklist />,
      },
      {
        key: 'notices',
        title: 'Avisos',
        path: '/avisos',
        icon: <IconBell />,
      },
      {
        key: 'audits',
        title: 'Auditorías',
        path: '/auditorias',
        icon: <IconClipboardCheck />,
      },
      {
        key: 'reporting',
        title: 'Reportería',
        path: '/reporteria',
        icon: <IconReportAnalytics />,
      },
    ],
  },
];

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { branchId, setBranchId } = useBranch();

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <HomeHeader
        onOpenMenu={() => setIsCollapsed(prev => !prev)}
        logoSrc={humandLogo}
        logoAlt="Humand"
        hideNotificationsButton
        hideSupportButton
        isAdmin={false}
        avatarProps={{ text: 'U' }}
        avatarPopoverContent={null}
        onOpenLanguageMenu={() => undefined}
        supportButtonProps={{ href: '#' }}
        sx={{ position: 'sticky', top: 0, zIndex: 100 }}
      />
      {/* Global branch selector bar */}
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: '70px',
          zIndex: 99,
        }}
      >
        <IconBuildingStore size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}>
          Sucursal:
        </Typography>
        {MOCK_BRANCHES.map(branch => (
          <Stack
            key={branch.id}
            onClick={() => setBranchId(branch.id)}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              cursor: 'pointer',
              bgcolor: branchId === branch.id ? 'primary.main' : 'transparent',
              transition: 'background-color 0.15s',
              '&:hover': {
                bgcolor: branchId === branch.id ? 'primary.main' : 'action.hover',
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: branchId === branch.id ? 700 : 400,
                color: branchId === branch.id ? 'primary.contrastText' : 'text.primary',
              }}
            >
              {branch.name}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Stack sx={{ flexDirection: 'row' }}>
        <Sidebar
          isCollapsed={isCollapsed}
          pathname={pathname}
          sections={SECTIONS}
          openMenu={() => setIsCollapsed(false)}
          sx={{
            position: 'sticky',
            top: '110px',
            bottom: 0,
            left: 0,
            height: 'calc(100vh - 110px)',
          }}
        />
        <Stack
          component="main"
          sx={{
            flex: 1,
            py: 4,
            px: 6,
            maxWidth: `calc(100% - ${sidebarWidth}px)`,
            bgcolor: 'new.background.layout.default',
            minHeight: 'calc(100vh - 70px)',
          }}
        >
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
};
