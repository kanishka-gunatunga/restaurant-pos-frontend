"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";
import { MOCK_DISCOUNTS, type DiscountOffer } from "@/domains/inventory/types";
import AddDiscountModal from "./AddDiscountModal";

function DiscountCard({ offer }: { offer: DiscountOffer }) {
  const [isActive, setIsActive] = useState(offer.isActive);

  return (
    <div className="rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="font-['Inter'] text-[18px] font-bold leading-[28px] tracking-normal text-[#1D293D]">
              {offer.name}
            </h3>
            <span
              className={`rounded-[10px] px-2 py-1 font-['Inter'] text-xs font-bold leading-4 ${
                isActive ? "bg-[#D0FAE5] text-[#009966]" : "bg-[#F1F5F9] text-[#64748B]"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-5 font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
            {offer.productCount} product(s) • {offer.variantCount} variant(s) with discounts
          </p>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label={isActive ? "Deactivate" : "Activate"}
            onClick={() => setIsActive((prev) => !prev)}
            className={`flex h-5 w-9 shrink-0 items-center mr-2 rounded-full border-2 bg-white p-1 transition-colors duration-200 ${
              isActive ? "border-[#00BC7D] justify-end" : "border-[#CBD5E1] justify-start"
            }`}
          >
            <span
              className={`h-3 w-3 shrink-0 rounded-full transition-all duration-200 ${
                isActive ? "bg-[#00BC7D]" : "bg-[#94A3B8]"
              }`}
            />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#64748B]"
            aria-label="Edit"
          >
            <Pencil className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#FEE2E2] hover:text-[#DC2626]"
            aria-label="Delete"
          >
            <Trash2 className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {offer.items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-4"
          >
            <p className="font-['Inter'] text-xs leading-4">
              <span className="font-bold text-[#314158]">{item.productName}</span>
              {item.variant && (
                <span className="font-normal text-[#90A1B9]">{` • ${item.variant}`}</span>
              )}
            </p>
            <p className="mt-1 font-['Inter'] text-xs font-bold leading-4 text-[#EA580C]">
              {item.discountPercent}% OFF
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiscountsTab() {
  const [discounts, setDiscounts] = useState<DiscountOffer[]>(MOCK_DISCOUNTS);
  const [addDiscountOpen, setAddDiscountOpen] = useState(false);
  const [addDiscountOverlayVisible, setAddDiscountOverlayVisible] = useState(false);

  useEffect(() => {
    if (!addDiscountOpen) return;
    const raf = requestAnimationFrame(() => setAddDiscountOverlayVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [addDiscountOpen]);

  const handleCreateDiscount = (offer: DiscountOffer) => {
    setDiscounts((prev) => [...prev, offer]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-['Inter'] text-[16px] font-bold leading-6 text-[#314158]">
          Discount Products
        </h2>
        <button
          type="button"
          onClick={() => setAddDiscountOpen(true)}
          className="flex items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
          style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
        >
          <Plus className="h-4 w-4" />
          Add Discount
        </button>
      </div>
      {discounts.length > 0 ? (
        <div className="space-y-4">
          {discounts.map((offer) => (
            <DiscountCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center">
          <Tag className="mx-auto h-12 w-12 text-[#90A1B9]" />
          <p className="mt-3 font-['Inter'] text-sm text-[#62748E]">
            No discounts configured yet. Add discounts to apply to products or orders.
          </p>
        </div>
      )}

      <AddDiscountModal
        open={addDiscountOpen}
        overlayVisible={addDiscountOverlayVisible}
        onClose={() => setAddDiscountOpen(false)}
        onCreate={handleCreateDiscount}
      />
    </div>
  );
}
