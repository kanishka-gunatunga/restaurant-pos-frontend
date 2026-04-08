"use client";

import { useState, useEffect } from "react";
import {
  X,
  Search,
  Check,
  Calendar,
  Package,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { type Product } from "@/types/product";
import { useGetAllProducts } from "@/hooks/useProduct";
import { useGetAllBranches } from "@/hooks/useBranch";

type AddBogoModalProps = {
  open: boolean;
  overlayVisible: boolean;
  onClose: () => void;
  editingBogo?: any;
};

export default function AddBogoModal({
  open,
  overlayVisible,
  onClose,
  editingBogo,
}: AddBogoModalProps) {
  const { data: products } = useGetAllProducts({ status: "active" });
  const { data: branches } = useGetAllBranches("active");

  const [step, setStep] = useState(1);
  const [promoName, setPromoName] = useState(() => editingBogo?.name ?? "");
  const [expiryDate, setExpiryDate] = useState(() => editingBogo?.expiryDate ?? "");
  const [isForAllBranches, setIsForAllBranches] = useState(
    () => editingBogo?.isForAllBranches ?? true
  );
  const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>(
    () => editingBogo?.branches?.map((b: any) => b.branchId) ?? []
  );

  const [buyQty, setBuyQty] = useState<number>(() => editingBogo?.buyQty ?? 1);
  const [getQty, setGetQty] = useState<number>(() => editingBogo?.getQty ?? 1);

  const [buySearch, setBuySearch] = useState("");
  const [freeSearch, setFreeSearch] = useState("");
  const [selectedBuyProduct, setSelectedBuyProduct] = useState<Product | null>(null);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState<Product | null>(null);

  const isEditing = !!editingBogo;
  const isLoading = false;

  const filteredBuyProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(buySearch.toLowerCase())
  ) || [];

  const filteredFreeProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(freeSearch.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    toast.success("BOGO promotion created successfully!");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
      style={{ opacity: overlayVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-5xl flex-col rounded-[24px] border border-[#E2E8F0] bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex shrink-0 items-start justify-between">
          <div>
            <h2 className="font-['Inter'] text-2xl font-bold text-[#1D293D]">
              Create BOGO Promotion
            </h2>
            <p className="mt-1 font-['Inter'] text-sm text-[#94A3B8]">
              Set up a Buy One Get One offer
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#45556C]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
          {step === 1 ? (
            <div className="flex flex-col gap-6 overflow-hidden">
              <div className="grid shrink-0 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                    Promotion Name <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={promoName}
                    onChange={(e) => setPromoName(e.target.value)}
                    placeholder="e.g. Pizza Tuesday, Burger Bonanza"
                    className="w-full rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                    Expiry Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFC] py-3.5 pl-10 pr-4 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col overflow-hidden">
                <label className="mb-3 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  Select Branches <span className="text-[#F43F5E]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 sm:grid-cols-4">
                   <div
                    onClick={() => {
                      setIsForAllBranches(true);
                      setSelectedBranchIds([]);
                    }}
                    className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all outline-none ${
                      isForAllBranches
                        ? "border-[#EA580C] bg-[#EA580C]/5 shadow-sm"
                        : "border-[#F1F5F9] bg-white hover:border-[#EA580C]/30"
                    }`}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors absolute top-4 left-4">
                      {isForAllBranches && <div className="h-2.5 w-2.5 rounded-full bg-[#EA580C]" />}
                    </div>
                    <div className="mt-4">
                      <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">All Branches</p>
                      <p className="mt-1 font-['Inter'] text-xs text-[#94A3B8]">Apply everywhere</p>
                    </div>
                  </div>

                  {branches?.map((branch) => {
                    const isSelected = !isForAllBranches && selectedBranchIds.includes(branch.id);
                    return (
                      <div
                        key={branch.id}
                        onClick={() => {
                          setIsForAllBranches(false);
                          setSelectedBranchIds(prev =>
                            isSelected ? prev.filter(id => id !== branch.id) : [...prev, branch.id]
                          );
                        }}
                        className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all outline-none ${
                          isSelected
                            ? "border-[#EA580C] bg-[#EA580C]/5 shadow-sm"
                            : "border-[#F1F5F9] bg-white hover:border-[#EA580C]/30"
                        }`}
                      >
                         <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors absolute top-4 left-4">
                          {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#EA580C]" />}
                        </div>
                        <div className="mt-4">
                          <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{branch.name}</p>
                          <p className="mt-1 font-['Inter'] text-xs text-[#94A3B8] truncate">{branch.location || "123 Main St"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BOGO Configuration Section */}
              <div className="flex flex-col gap-3">
                 <label className="block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  BOGO Configuration <span className="text-[#F43F5E]">*</span>
                </label>
                <div className="rounded-[20px] bg-[#FDF2F8]/50 border border-[#FDF2F8] p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center group">
                      <p className="mb-2 font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Buy Quantity</p>
                      <div className="relative mx-auto w-full max-w-[200px]">
                        <input
                          type="number"
                          value={buyQty}
                          onChange={(e) => setBuyQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full rounded-[20px] border border-[#FDF2F8] bg-white p-8 text-center font-['Inter'] text-[32px] font-bold text-[#D946EF] shadow-sm focus:border-[#D946EF] focus:outline-none"
                        />
                      </div>
                      <p className="mt-3 font-['Inter'] text-[11px] text-[#94A3B8]">Customer must buy this many</p>
                    </div>
                    <div className="text-center group">
                      <p className="mb-2 font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Get Free Quantity</p>
                      <div className="relative mx-auto w-full max-w-[200px]">
                        <input
                          type="number"
                          value={getQty}
                          onChange={(e) => setGetQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full rounded-[20px] border border-[#FDF2F8] bg-white p-8 text-center font-['Inter'] text-[32px] font-bold text-[#D946EF] shadow-sm focus:border-[#D946EF] focus:outline-none"
                        />
                      </div>
                      <p className="mt-3 font-['Inter'] text-[11px] text-[#94A3B8]">Customer gets this many free</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-8 overflow-hidden">
              {/* Select Buy Product */}
              <div className="flex flex-col overflow-hidden">
                <label className="mb-3 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  Select Buy Product <span className="text-[#F43F5E]">*</span>
                </label>
                <div className="flex flex-col gap-4 overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-[#F8FAFC] p-4">
                   <div className="relative shrink-0">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={buySearch}
                      onChange={(e) => setBuySearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-[12px] border border-[#F1F5F9] bg-white py-2.5 pl-11 pr-4 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
                    {filteredBuyProducts.map((p) => {
                      const isSelected = selectedBuyProduct?.id === p.id;
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => setSelectedBuyProduct(p)}
                          className={`flex min-w-[240px] cursor-pointer items-center justify-between rounded-[14px] border-2 p-3 transition-all ${
                            isSelected ? "border-[#D946EF] bg-[#FDF2F8]" : "border-[#F1F5F9] bg-white hover:border-[#D946EF]/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={p.image || ""} className="h-11 w-11 rounded-lg object-cover" alt="" />
                            <div>
                                <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{p.name}</p>
                                <p className="font-['Inter'] text-[11px] text-[#94A3B8]">Rs. {Number(p.variations?.[0]?.options?.[0]?.prices?.[0]?.price || 0).toFixed(2)}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-[#D946EF]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Select Free Product */}
              <div className="flex flex-col overflow-hidden">
                <label className="mb-3 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  Select Free Product <span className="text-[#F43F5E]">*</span>
                </label>
                <div className="flex flex-col gap-4 overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-[#F8FAFC] p-4">
                   <div className="relative shrink-0">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={freeSearch}
                      onChange={(e) => setFreeSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-[12px] border border-[#F1F5F9] bg-white py-2.5 pl-11 pr-4 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
                    {filteredFreeProducts.map((p) => {
                      const isSelected = selectedFreeProduct?.id === p.id;
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => setSelectedFreeProduct(p)}
                          className={`flex min-w-[240px] cursor-pointer items-center justify-between rounded-[14px] border-2 p-3 transition-all ${
                            isSelected ? "border-[#D946EF] bg-[#FDF2F8]" : "border-[#F1F5F9] bg-white hover:border-[#D946EF]/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={p.image || ""} className="h-11 w-11 rounded-lg object-cover" alt="" />
                            <div>
                                <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{p.name}</p>
                                <p className="font-['Inter'] text-[11px] text-[#94A3B8]">Rs. {Number(p.variations?.[0]?.options?.[0]?.prices?.[0]?.price || 0).toFixed(2)}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-[#D946EF]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex shrink-0 justify-between gap-4 border-t border-[#F1F5F9] pt-8">
            <button
              type="button"
              onClick={step === 1 ? onClose : () => setStep(1)}
              className="flex-1 rounded-[16px] border border-[#E2E8F0] bg-white py-4 font-['Inter'] text-base font-bold text-[#45556C] transition-all hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (step === 2 && (!selectedBuyProduct || !selectedFreeProduct))}
              className="flex-[1.5] rounded-[16px] bg-[#EA580C] py-4 font-['Inter'] text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(234,88,12,0.3)] transition-all hover:bg-[#c2410c] disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
              {step === 1 ? "Next Step" : "Create BOGO Promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
