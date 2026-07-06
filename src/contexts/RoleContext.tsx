import { createContext, type ReactNode, useContext, useState } from 'react';

export const ROLES = ['Administrador', 'Encargado', 'Empleado'] as const;
export type Role = (typeof ROLES)[number];

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: 'Administrador',
  setRole: () => undefined,
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('Administrador');
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
