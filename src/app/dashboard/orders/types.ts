import type {
  OrderStatus,
  PaymentStatus,
  OrderDetailItem,
} from "@/components/orders/OrderDetailsViewModal";

export type { OrderStatus, PaymentStatus, OrderDetailItem };

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
