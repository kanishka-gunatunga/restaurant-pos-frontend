"use client";

import { useState } from "react";
import {
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  Percent,
  DollarSign,
  Calendar,
  Package,
} from "lucide-react";
import {
  MOCK_PRODUCTS_FOR_DISCOUNT,
  type ProductForDiscount,
  type ProductVariantForDiscount,
  type DiscountOffer,
  type DiscountItem,
} from "@/domains/inventory/types";

type DiscountType = "percentage" | "fixed";

type SelectedDiscount = {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  basePrice: string;
  type: DiscountType;
  value: number;
};

type AddDiscountModalProps = {
  open: boolean;
  overlayVisible: boolean;
  onClose: () => void;
  onCreate: (offer: DiscountOffer) => void;
};

function parsePrice(priceStr: string): number {
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

function formatPrice(value: number): string {
  return `Rs.${value.toFixed(2)}`;
}

export default function AddDiscountModal({
  open,
  overlayVisible,
  onClose,
  onCreate,
}: AddDiscountModalProps) {
  const [discountName, setDiscountName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [selectedDiscounts, setSelectedDiscounts] = useState<SelectedDiscount[]>([]);

  const filteredProducts = MOCK_PRODUCTS_FOR_DISCOUNT.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleExpand = (productId: string) => {
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  };

  const isSelected = (productId: string, variantId?: string) =>
    selectedDiscounts.some(
      (s) => s.productId === productId && s.variantId === variantId
    );

  const handleToggleSelect = (
    product: ProductForDiscount,
    variant?: ProductVariantForDiscount
  ) => {
    const variantId = variant?.id;
    if (isSelected(product.id, variantId)) {
      setSelectedDiscounts((prev) =>
        prev.filter(
          (s) => !(s.productId === product.id && s.variantId === variantId)
        )
      );
    } else {
      const basePrice = variant?.price ?? product.price;
      setSelectedDiscounts((prev) => [
        ...prev,
        {
          productId: product.id,
          variantId,
          productName: product.name,
          variantName: variant?.name,
          basePrice,
          type: "percentage" as DiscountType,
          value: 10,
        },
      ]);
    }
  };

  const handleRemove = (productId: string, variantId?: string) => {
    setSelectedDiscounts((prev) =>
      prev.filter(
        (s) => !(s.productId === productId && s.variantId === variantId)
      )
    );
  };

  const handleUpdateDiscount = (
    productId: string,
    variantId: string | undefined,
    field: "type" | "value",
    value: DiscountType | number
  ) => {
    setSelectedDiscounts((prev) =>
      prev.map((s) =>
        s.productId === productId && s.variantId === variantId
          ? { ...s, [field]: value }
          : s
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountName.trim()) return;
    if (selectedDiscounts.length === 0) return;

    for (const s of selectedDiscounts) {
      if (s.type === "percentage" && (s.value <= 0 || s.value > 100)) return;
      if (s.type === "fixed" && s.value <= 0) return;
    }

    const items: DiscountItem[] = selectedDiscounts.map((s) => {
      const baseNum = parsePrice(s.basePrice);
      const discountPercent =
        s.type === "percentage"
          ? s.value
          : baseNum > 0
            ? (s.value / baseNum) * 100
            : 0;
      return {
        productName: s.productName,
        variant: s.variantName,
        discountPercent: Math.min(100, Math.round(discountPercent * 10) / 10),
      };
    });

    const uniqueProducts = new Set(selectedDiscounts.map((s) => s.productId));

    const offer: DiscountOffer = {
      id: `disc-${Date.now()}`,
      name: discountName.trim(),
      isActive: true,
      productCount: uniqueProducts.size,
      variantCount: selectedDiscounts.length,
      items,
    };

    onCreate(offer);
    setDiscountName("");
    setExpiryDate("");
    setSearchTerm("");
    setSelectedDiscounts([]);
    setExpandedProduct(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-discount-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
      style={{ opacity: overlayVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex shrink-0 items-start justify-between">
          <div>
            <h2
              id="add-discount-title"
              className="font-['Inter'] text-xl font-bold text-[#1D293D]"
            >
              Create New Discount
            </h2>
            <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
              Configure discounts for products and variants
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

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden"
        >
          <div className="grid shrink-0 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Discount Name <span className="text-[#EC003F]">*</span>
              </label>
              <input
                type="text"
                value={discountName}
                onChange={(e) => setDiscountName(e.target.value)}
                placeholder="e.g. Summer Sale, Weekend Special"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20"
                required
              />
            </div>
            <div>
              <label className="mb-2 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Expiry Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 pl-10 pr-4 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20"
                />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 grid gap-6 overflow-hidden sm:grid-cols-2">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <label className="mb-3 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Select Products <span className="text-[#EC003F]">*</span>
              </label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin]">
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="mx-auto h-8 w-8 text-[#90A1B9] opacity-50" />
                    <p className="mt-2 font-['Inter'] text-sm text-[#90A1B9]">
                      No products found
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const hasVariants = product.variants && product.variants.length > 0;
                    const isExpanded = expandedProduct === product.id;

                    return (
                      <div
                        key={product.id}
                        className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
                      >
                        <div
                          className="flex cursor-pointer items-center gap-3 p-3"
                          onClick={() => handleToggleExpand(product.id)}
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">
                              {product.name}
                            </p>
                            <p className="font-['Inter'] text-xs text-[#90A1B9]">
                              {product.price}
                              {hasVariants &&
                                ` • ${product.variants!.length} variants`}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9]"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-[#E2E8F0] p-3 pt-0">
                            {!hasVariants ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSelect(product);
                                }}
                                className={`mt-2 flex w-full items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                                  isSelected(product.id)
                                    ? "border-[#EA580C] bg-[#EA580C]/10"
                                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                                }`}
                              >
                                <span
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 ${
                                    isSelected(product.id)
                                      ? "border-[#EA580C] bg-[#EA580C]"
                                      : "border-[#CBD5E1]"
                                  }`}
                                >
                                  {isSelected(product.id) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </span>
                                <span className="font-['Inter'] text-sm text-[#1D293D]">
                                  {product.name}
                                </span>
                                <span className="font-['Inter'] text-xs text-[#90A1B9]">
                                  {product.price}
                                </span>
                              </button>
                            ) : (
                              <div className="mt-2 space-y-2">
                                {product.variants!.map((variant) => (
                                  <button
                                    key={variant.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleSelect(product, variant);
                                    }}
                                    className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                                      isSelected(product.id, variant.id)
                                        ? "border-[#EA580C] bg-[#EA580C]/10"
                                        : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                                    }`}
                                  >
                                    <span
                                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 ${
                                        isSelected(product.id, variant.id)
                                          ? "border-[#EA580C] bg-[#EA580C]"
                                          : "border-[#CBD5E1]"
                                      }`}
                                    >
                                      {isSelected(product.id, variant.id) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </span>
                                    <span className="flex-1 font-['Inter'] text-sm text-[#1D293D]">
                                      {variant.name}
                                    </span>
                                    <span className="font-['Inter'] text-xs text-[#90A1B9]">
                                      {variant.price}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <label className="mb-1 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Selected Products & Discounts
              </label>
              <p className="mb-4 font-['Inter'] text-xs text-[#90A1B9]">
                {selectedDiscounts.length} item(s) selected
              </p>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin]">
                {selectedDiscounts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Percent className="mx-auto h-8 w-8 text-[#90A1B9] opacity-50" />
                    <p className="mt-2 font-['Inter'] text-sm font-medium text-[#90A1B9]">
                      No products selected
                    </p>
                    <p className="font-['Inter'] text-xs text-[#90A1B9]">
                      Select products from the left panel
                    </p>
                  </div>
                ) : (
                  selectedDiscounts.map((config) => {
                    const basePriceNum = parsePrice(config.basePrice);
                    const discountAmount =
                      config.type === "percentage"
                        ? (basePriceNum * config.value) / 100
                        : config.value;
                    const finalPrice = Math.max(0, basePriceNum - discountAmount);

                    return (
                      <div
                        key={`${config.productId}-${config.variantId ?? "base"}`}
                        className="rounded-xl border border-[#E2E8F0] bg-white p-4"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">
                              {config.productName}
                              {config.variantName &&
                                ` Variant: ${config.variantName}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(config.productId, config.variantId)
                            }
                            className="rounded p-1 text-[#90A1B9] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                            aria-label="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mb-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateDiscount(
                                config.productId,
                                config.variantId,
                                "type",
                                "percentage"
                              )
                            }
                            className={`flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2 font-['Inter'] text-xs font-bold transition-colors ${
                              config.type === "percentage"
                                ? "border-[#EA580C] bg-[#EA580C]/10 text-[#EA580C]"
                                : "border-[#E2E8F0] text-[#90A1B9] hover:border-[#CBD5E1]"
                            }`}
                          >
                            <Percent className="h-3.5 w-3.5" />
                            Percentage
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateDiscount(
                                config.productId,
                                config.variantId,
                                "type",
                                "fixed"
                              )
                            }
                            className={`flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2 font-['Inter'] text-xs font-bold transition-colors ${
                              config.type === "fixed"
                                ? "border-[#EA580C] bg-[#EA580C]/10 text-[#EA580C]"
                                : "border-[#E2E8F0] text-[#90A1B9] hover:border-[#CBD5E1]"
                            }`}
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                            Fixed Price
                          </button>
                        </div>

                        <div className="mb-3">
                          <label className="mb-1 block font-['Inter'] text-[10px] font-bold uppercase tracking-wide text-[#90A1B9]">
                            Discount {config.type === "percentage" ? "(%)" : "(Rs.)"}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            max={config.type === "percentage" ? 100 : undefined}
                            value={config.value}
                            onChange={(e) =>
                              handleUpdateDiscount(
                                config.productId,
                                config.variantId,
                                "value",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                          />
                        </div>

                        <div className="rounded-lg border border-[#D0FAE5] bg-[#D0FAE5]/30 p-2">
                          <div className="flex justify-between font-['Inter'] text-xs">
                            <span className="text-[#62748E]">Original:</span>
                            <span className="text-[#90A1B9] line-through">
                              {config.basePrice}
                            </span>
                          </div>
                          <div className="mt-1 flex justify-between font-['Inter'] text-xs font-bold">
                            <span className="text-[#1D293D]">Final Price:</span>
                            <span className="text-[#009966]">
                              {formatPrice(finalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-[#E2E8F0] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 font-['Inter'] text-sm font-bold text-[#45556C] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] hover:bg-[#c2410c]"
            >
              Create Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
