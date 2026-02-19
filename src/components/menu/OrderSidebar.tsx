"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Phone, ChefHat, Trash2 } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";
import NewOrderDetailsModal, { type OrderDetailsData } from "./NewOrderDetailsModal";

const TAX_RATE = 0.1;

export default function OrderSidebar() {
  const { items, updateQty, removeItem } = useOrder();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const orderLabel = "Current Order";
  const hasDetails = orderDetails !== null;

  const handleOrderDetailsSubmit = (data: OrderDetailsData) => {
    setOrderDetails(data);
    setShowModal(false);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <>
    <aside
      className="fixed right-0 z-40 flex w-[320px] flex-col overflow-hidden border-l border-t border-zinc-200 bg-white shadow-lg md:w-[380px]"
      style={{
        top: "var(--order-sidebar-top)",
        height: "var(--order-sidebar-height)",
      }}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        {hasDetails ? (
          <>
            <div className="mt-3 flex items-center justify-between px-5 py-2.5">
              <h2 className="font-['Arial'] text-xl font-bold leading-7 text-[#0F172B]">{orderLabel}</h2>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="font-['Arial'] text-xs font-bold uppercase leading-4 text-[#E26522] transition-opacity duration-300 ease-out hover:opacity-70"
              >
                EDIT INFO
              </button>
            </div>
            <div className="flex items-center gap-4 bg-[#F8FAFC80] px-5 pb-2.5">
              <div className="flex items-center gap-1.5 font-['Arial'] text-sm leading-5 text-[#45556C]">
                <User className="h-3.5 w-3.5" />
                <span>{orderDetails.customerName}</span>
              </div>
              <div className="flex items-center gap-1.5 font-['Arial'] text-sm leading-5 text-[#45556C]">
                <Phone className="h-3.5 w-3.5" />
                <span>{orderDetails.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] bg-[#F8FAFC80] px-5 py-1.5">
              <svg className="h-4 w-4 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 7.33331L9.33337 13.3333" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.6667 7.33335L10 2.66669" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.33337 7.33331H14.6667" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.33337 7.33331L3.40004 12.2666C3.46238 12.5723 3.62994 12.8465 3.87356 13.0414C4.11719 13.2363 4.42145 13.3396 4.73337 13.3333H11.2667C11.5786 13.3396 11.8829 13.2363 12.1265 13.0414C12.3701 12.8465 12.5377 12.5723 12.6 12.2666L13.7334 7.33331" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10.3333H13" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.33337 7.33335L6.00004 2.66669" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 7.33331L6.66667 13.3333" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-['Arial'] text-sm font-bold leading-5 text-[#E26522]">{orderDetails.orderType}</span>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 pt-4 pb-2">
              <p className="font-['Arial'] text-base font-bold leading-7 text-[#EA580C]">
                Choose a menu option to start a new order.
              </p>
            </div>
            <div className="flex items-center bg-[#F8FAFC80] px-5 pb-2.5 mt-1">
              <div className="flex w-1/2 items-center gap-1.5 font-['Arial'] text-sm leading-5 text-[#45556C]">
                <User className="h-3.5 w-3.5" />
                <span>—</span>
              </div>
              <div className="flex w-1/2 items-center gap-1.5 font-['Arial'] text-sm leading-5 text-[#45556C]">
                <Phone className="h-3.5 w-3.5" />
                <span>—</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] bg-[#F8FAFC80] px-5 py-1.5">
              <svg className="h-4 w-4 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 7.33331L9.33337 13.3333" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.6667 7.33335L10 2.66669" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.33337 7.33331H14.6667" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.33337 7.33331L3.40004 12.2666C3.46238 12.5723 3.62994 12.8465 3.87356 13.0414C4.11719 13.2363 4.42145 13.3396 4.73337 13.3333H11.2667C11.5786 13.3396 11.8829 13.2363 12.1265 13.0414C12.3701 12.8465 12.5377 12.5723 12.6 12.2666L13.7334 7.33331" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10.3333H13" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.33337 7.33335L6.00004 2.66669" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 7.33331L6.66667 13.3333" stroke="#E26522" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-['Arial'] text-sm font-bold leading-5 text-[#E26522]">—</span>
            </div>
          </>
        )}

        <div className="flex-1 overflow-y-auto px-5">
          <div className="space-y-3 py-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg className="h-6 w-6 text-[#90A1B9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <p className="mt-2 font-['Arial'] text-xs font-bold uppercase leading-4 text-[#90A1B9]">
                  NO ITEMS IN CART
                </p>
              </div>
            ) : (
            items.map((item) => {
              const variant = item.variant || "";
              const addOns = item.addOnsList || [];

              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-[14px] border border-[#F1F5F9] bg-white px-3 pb-2.5 pt-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-lg">🍽️</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <p className="font-['Arial'] text-sm font-bold leading-[17.5px] text-[#1D293D]">{item.name}</p>
                        <p className="font-['Arial'] text-[10px] font-bold uppercase leading-[15px] text-[#EA580C]">{variant}</p>
                        {addOns.length > 0 && (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {addOns.map((addOn) => {
                              const match = addOn.match(/^(.+?)\s*x(\d+)$/);
                              const label = match ? `+${match[2]} ${match[1]}` : `+${addOn}`;
                              return (
                                <span key={addOn} className="inline-block rounded bg-[#F1F5F9] px-1.5 py-0.5 font-['Arial'] text-[9px] leading-[13.5px] text-[#62748E]">
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-[#CAD5E2] hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="font-['Arial'] text-sm font-bold leading-5 text-[#0F172B]">
                        Rs.{(item.price * item.qty).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center gap-3 rounded-[10px] border border-[#F1F5F9] bg-[#F8FAFC] px-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="py-1 text-[#90A1B9] hover:text-zinc-700"
                        >
                          −
                        </button>
                        <span className="flex min-w-[16px] items-center justify-center font-['Arial'] text-xs font-black text-[#0A0A0A]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="py-1 text-[#90A1B9] hover:text-primary"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        <div className="shrink-0 space-y-2 border-t border-zinc-200 px-5 py-2">
          <div className="flex flex-col gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-3 py-2.5 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
            <p className="font-['Arial'] text-[10px] font-black uppercase leading-[15px] tracking-[1px] text-[#90A1B9]">
              Estimated Preparation
            </p>
            <p className="rounded-[10px] border border-[#F1F5F9] bg-[#F8FAFC] px-3 py-1.5 font-['Arial'] text-xs leading-[100%] text-[#45556C80]">15 mins</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[14px] border border-[#E2E8F0] bg-white py-2 font-['Arial'] text-xs font-bold leading-4 text-[#45556C] hover:bg-zinc-50"
            >
              <ChefHat className="h-4 w-4" />
              Kitchen Note
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[14px] border border-[#E2E8F0] bg-white py-2 font-['Arial'] text-xs font-bold leading-4 text-[#45556C] hover:bg-zinc-50"
            >
              <svg className="h-4 w-4 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.6667 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V5.33333L10.6667 2Z" stroke="#45556C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 2V4.66667C10 5.02029 10.1405 5.35943 10.3905 5.60948C10.6406 5.85952 10.9797 6 11.3333 6H14" stroke="#45556C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Order Note
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-['Arial'] text-sm leading-5 text-[#62748E]">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-['Arial'] text-sm leading-5 text-[#62748E]">
              <span>Tax (10%)</span>
              <span>Rs.{tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-1.5">
              <span className="font-['Arial'] text-base font-bold leading-6 text-[#0F172B]">Total Amount</span>
              <span className="font-['Arial'] text-2xl font-black leading-8 text-[#EA580C]">
                Rs.{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-[14px] border-2 border-[#E2E8F0] bg-white py-2 font-['Arial'] text-sm font-bold leading-5 text-[#62748E] hover:bg-zinc-50"
          >
            % Add Discount
          </button>

          <div className="flex gap-2.5">
            <button
              type="button"
              className="flex-1 rounded-[14px] border-2 border-[#EA580C] bg-white py-2.5 font-['Arial'] text-base font-bold leading-6 text-[#EA580C] transition-all duration-300 ease-out hover:bg-primary-muted active:scale-95"
            >
              Order Now
            </button>
            <button
              type="button"
              className="flex-1 rounded-[14px] bg-[#EA580C] py-2.5 font-['Arial'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#EA580C4D,0px_10px_15px_-3px_#EA580C4D] transition-all duration-300 ease-out hover:bg-[#DC4C04] active:scale-95"
            >
              Order & Pay
            </button>
          </div>
        </div>
      </div>
    </aside>

      {showModal && (
        <NewOrderDetailsModal
          onSubmit={handleOrderDetailsSubmit}
          initialData={orderDetails}
        />
      )}

      {!hasDetails && !showModal && (
        <div
          className="fixed inset-0 z-50 cursor-pointer"
          onClick={() => setShowModal(true)}
        />
      )}
    </>
  );
}
