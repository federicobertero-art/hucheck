export interface Branch {
  id: string;
  name: string;
  address: string;
}

export const MOCK_BRANCHES: Branch[] = [
  { id: 'b1', name: 'Central', address: 'Av. Corrientes 1234, CABA' },
  { id: 'b2', name: 'Norte', address: 'Av. Cabildo 2100, Belgrano' },
  { id: 'b3', name: 'Sur', address: 'Av. Rivadavia 8500, Liniers' },
];
