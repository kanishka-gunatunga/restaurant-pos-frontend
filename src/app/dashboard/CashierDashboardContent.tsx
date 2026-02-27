"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ChefHat,
  CheckCircle2,
  Pause,
  Wallet,
  AlertTriangle,
  Package,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function useRealTimeClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
  useEffect(() => {
    const interval = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        ),
      1000
    );
    return () => clearInterval(interval);
  }, []);
  return time;
}

const MOCK_METRICS = {
  pending: 1,
  preparing: 2,
  ready: 1,
  hold: 1,
  drawerCash: "Rs.125,230.00",
};

const MOCK_READY_ORDERS = [
  {
    id: "1029",
    customerName: "James Bond",
    type: "DINE IN",
    table: "TABLE 07",
    status: "PAID",
    time: "12:45 PM",
    itemCount: 1,
    amount: "Rs.5,230.00",
  },
];

const MOCK_HOLD_ORDERS = [
  {
    id: "1028",
    customerName: "Elena Rodriguez",
    type: "DINE IN",
    table: "TABLE 08",
    status: "PAID",
    time: "12:30 PM",
    itemCount: 2,
    amount: "Rs.5,230.00",
  },
];

const MOCK_LOW_STOCK = [
  {
    id: "1",
    name: "Crispy Chicken Burger",
    category: "Burgers • Chicken",
    status: "LOW" as const,
    stock: 3,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop",
    salesThisWeek: 98,
  },
  {
    id: "2",
    name: "BBQ Chicken Pizza",
    category: "Pizza • Specialty",
    status: "OUT" as const,
    stock: 0,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=80&h=80&fit=crop",
    salesThisWeek: 112,
  },
  {
    id: "3",
    name: "Bolognese Pasta",
    category: "Pasta • Meat",
    status: "LOW" as const,
    stock: 2,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=80&h=80&fit=crop",
    salesThisWeek: 89,
  },
];

