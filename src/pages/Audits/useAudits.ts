import { useQuery } from "@tanstack/react-query";
import { provider } from "../../data/provider";
import type { Audit } from "./index";

export const useAudits = () =>
  useQuery({ queryKey: ["audits"], queryFn: () => provider.list<Audit>("audits") });
