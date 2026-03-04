import axiosInstance from "@/lib/api/axiosInstance";
import { 
  Customer, 
  CreateCustomerData, 
  UpdateCustomerData, 
  CustomerSearchParams, 
  CustomerFilterParams,
  BulkPromotionData
} from "@/types/customer";

export const getAllCustomers = async (params?: CustomerFilterParams): Promise<Customer[]> => {
  const res = await axiosInstance.get("/customers", { params });
  return res.data;
};

export const searchCustomers = async (params: CustomerSearchParams): Promise<Customer[]> => {
  const res = await axiosInstance.get("/customers/search", { params });
  return res.data;
};

export const getCustomerByMobile = async (mobile: string): Promise<Customer> => {
  const res = await axiosInstance.get(`/customers/mobile/${mobile}`);
  return res.data;
};

export const getCustomerById = async (id: string | number): Promise<Customer> => {
  const res = await axiosInstance.get(`/customers/${id}`);
  return res.data;
};

export const createCustomer = async (data: CreateCustomerData): Promise<Customer> => {
  const res = await axiosInstance.post("/customers", data);
  return res.data;
};

export const findOrCreateCustomer = async (data: CreateCustomerData): Promise<Customer> => {
  const res = await axiosInstance.post("/customers/find-or-create", data);
  return res.data;
};

export const updateCustomer = async (id: string | number, data: UpdateCustomerData): Promise<Customer> => {
  const res = await axiosInstance.put(`/customers/${id}`, data);
  return res.data;
};

export const updatePromotionPreference = async (
  id: string | number, 
  promotions_enabled: boolean
): Promise<{ message: string; customer: Customer }> => {
  const res = await axiosInstance.put(`/customers/${id}/promotions`, { promotions_enabled });
  return res.data;
};

export const sendBulkPromotions = async (data: BulkPromotionData): Promise<{ message: string; mobitel_response: any }> => {
  const res = await axiosInstance.post("/customers/send-promotions", data);
  return res.data;
};

export const activateCustomer = async (id: string | number): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/customers/${id}/activate`);
  return res.data;
};

export const deactivateCustomer = async (id: string | number): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/customers/${id}/deactivate`);
  return res.data;
};
