import type { Order as ApiOrder, OrderItem as ApiOrderItem } from "@/types/order";
import { formatDate, formatTime } from "@/lib/format";

export type OrderStatus = "pending" | "preparing" | "ready" | "hold" | "complete" | "cancel";
export type PaymentStatus = "pending" | "paid" | "refund" | "partial_refund";
export type OrderType = "takeaway" | "dining" | "delivery";
export type OrderTypeLabel = "Dine In" | "Take Away" | "Delivery";

export type OrderDetailItem = {
  id?: string;
  productId?: string;
  variationId?: string;
  name: string;
  qty: number;
  price: number;
  productDiscount?: number;
  image?: string;
  variant?: string;
  addOns?: string[];
  modifications?: { modificationId: number; price: number }[];
};

export type OrderDetailsView = {
  id: string;
  orderNo: string;
  date: string;
  time: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  phone: string;
  customerId?: string | number;
  totalAmount: number;
  orderType?: OrderTypeLabel;
  tableNumber?: string;
  deliveryAddress?: string;
  landmark?: string;
  zipCode?: string;
  deliveryInstructions?: string;
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
  customerId?: string | number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderType?: OrderTypeLabel;
  tableNumber?: string;
  deliveryAddress?: string;
  landmark?: string;
  zipCode?: string;
  deliveryInstructions?: string;
  items?: OrderDetailItem[];
  subtotal?: number;
  discount?: number;
};

export function mapOrderToRow(apiOrder: ApiOrder): OrderRow {
  const orderType =
    apiOrder.orderType === "dining"
      ? "Dine In"
      : apiOrder.orderType === "takeaway"
        ? "Take Away"
        : apiOrder.orderType === "delivery"
          ? "Delivery"
          : undefined;

  return {
    id: String(apiOrder.id),
    orderNo: String(apiOrder.id),
    date: formatDate(apiOrder.createdAt),
    time: formatTime(apiOrder.createdAt),
    customerName: apiOrder.customer?.name || "Guest",
    phone: apiOrder.customer?.mobile || "N/A",
    customerId: apiOrder.customerId || apiOrder.customer?.id,
    totalAmount: Number(apiOrder.totalAmount),
    status: apiOrder.status || "pending",
    paymentStatus: (apiOrder.paymentStatus as PaymentStatus) || "pending",
    orderType,
    tableNumber: apiOrder.tableNumber,
    deliveryAddress: apiOrder.deliveryAddress,
    landmark: apiOrder.landmark,
    zipCode: apiOrder.zipcode,
    deliveryInstructions: apiOrder.deliveryInstructions,
    items: apiOrder.items?.map(mapOrderItemToDetail),
    subtotal: Number(apiOrder.totalAmount) - Number(apiOrder.tax || 0) + Number(apiOrder.orderDiscount || 0) + (apiOrder.items?.reduce((sum, item) => sum + (Number(item.productDiscount || 0) * item.quantity), 0) || 0),
    discount: Number(apiOrder.orderDiscount || 0) + (apiOrder.items?.reduce((sum, item) => sum + (Number(item.productDiscount || 0) * item.quantity), 0) || 0),
  };
}

function mapOrderItemToDetail(item: ApiOrderItem): OrderDetailItem {
  return {
    id: String(item.id),
    productId: String(item.productId),
    variationId: item.variationId != null ? String(item.variationId) : undefined,
    name: (item.product as any)?.name || "Unknown Product",
    qty: item.quantity,
    price: Number(item.unitPrice),
    productDiscount: Number(item.productDiscount || 0),
    image: item.product?.image,
    variant: item.variation?.name,
    addOns:
      item.modifications
        ?.map((modification) => modification.modification?.title)
        .filter((title): title is string => Boolean(title)) ?? undefined,
    modifications: item.modifications?.map((modification) => ({
      modificationId: Number(modification.modificationId),
      price: Number(modification.price),
    })),
  };
}
