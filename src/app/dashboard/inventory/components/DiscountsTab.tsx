"use client";

import { Plus, Tag } from "lucide-react";

export default function DiscountsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-['Inter'] text-lg font-bold text-[#1D293D]">
          Discounts
        </h2>
        <button
          type="button"
          className="flex items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
          style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
        >
          <Plus className="h-4 w-4" />
          Add Discount
        </button>
      </div>
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center">
        <Tag className="mx-auto h-12 w-12 text-[#90A1B9]" />
        <p className="mt-3 font-['Inter'] text-sm text-[#62748E]">
          No discounts configured yet. Add discounts to apply to products or orders.
        </p>
      </div>
    </div>
  );
}
