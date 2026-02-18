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
    image?: string
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

  const handleAddToOrder = () => {
    const unitPrice = totalPrice / qty;
    const details = getDetailsString();
    const image = getProdImage(item.id);
    for (let i = 0; i < qty; i++) {
      onAddToOrder(item.name, unitPrice, details, image);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
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

          <div className="flex flex-1 flex-col overflow-y-auto p-6">
            <p className="text-sm text-zinc-600">
              From Rs.
              {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>

            {hasVariants && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  SELECT VARIANT
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.variants!.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`flex flex-col items-start rounded-[14px] border-2 pt-2.5 pr-2.5 pb-0.5 pl-2.5 font-sans transition-colors ${
                        selectedVariant?.name === v.name
                          ? "border-primary bg-[#EA580C0D] text-[#EA580C] shadow-[0px_0px_0px_2px_#EA580C1A]"
                          : "border-white bg-white text-[#314158] hover:bg-zinc-50"
                      }`}
                    >
                      <span
                        className={`block font-bold text-[12px] leading-4 ${
                          selectedVariant?.name === v.name
                            ? "variant-name-selected !text-[#EA580C]"
                            : ""
                        }`}
                        {...(selectedVariant?.name === v.name && {
                          style: { color: "#EA580C" },
                        })}
                      >
                        {v.name}
                      </span>
                      <span className="mt-1 block font-normal text-[10px] leading-[15px] text-[#62748E]">
                        {v.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        LKR
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.addOns && item.addOns.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                ADD-ONS
              </p>
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search add-ons..."
                  value={addOnSearch}
                  onChange={(e) => setAddOnSearch(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
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
              <div className="space-y-2">
                {filteredAddOns.map((addOn) => {
                  const selected = selectedAddOns.find(
                    (p) => p.addOn.id === addOn.id
                  );
                  return (
                    <div
                      key={addOn.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        selected
                          ? "border-primary bg-primary-muted"
                          : "border-zinc-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAddOn(addOn)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                            selected
                              ? "border-primary bg-primary"
                              : "border-zinc-300"
                          }`}
                        >
                          {selected && (
                            <svg
                              className="h-3 w-3 text-white"
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
                        <span className="font-medium text-zinc-800">
                          {addOn.name}
                        </span>
                        <span className="text-sm text-zinc-600">
                          +
                          {addOn.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          LKR
                        </span>
                      </button>
                      {selected && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateAddOnQty(addOn.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-zinc-700"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="quantity-display flex min-w-[24px] items-center justify-center font-black text-[#0a0a0a]">
                            {selected.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateAddOnQty(addOn.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-zinc-200 pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-700"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="quantity-display flex min-w-[32px] items-center justify-center font-black text-[#0a0a0a]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase text-zinc-500">
                  TOTAL PRICE
                </p>
                <p className="text-lg font-bold text-primary">
                  Rs.
                  {totalPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToOrder}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-hover"
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
