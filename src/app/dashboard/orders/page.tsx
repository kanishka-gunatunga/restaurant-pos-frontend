"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, Pencil, Trash2, Lock, X } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ROUTES } from "@/lib/constants";

type OrderStatus = "PREPARING" | "PENDING" | "COMPLETE" | "HOLD" | "READY" | "CANCELED";

type OrderRow = {
  id: string;
  orderNo: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  status: OrderStatus;
};

const STATUS_STYLES: Record<OrderStatus, { bg: string; border: string; text: string }> = {
  PREPARING: { bg: "#EFF6FF", border: "#BEDBFF", text: "#155DFC" },
  PENDING: { bg: "#FFF4E6", border: "#FFE0B3", text: "#E17100" },
  COMPLETE: { bg: "#E6F7F0", border: "#B3E6D1", text: "#009966" },
  HOLD: { bg: "#F1F5F9", border: "#CAD5E2", text: "#45556C" },
  READY: { bg: "#F3F0FF", border: "#D4C5FF", text: "#4F39F6" },
  CANCELED: { bg: "#FFE6EB", border: "#FFB3C1", text: "#EC003F" },
};

const MOCK_ORDERS: OrderRow[] = [
  {
    id: "1",
    orderNo: "1024",
    date: "2026-02-19",
    time: "11:30 AM",
    customerName: "Samantha Reed",
    phone: "0712345678",
    totalAmount: 5230,
    status: "PREPARING",
  },
  {
    id: "2",
    orderNo: "1023",
    date: "2026-02-19",
    time: "11:22 AM",
    customerName: "James Chen",
    phone: "0771234567",
    totalAmount: 3890,
    status: "PENDING",
  },
  {
    id: "3",
    orderNo: "1022",
    date: "2026-02-19",
    time: "11:15 AM",
    customerName: "Maria Garcia",
    phone: "0723456789",
    totalAmount: 6750,
    status: "COMPLETE",
  },
  {
    id: "4",
    orderNo: "1021",
    date: "2026-02-19",
    time: "11:08 AM",
    customerName: "David Kim",
    phone: "0762345678",
    totalAmount: 2100,
    status: "HOLD",
  },
  {
    id: "5",
    orderNo: "1020",
    date: "2026-02-19",
    time: "11:00 AM",
    customerName: "Emma Wilson",
    phone: "0753456789",
    totalAmount: 4450,
    status: "READY",
  },
  {
    id: "6",
    orderNo: "1019",
    date: "2026-02-19",
    time: "10:52 AM",
    customerName: "Alex Brown",
    phone: "0784567890",
    totalAmount: 1890,
    status: "CANCELED",
  },
];

function StatusPill({ status }: { status: OrderStatus }) {
  const { bg, border, text } = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 font-['Inter'] text-xs font-bold uppercase leading-4"
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      {status}
    </span>
  );
}

