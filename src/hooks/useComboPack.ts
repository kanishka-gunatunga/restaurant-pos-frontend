import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as comboPackService from "@/services/comboPackService";
import { CreateComboPackPayload, UpdateComboPackPayload } from "@/types/comboPack";

export const COMBO_PACK_KEYS = {
  all: ["combo-packs"] as const,
  lists: () => [...COMBO_PACK_KEYS.all, "list"] as const,
  list: (status: string) => [...COMBO_PACK_KEYS.lists(), { status }] as const,
  details: () => [...COMBO_PACK_KEYS.all, "detail"] as const,
  detail: (id: number) => [...COMBO_PACK_KEYS.details(), id] as const,
};

export const useGetAllComboPacks = (status: "active" | "inactive" | "all" = "active") => {
  return useQuery({
    queryKey: COMBO_PACK_KEYS.list(status),
    queryFn: () => comboPackService.getAllComboPacks(status),
  });
};

export const useGetComboPackById = (id: number) => {
  return useQuery({
    queryKey: COMBO_PACK_KEYS.detail(id),
    queryFn: () => comboPackService.getComboPackById(id),
    enabled: !!id,
  });
};

export const useCreateComboPack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateComboPackPayload) => comboPackService.createComboPack(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMBO_PACK_KEYS.all });
    },
  });
};

export const useUpdateComboPack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateComboPackPayload }) =>
      comboPackService.updateComboPack(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COMBO_PACK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMBO_PACK_KEYS.detail(variables.id) });
    },
  });
};

export const useActivateComboPack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => comboPackService.activateComboPack(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: COMBO_PACK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMBO_PACK_KEYS.detail(id) });
    },
  });
};

export const useDeactivateComboPack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => comboPackService.deactivateComboPack(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: COMBO_PACK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMBO_PACK_KEYS.detail(id) });
    },
  });
};
