import { useQuery } from "@tanstack/react-query";
import { provider } from "../../data/provider";
import type { DailyProcess } from "./types";

export const useProcesses = () =>
  useQuery({ queryKey: ["processes"], queryFn: () => provider.list<DailyProcess>("processes") });
