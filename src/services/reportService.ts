import axiosInstance from "@/lib/api/axiosInstance";

export interface GetReportParams {
  startDate: string;
  endDate: string;
  branch: string | number;
  reportTypePath: string;
  product?: string;
  export?: string;
}

export const getReportData = async (params: GetReportParams) => {
  const { reportTypePath, ...queryParams } = params;
  const res = await axiosInstance.get(`/reports/${reportTypePath}`, {
    params: queryParams,
  });
  console.log(`${reportTypePath} Report API Response:`, res.data);
  return res.data;
};
