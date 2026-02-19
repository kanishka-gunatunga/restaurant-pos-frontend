"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import type { MenuItem, ProductVariant, ProductAddOn } from "./types";

type ProductModalProps = {
  item: MenuItem;
  onClose: () => void;
  onAddToOrder: (
    name: string,
    price: number,
    details: string,
    image?: string,
    variant?: string,
    addOnsList?: string[]
  ) => void;
  getProdImage: (id: string) => string;
};

export default function ProductModal({
  item,
  onClose,
  onAddToOrder,
  getProdImage,
}: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    item.variants?.[0] ?? null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<
    { addOn: ProductAddOn; qty: number }[]
  >([]);
  const [qty, setQty] = useState(1);
  const [addOnSearch, setAddOnSearch] = useState("");

  const hasVariants = item.variants && item.variants.length > 0;
  const basePrice = selectedVariant?.price ?? item.price;
  const addOnsTotal = selectedAddOns.reduce(
    (sum, { addOn, qty: n }) => sum + addOn.price * n,
    0
  );
  const totalPrice = (basePrice + addOnsTotal) * qty;

  const filteredAddOns =
    item.addOns?.filter((a) =>
      a.name.toLowerCase().includes(addOnSearch.toLowerCase())
    ) ?? [];

  const toggleAddOn = (addOn: ProductAddOn) => {
    setSelectedAddOns((prev) => {
      const existing = prev.find((p) => p.addOn.id === addOn.id);
      if (existing) {
        return prev.filter((p) => p.addOn.id !== addOn.id);
      }
      return [...prev, { addOn, qty: 1 }];
    });
  };

  const updateAddOnQty = (addOnId: string, delta: number) => {
    setSelectedAddOns((prev) =>
      prev
        .map((p) =>
          p.addOn.id === addOnId
            ? { ...p, qty: Math.max(0, p.qty + delta) }
            : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  const getDetailsString = () => {
    const parts: string[] = [];
    if (selectedVariant) parts.push(selectedVariant.name);
    if (selectedAddOns.length > 0) {
      parts.push(
        ...selectedAddOns.flatMap(({ addOn, qty: n }) =>
          n > 1 ? [`${addOn.name} x${n}`] : [addOn.name]
        )
      );
    }
    return parts.join(" + ") || "REGULAR";
  };

  const getAddOnsList = () =>
    selectedAddOns.map(({ addOn, qty: n }) => (n > 1 ? `${addOn.name} x${n}` : addOn.name));

  const handleAddToOrder = () => {
    const unitPrice = totalPrice / qty;
    const details = getDetailsString();
    const image = getProdImage(item.id);
    const variantName = selectedVariant?.name;
    const addOnsParsed = getAddOnsList();
    for (let i = 0; i < qty; i++) {
      onAddToOrder(item.name, unitPrice, details, image, variantName, addOnsParsed.length > 0 ? addOnsParsed : undefined);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-full flex-col md:flex-row">
          <div className="relative h-48 w-full shrink-0 md:h-auto md:w-1/2">
            <Image
              src={getProdImage(item.id)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-white/90">
                {item.category}
              </span>
              <h2 className="text-lg font-bold text-white">{item.name}</h2>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto bg-[#F8FAFC] p-5">
            {hasVariants && (
              <div>
                <p className="mb-2 font-['Arial'] text-[10px] font-black uppercase leading-[15px] tracking-[1px] text-[#90A1B9]">
                  SELECT VARIANT
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {item.variants!.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-[14px] px-3 py-2 text-left transition-colors ${
                        selectedVariant?.name === v.name
                          ? "border-2 border-primary bg-primary-muted"
                          : "border border-[#E2E8F0] bg-white text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span
                        className={`block text-sm font-semibold ${
                          selectedVariant?.name === v.name ? "text-primary" : ""
                        }`}
                      >
                        {v.name}
                      </span>
                      <span className="block text-xs text-zinc-600">
                        {v.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} LKR
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.addOns && item.addOns.length > 0 && (
              <div className="mt-4">
                <div className="mb-3 flex items-center gap-5">
                  <p className="shrink-0 font-['Arial'] text-[10px] font-black uppercase leading-[15px] tracking-[1px] text-[#90A1B9]">
                    ADD-ONS
                  </p>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search add-ons..."
                      value={addOnSearch}
                      onChange={(e) => setAddOnSearch(e.target.value)}
                      className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F1F5F9] py-1.5 pl-8 pr-3 text-sm text-[#0A0A0A80]"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {filteredAddOns.map((addOn) => {
                    const selected = selectedAddOns.find(
                      (p) => p.addOn.id === addOn.id
                    );
                    return (
                      <div
                        key={addOn.id}
                        className={`flex items-center justify-between gap-2 rounded-md border p-2.5 ${
                          selected
                            ? "border-primary bg-primary-muted"
                            : "border-[#E2E8F0] bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleAddOn(addOn)}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                        >
                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              selected ? "border-primary bg-primary" : "border-zinc-300"
                            }`}
                          >
                            {selected && (
                              <svg
                                className="h-2.5 w-2.5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-sm font-medium text-zinc-800">
                              {addOn.name}
                            </span>
                            <span className="text-xs text-zinc-600">
                              +{addOn.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} LKR
                            </span>
                          </div>
                        </button>
                        {selected && (
                          <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#EA580C33] bg-white px-1.5 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateAddOnQty(addOn.id, -1)}
                              className="py-0.5 text-[#90A1B9] hover:text-zinc-700"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[18px] text-center text-xs font-bold text-[#0A0A0A]">
                              {selected.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateAddOnQty(addOn.id, 1)}
                              className="py-0.5 text-[#90A1B9] hover:text-primary"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 flex w-full items-stretch justify-between gap-3 border-t border-[#E2E8F0] pt-4">
              <div className="flex shrink-0 items-stretch gap-3 rounded-[14px] border border-[#E2E8F0] bg-white px-1.5 py-1.5">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex w-8 items-center justify-center rounded-[10px] bg-[#F8FAFC] text-zinc-700"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="flex min-w-[24px] items-center justify-center font-['Arial'] text-sm font-black leading-5 text-[#0A0A0A]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex w-8 items-center justify-center rounded-[10px] bg-[#EA580C] text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="font-['Arial'] text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#90A1B9]">
                  TOTAL PRICE
                </p>
                <p className="font-['Arial'] text-xl font-black leading-7 text-[#EA580C]">
                  Rs.{totalPrice.toLocaleString("en-US")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToOrder}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#EA580C] py-3 font-['Arial'] text-sm font-bold leading-4 text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-all duration-300 ease-out hover:bg-[#DC4C04] active:scale-95"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
