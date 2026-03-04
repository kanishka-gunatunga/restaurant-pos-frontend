"use client";

import { useMemo, useState } from "react";
import { CreditCard, Banknote, Globe } from "lucide-react";
import ProcessPaymentModal from "@/components/menu/ProcessPaymentModal";

export interface Payment {
  id: string;
  receiptNo: string;
  orderNo: string;
  customerName: string;
  customerMobile: string;
  dateTime: string;
  method: "Card" | "Cash" | "Online" | "Pending";
  amount: number;
  refundAmount?: number;
  status: "PAID" | "PENDING" | "PARTIAL REFUND" | "FULL REFUND";
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "1",
    receiptNo: "#P13453443",
    orderNo: "#1024",
    customerName: "Michael Chen",
    customerMobile: "0114356897",
    dateTime: "2026-02-19T11:30:00",
    method: "Card",
    amount: 5230.00,
    status: "PAID",
  },
  {
    id: "2",
    receiptNo: "#P13453443",
    orderNo: "#1025",
    customerName: "Michael Chen",
    customerMobile: "0114356897",
    dateTime: "2026-02-19T11:45:00",
    method: "Pending",
    amount: 9000.00,
    status: "PENDING",
  },
  {
    id: "3",
    receiptNo: "#P13453443",
    orderNo: "#1027",
    customerName: "Michael Chen",
    customerMobile: "0114356897",
    dateTime: "2026-02-19T12:15:00",
    method: "Card",
    amount: 8350.00,
    refundAmount: 3000.00,
    status: "PARTIAL REFUND",
  },
  {
    id: "4",
    receiptNo: "#P13453443",
    orderNo: "#1028",
    customerName: "Michael Chen",
    customerMobile: "0114356897",
    dateTime: "2026-02-19T12:30:00",
    method: "Cash",
    amount: 15600.00,
    status: "PAID",
  },
  {
    id: "5",
    receiptNo: "#P13453443",
    orderNo: "#1030",
    customerName: "Michael Chen",
    customerMobile: "0114356897",
    dateTime: "2026-02-19T13:00:00",
    method: "Card",
    amount: 14500.00,
    status: "FULL REFUND",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-[#ECFDF5] text-[#009966] border-[#A4F4CF]";
    case "PENDING":
      return "bg-[#FFFBEB] text-[#E17100] border-[#FEE685]";
    case "PARTIAL REFUND":
      return "bg-[#FFF1F2] text-[#EC003F] border-[#FFCCD3]";
    case "FULL REFUND":
      return "bg-[#FFF1F2] text-[#EC003F] border-[#FFCCD3]";
    default:
      return "bg-zinc-50 text-zinc-500 border-zinc-200";
  }
};

interface PaymentHistoryTableProps {
  searchTerm: string;
  activeFilter: string;
}

export default function PaymentHistoryTable({ searchTerm, activeFilter }: PaymentHistoryTableProps) {
  const [processingPayment, setProcessingPayment] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((payment) => {
      const matchesSearch =
        payment.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        payment.status.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleCompletePayment = () => {
    // TODO: Call API to mark payment as completed
    setProcessingPayment(null);
  };

  const getMethodDisplay = (payment: Payment) => {
    switch (payment.method) {
      case "Card":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#F1F5F9] bg-[#F8FAFC] text-[#2B7FFF]">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-[14px] font-bold text-[#45556C]">Card</span>
          </div>
        );
      case "Cash":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#F1F5F9] bg-[#F8FAFC] text-[#00D094]">
              <Banknote className="h-4 w-4" />
            </div>
            <span className="text-[14px] font-bold text-[#45556C]">Cash</span>
          </div>
        );
      case "Pending":
        return (
          <button
            onClick={() => setProcessingPayment(payment)}
            className="flex h-7 items-center gap-2 rounded-[14px] bg-[#00BC7D] px-4 text-[14px] font-bold text-white transition-all hover:bg-[#00BC86] active:scale-95"
          >
            Pay
          </button>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#F1F5F9] bg-[#F8FAFC] text-[#94A3B8]">
            <Globe className="h-4 w-4" />
            <span className="text-[14px] font-bold">{payment.method}</span>
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                RECEIPT NO
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                ORDER NO
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                CUSTOMER
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                DATE & TIME
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                METHOD
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                AMOUNT
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9] text-right">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="group hover:bg-[#F8FAFC] transition-colors">
                <td className="px-6 py-5 text-[11px] font-normal text-[#62748E]">
                  {payment.receiptNo}
                </td>
                <td className="px-6 py-5 text-[16px] font-bold text-[#314158]">
                  {payment.orderNo}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#314158]">{payment.customerName}</span>
                    <span className="text-[11px] font-normal text-[#90A1B9]">{payment.customerMobile}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-[#314158]">{formatDate(payment.dateTime)}</span>
                    <span className="text-[11px] font-normal text-[#90A1B9] uppercase">{formatTime(payment.dateTime)}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {getMethodDisplay(payment)}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1 text-[14px] font-bold">
                    {payment.status === "FULL REFUND" ? (
                      <span className="text-[#EC003F]">- Rs.{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    ) : payment.status === "PENDING" ? (
                      <span className="text-[#E17100]">+Rs.{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    ) : (
                      <>
                        <span className="text-[#009966]">+Rs.{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        {payment.refundAmount && (
                          <span className="text-[#EC003F] ml-1"> - Rs.{payment.refundAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black tracking-wider ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {processingPayment && (
        <ProcessPaymentModal
          customerName={processingPayment.customerName}
          total={processingPayment.amount}
          onClose={() => setProcessingPayment(null)}
          onComplete={handleCompletePayment}
        />
      )}
    </div>
  );
}
