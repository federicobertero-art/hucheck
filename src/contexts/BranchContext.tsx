import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useBranches } from "../pages/Processes/useBranches";

interface BranchContextValue {
  branchId: string;
  setBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextValue>({
  branchId: '',
  setBranchId: () => undefined,
});

export const BranchProvider = ({ children }: { children: ReactNode }) => {
    const { data: branches = [] } = useBranches();
  const [branchId, setBranchId] = useState('');
  useEffect(() => {
    if (!branchId && branches[0]) setBranchId(branches[0].id);
  }, [branches, branchId]);
  return (
    <BranchContext.Provider value={{ branchId, setBranchId }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
