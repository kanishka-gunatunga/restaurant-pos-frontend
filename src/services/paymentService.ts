import axiosInstance from "@/lib/api/axiosInstance";
import {
  CreatePaymentPayload,
  Payment,
  PaymentStats,
  PaymentUpdatePayload,
} from "@/types/payment";

function numField(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/,/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

/** Map API stats payload (camelCase or snake_case, optional `data` wrapper) to PaymentStats. */
export function normalizePaymentStats(raw: unknown): PaymentStats {
  const root = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const data =
    root.data != null && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;
  const refundRaw = data.refundRate ?? data.refund_rate;
  const refundRate =
    typeof refundRaw === "number" && !Number.isNaN(refundRaw)
      ? `${refundRaw.toFixed(2)}%`
      : String(refundRaw ?? "0.00%");
  return {
    totalCollectedAmount: numField(data.totalCollectedAmount ?? data.total_collected_amount),
    pendingPaymentAmount: numField(
      data.pendingPaymentAmount ??
        data.pending_payment_amount ??
        data.pendingAmount ??
        data.pending_amount
    ),
    totalRefundAmount: numField(data.totalRefundAmount ?? data.total_refund_amount),
    refundRate,
  };
}

export const createPayment = async (payload: CreatePaymentPayload): Promise<any> => {
  const res = await axiosInstance.post("/payments", payload);
  return res.data;
};

export const updatePaymentStatus = async (id: number, payload: PaymentUpdatePayload): Promise<any> => {
  const res = await axiosInstance.put(`/payments/${id}/status`, payload);
  return res.data;
};

export const getPaymentsByOrder = async (orderId: number): Promise<any[]> => {
  const res = await axiosInstance.get(`/payments/order/${orderId}`);
  return res.data;
};

export const searchPaymentDetails = async (query: string): Promise<Payment[]> => {
  const res = await axiosInstance.get("/payments/search", { params: { query } });
  return res.data;
};

export const filterPaymentsByStatus = async (status: string): Promise<Payment[]> => {
  const res = await axiosInstance.get("/payments/filter", { params: { status } });
  return res.data;
};

export const getAllPaymentDetails = async (): Promise<Payment[]> => {
  const res = await axiosInstance.get("/payments/all-details");
  return res.data;
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
  const res = await axiosInstance.get("/payments/stats");
  return normalizePaymentStats(res.data);
};
