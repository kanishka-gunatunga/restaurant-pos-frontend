"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Pencil, Loader2 } from "lucide-react";
import { useGetAllDiscounts, useActivateDiscount, useDeactivateDiscount } from "@/hooks/useDiscount";
import { Discount } from "@/types/product";
import AddDiscountModal from "./AddDiscountModal";

function DiscountCard({ offer, onEdit }: { offer: Discount; onEdit: (offer: Discount) => void }) {
  const activateMutation = useActivateDiscount();
  const deactivateMutation = useDeactivateDiscount();

  const handleToggleActive = async () => {
    if (offer.status === "active") {
      await deactivateMutation.mutateAsync(offer.id);
    } else {
      await activateMutation.mutateAsync(offer.id);
    }
  };

  const isToggling = activateMutation.isPending || deactivateMutation.isPending;
  const isActive = offer.status === "active";

  const productCount = offer.items?.reduce((acc, item) => {
    if (item.productId) acc.add(item.productId);
    return acc;
  }, new Set()).size || 0;

  const variantCount = offer.items?.length || 0;

  return (
    <div className={`rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] p-6 shadow-sm transition-opacity ${!isActive ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="font-['Inter'] text-[18px] font-bold leading-[28px] tracking-normal text-[#1D293D]">
              {offer.name}
            </h3>
            <span
              className={`rounded-[10px] px-2 py-1 font-['Inter'] text-xs font-bold leading-4 ${isActive ? "bg-[#D0FAE5] text-[#009966]" : "bg-[#F1F5F9] text-[#64748B]"
                }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-5 font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
            {productCount} product(s) • {variantCount} variant(s) with discounts
          </p>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label={isActive ? "Deactivate" : "Activate"}
            onClick={handleToggleActive}
            disabled={isToggling}
            className={`flex h-5 w-9 shrink-0 items-center mr-2 rounded-full border-2 bg-white p-1 transition-colors duration-200 ${isActive ? "border-[#00BC7D] justify-end" : "border-[#CBD5E1] justify-start"
              } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isToggling ? (
              <Loader2 className="h-3 w-3 animate-spin text-[#94A3B8]" />
            ) : (
              <span
                className={`h-3 w-3 shrink-0 rounded-full transition-all duration-200 ${isActive ? "bg-[#00BC7D]" : "bg-[#94A3B8]"
                  }`}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => onEdit(offer)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#64748B]"
            aria-label="Edit"
          >
            <Pencil className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {offer.items?.map((item, idx) => (
          <div
            key={idx}
            className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-4"
          >
            <p className="font-['Inter'] text-xs leading-4">
              <span className="font-bold text-[#314158]">{item.product?.name || "Product"}</span>
              {item.variationOption?.name && (
                <span className="font-normal text-[#90A1B9]">{` • ${item.variationOption.name}`}</span>
              )}
            </p>
            <p className="mt-1 font-['Inter'] text-xs font-bold leading-4 text-[#EA580C]">
              {item.discountType === "percentage" ? `${item.discountValue}% OFF` : `Rs.${item.discountValue} OFF`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiscountsTab() {
  const { data: discounts, isLoading } = useGetAllDiscounts({ status: "all" });
  const [addDiscountOpen, setAddDiscountOpen] = useState(false);
  const [addDiscountOverlayVisible, setAddDiscountOverlayVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    if (!addDiscountOpen) {
      setEditingDiscount(null);
      return;
    }
    const raf = requestAnimationFrame(() => setAddDiscountOverlayVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [addDiscountOpen]);

  const handleEdit = (offer: Discount) => {
    setEditingDiscount(offer);
    setAddDiscountOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EA580C]" />
      </div>
    );
  }

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
      {discounts && discounts.length > 0 ? (
        <div className="space-y-4">
          {discounts.map((offer) => (
            <DiscountCard key={offer.id} offer={offer} onEdit={handleEdit} />
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
        editingDiscount={editingDiscount}
        onClose={() => setAddDiscountOpen(false)}
      />
    </div>
  );
}
