import axiosInstance from "@/lib/api/axiosInstance";

export const registerUser = async (data: any) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getUserById = async (id: string | number) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: string | number, data: any) => {
  const res = await axiosInstance.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string | number) => {
  const res = await axiosInstance.delete(`/users/${id}`);
  return res.data;
};
