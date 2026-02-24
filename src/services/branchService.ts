import axiosInstance from "@/lib/api/axiosInstance";

export const createBranch = async (data: any) => {
  const res = await axiosInstance.post("/branches", data);
  return res.data;
};

export const getBranches = async () => {
  const res = await axiosInstance.get("/branches");
  return res.data;
};
