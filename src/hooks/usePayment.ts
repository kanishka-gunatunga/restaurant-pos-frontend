import { useQuery } from "@tanstack/react-query";
import * as paymentService from "@/services/paymentService";

export const PAYMENT_KEYS = {
  all: ["payments"] as const,
  lists: () => [...PAYMENT_KEYS.all, "list"] as const,
  list: (filters: any) => [...PAYMENT_KEYS.lists(), { filters }] as const,
};

export const useGetAllPaymentDetails = () => {
  return useQuery({
    queryKey: PAYMENT_KEYS.lists(),
    queryFn: paymentService.getAllPaymentDetails,
    staleTime: 1 * 60 * 1000,
  });
};
