import type { Order as ApiOrder, OrderItem as ApiOrderItem } from "@/types/order";
import { formatDate, formatTime } from "@/lib/format";
import { totalsFromOrderLineItems } from "./orderLineTotals";

function readBalanceDueFromApi(o: ApiOrder & Record<string, unknown>): number | undefined {
  const v = o.balanceDue ?? o.balance_due;
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "hold" | "complete" | "cancel";
export type PaymentStatus = "pending" | "paid" | "refund" | "partial_refund";

function readPaymentStatusFromApi(o: ApiOrder & Record<string, unknown>): PaymentStatus {
  const raw = o.paymentStatus ?? o.payment_status;
  if (raw == null || raw === "") return "pending";
  const s = String(raw).trim().toLowerCase().replace(/\s+/g, "_");
  const allowed: PaymentStatus[] = ["pending", "paid", "refund", "partial_refund"];
  if (allowed.includes(s as PaymentStatus)) return s as PaymentStatus;
  return "pending";
}

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
  orderDiscount?: number;
  balanceDue?: number;
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
  orderDiscount?: number;
  balanceDue?: number;
};

export function mapOrderToRow(apiOrder: ApiOrder): OrderRow {
  const raw = apiOrder as ApiOrder & Record<string, unknown>;
  const balanceDue = readBalanceDueFromApi(raw);

  const orderType =
    apiOrder.orderType === "dining"
      ? "Dine In"
      : apiOrder.orderType === "takeaway"
        ? "Take Away"
        : apiOrder.orderType === "delivery"
          ? "Delivery"
          : undefined;

  const itemDiscountSum =
    apiOrder.items?.reduce(
      (sum, item) => sum + Number(item.productDiscount || 0) * item.quantity,
      0
    ) || 0;
  const orderDiscount = Number(apiOrder.orderDiscount || 0);
  const aggregateDiscount = orderDiscount + itemDiscountSum;
  const items = apiOrder.items?.map(mapOrderItemToDetail);
  const fromLines = totalsFromOrderLineItems(items, orderDiscount);
  const subtotalFromApi =
    Number(apiOrder.totalAmount) -
    Number(apiOrder.tax || 0) +
    Number(apiOrder.orderDiscount || 0) +
    itemDiscountSum;

  return {
    id: String(apiOrder.id),
    orderNo: String(apiOrder.id),
    date: formatDate(apiOrder.createdAt),
    time: formatTime(apiOrder.createdAt),
    customerName: apiOrder.customer?.name || "Guest",
    phone: apiOrder.customer?.mobile || "N/A",
    customerId: apiOrder.customerId || apiOrder.customer?.id,
    totalAmount: fromLines?.totalAmount ?? Number(apiOrder.totalAmount),
    status: apiOrder.status || "pending",
    paymentStatus: readPaymentStatusFromApi(raw),
    orderType,
    tableNumber: apiOrder.tableNumber,
    deliveryAddress: apiOrder.deliveryAddress,
    landmark: apiOrder.landmark,
    zipCode: apiOrder.zipcode,
    deliveryInstructions: apiOrder.deliveryInstructions,
    items,
    subtotal: fromLines?.itemsSubtotal ?? subtotalFromApi,
    discount: fromLines?.totalDiscountAmount ?? aggregateDiscount,
    orderDiscount,
    balanceDue,
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
