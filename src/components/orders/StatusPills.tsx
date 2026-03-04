import type { OrderStatus, PaymentStatus } from "@/domains/orders/types";
import { STATUS_STYLES, PAYMENT_STATUS_STYLES } from "@/domains/orders/constants";

export function StatusPill({ status }: { status: OrderStatus }) {
  const { bg, border, text } = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 font-['Inter'] text-xs font-bold uppercase leading-4"
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      {status}
    </span>
  );
}

export function PaymentStatusPill({ status }: { status: PaymentStatus }) {
  const { bg, border, text } = PAYMENT_STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 font-['Inter'] text-xs font-bold uppercase leading-4"
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      {status}
    </span>
  );
}
