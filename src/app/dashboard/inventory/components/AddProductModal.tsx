"use client";

import { Plus, Trash2, X, ChevronDown, Link2, Package, Calendar } from "lucide-react";
import type { NewProductForm } from "../types";
import { MOCK_CATEGORIES, MOCK_ADDON_GROUPS } from "../types";

type AddProductModalProps = {
  open: boolean;
  overlayVisible: boolean;
  branchName: string;
  product: NewProductForm;
  onProductChange: (product: NewProductForm | ((prev: NewProductForm) => NewProductForm)) => void;
  onVariantAdd: () => void;
  onVariantRemove: (index: number) => void;
  onVariantUpdate: (index: number, field: "name" | "price", value: string) => void;
  onAddonGroupToggle: (id: string) => void;
  onClose: () => void;
};

export default function AddProductModal({
  open,
  overlayVisible,
  branchName,
  product,
  onProductChange,
  onVariantAdd,
  onVariantRemove,
  onVariantUpdate,
  onAddonGroupToggle,
  onClose,
}: AddProductModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
      style={{ opacity: overlayVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex shrink-0 items-start justify-between">
          <div>
            <h2 id="add-product-title" className="font-['Inter'] text-[20px] font-bold text-[#1D293D]">
              Create New Product
            </h2>
            <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
              Add product details for {branchName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="product-name" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                value={product.productName}
                onChange={(e) => onProductChange((p) => ({ ...p, productName: e.target.value }))}
                placeholder="e.g. Pepperoni Pizza"
                className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <div>
              <label htmlFor="product-image" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Product Image URL
              </label>
              <div className="relative">
                <input
                  id="product-image"
                  type="url"
                  value={product.productImageUrl}
                  onChange={(e) => onProductChange((p) => ({ ...p, productImageUrl: e.target.value }))}
                  placeholder="https://unsplash.com/..."
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-3 pr-10 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
                <Link2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              </div>
            </div>
            <div>
              <label htmlFor="base-price" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Base Price (Rs.)
              </label>
              <input
                id="base-price"
                type="text"
                inputMode="decimal"
                value={product.basePrice}
                onChange={(e) => onProductChange((p) => ({ ...p, basePrice: e.target.value }))}
                placeholder="15.00"
                className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Quantity (Stock)
              </label>
              <input
                id="quantity"
                type="text"
                inputMode="numeric"
                value={product.quantity}
                onChange={(e) => onProductChange((p) => ({ ...p, quantity: e.target.value }))}
                placeholder="100"
                className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <div>
              <label htmlFor="category" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={product.category}
                  onChange={(e) => onProductChange((p) => ({ ...p, category: e.target.value }))}
                  className="w-full appearance-none rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-3 pr-10 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                >
                  <option value="">Category</option>
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              </div>
            </div>
            <div>
              <label htmlFor="sub-category" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Sub-Category
              </label>
              <div className="relative">
                <select
                  id="sub-category"
                  value={product.subCategory}
                  onChange={(e) => onProductChange((p) => ({ ...p, subCategory: e.target.value }))}
                  className="w-full appearance-none rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-3 pr-10 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                >
                  <option value="">Sub-Category</option>
                  {MOCK_CATEGORIES.flatMap((c) => c.subCategories.map((s) => ({ cat: c.name, sub: s }))).map(({ cat, sub }) => (
                    <option key={`${cat}-${sub}`} value={sub}>{sub}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-[#BFDBFE] bg-[#F0F9FF]/60 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#3B82F6]" />
              <span className="font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Inventory Details
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="batch" className="mb-1.5 flex items-center gap-1 font-['Inter'] text-xs font-medium text-[#45556C]">
                  <span>#</span> Batch Number
                </label>
                <input
                  id="batch"
                  type="text"
                  value={product.batchNumber}
                  onChange={(e) => onProductChange((p) => ({ ...p, batchNumber: e.target.value }))}
                  placeholder="e.g. BTH2024-001"
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
              <div>
                <label htmlFor="expiry" className="mb-1.5 flex items-center gap-1 font-['Inter'] text-xs font-medium text-[#45556C]">
                  <Calendar className="h-3.5 w-3.5" /> Expiry Date
                </label>
                <input
                  id="expiry"
                  type="date"
                  value={product.expiryDate}
                  onChange={(e) => onProductChange((p) => ({ ...p, expiryDate: e.target.value }))}
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex shrink-0 items-center justify-between">
              <label className="block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Product Variants (E.G. Sizes)
              </label>
              <button
                type="button"
                onClick={onVariantAdd}
                className="flex items-center gap-1 font-['Inter'] text-sm font-bold text-[#EA580C]"
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </button>
            </div>
            {product.variants.length === 0 ? (
              <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-6 font-['Inter'] text-sm text-[#90A1B9]">
                No variants added yet. Add variants for different sizes or options.
              </div>
            ) : (
              <div className="max-h-40 space-y-3 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                {product.variants.map((v, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => onVariantUpdate(i, "name", e.target.value)}
                        placeholder="Variant Name (e.g. Large)"
                        className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                      />
                    </div>
                    <div className="w-28 shrink-0">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-['Inter'] text-sm text-[#90A1B9]">Rs.</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={v.price}
                          onChange={(e) => onVariantUpdate(i, "price", e.target.value)}
                          placeholder="Price"
                          className="w-full rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-8 pr-3 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                        />
                      </div>
                    </div>
                    <div className="flex items-end pb-1">
                      <button
                        type="button"
                        onClick={() => onVariantRemove(i)}
                        className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
              Attach Add-on Groups
            </label>
            <div className="flex flex-wrap gap-3">
              {MOCK_ADDON_GROUPS.map((g) => {
                const selected = product.addonGroupIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onAddonGroupToggle(g.id)}
                    className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition-colors ${
                      selected
                        ? "border-[#EA580C] bg-[#EA580C1A]"
                        : "border-[#E2E8F0] bg-white hover:border-[#CAD5E2]"
                    }`}
                  >
                    <span className={`h-4 w-4 shrink-0 rounded-full border-2 ${selected ? "border-[#EA580C] bg-[#EA580C]" : "border-[#90A1B9]"}`} />
                    <div>
                      <p className="font-['Inter'] text-xs text-[#90A1B9]">{g.items.length} items</p>
                      <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{g.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex shrink-0 justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 font-['Inter'] text-sm font-bold text-[#45556C] hover:bg-[#F8FAFC]"
          >
            Discard
          </button>
          <button
            type="button"
            className="rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] hover:bg-[#c2410c]"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
