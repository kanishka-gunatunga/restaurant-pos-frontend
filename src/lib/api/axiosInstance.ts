import axios from "axios";
import Cookies from "js-cookie";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // 1. Try to get the token from cookies first (fastest)
    let token = typeof window !== "undefined" ? Cookies.get("token") : null;

    // 2. Fallback: Get the token from NextAuth session if cookie is missing
    if (!token && typeof window !== "undefined") {
      const session = await getSession();
      token = (session?.user as { token?: string })?.token ?? null;
      
      // If we found it in the session, sync it back to the cookie for future fast access
      if (token) {
        Cookies.set("token", token, { expires: 1 }); // 1 day
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
