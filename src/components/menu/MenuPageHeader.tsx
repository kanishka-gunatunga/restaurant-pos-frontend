"use client";

import Image from "next/image";
import { Calendar, Clock, Plus, Layers, X } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFormattedTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MenuPageHeader() {
  const {
    orders,
    activeOrderId,
    setActiveOrderId,
    addOrder,
    closeOrder,
    canAddOrder,
    canCloseOrder,
  } = useOrder();

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"
            style={{
              boxShadow:
                "0px 4px 6px -4px #EA580C33, 0px 10px 15px -3px #EA580C33",
            }}
          >
            <Image
              src="/house_icon.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-[22.5px] tracking-normal text-[#1D293D]">
              Savory Delights Bistro
            </h1>
            <p className="text-xs font-medium text-zinc-500">
              MAHARAGAMA BRANCH
            </p>
          </div>
        </div>

        {/* Order tabs - pill-shaped like in design */}
        <div className="flex items-center gap-2">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${
                activeOrderId === order.id
                  ? "bg-slate-100"
                  : "bg-zinc-50 hover:bg-zinc-100"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveOrderId(order.id)}
                className="flex items-center gap-2"
              >
                <Layers
                  className={`h-4 w-4 shrink-0 ${
                    activeOrderId === order.id ? "text-primary" : "text-zinc-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    activeOrderId === order.id
                      ? "text-primary"
                      : "text-zinc-600"
                  }`}
                >
                  Order {index + 1}
                </span>
              </button>
              {canCloseOrder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeOrder(order.id);
                  }}
                  className="rounded-full p-0.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
                  aria-label={`Close Order ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {canAddOrder && (
            <button
              type="button"
              onClick={addOrder}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-zinc-500">
                <Plus className="h-3.5 w-3.5" />
              </span>
              New Order
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{getFormattedDate()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{getFormattedTime()}</span>
        </div>
      </div>
    </header>
  );
}
