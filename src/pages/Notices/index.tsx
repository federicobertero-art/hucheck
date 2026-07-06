import { useState } from 'react';

import {
  IconAlertTriangle,
  IconBell,
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
} from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Pills from '@material-hu/components/design-system/Pills';
import Title from '@material-hu/components/design-system/Title';

import { useBranch } from '../../contexts/BranchContext';
import { useNotices } from "./useNotices";

type NoticePriority = 'urgent' | 'info' | 'reminder';

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: NoticePriority;
  readBy: string[];
  branchId: string | 'all';
}

const CURRENT_USER = 'Federico B.';
const PRIORITY_CONFIG: Record<
  NoticePriority,
  { label: string; type: 'error' | 'info' | 'warning'; icon: React.ElementType }
> = {
  urgent: { label: 'Urgente', type: 'error', icon: IconAlertTriangle },
  info: { label: 'Información', type: 'info', icon: IconInfoCircle },
  reminder: { label: 'Recordatorio', type: 'warning', icon: IconBell },
};

const NoticesPage = () => {
    const { data: noticesData = [] } = useNotices();
  const { branchId } = useBranch();
  const [notices, setNotices] = useState<Notice[]>(noticesData);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const markAsRead = (id: string) => {
    setNotices(prev =>
      prev.map(n =>
        n.id === id && !n.readBy.includes(CURRENT_USER)
          ? { ...n, readBy: [...n.readBy, CURRENT_USER] }
          : n,
      ),
    );
  };

  const visibleNotices = notices.filter(n => n.branchId === 'all' || n.branchId === branchId);
  const unreadCount = visibleNotices.filter(n => !n.readBy.includes(CURRENT_USER)).length;

  return (
    <Stack sx={{ gap: 3 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Title title="Avisos" variant="L" />
        {unreadCount > 0 && (
          <Pills label={`${unreadCount} sin leer`} type="info" size="small" />
        )}
      </Stack>

      <Stack sx={{ gap: 1.5 }}>
        {visibleNotices.map(notice => {
          const isRead = notice.readBy.includes(CURRENT_USER);
          const isExpanded = expandedId === notice.id;
          const config = PRIORITY_CONFIG[notice.priority];
          const PriorityIcon = config.icon;

          return (
            <Stack
              key={notice.id}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: isRead ? 'divider' : 'primary.light',
                bgcolor: 'background.paper',
                overflow: 'hidden',
                opacity: isRead ? 0.8 : 1,
              }}
            >
              <Stack
                sx={{
                  height: 4,
                  bgcolor:
                    notice.priority === 'urgent'
                      ? 'error.light'
                      : notice.priority === 'reminder'
                        ? 'warning.light'
                        : 'info.light',
                }}
              />
              <Stack
                onClick={() => {
                  setExpandedId(isExpanded ? null : notice.id);
                  if (!isRead) markAsRead(notice.id);
                }}
                sx={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  px: 2.5,
                  py: 2,
                  gap: 2,
                  cursor: 'pointer',
                }}
              >
                <Stack sx={{ pt: 0.25, color: isRead ? 'text.disabled' : 'text.primary' }}>
                  <PriorityIcon size={20} />
                </Stack>
                <Stack sx={{ flex: 1, gap: 0.5 }}>
                  <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: isRead ? 400 : 700, flex: 1 }}
                    >
                      {notice.title}
                    </Typography>
                    <Pills label={config.label} type={config.type} size="small" />
                    {!isRead && (
                      <Stack
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {notice.author} ·{' '}
                    {new Date(notice.date + 'T12:00:00').toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </Typography>
                </Stack>
                <Stack sx={{ pt: 0.25, color: 'text.disabled' }}>
                  {isExpanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                </Stack>
              </Stack>

              {isExpanded && (
                <Stack
                  sx={{
                    px: 2.5,
                    pb: 2.5,
                    pt: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', pt: 1.5, lineHeight: 1.7 }}>
                    {notice.content}
                  </Typography>
                  {notice.readBy.length > 0 && (
                    <Typography variant="caption" sx={{ color: 'text.disabled', pt: 1.5 }}>
                      Leído por: {notice.readBy.join(', ')}
                    </Typography>
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

export default NoticesPage;
