import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as bogoPromotionService from "@/services/bogoPromotionService";
import { CreateBogoPromotionPayload, UpdateBogoPromotionPayload } from "@/types/bogoPromotion";

export const BOGO_PROMOTION_KEYS = {
  all: ["bogo-promotions"] as const,
  lists: () => [...BOGO_PROMOTION_KEYS.all, "list"] as const,
  list: (status: string) => [...BOGO_PROMOTION_KEYS.lists(), { status }] as const,
  details: () => [...BOGO_PROMOTION_KEYS.all, "detail"] as const,
  detail: (id: number) => [...BOGO_PROMOTION_KEYS.details(), id] as const,
};

export const useGetAllBogoPromotions = (status: "active" | "inactive" | "all" = "active") => {
  return useQuery({
    queryKey: BOGO_PROMOTION_KEYS.list(status),
    queryFn: () => bogoPromotionService.getAllBogoPromotions(status),
  });
};

export const useGetBogoPromotionById = (id: number) => {
  return useQuery({
    queryKey: BOGO_PROMOTION_KEYS.detail(id),
    queryFn: () => bogoPromotionService.getBogoPromotionById(id),
    enabled: !!id,
  });
};

export const useCreateBogoPromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBogoPromotionPayload) => bogoPromotionService.createBogoPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOGO_PROMOTION_KEYS.all });
    },
  });
};

export const useUpdateBogoPromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBogoPromotionPayload }) =>
      bogoPromotionService.updateBogoPromotion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BOGO_PROMOTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOGO_PROMOTION_KEYS.detail(variables.id) });
    },
  });
};

export const useActivateBogoPromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bogoPromotionService.activateBogoPromotion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: BOGO_PROMOTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOGO_PROMOTION_KEYS.detail(id) });
    },
  });
};

export const useDeactivateBogoPromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bogoPromotionService.deactivateBogoPromotion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: BOGO_PROMOTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOGO_PROMOTION_KEYS.detail(id) });
    },
  });
};
