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
