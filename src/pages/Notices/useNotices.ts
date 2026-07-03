import { useQuery } from "@tanstack/react-query";
import { provider } from "../../data/provider";
import type { Notice } from "./index";

export const useNotices = () =>
  useQuery({ queryKey: ["notices"], queryFn: () => provider.list<Notice>("notices") });
