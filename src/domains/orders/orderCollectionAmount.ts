/** `ORDER_MONEY_TOLERANCE` (default 0.02). */
const COLLECT_EPS = 0.02;

export function collectibleOrderAmount(order: {
  totalAmount: number;
  balanceDue?: number | null;
}): number {
  const raw = order.balanceDue;
  if (raw != null && Number.isFinite(Number(raw))) {
    const n = Number(raw);
    if (n > COLLECT_EPS) return n;
    return 0;
  }
  return Number(order.totalAmount) || 0;
}

type OrderLikeForPayGate = {
  totalAmount: number;
  balanceDue?: number | null;
  requiresAdditionalPayment?: boolean | null;
  requires_additional_payment?: boolean | null;
};

export function orderNeedsPaymentCollection(order: OrderLikeForPayGate): boolean {
  const snake = order.requires_additional_payment;
  const camel = order.requiresAdditionalPayment;
  if (camel === true || snake === true) return true;
  if (camel === false || snake === false) {
    return collectibleOrderAmount(order) > COLLECT_EPS;
  }
  return collectibleOrderAmount(order) > COLLECT_EPS;
}
