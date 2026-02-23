"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

import axiosInstance from "@/lib/api/axiosInstance";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      if (response.data && response.data.token) {
        // Store the token
        localStorage.setItem("token", response.data.token);
        // Store user info if needed
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        console.log("Login successful:", response.data);
        router.push(ROUTES.DASHBOARD_MENU);
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || 
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col items-center rounded-3xl bg-white px-10 py-10 shadow-xl"
    >
      {/* Logo - Bistro/House icon */}
      <div className="mb-4 flex h-[52px] w-16 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <Image
          src="/house_icon.svg"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </div>

      <h1 className="text-center font-[Arial] text-[28px] font-black leading-[36px] tracking-[-0.75px] text-[#1D293D]">
        Savory Delights Bistro
      </h1>
      <p className="mb-8 mt-4 font-[Arial] text-[10px] font-normal leading-[15px] tracking-[1px] uppercase text-[#62748E]">
        Login Here
      </p>

      {error && (
        <div className="mb-6 w-full rounded-xl bg-red-50 p-4 text-center text-[12px] font-semibold text-red-500 border border-red-100 animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {/* Username */}
      <div className="mb-5 mt-2 w-full">
        <label
          htmlFor="username"
          className="mb-2 block font-[Arial] text-[12px] font-bold leading-[16px] tracking-[1.2px] uppercase text-[#90A1B9]"
        >
          Username
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            id="username"
            type="text"
            placeholder="admin1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-800 placeholder:font-[Arial] placeholder:text-[16px] placeholder:leading-[100%] placeholder:text-[#31415880] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-8 w-full">
        <label
          htmlFor="password"
          className="mb-2 block font-[Arial] text-[12px] font-bold leading-[16px] tracking-[1.2px] uppercase text-[#90A1B9]"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-800 placeholder:font-[Arial] placeholder:text-[16px] placeholder:leading-[100%] placeholder:text-[#31415880] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-medium text-white shadow-[var(--shadow-primary)] transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing In...
          </>
        ) : (
          <>
            Sign In to Terminal
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* Forgot credentials */}
      <p className="mt-10 text-center font-[Arial] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
        Forgot your credentials?{" "}
        <a
          href="#"
          className="inline font-[Arial] text-[16px] font-bold leading-[24px] text-primary hover:underline hover:opacity-90"
        >
          Contact Manager
        </a>
      </p>
    </form>
  );
}
