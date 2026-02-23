"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useAuth, type UserRole } from "@/contexts/AuthContext";

/** Sample credentials for development. Replace with backend auth later. */
const SAMPLE_CREDENTIALS: { employeeId: string; pin: string; role: UserRole; name: string }[] = [
  { employeeId: "EMP-1001", pin: "1234", role: "cashier", name: "Sarah" },
  { employeeId: "EMP-2001", pin: "1234", role: "manager", name: "James" },
  { employeeId: "EMP-3001", pin: "1234", role: "admin", name: "Alex" },
];

export default function LoginForm() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "cashier") router.replace(ROUTES.DASHBOARD_MENU);
      else router.replace(ROUTES.DASHBOARD);
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const id = employeeId.trim().toUpperCase();
    const matched = SAMPLE_CREDENTIALS.find(
      (c) => c.employeeId.toUpperCase() === id && c.pin === pin
    );
    if (!matched) {
      setError("Invalid Employee ID or PIN.");
      return;
    }
    login(matched.role, matched.name);
    if (matched.role === "cashier") {
      router.push(ROUTES.DASHBOARD_MENU);
    } else {
      router.push(ROUTES.DASHBOARD);
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
        <p className="mb-4 w-full rounded-xl bg-red-50 px-4 py-2.5 font-[Arial] text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Employee ID */}
      <div className="mb-5 w-full">
        <label
          htmlFor="employeeId"
          className="mb-2 block font-[Arial] text-[12px] font-bold leading-[16px] tracking-[1.2px] uppercase text-[#90A1B9]"
        >
          Employee ID
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            id="employeeId"
            type="text"
            placeholder="EMP-1024"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-800 placeholder:font-[Arial] placeholder:text-[16px] placeholder:leading-[100%] placeholder:text-[#31415880] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Secure PIN */}
      <div className="mb-8 w-full">
        <label
          htmlFor="pin"
          className="mb-2 block font-[Arial] text-[12px] font-bold leading-[16px] tracking-[1.2px] uppercase text-[#90A1B9]"
        >
          Secure PIN
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            id="pin"
            type="password"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-800 placeholder:font-[Arial] placeholder:text-[16px] placeholder:leading-[100%] placeholder:text-[#31415880] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-medium text-white shadow-[var(--shadow-primary)] transition-all hover:bg-primary-hover active:scale-[0.98]"
      >
        Sign In to Terminal
        <ArrowRight className="h-5 w-5" />
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
