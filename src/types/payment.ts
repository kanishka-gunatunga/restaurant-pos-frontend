export type PaymentStatus = "paid" | "pending" | "refund" | "partial_refund" | string;

export interface Payment {
  id: number;
  orderNo: number;
  customerName: string;
  customerMobile: string;
  dateTime: string;
  method: string | null;
  paymentStatus: PaymentStatus;
  amount: number;
  refundedAmount?: number;
}

export interface PaymentUpdatePayload {
  status?: PaymentStatus;
  is_refund?: number;
  refund_type?: "partial" | "full";
  refund_amount?: number;
}

export interface CreatePaymentPayload {
  orderId: number;
  paymentMethod: "cash" | "card";
  amount: number;
  transactionId?: string;
  status?: PaymentStatus;
}

export interface PaymentStats {
  totalCollectedAmount: number;
  pendingPaymentAmount: number;
  totalRefundAmount: number;
  refundRate: string;
}
