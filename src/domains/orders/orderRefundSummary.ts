import type { Order as ApiOrder } from "@/types/order";
import type { Payment } from "@/types/payment";

const EPS = 0.02;

function isSaleLikePaymentRow(p: Payment): boolean {
  const st = String(p.paymentStatus ?? "").toLowerCase();
  if (st !== "paid" && st !== "partial_refund") return false;
  const role = String(p.paymentRole ?? "").toLowerCase();
  if (role === "balance_due") return false;
  return true;
}

/** Gross amounts collected on sale-like rows (excludes `balance_due`). */
export function sumSalePaymentsGross(payments: Payment[] | undefined): number {
  if (!payments?.length) return 0;
  return payments.filter(isSaleLikePaymentRow).reduce((s, p) => s + Number(p.amount ?? 0), 0);
}

/** Sum of `refundedAmount` across all payment rows. */
export function sumRecordedRefundsFromPayments(payments: Payment[] | undefined): number {
  if (!payments?.length) return 0;
  return payments.reduce((s, p) => s + Number(p.refundedAmount ?? 0), 0);
}

export function readOrderLevelTotalRefunded(raw: Record<string, unknown>): number | undefined {
  const v =
    raw.totalRefunded ??
    raw.total_refunded ??
    raw.refundedAmount ??
    raw.refunded_amount ??
    raw.refunded_total ??
    raw.refundTotalAmount ??
    raw.refund_total_amount;
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export type OrderRefundSummary = {
  totalRefunded: number;
  totalPaidForOrder: number;
  outstandingRefund: number;
};

export function buildOrderRefundSummary(
  apiOrder: ApiOrder,
  raw: Record<string, unknown>,
  currentOrderTotal: number
): OrderRefundSummary {
  const fromOrderField = readOrderLevelTotalRefunded(raw);
  const fromPayments = sumRecordedRefundsFromPayments(apiOrder.payments);
  const totalRefunded = Math.max(fromOrderField ?? 0, fromPayments);

  const totalPaidForOrder = sumSalePaymentsGross(apiOrder.payments);

  const outstandingRefund =
    totalPaidForOrder > EPS
      ? Math.max(0, totalPaidForOrder - currentOrderTotal - totalRefunded)
      : 0;

  return { totalRefunded, totalPaidForOrder, outstandingRefund };
}
