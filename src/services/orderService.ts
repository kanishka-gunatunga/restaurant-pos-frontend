import axiosInstance from "@/lib/api/axiosInstance";

export const getOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data;
};
