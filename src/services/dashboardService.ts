import axiosInstance from "@/lib/api/axiosInstance";

export interface ExpiredProduct {
  id: number;
  quantity: number;
  productName: string;
  categoryName: string;
  image: string | null;
  variationName: string;
  expireDate: string | null;
  expiredDaysText: string;
  batchNo: string | null;
  branchName: string;
}

export interface RestockAlert {
  id: number;
  quantity: number;
  productName: string;
  categoryName: string;
  image: string | null;
  variationName: string;
  expireDate: string | null;
  expiredDaysText: string;
  batchNo: string | null;
  branchName: string;
  averageSaleForWeek: number;
  leftQuantityText: string;
}

export interface DiscountAlert {
  id: number;
  title: string;
  discountValueText: string;
  itemsSummary: string;
  expireDate: string;
}

export interface AdminDashboardData {
  totalCustomersCount: number;
  totalBranchesCount: number;
  totalUsersCount: number;
  todayCompletedOrdersCount: number;
  todayActiveOrdersCount: number;
  todayCancelledOrdersCount: number;
  totalRevenue: string;
  expiredProductsList: ExpiredProduct[];
  restockAlertsList: RestockAlert[];
  discountAlertsList: DiscountAlert[];
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardData> => {
  const res = await axiosInstance.get("/dashboard/admin");
  return res.data;
};