function ManagerAuthorizationModal({
  orderNo,
  isOpen,
  onClose,
  onVerify,
}: {
  orderNo: string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (passcode: string) => void;
}) {
  const [passcode, setPasscode] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length === 4) {
      onVerify(passcode);
      setPasscode("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[32px] border border-[#FFFFFF33] bg-white p-6 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFE6EB]">
              <Lock className="h-6 w-6 text-[#FF476E]" />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-[#90A1B9] transition-colors hover:bg-[#F1F5F9] hover:text-[#45556C]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 mt-5">
          <h2 className="font-['Inter'] text-[20px] font-bold leading-[28px] text-[#1D293D]">
            Manager Authorization
          </h2>
          <p className="mt-2 font-['Inter'] text-sm font-bold leading-[22.75px] text-[#62748E]">
            To cancel order <span className="font-['Inter'] text-sm font-bold leading-[22.75px] text-[#314158]">#{orderNo}</span>, please
            enter the manager passcode for verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={passcode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 4) setPasscode(value);
            }}
            placeholder="Enter 4-digit passcode"
            className="w-full rounded-[16px] border-2 border-[#F3E4E1C9] bg-[#FAFBFD] pl-[15px] pr-4 py-3 text-center font-['Inter'] text-base font-bold leading-[100%] tracking-[3px] text-[#0A0A0A54] placeholder:font-medium placeholder:text-[#90A1B9] placeholder:tracking-normal focus:border-[#FF476E] focus:outline-none focus:ring-1 focus:ring-[#FF476E]/20"
            autoFocus
          />

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[16px] bg-[#F1F5F9] px-4 py-3 text-center font-['Inter'] text-base font-bold leading-6 text-[#45556C] transition-colors hover:bg-[#E2E8F0]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={passcode.length !== 4}
              className="flex-1 rounded-[16px] bg-[#FF2056] px-4 py-3 text-center font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#FFCCD3,0px_10px_15px_-3px_#FFCCD3] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              Verify & Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; orderNo: string | null }>({
    isOpen: false,
    orderNo: null,
  });

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return MOCK_ORDERS;
    const q = search.trim().toLowerCase();
    return MOCK_ORDERS.filter(
      (o) =>
        o.orderNo.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
    );
  }, [search]);

  const handleDeleteClick = (orderNo: string) => {
    setAuthModal({ isOpen: true, orderNo });
  };

  const handleVerify = (passcode: string) => {
    // TODO: Verify passcode with backend
    // TODO: Update order status to CANCELED
    setAuthModal({ isOpen: false, orderNo: null });
  };

  const handleCloseModal = () => {
    setAuthModal({ isOpen: false, orderNo: null });
  };

  const handleEditClick = (order: OrderRow) => {
    if (order.status === "PENDING") {
      // TODO: Replace with actual API call to fetch order items from backend
      const dummyItems = [
        {
          id: crypto.randomUUID(),
          name: "Margherita Pizza",
          details: "REGULAR",
          variant: "Large",
          addOnsList: ["+2 Extra Cheese", "+1 Mushrooms"],
          price: 1250,
          qty: 1,
          image: "/prod/1.png",
        },
        {
          id: crypto.randomUUID(),
          name: "Chicken Burger",
          details: "REGULAR",
          variant: "Medium",
          addOnsList: ["+1 Bacon", "+1 Avocado"],
          price: 890,
          qty: 2,
          image: "/prod/2.png",
        },
        {
          id: crypto.randomUUID(),
          name: "Caesar Salad",
          details: "REGULAR",
          price: 650,
          qty: 1,
          image: "/prod/3.png",
        },
      ];
      
      const orderData = {
        id: order.id,
        orderNo: order.orderNo,
        customerName: order.customerName,
        phone: order.phone,
        totalAmount: order.totalAmount,
        items: dummyItems,
      };
      sessionStorage.setItem(`order_${order.id}`, JSON.stringify(orderData));
      router.push(`${ROUTES.DASHBOARD_MENU}?orderId=${order.id}&orderNo=${order.orderNo}`);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <DashboardPageHeader />
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-['Inter'] text-[24px] font-bold leading-[32px] tracking-normal text-[#1D293D]">
                Ongoing Orders
              </h1>
              <p className="mt-2 font-['Inter'] text-sm font-normal leading-5 text-[#62748E]">
                Manage and track all current restaurant orders.
              </p>
            </div>
            <div className="relative w-full sm:min-w-[384px] sm:max-w-[384px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID, Customer, or Phone..."
                className="w-full rounded-[16px] border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 font-['Inter'] text-sm leading-[100%] text-[#0A0A0A] placeholder:font-medium placeholder:text-[#45556C80] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]/20"
              />
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
            <div className="overflow-hidden">
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] border-collapse font-['Arial']">
                  <thead>
                    <tr className="border-b  border-[#E2E8F0]">
                      <th className="p-4 text-left font-['Inter'] text-[10px] font-bold leading-[15px] tracking-[1px] uppercase text-[#90A1B9]">
                        Order No
                      </th>
                      <th className="p-4 text-left font-['Inter'] text-[10px] font-bold leading-[15px] tracking-[1px] uppercase text-[#90A1B9]">
                        Date & Time
                      </th>
                      <th className="p-4 text-left font-['Inter'] text-[10px] font-bold leading-[15px] tracking-[1px] uppercase text-[#90A1B9]">
                        Customer Details
                      </th>
                      <th className="p-4 text-right font-['Inter'] text-[10px] font-bold leading-[15px] tracking-[1px] uppercase text-[#90A1B9]">
                        Total Amount
                      </th>
                      <th className="p-4 text-left font-['Inter'] text-[10px] font-bold leading-[15px] tracking-[1px] uppercase text-[#90A1B9]">
                        Status
                      </th>
                      <th className="p-4 text-right font-['Inter'] text-[10px] font-bold leading-[15px] tracking-[1px] uppercase text-[#90A1B9]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center font-['Arial'] text-sm text-[#62748E]"
                        >
                          No orders match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-[#F1F5F9] transition-colors hover:bg-[#F8FAFC]/50"
                        >
                          <td className="p-4 font-['Inter'] text-base font-bold leading-6 text-[#314158]">
                            #{order.orderNo}
                          </td>
                          <td className="p-4">
                            <span className="block font-['Inter'] text-sm font-semibold leading-5 text-[#314158]">
                              {order.date}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1 font-['Inter'] text-[11px] font-normal leading-[16.5px] text-[#90A1B9]">
                              <Clock className="h-3.5 w-3.5" />
                              {order.time}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="block font-['Inter'] text-sm font-bold leading-5 text-[#314158]">
                              {order.customerName}
                            </span>
                            <span className="font-['Inter'] text-xs font-normal leading-4 text-[#90A1B9]">
                              {order.phone}
                            </span>
                          </td>
                          <td className="p-4 text-right font-['Inter'] text-sm font-bold leading-5 text-[#1D293D]">
                            Rs.
                            {order.totalAmount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="p-4">
                            <StatusPill status={order.status} />
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditClick(order)}
                                disabled={order.status !== "PENDING"}
                                className={`rounded-lg p-1.5 transition-colors ${
                                  order.status === "PENDING"
                                    ? "text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C] cursor-pointer"
                                    : "text-[#CAD5E2] cursor-not-allowed opacity-50"
                                }`}
                                aria-label="Edit order"
                                title={order.status !== "PENDING" ? "Only pending orders can be edited" : "Edit order"}
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(order.orderNo)}
                                className="rounded-lg p-1.5 text-[#90A1B9] transition-colors hover:bg-red-50 hover:text-red-600"
                                aria-label="Delete order"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="flex flex-col gap-3 md:hidden">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[14px] border border-[#F1F5F9] bg-white p-4 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-['Inter'] text-base font-bold leading-6 text-[#314158]">
                          #{order.orderNo}
                        </span>
                        <span className="ml-2">
                          <StatusPill status={order.status} />
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditClick(order)}
                          disabled={order.status !== "PENDING"}
                          className={`rounded-lg p-1.5 transition-colors ${
                            order.status === "PENDING"
                              ? "text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C] cursor-pointer"
                              : "text-[#CAD5E2] cursor-not-allowed opacity-50"
                          }`}
                          aria-label="Edit order"
                          title={order.status !== "PENDING" ? "Only pending orders can be edited" : "Edit order"}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(order.orderNo)}
                          className="rounded-lg p-1.5 text-[#90A1B9] hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 font-['Inter'] text-sm font-bold leading-5 text-[#314158]">
                      {order.customerName}
                    </p>
                    <p className="font-['Inter'] text-xs font-normal leading-4 text-[#90A1B9]">
                      {order.phone}
                    </p>
                    <p className="mt-1 font-['Inter'] text-[11px] font-normal leading-[16.5px] text-[#90A1B9]">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {order.date} · {order.time}
                    </p>
                    <p className="mt-2 font-['Inter'] text-sm font-bold leading-5 text-[#1D293D]">
                      Rs.{order.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <p className="py-8 text-center font-['Arial'] text-sm text-[#62748E]">
                    No orders match your search.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {authModal.orderNo && (
        <ManagerAuthorizationModal
          orderNo={authModal.orderNo}
          isOpen={authModal.isOpen}
          onClose={handleCloseModal}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
}
