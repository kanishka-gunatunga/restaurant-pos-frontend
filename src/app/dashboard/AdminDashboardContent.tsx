"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#F8FAFC] p-8">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
        <h2 className="font-['Inter'] text-xl font-bold text-[#1D293D]">
          Admin Dashboard
        </h2>
        <p className="mt-2 font-['Inter'] text-sm text-[#62748E]">
          Welcome, {user?.name ?? "Admin"}! This dashboard is under development.
        </p>
      </div>
    </div>
  );
}
