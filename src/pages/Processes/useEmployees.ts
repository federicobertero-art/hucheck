import { useQuery } from "@tanstack/react-query";
import { provider } from "../../data/provider";
import type { Employee } from "./employees";

export const useEmployees = () =>
  useQuery({ queryKey: ["employees"], queryFn: () => provider.list<Employee>("employees") });
