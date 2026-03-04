import axiosInstance from "@/lib/api/axiosInstance";
import { Branch, CreateBranchData } from "@/types/branch";

export const createBranch = async (data: CreateBranchData): Promise<Branch> => {
  const res = await axiosInstance.post("/branches", data);
  return res.data;
};

export const getBranches = async () => {
  const res = await axiosInstance.get("/branches");
  return res.data;
};