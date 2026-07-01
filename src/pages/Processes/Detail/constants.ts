import { type Task } from './types';

export const MOCK_TASKS: Record<string, Task[]> = {
  '1': [
    { id: '1-1', name: 'Verificar iluminación del local', assignedTo: ['e1', 'e5'] },
    { id: '1-2', name: 'Revisar temperatura del refrigerador', assignedTo: ['e2'] },
    { id: '1-3', name: 'Activar sistema de alarma', assignedTo: ['e1'] },
    { id: '1-4', name: 'Limpiar mostrador principal', assignedTo: ['e4'] },
    { id: '1-5', name: 'Revisar stock de productos del día', assignedTo: ['e3'] },
    { id: '1-6', name: 'Encender equipos de trabajo', assignedTo: ['e1'] },
    { id: '1-7', name: 'Habilitar caja registradora', assignedTo: ['e5'] },
    { id: '1-8', name: 'Colocar cartel de "Abierto"', assignedTo: ['e1', 'e5'] },
  ],
  '2': [
    { id: '2-1', name: 'Medir temperatura zona de producción', assignedTo: ['e2'] },
    { id: '2-2', name: 'Registrar temperatura en planilla', assignedTo: ['e2', 'e6'] },
    { id: '2-3', name: 'Verificar sistema de ventilación', assignedTo: ['e1'] },
    { id: '2-4', name: 'Alertar supervisor si supera 25°C', assignedTo: ['e2'] },
  ],
  '3': [
    { id: '3-1', name: 'Contar unidades de producto A', assignedTo: ['e3'] },
    { id: '3-2', name: 'Contar unidades de producto B', assignedTo: ['e3'] },
    { id: '3-3', name: 'Contar unidades de producto C', assignedTo: ['e3', 'e5'] },
    { id: '3-4', name: 'Registrar totales en sistema', assignedTo: ['e3'] },
    { id: '3-5', name: 'Reportar diferencias al supervisor', assignedTo: ['e1'] },
    { id: '3-6', name: 'Archivar planilla de inventario', assignedTo: ['e3'] },
  ],
  '4': [
    { id: '4-1', name: 'Limpiar superficies de trabajo', assignedTo: ['e4'] },
    { id: '4-2', name: 'Desinfectar utensilios', assignedTo: ['e4', 'e6'] },
    { id: '4-3', name: 'Trapear el piso', assignedTo: ['e4'] },
    { id: '4-4', name: 'Vaciar papeleros', assignedTo: ['e5'] },
    { id: '4-5', name: 'Reabastecer dispensadores de jabón', assignedTo: ['e4', 'e5'] },
  ],
};
