"use client";

import { Calendar, ChevronDown, Download, DollarSign, ShoppingBag, Users as UsersIcon, Activity } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RevenuePerformanceChart from "@/components/dashboard/RevenuePerformanceChart";
import OrderDistributionChart from "@/components/dashboard/OrderDistributionChart";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import TimeFrameDropdown from "@/components/dashboard/TimeFrameDropdown";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Revenue",
      value: "Rs.512,845.00",
      icon: DollarSign,
      trend: { value: "12.5", isPositive: true },
      iconBgColor: "bg-[#EFF6FF]",
      iconColor: "text-[#155DFC]",
    },
    {
      label: "Total Orders",
      value: "642",
      icon: ShoppingBag,
      trend: { value: "8.2", isPositive: true },
      iconBgColor: "bg-[#FFFBEB]",
      iconColor: "text-[#E17100]",
    },
    {
      label: "New Customers",
      value: "48",
      icon: UsersIcon,
      trend: { value: "3.1", isPositive: false },
      iconBgColor: "bg-[#ECFDF5]",
      iconColor: "text-[#009966]",
    },
    {
      label: "Avg. Check",
      value: "Rs.3460.01",
      icon: Activity,
      trend: { value: "4.3", isPositive: true },
      iconBgColor: "bg-[#FFF1F2]",
      iconColor: "text-[#EC003F]",
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <DashboardPageHeader />
      
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-[#1D293D]">Operational Dashboard</h2>
            <p className="text-[14px] text-[#62748E]">Real-time performance metrics and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <TimeFrameDropdown />
            <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-primary transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              <span>Download Report</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <DashboardStatCard key={index} {...stat} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenuePerformanceChart />
          </div>
          <div>
            <OrderDistributionChart />
          </div>
        </div>
      </main>
    </div>
  );
}
