"use client";

import MenuPageHeader from "@/components/menu/MenuPageHeader";
import { OrderProvider } from "@/contexts/OrderContext";

export default function InventoryPage() {

  return (
    <OrderProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50/50">
        <MenuPageHeader />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[24px] font-bold text-[#1D293D]">Menu & Branch Management</h1>
                <p className="mt-1 text-[14px] text-[#62748E]">
                  Manage products, prices, and branches
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </OrderProvider>
  );
}
