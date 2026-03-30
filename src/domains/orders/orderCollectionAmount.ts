
export const ORDER_MONEY_EPS = 0.02;

const COLLECT_EPS = ORDER_MONEY_EPS;

export function resolvePaymentSettlementAmount(
  order: Partial<{ totalAmount: unknown; balanceDue: unknown | null }> &
    Record<string, unknown>
): number {
  const bdRaw = order.balanceDue ?? order.balance_due;
  const bd = Number(bdRaw);
  if (Number.isFinite(bd) && bd > COLLECT_EPS) return bd;

  const taRaw = order.totalAmount ?? order.total_amount;
  const ta = Number(taRaw);
  if (Number.isFinite(ta) && ta >= 0) return ta;

  return 0;
}

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
