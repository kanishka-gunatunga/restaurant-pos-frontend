"use client";

import { useState } from "react";
import MenuPageHeader from "@/components/menu/MenuPageHeader";
import { OrderProvider } from "@/contexts/OrderContext";
import PaymentStats from "@/components/payments/PaymentStats";
import PaymentHistoryTable from "@/components/payments/PaymentHistoryTable";
import { Search } from "lucide-react";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <OrderProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50/50">
        <MenuPageHeader />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[24px] font-bold text-[#1D293D]">Payment Transactions</h1>
                <p className="mt-1 text-[14px] text-[#62748E]">
                  Detailed record of all financial transactions and payment statuses.
                </p>
              </div>
              <div className="relative flex-1 sm:min-w-[320px] max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                <input
                  type="text"
                  placeholder="Search by Order ID or Customer Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full text-[#1D293D] rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <PaymentStats />
            <PaymentHistoryTable searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </OrderProvider>
  );
}
