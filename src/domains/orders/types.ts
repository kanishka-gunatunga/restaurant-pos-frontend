export type OrderStatus = "PREPARING" | "PENDING" | "COMPLETE" | "HOLD" | "READY" | "CANCELED";
export type PaymentStatus = "PENDING" | "PAID" | "PARTIAL REFUND" | "FULL REFUND";
export type OrderType = "Dine In" | "Take Away" | "Delivery";

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
