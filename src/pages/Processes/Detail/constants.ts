import { type Task } from './types';

export const MOCK_TASKS: Record<string, Task[]> = {
  '1': [
    { id: '1-1', name: 'Verificar iluminación del local', completed: true },
    {
      id: '1-2',
      name: 'Revisar temperatura del refrigerador',
      completed: true,
    },
    { id: '1-3', name: 'Activar sistema de alarma', completed: true },
    { id: '1-4', name: 'Limpiar mostrador principal', completed: false },
    { id: '1-5', name: 'Revisar stock de productos del día', completed: false },
    { id: '1-6', name: 'Encender equipos de trabajo', completed: false },
    { id: '1-7', name: 'Habilitar caja registradora', completed: false },
    { id: '1-8', name: 'Colocar cartel de "Abierto"', completed: false },
  ],
  '2': [
    {
      id: '2-1',
      name: 'Medir temperatura zona de producción',
      completed: false,
    },
    { id: '2-2', name: 'Registrar temperatura en planilla', completed: false },
    { id: '2-3', name: 'Verificar sistema de ventilación', completed: false },
    { id: '2-4', name: 'Alertar supervisor si supera 25°C', completed: false },
  ],
  '3': [
    { id: '3-1', name: 'Contar unidades de producto A', completed: true },
    { id: '3-2', name: 'Contar unidades de producto B', completed: true },
    { id: '3-3', name: 'Contar unidades de producto C', completed: true },
    { id: '3-4', name: 'Registrar totales en sistema', completed: true },
    { id: '3-5', name: 'Reportar diferencias al supervisor', completed: true },
    { id: '3-6', name: 'Archivar planilla de inventario', completed: true },
  ],
  '4': [
    { id: '4-1', name: 'Limpiar superficies de trabajo', completed: true },
    { id: '4-2', name: 'Desinfectar utensilios', completed: false },
    { id: '4-3', name: 'Trapear el piso', completed: false },
    { id: '4-4', name: 'Vaciar papeleros', completed: false },
    { id: '4-5', name: 'Reabastecer dispensadores de jabón', completed: false },
  ],
};
