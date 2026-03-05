import type { Order as ApiOrder, OrderItem as ApiOrderItem } from "@/types/order";
import { formatDate, formatTime } from "@/lib/format";

export type OrderStatus = "pending" | "preparing" | "ready" | "hold" | "complete" | "cancel";
export type PaymentStatus = "pending" | "paid" | "refund" | "partial_refund";
export type OrderType = "takeaway" | "dining" | "delivery";

export type OrderDetailItem = {
  name: string;
  qty: number;
  price: number;
};

export type OrderDetailsView = {
  orderNo: string;
  date: string;
  time: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  phone: string;
  totalAmount: number;
  orderType?: OrderType;
  tableNumber?: string;
  items?: OrderDetailItem[];
  subtotal?: number;
  discount?: number;
};

export type OrderRow = {
  id: string;
  orderNo: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderType?: "Dine In" | "Take Away" | "Delivery";
  tableNumber?: string;
  items?: OrderDetailItem[];
  subtotal?: number;
  discount?: number;
};

export function mapOrderToRow(apiOrder: ApiOrder): OrderRow {
  return {
    id: String(apiOrder.id),
    orderNo: String(apiOrder.id), // Using ID as Order No if not separate
    date: formatDate(apiOrder.createdAt),
    time: formatTime(apiOrder.createdAt),
    customerName: apiOrder.customer?.name || "Guest",
    phone: apiOrder.customer?.mobile || "N/A",
    totalAmount: Number(apiOrder.totalAmount),
    status: apiOrder.status,
    paymentStatus: apiOrder.paymentStatus as PaymentStatus,
    orderType: apiOrder.orderType === "dining" ? "takeaway" : apiOrder.orderType as any, // Simple mapping for now
    tableNumber: apiOrder.tableNumber,
    items: apiOrder.items?.map(mapOrderItemToDetail),
    subtotal: Number(apiOrder.totalAmount) - Number(apiOrder.tax || 0) + Number(apiOrder.orderDiscount || 0),
    discount: Number(apiOrder.orderDiscount),
  };
}

function mapOrderItemToDetail(item: ApiOrderItem): OrderDetailItem {
  return {
    name: (item.product as any)?.name || "Unknown Product",
    qty: item.quantity,
    price: Number(item.unitPrice),
  };
}
