import axiosInstance from "@/lib/api/axiosInstance";
import { Payment } from "@/types/payment";

export const getAllPaymentDetails = async (): Promise<Payment[]> => {
  const res = await axiosInstance.get("/payments/all-details");
  return res.data;
};
