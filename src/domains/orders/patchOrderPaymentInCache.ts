import type { QueryClient } from "@tanstack/react-query";
import type { Order } from "@/types/order";
import { ORDER_KEYS } from "@/hooks/useOrder";

/** Shape from `PUT /payments/:id/status` after backend refund work. */
export function readOrderPaymentFieldsFromRefundResponse(raw: unknown): {
  orderPaymentStatus?: string;
  balanceDue?: number;
  totalRefunded?: number;
  orderId?: string | number;
} {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const st = o.orderPaymentStatus ?? o.order_payment_status;
  const bd = o.balanceDue ?? o.balance_due;
  const oid = o.orderId ?? o.order_id;
  const tr = o.totalRefunded ?? o.total_refunded ?? o.refundedAmount ?? o.refunded_amount;
  const n = bd == null || bd === "" ? NaN : Number(bd);
  const trn = tr == null || tr === "" ? NaN : Number(tr);
  return {
    orderPaymentStatus: st != null && String(st) !== "" ? String(st) : undefined,
    balanceDue: Number.isFinite(n) ? n : undefined,
    totalRefunded: Number.isFinite(trn) ? trn : undefined,
    orderId:
      oid != null && oid !== ""
        ? typeof oid === "number" || typeof oid === "string"
          ? oid
          : undefined
        : undefined,
  };
}

export function patchOrderPaymentInQueryCache(
  queryClient: QueryClient,
  orderId: string | number,
  orderPaymentStatus: string,
  balanceDue?: number,
  totalRefunded?: number
) {
  const idStr = String(orderId);

  const patchOrder = (o: Order): Order => ({
    ...o,
    paymentStatus: orderPaymentStatus,
    ...(balanceDue !== undefined ? { balanceDue } : {}),
    ...(totalRefunded !== undefined ? { totalRefunded } : {}),
  });

  queryClient.setQueriesData<Order[]>({ queryKey: ORDER_KEYS.lists() }, (old) => {
    if (!Array.isArray(old)) return old;
    return old.map((o) => (String(o.id) === idStr ? patchOrder(o) : o));
  });

  queryClient.setQueryData<Order>(ORDER_KEYS.detail(orderId), (old) => {
    if (!old || String(old.id) !== idStr) return old;
    return patchOrder(old);
  });
}
