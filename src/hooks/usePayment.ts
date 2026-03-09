import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as paymentService from "@/services/paymentService";
import { CreatePaymentPayload, PaymentUpdatePayload } from "@/types/payment";
import { ORDER_KEYS } from "@/hooks/useOrder";

export const PAYMENT_KEYS = {
  all: ["payments"] as const,
  lists: () => [...PAYMENT_KEYS.all, "list"] as const,
  list: (filters: unknown) => [...PAYMENT_KEYS.lists(), { filters }] as const,
  byOrder: (orderId: number) => [...PAYMENT_KEYS.all, "order", orderId] as const,
};

export const useGetAllPaymentDetails = () => {
  return useQuery({
    queryKey: PAYMENT_KEYS.lists(),
    queryFn: paymentService.getAllPaymentDetails,
    staleTime: 1 * 60 * 1000,
  });
};

export const useSearchPaymentDetails = (query: string) => {
  return useQuery({
    queryKey: ["payments", "search", query],
    queryFn: () => paymentService.searchPaymentDetails(query),
    enabled: !!query,
  });
};

export const useFilterPaymentsByStatus = (status: string) => {
  return useQuery({
    queryKey: ["payments", "filter", status],
    queryFn: () => paymentService.filterPaymentsByStatus(status),
    enabled: status !== "All",
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) => paymentService.createPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentUpdatePayload }) =>
      paymentService.updatePaymentStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
    },
  });
};

export const useGetPaymentsByOrder = (orderId: number) => {
  return useQuery({
    queryKey: PAYMENT_KEYS.byOrder(orderId),
    queryFn: () => paymentService.getPaymentsByOrder(orderId),
    enabled: !!orderId,
  });
};

export const useGetPaymentStats = () => {
  return useQuery({
    queryKey: [...PAYMENT_KEYS.all, "stats"],
    queryFn: paymentService.getPaymentStats,
    staleTime: 1 * 60 * 1000,
  });
};
