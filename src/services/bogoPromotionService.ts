import axiosInstance from "@/lib/api/axiosInstance";
import { BogoPromotion, CreateBogoPromotionPayload, UpdateBogoPromotionPayload } from "@/types/bogoPromotion";

const API_URL = "/bogo-promotions";

export const getAllBogoPromotions = async (status: "active" | "inactive" | "all" = "active"): Promise<BogoPromotion[]> => {
  const response = await axiosInstance.get(API_URL, { params: { status } });
  return response.data;
};

export const getBogoPromotionById = async (id: number): Promise<BogoPromotion> => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

export const createBogoPromotion = async (data: CreateBogoPromotionPayload): Promise<BogoPromotion> => {
  const response = await axiosInstance.post(API_URL, data);
  return response.data;
};

export const updateBogoPromotion = async (id: number, data: UpdateBogoPromotionPayload): Promise<BogoPromotion> => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const activateBogoPromotion = async (id: number): Promise<void> => {
  const response = await axiosInstance.patch(`${API_URL}/${id}/activate`);
  return response.data;
};

export const deactivateBogoPromotion = async (id: number): Promise<void> => {
  const response = await axiosInstance.patch(`${API_URL}/${id}/deactivate`);
  return response.data;
};
