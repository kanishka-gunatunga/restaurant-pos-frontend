export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string | number;
  mobile: string;
  name: string;
  address?: string;
  email?: string;
  status: CustomerStatus;
  promotions_enabled: boolean;
  orders_count?: number;
  latest_order_date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerData {
  mobile: string;
  name: string;
  address?: string;
  email?: string;
  promotions_enabled?: boolean;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

export interface BulkPromotionData {
  message: string;
}

export interface CustomerSearchParams {
  query: string;
  status?: "active" | "inactive" | "all";
}

export interface CustomerFilterParams {
  status?: "active" | "inactive" | "all";
}
