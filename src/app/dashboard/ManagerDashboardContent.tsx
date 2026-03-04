"use client";

import { useSyncExternalStore } from "react";
import {
  Clock,
  CheckCircle2,
  Pause,
  XCircle,
  Users,
  Wallet,
  TrendingUp,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BranchBuildingIcon from "@/components/icons/BranchBuildingIcon";
import CashOutIcon from "@/components/icons/CashOutIcon";
import ExpiredBadgeIcon from "@/components/icons/ExpiredBadgeIcon";
import RestockPackageIcon from "@/components/icons/RestockPackageIcon";
import ExpiredCalendarIcon from "@/components/icons/ExpiredCalendarIcon";
import TodayCalendarIcon from "@/components/icons/TodayCalendarIcon";
import RevenueChartIcon from "@/components/icons/RevenueChartIcon";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { BRANCHES, getBranchByNumericId } from "@/lib/branchData";
import { getFirstName } from "@/lib/format";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const MOCK_ORDER_METRICS = {
  completed: 120,
  active: 8,
  hold: 1,
  cancelled: 0,
};

const MOCK_FINANCIAL_METRICS = {
  activeCashiers: 3,
  todayRevenue: "Rs.325,230.00",
  drawerCash: "Rs.225,230.00",
  todayCashOuts: "Rs.125,230.00",
};

const MOCK_EXPIRED_ITEMS = [
  {
    id: "1",
    name: "Coca Cola",
    category: "Beverages",
    units: "12 units",
    batch: "B-2731",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=80&h=80&fit=crop",
    expiredDays: "2 days expired",
  },
  {
    id: "2",
    name: "Chocolate Lava Cake",
    category: "Desert",
    variant: "Medium",
    units: "5 units",
    batch: "B-7421",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=80&h=80&fit=crop",
    expiredDays: "1 day expired",
  },
];

const MOCK_RESTOCK_ALERTS = [
  {
    id: "1",
    name: "French Fries",
    category: "Sides",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=80&h=80&fit=crop",
    stock: 3,
    weeklyAvg: "98/week avg",
  },
  {
    id: "2",
    name: "Chocolate Cookie",
    category: "Desert",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop",
    stock: 2,
    weeklyAvg: "45/week avg",
  },
];

const MOCK_DISCOUNT_ALERTS = [
  {
    id: "1",
    name: "Weekend Special",
    type: "percentage" as const,
    tag: "Up to 15% OFF",
    daysLeft: "1 days left",
    products: "2 product(s) • 4 variant(s) with discounts",
    expires: "2/28/2026",
  },
  {
    id: "2",
    name: "Pizza Monday",
    type: "fixed" as const,
    tag: "Up to Rs.2500.00 OFF",
    daysLeft: "2 days left",
    products: "2 product(s) • 4 variant(s) with discounts",
    expires: "3/1/2026",
  },
];

export default function ManagerDashboardContent() {
  const { user } = useAuth();
  const branch =
    user?.branchId != null ? (getBranchByNumericId(user.branchId) ?? BRANCHES[0]) : BRANCHES[0];

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F8FAFC]">
      <DashboardPageHeader />
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        <header className="mb-4 flex shrink-0 flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-['Inter'] text-xl font-bold leading-tight text-[#1D293D] sm:text-3xl sm:leading-9">
              {getGreeting()}, {getFirstName(user?.name) || "Manager"}!
            </h1>
            <div className="mt-1 flex items-center gap-2 font-['Inter'] text-base font-normal leading-6 text-[#62748E]">
              <BranchBuildingIcon className="h-4 w-4 shrink-0 text-[#62748E]" />
              <span>{branch?.name ?? "Branch"}</span>
            </div>
          </div>
          <button
            type="button"
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-4 font-['Inter'] text-sm font-bold leading-5 text-[#45556C]"
          >
            <TodayCalendarIcon className="h-4 w-4 shrink-0 text-[#45556C]" />
            Today
          </button>
        </header>

        <main className="space-y-4 sm:space-y-6">
          {/* Row 1: Order Status Cards */}
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            {[
              {
                label: "Completed Orders",
                value: MOCK_ORDER_METRICS.completed,
                icon: CheckCircle2,
                bg: "#D0FAE5",
                iconColor: "#009966",
                badge: "TODAY",
                badgeBg: "#ECFDF5",
                badgeColor: "#009966",
              },
              {
                label: "Active Orders",
                value: MOCK_ORDER_METRICS.active,
                icon: Clock,
                bg: "#DBEAFE",
                iconColor: "#155DFC",
              },
              {
                label: "Hold Orders",
                value: MOCK_ORDER_METRICS.hold,
                icon: Pause,
                bg: "#FEF3C6",
                iconColor: "#E17100",
              },
              {
                label: "Cancelled Orders",
                value: MOCK_ORDER_METRICS.cancelled,
                icon: XCircle,
                bg: "#FFE4E6",
                iconColor: "#EC003F",
              },
            ].map(({ label, value, icon: Icon, bg, iconColor, badge, badgeBg, badgeColor }) => (
              <div
                key={label}
                className="min-w-0 rounded-[24px] border border-[#E2E8F0] bg-white p-4 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-[16px]"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="h-7 w-7" style={{ color: iconColor }} />
                  </div>
                  {badge && (
                    <span
                      className="rounded-[10px] px-2 py-0.5 font-['Inter'] text-[10px] font-bold uppercase leading-4"
                      style={{ backgroundColor: badgeBg, color: badgeColor }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 font-['Inter'] text-[clamp(1.25rem,2.5vw+0.75rem,1.875rem)] font-bold leading-tight text-[#1D293D]">
                  {value}
                </p>
                <p className="font-['Inter'] text-sm font-medium leading-5 text-[#62748E]">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Row 2: Financial Cards */}
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {/* Active Cashiers */}
            <div className="relative min-w-0 rounded-[24px] border border-[#E2E8F0] bg-white p-4 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] sm:p-5">
              <span className="absolute right-3 top-3 rounded-[10px] bg-[#F3E8FF] px-2 py-0.5 font-['Inter'] text-[10px] font-bold uppercase leading-4 text-[#9810FA]">
                LIVE
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#F3E8FF]">
                <Users className="h-5 w-5 text-[#9810FA]" />
              </div>
              <p className="mt-3 font-['Inter'] text-[clamp(1.25rem,2.5vw+0.75rem,1.875rem)] font-bold leading-tight text-[#1D293D]">
                {MOCK_FINANCIAL_METRICS.activeCashiers}
              </p>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-[#62748E]">
                Active Cashiers
              </p>
            </div>

            {/* Today's Revenue */}
            <div className="relative min-w-0 overflow-hidden rounded-[24px] border border-[#51A2FF] p-4 shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] sm:p-5 bg-[linear-gradient(135deg,#2B7FFF_0%,#155DFC_100%)]">
              <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
                <RevenueChartIcon className="h-6 w-6" />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/20">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="scrollbar-subtle mt-3 min-w-0 overflow-x-auto">
                <p className="whitespace-nowrap font-['Inter'] text-[clamp(1.25rem,2.5vw+0.75rem,1.875rem)] font-bold leading-tight text-[#FFFFFF]">
                  {MOCK_FINANCIAL_METRICS.todayRevenue}
                </p>
              </div>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-white/90">
                Today&apos;s Revenue
              </p>
            </div>

            {/* Drawer Cash */}
            <div className="min-w-0 overflow-hidden rounded-[24px] border border-white/20 p-4 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] sm:p-5 bg-[linear-gradient(135deg,#00BC7D_0%,#009966_100%)]">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/20">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <span className="rounded-[10px] bg-white/20 px-2 py-0.5 font-['Inter'] text-[10px] font-bold uppercase leading-4 text-[#D0FAE5]">
                  CASH
                </span>
              </div>
              <div className="scrollbar-subtle mt-3 min-w-0 overflow-x-auto">
                <p className="whitespace-nowrap font-['Inter'] text-[clamp(1.25rem,2.5vw+0.75rem,1.875rem)] font-bold leading-tight text-[#FFFFFF]">
                  {MOCK_FINANCIAL_METRICS.drawerCash}
                </p>
              </div>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-[#D0FAE5]">
                Drawer Cash
              </p>
            </div>

            {/* Today's Cash Outs */}
            <div className="min-w-0 overflow-hidden rounded-[24px] border border-white/20 p-4 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] sm:p-5 bg-[linear-gradient(135deg,#FF6900_0%,#F54900_100%)]">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/20">
                  <CashOutIcon className="h-8 w-8" />
                </div>
                <span className="rounded-[10px] bg-white/20 px-2 py-0.5 font-['Inter'] text-[10px] font-bold uppercase leading-4 text-white/90">
                  OUT
                </span>
              </div>
              <div className="scrollbar-subtle mt-3 min-w-0 overflow-x-auto">
                <p className="whitespace-nowrap font-['Inter'] text-[clamp(1.25rem,2.5vw+0.75rem,1.875rem)] font-bold leading-tight text-[#FFFFFF]">
                  {MOCK_FINANCIAL_METRICS.todayCashOuts}
                </p>
              </div>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-white/90">
                Today&apos;s Cash Outs
              </p>
            </div>
          </div>

          {/* Row 3: Alert Panels */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Expired Items */}
            <div className="flex max-h-[643px] flex-col overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="shrink-0 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#FFE4E6]">
                      <ExpiredCalendarIcon className="h-6 w-6 text-[#E7000B]" />
                    </div>
                    <div>
                      <h2 className="font-['Inter'] text-[18px] font-bold leading-7 text-[#1D293D]">
                        Expired Items
                      </h2>
                      <p className="font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                        Items past expiry date
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FFE4E6]">
                    <span className="font-['Inter'] text-sm font-bold leading-5 text-[#EC003F]">
                      {MOCK_EXPIRED_ITEMS.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="scrollbar-subtle mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto px-6 pb-6 pr-5">
                {MOCK_EXPIRED_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-[16px] border-2 border-[#FFC9C9] bg-[#FEF2F2] px-4 py-4"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                        {item.name}
                      </p>
                      <span className="flex flex-wrap items-center gap-x-2 font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                        {[item.category, item.variant, item.units, item.batch]
                          .filter(Boolean)
                          .map((part, i) => (
                            <span key={i} className="contents">
                              {i > 0 && <span className="text-[#CAD5E2]">•</span>}
                              <span>{part}</span>
                            </span>
                          ))}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-[10px] border border-[#FFC9C9] bg-[#FFE2E2] px-2 py-1 font-['Inter'] text-xs font-bold leading-4 text-[#C10007]">
                        <ExpiredBadgeIcon className="h-3 w-3 text-[#C10007]" />
                        {item.expiredDays}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restock Alerts */}
            <div className="flex max-h-[643px] flex-col overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="shrink-0 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FEF3C6]">
                      <RestockPackageIcon className="h-5 w-5 text-[#E17100]" />
                    </div>
                    <div>
                      <h2 className="font-['Inter'] text-[18px] font-bold leading-7 text-[#1D293D]">
                        Restock Alerts
                      </h2>
                      <p className="font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                        Low stock items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-[#FE9A00]" />
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FEF3C6] font-['Inter'] text-sm font-bold leading-5 text-[#E17100]">
                      {MOCK_RESTOCK_ALERTS.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="scrollbar-subtle mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto px-6 pb-6 pr-5">
                {MOCK_RESTOCK_ALERTS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-[16px] border-2 border-[#FEE685] bg-[#FFFBEB] px-4 py-4"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                        {item.name}
                      </p>
                      <p className="font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                        {item.category}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0 font-['Inter'] text-xs leading-4">
                        <span className="inline-flex items-center gap-1 rounded-[10px] border border-[#FEE685] bg-[#FEF3C6] px-2 py-1 font-bold text-[#BB4D00]">
                          <AlertTriangle className="h-3 w-3 text-[#BB4D00]" />
                          Only {item.stock} left
                        </span>
                        <span className="font-normal text-[#90A1B9]">{item.weeklyAvg}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Alerts */}
            <div className="flex max-h-[643px] flex-col overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="shrink-0 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#DBEAFE]">
                      <Tag className="h-5 w-5 text-[#155DFC]" />
                    </div>
                    <div>
                      <h2 className="font-['Inter'] text-[18px] font-bold leading-7 text-[#1D293D]">
                        Discount Alerts
                      </h2>
                      <p className="font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                        Exclusive Offers
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#DBEAFE]">
                    <span className="font-['Inter'] text-sm font-bold leading-5 text-[#155DFC]">
                      {MOCK_DISCOUNT_ALERTS.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="scrollbar-subtle mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto px-6 pb-6 pr-5">
                {MOCK_DISCOUNT_ALERTS.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-1 rounded-[16px] border-2 border-[#BEDBFF] bg-[#EFF6FF] p-[18px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        className="shrink-0 rounded-[10px] text-[#EA580C] px-3 py-1.5 font-['Inter'] text-xs font-bold hover:text-[#c2410c]"
                      >
                        MORE
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-[10px] border px-2 py-1 font-['Inter'] text-[10px] font-bold leading-4 ${
                          item.type === "percentage"
                            ? "border-[#E9D4FF] bg-[#F3E8FF] text-[#8200DB]"
                            : "border-[#A4F4CF] bg-[#D0FAE5] text-[#007A55]"
                        }`}
                      >
                        {item.tag}
                      </span>
                      <span className="rounded-[10px] border border-[#FFC9C9] bg-[#FFE2E2] px-2 py-1 font-['Inter'] text-[10px] font-bold leading-4 text-[#C10007]">
                        {item.daysLeft}
                      </span>
                    </div>
                    <p className="font-['Inter'] mt-1 text-xs font-bold leading-4 text-[#62748E]">
                      {item.products}
                    </p>
                    <p className="font-['Inter'] text-xs font-normal leading-4 text-[#90A1B9]">
                      Expires: {item.expires}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
