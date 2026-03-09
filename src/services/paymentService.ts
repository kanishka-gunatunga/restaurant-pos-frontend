import axiosInstance from "@/lib/api/axiosInstance";
import { CreatePaymentPayload, Payment, PaymentUpdatePayload } from "@/types/payment";

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

export const getPaymentStats = async (): Promise<any> => {
  const res = await axiosInstance.get("/payments/stats");
  return res.data;
};
