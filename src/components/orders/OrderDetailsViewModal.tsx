"use client";

import { useId } from "react";
import { X, Clock, Package, User, Phone, UtensilsCrossed, DollarSign } from "lucide-react";

export type OrderStatus = "PREPARING" | "PENDING" | "COMPLETE" | "HOLD" | "READY" | "CANCELED";
export type PaymentStatus = "PENDING" | "PAID" | "PARTIAL REFUND" | "FULL REFUND";
export type OrderType = "Dine In" | "Take Away" | "Delivery";

export type OrderDetailItem = {
  name: string;
  qty: number;
  price: number;
};

export type OrderDetailsView = {
  orderNo: string;
  date: string;
  time: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  phone: string;
  totalAmount: number;
  orderType?: OrderType;
  tableNumber?: string;
  items?: OrderDetailItem[];
  subtotal?: number;
  discount?: number;
};

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string }> = {
  PREPARING: { bg: "#EFF6FF", text: "#155DFC" },
  PENDING: { bg: "#FFF4E6", text: "#E17100" },
  COMPLETE: { bg: "#E6F7F0", text: "#009966" },
  HOLD: { bg: "#F1F5F9", text: "#45556C" },
  READY: { bg: "#F3F0FF", text: "#4F39F6" },
  CANCELED: { bg: "#FFE6EB", text: "#EC003F" },
};

