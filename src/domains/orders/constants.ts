import type { OrderStatus, PaymentStatus } from "./types";

export const STATUS_STYLES: Record<OrderStatus, { bg: string; border: string; text: string }> = {
  PREPARING: { bg: "#EFF6FF", border: "#BEDBFF", text: "#155DFC" },
  PENDING: { bg: "#FFF4E6", border: "#FFE0B3", text: "#E17100" },
  COMPLETE: { bg: "#E6F7F0", border: "#B3E6D1", text: "#009966" },
  HOLD: { bg: "#F1F5F9", border: "#CAD5E2", text: "#45556C" },
  READY: { bg: "#F3F0FF", border: "#D4C5FF", text: "#4F39F6" },
  CANCELED: { bg: "#FFE6EB", border: "#FFB3C1", text: "#EC003F" },
};

export const PAYMENT_STATUS_STYLES: Record<PaymentStatus, { bg: string; border: string; text: string }> = {
  PENDING: { bg: "#FFF4E6", border: "#FFE0B3", text: "#E17100" },
  PAID: { bg: "#E6F7F0", border: "#B3E6D1", text: "#009966" },
  "PARTIAL REFUND": { bg: "#FFE6EB", border: "#FFB3C1", text: "#EC003F" },
  "FULL REFUND": { bg: "#FFE6EB", border: "#FFB3C1", text: "#EC003F" },
};

export const ORDER_STATUS_OPTIONS: (OrderStatus | "All")[] = [
  "All",
  "PENDING",
  "PREPARING",
  "READY",
  "COMPLETE",
  "HOLD",
  "CANCELED",
];

export const PAYMENT_STATUS_OPTIONS: (PaymentStatus | "All")[] = [
  "All",
  "PENDING",
  "PAID",
  "PARTIAL REFUND",
  "FULL REFUND",
];
