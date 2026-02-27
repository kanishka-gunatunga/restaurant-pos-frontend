"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ShoppingCart,
  Timer,
  ChefHat,
  CheckCircle2,
  Pause,
  Wallet,
  AlertTriangle,
  Package,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="flex shrink-0 flex-col gap-4 border-b border-[#E2E8F0] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Inter'] text-2xl font-bold text-[#1D293D]">
            {getGreeting()}, {user?.name ?? "Cashier"}!
          </h1>
          <div className="mt-1 flex items-center gap-2 text-[#62748E]">
            <Calendar className="h-4 w-4" />
            <span className="font-['Inter'] text-sm">{getFormattedDate()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 sm:flex">
            <Calendar className="h-4 w-4 text-[#90A1B9]" />
            <span className="font-['Inter'] text-sm text-[#45556C]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 sm:flex">
            <Clock className="h-4 w-4 text-[#90A1B9]" />
            <span className="font-['Inter'] text-sm font-medium text-[#1D293D]">
              {time}
            </span>
          </div>
          <Link
            href={ROUTES.DASHBOARD_MENU}
            className="flex items-center gap-2 rounded-xl bg-[#EA580C] px-5 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-colors hover:bg-[#c2410c]"
          >
            <ShoppingCart className="h-5 w-5" />
            Start New Order
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <Timer className="h-8 w-8 text-[#EAB308]" />
              <p className="mt-3 font-['Inter'] text-2xl font-bold text-[#1D293D]">
                {MOCK_METRICS.pending}
              </p>
              <p className="font-['Inter'] text-sm text-[#62748E]">
                Pending Orders
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <ChefHat className="h-8 w-8 text-[#3B82F6]" />
              <p className="mt-3 font-['Inter'] text-2xl font-bold text-[#1D293D]">
                {MOCK_METRICS.preparing}
              </p>
              <p className="font-['Inter'] text-sm text-[#62748E]">
                Preparing Orders
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-[#8B5CF6]" />
              <p className="mt-3 font-['Inter'] text-2xl font-bold text-[#1D293D]">
                {MOCK_METRICS.ready}
              </p>
              <p className="font-['Inter'] text-sm text-[#62748E]">
                Ready Orders
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <Pause className="h-8 w-8 text-[#EF4444]" />
              <p className="mt-3 font-['Inter'] text-2xl font-bold text-[#1D293D]">
                {MOCK_METRICS.hold}
              </p>
              <p className="font-['Inter'] text-sm text-[#62748E]">
                Hold Orders
              </p>
            </div>
            <div className="rounded-2xl border-0 bg-[#22C55E] p-5 shadow-sm">
              <Wallet className="h-8 w-8 text-white" />
              <p className="mt-3 font-['Inter'] text-2xl font-bold text-white">
                {MOCK_METRICS.drawerCash}
              </p>
              <p className="font-['Inter'] text-sm text-white/90">
                Drawer Cash
              </p>
            </div>
          </div>

          {/* Two columns */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Ready & Hold orders */}
            <div className="space-y-6 lg:col-span-2">
              {/* Ready Orders */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 font-['Inter'] text-lg font-bold text-[#1D293D]">
                      <CheckCircle2 className="h-5 w-5 text-[#8B5CF6]" />
                      Ready Orders
                    </h2>
                    <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
                      Orders ready for pickup/delivery
                    </p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5CF6] font-['Inter'] text-sm font-bold text-white">
                    {MOCK_READY_ORDERS.length}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {MOCK_READY_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl bg-[#F5F3FF] p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block rounded-full bg-[#8B5CF6] px-2.5 py-0.5 font-['Inter'] text-xs font-bold text-white">
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
                        <p className="font-['Inter'] text-base font-bold text-[#8B5CF6]">
                          {order.amount}
                        </p>
                      </div>
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
                    <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
                      Orders on hold
                    </p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4444] font-['Inter'] text-sm font-bold text-white">
                    {MOCK_HOLD_ORDERS.length}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {MOCK_HOLD_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl bg-[#FEF2F2] p-4"
                    >
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
                      <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">
                        {item.name}
                      </p>
                      <p className="font-['Inter'] text-xs text-[#90A1B9]">
                        {item.category}
                      </p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-['Inter'] text-xs font-medium text-white ${
                          item.status === "OUT"
                            ? "bg-[#EF4444]"
                            : "bg-[#EAB308]"
                        }`}
                      >
                        {item.status === "OUT" ? (
                          <>
                            <span className="font-bold">®</span> OUT OF STOCK
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" /> LOW:{" "}
                            {item.stock} left
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