const formatRs = (n: number) =>
  `Rs.${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Props = {
  order: OrderDetailsView;
  onClose: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
};

export default function OrderDetailsViewModal({ order, onClose, onEdit, onCancel }: Props) {
  const paymentClipId = useId();
  const subtotal = order.subtotal ?? order.totalAmount;
  const discount = order.discount ?? 0;
  const items = order.items ?? [{ name: "Order items", qty: 1, price: order.totalAmount }];
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const orderTypeLabel = order.orderType ?? "Dine In";
  const tableLabel = order.tableNumber ? `Table ${order.tableNumber}` : "";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0px_25px_50px_-12px_#00000040]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[#E2E8F0] bg-white p-5">
          {/* Left: icon */}
          <div className="shrink-0">
            <span className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#EA580C] text-white shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]">
              <Package className="h-8 w-8" />
            </span>
          </div>

          {/* Right: title, status chip, meta */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-['Inter'] text-2xl font-bold leading-8 text-[#1D293D]">
                Order #{order.orderNo}
              </span>
              <span
                className="inline-flex rounded-[14px] border-2 px-3 py-1 font-['Inter'] text-xs font-bold uppercase leading-4"
                style={{
                  backgroundColor: order.status === "PREPARING" ? "#DBEAFE" : "#DBEAFE",
                  borderColor: "#8EC5FF",
                  color:
                    order.status === "PREPARING" ? "#1447E6" : STATUS_STYLES[order.status].text,
                }}
              >
                {order.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-['Inter'] text-sm font-normal leading-5 text-[#62748E]">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {order.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {order.time}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-[#90A1B9] transition-colors hover:bg-[#F1F5F9] hover:text-[#45556C]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - 2 column grid, scrollable with styled scrollbar */}
        <div
          className="min-h-0 flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#F1F5F9] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:hover:bg-[#94A3B8]"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
            {/* Customer Details */}
            <div className="flex flex-col gap-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-lg font-bold leading-7 text-[#1D293D]">
                  Customer Details
                </span>
                <button
                  type="button"
                  className="font-['Inter'] text-xs font-bold uppercase leading-4 text-[#EA580C] hover:underline"
                >
                  EDIT INFO
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#EA580C1A]">
                    <User className="h-4 w-4 text-[#EA580C]" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="font-['Inter'] text-xs font-medium leading-4 text-[#62748E]">
                      Name
                    </span>
                    <span className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                      {order.customerName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#DBEAFE]">
                    <Phone className="h-4 w-4 text-[#155DFC]" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="font-['Inter'] text-xs font-medium leading-4 text-[#62748E]">
                      Phone Number
                    </span>
                    <span className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                      {order.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items - scroll only inside this list when many items */}
            <div className="flex max-h-[min(220px,30vh)] flex-col gap-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <div className="shrink-0 flex items-center gap-2 font-['Inter'] text-lg font-bold leading-7 text-[#1D293D]">
                <Package className="h-5 w-5 text-[#EA580C]" />
                Order Items
              </div>
              <div className="min-h-0 overflow-y-auto space-y-2 pr-1">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-4 font-['Inter'] text-base font-bold leading-6 text-[#1D293D]"
                  >
                    <span>
                      {item.qty}x {item.name}
                    </span>
                    <span>{formatRs(item.qty * item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Type */}
            <div className="flex flex-col gap-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-['Inter'] text-lg font-bold leading-7 text-[#1D293D]">
                  <UtensilsCrossed className="h-4 w-4 text-[#1D293D]" />
                  Order Type
                </span>
                <button
                  type="button"
                  className="font-['Inter'] text-xs font-bold uppercase leading-4 text-[#EA580C] hover:underline"
                >
                  EDIT INFO
                </button>
              </div>
              <div className="flex justify-between items-center gap-2 rounded-[14px] border-2 border-[#E9D4FF] bg-[#F3E8FF] px-3 py-2">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-[#8200DB]" />
                  <span className="font-['Inter'] text-lg font-bold leading-7 text-[#8200DB]">
                    {orderTypeLabel}
                  </span>
                </div>
                {tableLabel && (
                  <>
                    <span className="font-['Inter'] text-sm font-bold leading-5 text-[#8200DB]">
                      {tableLabel}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <div className="flex items-center gap-2 font-['Inter'] text-lg font-bold leading-7 text-[#1D293D]">
                <DollarSign className="h-4 w-4 text-[#EA580C]" />
                Price Breakdown
              </div>
              <div className="space-y-2 font-['Inter']">
                <div className="flex justify-between text-base leading-6">
                  <span className="font-normal text-[#45556C]">Subtotal</span>
                  <span className="font-bold text-[#1D293D]">{formatRs(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base leading-6 mt-3 mb-3">
                  <span className="font-normal text-[#45556C]">Discount</span>
                  <span className="font-bold text-[#009966]">{formatRs(discount)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-[#CAD5E2] pt-3">
                  <span className="font-['Inter'] text-lg font-bold leading-7 text-[#1D293D]">Total Amount</span>
                  <span className="font-['Inter'] text-2xl font-bold leading-8 text-[#EA580C]">{formatRs(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information - single column like others */}
            <div className="flex flex-col gap-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] pt-[25px] pr-[25px] pb-px pl-[25px]">
              <div className="flex items-center gap-2 font-['Inter'] text-lg font-bold leading-7 text-[#1D293D]">
                <DollarSign className="h-4 w-4 text-[#EA580C]" />
                Payment Information
              </div>
              <div className="inline-flex items-center gap-3 rounded-[14px] border-2 border-[#FFD230] bg-[#FEF3C6] pl-4 pr-3 py-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
                  <g clipPath={`url(#${paymentClipId})`}>
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6024 1.66663 10 1.66663C5.39765 1.66663 1.66669 5.39759 1.66669 9.99996C1.66669 14.6023 5.39765 18.3333 10 18.3333Z" stroke="#BB4D00" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.5 10L9.16667 11.6667L12.5 8.33337" stroke="#BB4D00" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id={paymentClipId}>
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="font-['Inter'] text-base font-bold leading-6 text-[#BB4D00]">
                  Payment Status: {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex flex-wrap items-center justify-end gap-3 border-t border-[#E2E8F0] bg-white p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] bg-[#F1F5F9] px-5 py-2.5 font-['Inter'] text-sm font-bold leading-5 text-[#314158] transition-colors hover:bg-[#E2E8F0]"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 rounded-[14px] bg-[#3B82F6] px-5 py-2.5 font-['Inter'] text-sm font-bold leading-5 text-white transition-colors hover:bg-[#2563EB]"
            >
              <span className="inline-block h-4 w-4">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
              </span>
              Edit Order
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 rounded-[14px] bg-[#EC003F] px-5 py-2.5 font-['Inter'] text-sm font-bold leading-5 text-white transition-colors hover:bg-[#D10038]"
            >
              <X className="h-4 w-4" />
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
