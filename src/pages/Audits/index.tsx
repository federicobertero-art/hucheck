import { useState } from 'react';

import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconClipboardCheck,
  IconX,
} from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Pills from '@material-hu/components/design-system/Pills';
import ProgressBar from '@material-hu/components/design-system/ProgressIndicators/ProgressBar';
import Title from '@material-hu/components/design-system/Title';

import { useBranch } from '../../contexts/BranchContext';
import { MOCK_BRANCHES } from '../Processes/branches';

type AuditStatus = 'approved' | 'rejected' | 'observations';

interface AuditItem {
  id: string;
  label: string;
  passed: boolean;
  observation?: string;
}

interface Audit {
  id: string;
  date: string;
  branch: string;
  auditor: string;
  process: string;
  status: AuditStatus;
  score: number;
  items: AuditItem[];
}

const MOCK_AUDITS: Audit[] = [
  {
    id: 'a1',
    date: '2026-06-20',
    branch: 'Central',
    auditor: 'Ana G.',
    process: 'Apertura del local',
    status: 'approved',
    score: 95,
    items: [
      { id: 'a1-1', label: 'Iluminación operativa', passed: true },
      { id: 'a1-2', label: 'Temperatura de refrigeración dentro de rango', passed: true },
      { id: 'a1-3', label: 'Registro de apertura completo', passed: true },
      { id: 'a1-4', label: 'Personal con uniforme reglamentario', passed: false, observation: 'Un empleado sin cofia' },
      { id: 'a1-5', label: 'Área de caja habilitada y con fondo', passed: true },
    ],
  },
  {
    id: 'a2',
    date: '2026-06-18',
    branch: 'Norte',
    auditor: 'Marcos L.',
    process: 'Control de higiene',
    status: 'observations',
    score: 72,
    items: [
      { id: 'a2-1', label: 'Superficies desinfectadas', passed: true },
      { id: 'a2-2', label: 'Utensilios en condiciones', passed: false, observation: 'Tabla de corte con manchas visibles' },
      { id: 'a2-3', label: 'Registro de limpieza firmado', passed: false, observation: 'Sin firmar turno tarde' },
      { id: 'a2-4', label: 'Dispensadores de jabón llenos', passed: true },
      { id: 'a2-5', label: 'Piso libre de manchas', passed: true },
    ],
  },
  {
    id: 'a3',
    date: '2026-06-15',
    branch: 'Sur',
    auditor: 'Sofía R.',
    process: 'Inventario y stock',
    status: 'rejected',
    score: 48,
    items: [
      { id: 'a3-1', label: 'Inventario actualizado en sistema', passed: false, observation: 'Sistema sin actualizar hace 3 días' },
      { id: 'a3-2', label: 'Stock mínimo de producto A', passed: false, observation: 'Por debajo del mínimo requerido' },
      { id: 'a3-3', label: 'Stock mínimo de producto B', passed: true },
      { id: 'a3-4', label: 'Planilla de diferencias archivada', passed: false, observation: 'No se encontró planilla del mes' },
      { id: 'a3-5', label: 'Responsable de inventario identificado', passed: true },
    ],
  },
  {
    id: 'a4',
    date: '2026-06-10',
    branch: 'Central',
    auditor: 'Ana G.',
    process: 'Control de temperatura',
    status: 'approved',
    score: 100,
    items: [
      { id: 'a4-1', label: 'Temperatura registrada en horario', passed: true },
      { id: 'a4-2', label: 'Planilla completa sin faltantes', passed: true },
      { id: 'a4-3', label: 'Alertas gestionadas correctamente', passed: true },
      { id: 'a4-4', label: 'Equipo de medición calibrado', passed: true },
    ],
  },
];

const STATUS_CONFIG: Record<
  AuditStatus,
  { label: string; type: 'success' | 'error' | 'warning' }
> = {
  approved: { label: 'Aprobado', type: 'success' },
  rejected: { label: 'Rechazado', type: 'error' },
  observations: { label: 'Con observaciones', type: 'warning' },
};

const AuditsPage = () => {
  const { branchId } = useBranch();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentBranchName = MOCK_BRANCHES.find(b => b.id === branchId)?.name ?? '';
  const visibleAudits = MOCK_AUDITS.filter(a => a.branch === currentBranchName);

  return (
    <Stack sx={{ gap: 3 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <Title title="Auditorías" variant="L" />
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <Pills label={`${visibleAudits.filter(a => a.status === 'approved').length} aprobadas`} type="success" size="small" />
          <Pills label={`${visibleAudits.filter(a => a.status !== 'approved').length} con issues`} type="warning" size="small" />
        </Stack>
      </Stack>

      {visibleAudits.length === 0 && (
        <Stack sx={{ py: 6, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sin auditorías registradas para esta sucursal.
          </Typography>
        </Stack>
      )}

      <Stack sx={{ gap: 1.5 }}>
        {visibleAudits.map(audit => {
          const isExpanded = expandedId === audit.id;
          const config = STATUS_CONFIG[audit.status];
          const passedCount = audit.items.filter(i => i.passed).length;

          return (
            <Stack
              key={audit.id}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden',
              }}
            >
              <Stack
                sx={{
                  height: 4,
                  bgcolor:
                    audit.status === 'approved'
                      ? 'success.light'
                      : audit.status === 'rejected'
                        ? 'error.light'
                        : 'warning.light',
                }}
              />

              <Stack
                onClick={() => setExpandedId(isExpanded ? null : audit.id)}
                sx={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  px: 2.5,
                  py: 2,
                  gap: 2,
                  cursor: 'pointer',
                }}
              >
                <Stack sx={{ pt: 0.5, color: 'text.disabled' }}>
                  <IconClipboardCheck size={20} />
                </Stack>
                <Stack sx={{ flex: 1, gap: 0.5 }}>
                  <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                      {audit.process}
                    </Typography>
                    <Pills label={config.label} type={config.type} size="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: config.type === 'success' ? 'success.main' : config.type === 'error' ? 'error.main' : 'warning.main' }}>
                      {audit.score}%
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {audit.branch} · {audit.auditor} ·{' '}
                    {new Date(audit.date + 'T12:00:00').toLocaleDateString('es-AR', {
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
                    pt: 1,
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <ProgressBar
                    variant="determinate"
                    current={passedCount}
                    total={audit.items.length}
                    description={`${passedCount} de ${audit.items.length} ítems aprobados`}
                    hasPercentage
                    decimalPrecision={0}
                  />
                  <Stack sx={{ gap: 1 }}>
                    {audit.items.map(item => (
                      <Stack
                        key={item.id}
                        sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 1.5 }}
                      >
                        <Stack sx={{ pt: 0.25, flexShrink: 0 }}>
                          {item.passed ? (
                            <IconCheck size={16} style={{ color: '#22c55e' }} />
                          ) : (
                            <IconX size={16} style={{ color: '#ef4444' }} />
                          )}
                        </Stack>
                        <Stack sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ color: item.passed ? 'text.primary' : 'text.secondary' }}
                          >
                            {item.label}
                          </Typography>
                          {item.observation && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'error.main', fontStyle: 'italic' }}
                            >
                              {item.observation}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default AuditsPage;
