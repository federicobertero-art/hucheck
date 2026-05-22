import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  IconBell,
  IconChecklist,
  IconClipboardCheck,
  IconHome,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import HomeHeader from '@material-hu/components/design-system/Header/Home';

import humandLogo from '../../assets/humand.svg';

const NAV_ITEMS = [
  { key: 'home', label: 'Inicio', Icon: IconHome, path: '/' },
  {
    key: 'processes',
    label: 'Procesos',
    Icon: IconChecklist,
    path: '/procesos',
  },
  { key: 'notices', label: 'Avisos', Icon: IconBell, path: '/avisos' },
  {
    key: 'audits',
    label: 'Auditorías',
    Icon: IconClipboardCheck,
    path: '/auditorias',
  },
] as const;

export const MobileLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Stack
      sx={{ minHeight: '100vh', bgcolor: 'new.background.elements.default' }}
    >
      <Stack sx={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <HomeHeader
          onOpenMenu={() => undefined}
          logoSrc={humandLogo}
          logoAlt="Humand"
          avatarProps={{ text: '' }}
          avatarPopoverContent={null}
          onOpenLanguageMenu={() => undefined}
          supportButtonProps={{ href: '' }}
          hideSupportButton
          hideNotificationsButton
        />
      </Stack>

      <Stack sx={{ flex: 1, pb: '64px' }}>
        <Outlet />
      </Stack>

      <Stack
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          flexDirection: 'row',
          bgcolor: 'new.background.elements.default',
          borderTop: '1px solid',
          borderColor: 'new.border.neutral.default',
          zIndex: 100,
        }}
      >
        {NAV_ITEMS.map(({ key, label, Icon, path }) => {
          const isActive =
            path === '/' ? pathname === '/' : pathname.startsWith(path);
          return (
            <Stack
              key={key}
              role="button"
              tabIndex={0}
              sx={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                cursor: 'pointer',
              }}
              onClick={() => navigate(path)}
              onKeyDown={e => e.key === 'Enter' && navigate(path)}
            >
              <IconButton
                sx={{
                  color: isActive
                    ? 'new.icon.neutral.brand'
                    : 'new.icon.neutral.lighter',
                }}
              >
                <Icon size={20} />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  color: isActive
                    ? 'new.text.neutral.brand'
                    : 'new.text.neutral.lighter',
                }}
              >
                {label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
