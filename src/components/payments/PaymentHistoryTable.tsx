"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Filter, Banknote, CreditCard, Globe } from "lucide-react";

type PaymentStatus = "Paid" | "Pending" | "Cancelled" | "Refunded";

interface Payment {
  id: string;
  orderId: string;
  customer: string;
  telephone: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
  time: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "#P13453443",
    orderId: "#1024",
    customer: "Michael Chen",
    telephone: "123-456-7890",
    amount: 5230.00,
    method: "Credit Card",
    status: "Paid",
    date: "Oct 24, 2023",
    time: "10:42 AM",
  },
  {
    id: "#P13453444",
    orderId: "#1025",
    customer: "John Doe",
    telephone: "123-456-7890",
    amount: 12.00,
    method: "Cash",
    status: "Paid",
    date: "Oct 24, 2023",
    time: "11:15 AM",
  },
  {
    id: "PAY-003",
    orderId: "ORD-7831",
    customer: "John Doe",
    telephone: "123-456-7890",
    amount: 45.00,
    method: "Online",
    status: "Pending",
    date: "Oct 24, 2023",
    time: "11:30 AM",
  },
  {
    id: "PAY-004",
    orderId: "ORD-7832",
    customer: "John Doe",
    telephone: "123-456-7890",
    amount: 32.50,
    method: "Credit Card",
    status: "Refunded",
    date: "Oct 23, 2023",
    time: "02:20 PM",
  },
  {
    id: "PAY-005",
    orderId: "ORD-7833",
    customer: "John Doe",
    telephone: "123-456-7890",
    amount: 120.00,
    method: "Credit Card",
    status: "Paid",
    date: "Oct 23, 2023",
    time: "04:45 PM",
  },
  {
    id: "PAY-006",
    orderId: "ORD-7834",
    customer: "John Doe",
    telephone: "123-456-7890",
    amount: 60.00,
    method: "Cash",
    status: "Paid",
    date: "Oct 22, 2023",
    time: "09:10 AM",
  },
  {
    id: "#P13453445",
    orderId: "#1026",
    customer: "John Doe",
    telephone: "123-456-7890",
    amount: 25.00,
    method: "Credit Card",
    status: "Paid",
    date: "Oct 22, 2023",
    time: "12:00 PM",
  },
];

const getMethodIcon = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes("cash")) return <Banknote className="h-4 w-4 text-[#00BC7D]" />;
  if (m.includes("card")) return <CreditCard className="h-4 w-4 text-[#2B7FFF]" />;
  if (m.includes("online")) return <Globe className="h-4 w-4 text-[#94A3B8]" />;
  return null;
};

interface PaymentHistoryTableProps {
  searchTerm: string;
}

export default function PaymentHistoryTable({ searchTerm }: PaymentHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(
      (payment) =>
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-[#ECFDF5] text-[#009966] border-[#A4F4CF]";
      case "Pending":
        return "bg-[#FFFBEB] text-[#E17100] border-[#FEE685]";
      case "Cancelled":
        return "bg-[#FFF1F2] text-[#EC003F] border-[#FFCCD3]";
      case "Refunded":
        return "bg-[#FFF1F2] text-[#EC003F] border-[#FFCCD3]";
      default:
        return "bg-[#FFF1F2] text-[#EC003F] border-[#FFCCD3]";
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
      {/* <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"> */}
        {/* <h2 className="text-lg font-bold text-zinc-900">Recent Transactions</h2> */}
        {/* <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search amount, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none ring-offset-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div> */}
      {/* </div> */}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAFC80] rounded-[25px] text-[10px] font-bold text-[#90A1B9] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Trans ID</th>
              <th className="px-6 py-3">Order No</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date & Time</th>
              <th className="px-6 py-3">Method</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              {/* <th className="px-6 py-3 font-medium text-right">Actions</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <tr key={payment.id} className="group hover:bg-zinc-50/50">
                  <td className="px-6 py-4 font-[400] text-[11px] text-[#62748E]">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-[#314158] font-bold text-[16px]">{payment.orderId}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-[#314158] flex flex-col">
                    {payment.customer} <span className="text-[#90A1B9] font-[400] font-[11px]">{payment.telephone}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[14px] text-[#314158]">
                    <div className="flex flex-col">
                    {payment.date} <span className="text-[#90A1B9] text-[11px] font-[400]">{payment.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#45556C] font-[700] text-[14px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#94A3B8] shrink-0 bg-[#F8FAFC] rounded-[14px] p-2">
                        {getMethodIcon(payment.method)}
                      </span>
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1D293D] text-[14px]">
                    Rs.{payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border-1 ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
        <p className="text-sm text-zinc-500">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
          </span>{" "}
          of <span className="font-medium">{filteredPayments.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-zinc-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div> */}
    </div>
  );
}
