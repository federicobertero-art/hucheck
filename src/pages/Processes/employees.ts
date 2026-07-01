export interface Employee {
  id: string;
  name: string;
  area: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Federico B.', area: 'Operaciones' },
  { id: 'e2', name: 'Ana G.', area: 'Calidad' },
  { id: 'e3', name: 'Marcos L.', area: 'Logística' },
  { id: 'e4', name: 'Sofía R.', area: 'Higiene' },
  { id: 'e5', name: 'Diego M.', area: 'Operaciones' },
  { id: 'e6', name: 'Laura P.', area: 'Calidad' },
];
