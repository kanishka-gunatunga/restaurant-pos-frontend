export type PaymentStatus = "Paid" | "Pending" | "Cancelled" | "Refunded";

export interface Payment {
  id: string | number;
  orderNo: string | number;
  customerDetails: string;
  dateTime: string;
  method: string;
  amount?: number;
  status?: PaymentStatus;
}
