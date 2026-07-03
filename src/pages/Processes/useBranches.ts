import { useQuery } from "@tanstack/react-query";
import { provider } from "../../data/provider";
import type { Branch } from "./branches";

export const useBranches = () =>
  useQuery({ queryKey: ["branches"], queryFn: () => provider.list<Branch>("branches") });
