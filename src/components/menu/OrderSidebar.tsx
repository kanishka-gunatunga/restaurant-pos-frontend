"use client";

import Image from "next/image";
import { User, Phone, ShoppingBag, ChefHat, FileText, Trash2 } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";

const TAX_RATE = 0.1;

export default function OrderSidebar() {
  const { items, updateQty, removeItem, orders, activeOrderId } = useOrder();

  const activeOrderIndex = orders.findIndex((o) => o.id === activeOrderId);
  const orderLabel = activeOrderIndex >= 0 ? `Order ${activeOrderIndex + 1}` : "Current Order";

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <aside
      className="fixed right-0 z-40 flex w-[320px] flex-col overflow-hidden border-l border-t border-zinc-200 bg-white shadow-lg md:w-[380px]"
      style={{
        top: "var(--order-sidebar-top)",
        height: "var(--order-sidebar-height)",
      }}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-bold text-zinc-800">{orderLabel}</h2>
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
          >
            EDIT INFO
          </button>
        </div>

        <div className="space-y-2 px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <User className="h-4 w-4 text-zinc-500" />
            <span>Aruna Madushanka</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <Phone className="h-4 w-4 text-zinc-500" />
            <span>077-1234-342</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <ShoppingBag className="h-4 w-4 text-zinc-500" />
            <span>Take Away</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <div className="space-y-4 py-2">
            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                No items in order. Click menu items to add.
              </p>
            ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xl">🍽️</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-800">{item.name}</p>
                  <p className="text-xs uppercase text-zinc-500">{item.details}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-700">
                      Rs.{(item.price * item.qty).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                      >
                        −
                      </button>
                      <span className="quantity-display flex min-w-[28px] items-center justify-center font-black text-[#0a0a0a]">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 self-start text-zinc-400 hover:text-red-500"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )))}
          </div>
        </div>

        <div className="shrink-0 space-y-4 border-t border-zinc-200 px-5 py-4">
          <div className="rounded-lg bg-zinc-50 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Estimated Preparation
            </p>
            <p className="text-lg font-semibold text-zinc-800">15 mins</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <ChefHat className="h-4 w-4" />
              Kitchen Note
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <FileText className="h-4 w-4" />
              Order Note
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-700">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-zinc-700">
              <span>Tax (10%)</span>
              <span>Rs.{tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2">
              <span className="font-bold text-zinc-800">Total Amount</span>
              <span className="text-xl font-bold text-primary">
                Rs.{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            % Add Discount
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl border-2 border-primary bg-white py-3 font-semibold text-primary transition-colors hover:bg-primary-muted"
            >
              Order Now
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Order & Pay
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