export default function CashierDashboardContent() {
  const { user } = useAuth();
  const time = useRealTimeClock();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <DashboardPageHeader />
      <header className="flex shrink-0 flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between mt-2">
        <div>
          <h1 className="font-['Inter'] text-3xl font-bold leading-9 text-[#1D293D]">
            {getGreeting()}, {user?.name ?? "Cashier"}!
          </h1>
          <div className="mt-1 flex items-center gap-2 font-['Inter'] text-base font-normal leading-6 text-[#62748E]">
            <Calendar className="h-4 w-4" />
            <span>{getFormattedDate()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.DASHBOARD_MENU}
            className="flex h-14 items-center justify-center gap-2 rounded-[16px] bg-[#EA580C] px-5 font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_8px_10px_-6px_#EA580C4D,0px_20px_25px_-5px_#EA580C4D] transition-colors duration-300 ease-out hover:bg-[#c2410c]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Start New Order
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#FEF3C6]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 25.6668C20.4434 25.6668 25.6667 20.4435 25.6667 14.0002C25.6667 7.55684 20.4434 2.3335 14 2.3335C7.55672 2.3335 2.33337 7.55684 2.33337 14.0002C2.33337 20.4435 7.55672 25.6668 14 25.6668Z"
                    stroke="#E17100"
                    strokeWidth="2.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 7V14L18.6667 16.3333"
                    stroke="#E17100"
                    strokeWidth="2.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-3 font-['Inter'] text-[30px] font-bold leading-9 text-[#1D293D]">
                {MOCK_METRICS.pending}
              </p>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-[#62748E]">
                Pending Orders
              </p>
            </div>
            <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#DBEAFE]">
                <ChefHat className="h-7 w-7 text-[#155DFC]" />
              </div>
              <p className="mt-3 font-['Inter'] text-[30px] font-bold leading-9 text-[#1D293D]">
                {MOCK_METRICS.preparing}
              </p>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-[#62748E]">
                Preparing Orders
              </p>
            </div>
            <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#F3E8FF]">
                <CheckCircle2 className="h-7 w-7 text-[#9810FA]" />
              </div>
              <p className="mt-3 font-['Inter'] text-[30px] font-bold leading-9 text-[#1D293D]">
                {MOCK_METRICS.ready}
              </p>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-[#62748E]">
                Ready Orders
              </p>
            </div>
            <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#FFE4E6]">
                <Pause className="h-7 w-7 text-[#EC003F]" />
              </div>
              <p className="mt-3 font-['Inter'] text-[30px] font-bold leading-9 text-[#1D293D]">
                {MOCK_METRICS.hold}
              </p>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-[#62748E]">
                Hold Orders
              </p>
            </div>
            <div className="rounded-[24px] border border-white/20 p-5 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] bg-[linear-gradient(135deg,#00BC7D_0%,#009966_100%)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/20">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <p className="mt-3 font-['Inter'] text-[30px] font-bold leading-9 text-[#FFFFFF]">
                {MOCK_METRICS.drawerCash}
              </p>
              <p className="font-['Inter'] text-sm font-medium leading-5 text-[#D0FAE5]">
                Drawer Cash
              </p>
            </div>
          </div>

          {/* Two columns */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Ready & Hold orders */}
            <div className="space-y-6">
              {/* Ready Orders */}
              <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F3E8FF]">
                      <CheckCircle2 className="h-5 w-5 text-[#9810FA]" />
                    </div>
                    <div>
                      <h2 className="font-['Inter'] text-[18px] font-bold leading-7 text-[#1D293D]">
                        Ready Orders
                      </h2>
                      <p className="font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                        Orders ready for pickup/delivery
                      </p>
                    </div>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#F3E8FF] font-['Inter'] text-sm font-bold leading-5 text-[#9810FA]">
                    {MOCK_READY_ORDERS.length}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {MOCK_READY_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-4 rounded-[16px] border border-[#E9D4FF] bg-[#FAF5FF] px-4 py-4"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="shrink-0 rounded-[14px] border-2 border-[#DAB2FF] bg-white px-2.5 py-3 font-['Inter'] text-base font-bold leading-6 text-[#8200DB]">
                          #{order.id}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                              {order.customerName}
                            </p>
                            <span className="rounded-[10px] border border-[#E9D4FF] bg-white px-2 py-1 font-['Inter'] text-[10px] font-bold uppercase leading-[15px] text-[#8200DB]">
                              {order.type} • {order.table}
                            </span>
                            <span className="rounded-[10px] border border-[#A4F4CF] bg-[#ECFDF5] px-2 py-1 font-['Inter'] text-[10px] font-bold uppercase leading-[15px] text-[#009966]">
                              {order.status}
                            </span>
                          </div>
                          <p className="flex items-center gap-1 font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            {order.time} • {order.itemCount} items
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 font-['Inter'] text-right text-[20px] font-bold leading-7 text-[#8200DB]">
                        {order.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hold Orders */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 font-['Inter'] text-lg font-bold text-[#1D293D]">
                      <Pause className="h-5 w-5 text-[#EF4444]" />
                      Hold Orders
                    </h2>
                    <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">Orders on hold</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4444] font-['Inter'] text-sm font-bold text-white">
                    {MOCK_HOLD_ORDERS.length}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {MOCK_HOLD_ORDERS.map((order) => (
                    <div key={order.id} className="rounded-xl bg-[#FEF2F2] p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block rounded-full bg-[#EF4444] px-2.5 py-0.5 font-['Inter'] text-xs font-bold text-white">
                            #{order.id}
                          </span>
                          <p className="mt-2 font-['Inter'] text-base font-bold text-[#1D293D]">
                            {order.customerName}
                          </p>
                          <span className="mt-1 inline-block rounded-full bg-[#EF4444] px-2 py-0.5 font-['Inter'] text-xs font-medium text-white">
                            {order.type} • {order.table}
                          </span>
                          <span className="ml-2 inline-block rounded-full bg-[#22C55E] px-2 py-0.5 font-['Inter'] text-xs font-medium text-white">
                            {order.status}
                          </span>
                          <p className="mt-2 flex items-center gap-1 font-['Inter'] text-xs text-[#90A1B9]">
                            <Clock className="h-3.5 w-3.5" />
                            {order.time} • {order.itemCount} items
                          </p>
                        </div>
                        <p className="font-['Inter'] text-base font-bold text-[#EF4444]">
                          {order.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Low / Out of Stock */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="flex items-center gap-2 font-['Inter'] text-lg font-bold text-[#1D293D]">
                    <Package className="h-5 w-5 text-[#EA580C]" />
                    Low / Out of Stock
                  </h2>
                  <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
                    Items running low or unavailable
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
                  <span className="font-['Inter'] text-sm font-bold text-[#EF4444]">
                    {MOCK_LOW_STOCK.length}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {MOCK_LOW_STOCK.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] p-3"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{item.name}</p>
                      <p className="font-['Inter'] text-xs text-[#90A1B9]">{item.category}</p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-['Inter'] text-xs font-medium text-white ${
                          item.status === "OUT" ? "bg-[#EF4444]" : "bg-[#EAB308]"
                        }`}
                      >
                        {item.status === "OUT" ? (
                          <>
                            <span className="font-bold">®</span> OUT OF STOCK
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" /> LOW: {item.stock} left
                          </>
                        )}
                      </span>
                    </div>
                    <p className="shrink-0 font-['Inter'] text-xs text-[#90A1B9]">
                      This Week {item.salesThisWeek} units sold
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
