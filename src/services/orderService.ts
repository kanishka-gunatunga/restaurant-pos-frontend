import axiosInstance from "@/lib/api/axiosInstance";
import { 
  Order, 
  CreateOrderData, 
  UpdateOrderData, 
  OrderSearchParams, 
  OrderFilterParams,
  OrderStatus,
  OrderItem
} from "@/types/order";

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await axiosInstance.get("/orders");
  return res.data;
};

export const getOrdersExcludeStatus = async (status: string): Promise<Order[]> => {
  const res = await axiosInstance.get("/orders/exclude-status", { params: { status } });
  return res.data;
};

export const searchOrders = async (params: OrderSearchParams): Promise<Order[]> => {
  const res = await axiosInstance.get("/orders/search", { params });
  return res.data;
};

export const filterOrders = async (params: OrderFilterParams): Promise<Order[]> => {
  const res = await axiosInstance.get("/orders/filter", { params });
  return res.data;
};

export const getOrderById = async (id: string | number): Promise<Order> => {
  const res = await axiosInstance.get(`/orders/${id}`);
  return res.data;
};

export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const res = await axiosInstance.post("/orders", data);
  return res.data;
};

export const updateOrder = async (id: string | number, data: UpdateOrderData): Promise<Order> => {
  const res = await axiosInstance.put(`/orders/${id}`, data);
  return res.data;
};

export const updateOrderStatus = async (
  id: string | number, 
  data: { status: OrderStatus; rejectReason?: string; passcode?: string }
): Promise<Order> => {
  const res = await axiosInstance.put(`/orders/${id}/status`, data);
  return res.data;
};

export const updateOrderItemStatus = async (
  itemId: string | number, 
  status: OrderStatus
): Promise<OrderItem> => {
  const res = await axiosInstance.put(`/orders/item/${itemId}/status`, { status });
  return res.data;
};

export const deleteOrder = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/orders/${id}`);
};
