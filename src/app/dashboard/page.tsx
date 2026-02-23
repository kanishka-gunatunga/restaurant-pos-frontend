"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

export default function DashboardPage() {
  const router = useRouter();
  const { isCashier, isManagerOrAdmin } = useAuth();

  useEffect(() => {
    if (isCashier) {
      router.replace(ROUTES.DASHBOARD_MENU);
    }
  }, [isCashier, router]);

  if (isCashier) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50/50">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-['Inter'] text-[24px] font-bold leading-8 text-[#1D293D]">
            Dashboard
          </h1>
          <p className="mt-2 font-['Inter'] text-sm text-[#62748E]">
            Welcome. Dashboard content will be added by the UI team.
          </p>
        </div>
      </div>
    </div>
  );
}
