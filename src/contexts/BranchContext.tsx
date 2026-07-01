import { createContext, useContext, useState, type ReactNode } from 'react';

import { MOCK_BRANCHES } from '../pages/Processes/branches';

interface BranchContextValue {
  branchId: string;
  setBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextValue>({
  branchId: MOCK_BRANCHES[0].id,
  setBranchId: () => undefined,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branchId, setBranchId] = useState(MOCK_BRANCHES[0].id);
  return (
    <BranchContext.Provider value={{ branchId, setBranchId }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
