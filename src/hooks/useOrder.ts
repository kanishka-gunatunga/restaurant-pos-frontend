import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as orderService from "@/services/orderService";
import {
  Order,
  CreateOrderData,
  UpdateOrderData,
  OrderSearchParams,
  OrderFilterParams,
  OrderStatus
} from "@/types/order";
import { DASHBOARD_KEYS } from "./useDashboard";
import { KitchenDashboardData } from "@/services/dashboardService";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  list: (params: OrderSearchParams | OrderFilterParams) => [...ORDER_KEYS.lists(), params] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...ORDER_KEYS.details(), id] as const,
};


export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ORDER_KEYS.lists(),
    queryFn: orderService.getAllOrders,
    // staleTime: 0.5 * 60 * 1000,
  });
};

export const useGetOrdersExcludeStatus = (status: string) => {
  return useQuery({
    queryKey: [...ORDER_KEYS.lists(), "exclude", status],
    queryFn: () => orderService.getOrdersExcludeStatus(status),
    // staleTime: 0.5 * 60 * 1000,
  });
};

export const useSearchOrders = (params: OrderSearchParams) => {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => orderService.searchOrders(params),
    enabled: !!(params.q || params.orderId || params.customerName || params.phone),
  });
};

export const useFilterOrders = (params: OrderFilterParams) => {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => orderService.filterOrders(params),
    enabled: !!(params.status || params.paymentStatus),
  });
};

export const useGetOrderById = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ORDER_KEYS.detail(id!),
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
  });
};


export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateOrderData }) =>
      orderService.updateOrder(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ORDER_KEYS.lists() });
      await queryClient.cancelQueries({ queryKey: ORDER_KEYS.detail(id) });

      const previousOrders = queryClient.getQueryData<Order[]>(ORDER_KEYS.lists());
      const previousOrder = queryClient.getQueryData<Order>(ORDER_KEYS.detail(id));

      if (previousOrders) {
        queryClient.setQueryData<Order[]>(ORDER_KEYS.lists(), (old) =>
          old?.map((order) =>
            String(order.id) === String(id) ? { ...order, ...data } : order
          )
        );
      }

      if (previousOrder) {
        queryClient.setQueryData<Order>(ORDER_KEYS.detail(id), {
          ...previousOrder,
          ...data,
        });
      }

      return { previousOrders, previousOrder };
    },
    onError: (err, { id }, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ORDER_KEYS.lists(), context.previousOrders);
      }
      if (context?.previousOrder) {
        queryClient.setQueryData(ORDER_KEYS.detail(id), context.previousOrder);
      }
    },
    onSettled: (data, error, { id }) => {
      if (!error && data != null && typeof data === "object" && "id" in data) {
        const updated = data as Order;
        queryClient.setQueryData<Order[]>(ORDER_KEYS.lists(), (old) =>
          old?.map((order) =>
            String(order.id) === String(id) ? { ...order, ...updated } : order
          )
        );
        queryClient.setQueryData<Order>(ORDER_KEYS.detail(id), updated);
      }
      void queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(id) });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string | number;
      data: { status: OrderStatus; rejectReason?: string; passcode?: string }
    }) => orderService.updateOrderStatus(id, data),
    onMutate: async ({ id, data }) => {

      await queryClient.cancelQueries({ queryKey: ORDER_KEYS.lists() });
      await queryClient.cancelQueries({ queryKey: DASHBOARD_KEYS.kitchen() });

      const previousOrders = queryClient.getQueryData(ORDER_KEYS.lists());
      const previousKitchenData = queryClient.getQueryData<KitchenDashboardData>(DASHBOARD_KEYS.kitchen());

      if (previousOrders) {
        queryClient.setQueryData(ORDER_KEYS.lists(), (old: any) =>
          old?.map((order: any) =>
            String(order.id) === String(id) ? { ...order, status: data.status } : order
          )
        );
      }

      if (previousKitchenData) {
        queryClient.setQueryData<KitchenDashboardData>(DASHBOARD_KEYS.kitchen(), (old) => {
          if (!old) return old;

          const newOrders = old.orders.map((order) => {
            if (String(order.id) === String(id)) {
              return { ...order, status: data.status.toLowerCase() };
            }
            return order;
          });

          const metrics = {
            allOrdersCount: newOrders.length,
            pendingOrdersCount: newOrders.filter(o => o.status === "pending").length,
            preparingOrdersCount: newOrders.filter(o => o.status === "preparing").length,
            readyOrdersCount: newOrders.filter(o => o.status === "ready").length,
            holdOrdersCount: newOrders.filter(o => o.status === "hold").length,
          };

          return { ...old, orders: newOrders, metrics };
        });
      }

      return { previousOrders, previousKitchenData };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ORDER_KEYS.lists(), context.previousOrders);
      }
      if (context?.previousKitchenData) {
        queryClient.setQueryData(DASHBOARD_KEYS.kitchen(), context.previousKitchenData);
      }
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.kitchen() });
    },
  });
};

export const useUpdateOrderItemStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      status
    }: {
      itemId: string | number;
      status: "pending" | "complete"
    }) => orderService.updateOrderItemStatus(itemId, status as any),
    onMutate: async ({ itemId, status }) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_KEYS.kitchen() });

      const previousKitchenData = queryClient.getQueryData<KitchenDashboardData>(DASHBOARD_KEYS.kitchen());

      if (previousKitchenData) {
        queryClient.setQueryData<KitchenDashboardData>(DASHBOARD_KEYS.kitchen(), (old) => {
          if (!old) return old;

          const newOrders = old.orders.map((order) => {
            const itemIndex = order.items.findIndex(i => String(i.id) === String(itemId));
            if (itemIndex !== -1) {
              const newItems = [...order.items];
              newItems[itemIndex] = { ...newItems[itemIndex], status: status as any };
              return { ...order, items: newItems };
            }
            return order;
          });

          return { ...old, orders: newOrders };
        });
      }

      return { previousKitchenData };
    },
    onError: (err, variables, context) => {
      if (context?.previousKitchenData) {
        queryClient.setQueryData(DASHBOARD_KEYS.kitchen(), context.previousKitchenData);
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.kitchen() });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
    },
  });
};
