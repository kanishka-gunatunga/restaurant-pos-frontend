"use client";

import { useState } from "react";
import {
  Filter,
  TrendingUp,
  Package,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Building2,
  Tag,
  Calendar,
  Building,
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { BRANCHES } from "@/lib/branchData";

export type ReportType =
  | "sales"
  | "inventory"
  | "user_activity"
  | "order_summary"
  | "payment"
  | "product_performance"
  | "branch_performance"
  | "discount_usage";

const REPORT_TYPES: {
  id: ReportType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "sales",
    label: "Sales Report",
    description: "Overview of sales performance and revenue",
    icon: TrendingUp,
  },
  {
    id: "inventory",
    label: "Inventory Report",
    description: "Stock levels, restocks, and expired items",
    icon: Package,
  },
  {
    id: "user_activity",
    label: "User Activity Report",
    description: "User logins, actions, and performance metrics",
    icon: Users,
  },
  {
    id: "order_summary",
    label: "Order Summary Report",
    description: "Order volumes, types, and completion rates",
    icon: FileText,
  },
  {
    id: "payment",
    label: "Payment Report",
    description: "Payment methods, transactions, and refunds",
    icon: DollarSign,
  },
  {
    id: "product_performance",
    label: "Product Performance Report",
    description: "Best sellers, slow movers, and trends",
    icon: BarChart3,
  },
  {
    id: "branch_performance",
    label: "Branch Performance Report",
    description: "Compare performance across branches",
    icon: Building2,
  },
  {
    id: "discount_usage",
    label: "Discount Usage Report",
    description: "Discount effectiveness and usage patterns",
    icon: Tag,
  },
];

export default function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("sales");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [branch, setBranch] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation - in production this would call an API
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-['Inter'] text-[24px] font-bold leading-8 text-[#1D293D]">
              Reports
            </h1>
            <p className="mt-1 font-['Inter'] text-[14px] font-normal italic leading-5 text-[#62748E]">
              Performance reports with real-time metrics and insights
            </p>
          </div>

          {/* Report Configuration */}
          <div className="flex max-w-[1380px] min-h-[490px] flex-col gap-6 rounded-[24px] border border-[#E2E8F0] bg-white px-[25px] pt-[25px] pb-px shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#DBEAFE]">
                <Filter className="h-4 w-4 text-[#155DFC]" />
              </div>
              <span className="font-['Inter'] text-[20px] font-bold leading-7 text-[#1D293D]">
                Report Configuration
              </span>
            </div>

            {/* Report Type Grid */}
            <div>
              <h3 className="mb-4 font-['Inter'] uppercase text-[12px] font-bold leading-4 text-[#45556C]">
                Select Report Type
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {REPORT_TYPES.map((report) => {
                  const Icon = report.icon;
                  const isSelected = selectedReport === report.id;
                  return (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => setSelectedReport(report.id)}
                      className={`relative flex min-h-[120px] min-w-[280px] flex-col items-start gap-3 rounded-[16px] border-2 p-5 text-left transition-all hover:border-primary/50 ${
                        isSelected
                          ? "border-primary bg-[#EA580C0D shadow-[0px_4px_6px_-4px_#EA580C1A,0px_10px_15px_-3px_#EA580C1A]"
                          : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex w-full items-start justify-between gap-2">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] p-2 ${
                            isSelected
                              ? "bg-[#EA580C1A] text-primary"
                              : "bg-[#F1F5F9] text-[#45556C]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {isSelected && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-['Inter'] text-[14px] font-bold leading-5 ${
                            isSelected ? "text-[#1D293D]" : "text-[#314158]"
                          }`}
                        >
                          {report.label}
                        </p>
                        <p className="mt-0.5 font-['Inter'] text-[12px] font-medium leading-4 text-[#62748E]">
                          {report.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-col gap-4 rounded-[16px] bg-[#F8FAFC] p-4 sm:flex-row sm:items-end sm:gap-6">
              <div className="min-w-0 flex-1">
                <label className="mb-1.5 block font-['Inter'] text-[12px] font-bold uppercase leading-4 text-[#45556C]">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="h-11 w-full rounded-[14px] border-2 border-[#E2E8F0] bg-white pl-10 pr-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <label className="mb-1.5 block font-['Inter'] text-[12px] font-bold uppercase leading-4 text-[#45556C]">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="h-11 w-full rounded-[14px] border-2 border-[#E2E8F0] bg-white pl-10 pr-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <label className="mb-1.5 block font-['Inter'] text-[12px] font-bold uppercase leading-4 text-[#45556C]">
                  Branch
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="h-11 w-full appearance-none rounded-[14px] border-2 border-[#E2E8F0] bg-white pl-10 pr-10 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="all">All Branches</option>
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#90A1B9]">
                    ▼
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex min-h-[40px] min-w-0 flex-1 items-center justify-center rounded-[14px] bg-[#EA580C] py-2.5 font-['Inter'] text-[14px] font-bold leading-5 text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating...
                  </span>
                ) : (
                  "Generate Report"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
