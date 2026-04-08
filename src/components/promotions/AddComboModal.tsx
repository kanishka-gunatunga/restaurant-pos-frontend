"use client";

import { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Check,
  Calendar,
  Package,
  Loader2,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { type Product, type VariationOption } from "@/types/product";
import { useGetAllProducts } from "@/hooks/useProduct";
import { useGetAllBranches } from "@/hooks/useBranch";

type AddComboModalProps = {
  open: boolean;
  overlayVisible: boolean;
  onClose: () => void;
  editingCombo?: any;
};

function formatPrice(value: number): string {
  return `Rs. ${Number(value).toFixed(2)}`;
}

export default function AddComboModal({
  open,
  overlayVisible,
  onClose,
  editingCombo,
}: AddComboModalProps) {
  const { data: products } = useGetAllProducts({ status: "active" });
  const { data: branches } = useGetAllBranches("active");

  const [step, setStep] = useState(1);
  const [comboName, setComboName] = useState(() => editingCombo?.name ?? "");
  const [expiryDate, setExpiryDate] = useState(() => editingCombo?.expiryDate ?? "");
  const [description, setDescription] = useState(() => editingCombo?.description ?? "");
  const [isForAllBranches, setIsForAllBranches] = useState(
    () => editingCombo?.isForAllBranches ?? true
  );
  const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>(
    () => editingCombo?.branches?.map((b: any) => b.branchId) ?? []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [comboPrice, setComboPrice] = useState<number>(0);

  const isEditing = !!editingCombo;
  const isLoading = false;

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const originalTotalPrice = useMemo(() => {
    return selectedProducts.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  }, [selectedProducts]);

  const customerSaves = Math.max(0, originalTotalPrice - comboPrice);

  const handleToggleSelect = (product: Product) => {
    const isSelected = selectedProducts.some((s) => s.productId === product.id);

    if (isSelected) {
      setSelectedProducts((prev) => prev.filter((s) => s.productId !== product.id));
    } else {
      const price = Number(product.variations?.[0]?.options?.[0]?.prices?.[0]?.price || 0);
      setSelectedProducts((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price,
          qty: 1,
          image: product.image
        },
      ]);
    }
  };

  const updateQty = (productId: number, delta: number) => {
    setSelectedProducts(prev => prev.map(p => 
      p.productId === productId 
        ? { ...p, qty: Math.max(1, p.qty + delta) } 
        : p
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    toast.success("Combo pack created successfully!");
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
              Create Combo Pack
            </h2>
            <p className="mt-1 font-['Inter'] text-sm text-[#94A3B8]">
              Bundle products together for special pricing
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
                    Combo Name <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={comboName}
                    onChange={(e) => setComboName(e.target.value)}
                    placeholder="e.g. Family Feast, Lunch Combo"
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

              <div>
                <label className="mb-2 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  Description <span className="text-[#F43F5E]">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the combo pack..."
                  rows={3}
                  className="w-full rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-1 flex-col overflow-hidden">
                <label className="mb-3 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  Select Branches <span className="text-[#F43F5E]">*</span>
                </label>
                <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC]">
                        <Package className={`h-5 w-5 ${isForAllBranches ? "text-[#EA580C]" : "text-[#94A3B8]"}`} />
                      </div>
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                        isForAllBranches ? "border-[#EA580C] bg-[#EA580C]" : "border-[#CBD5E1]"
                      }`}>
                        {isForAllBranches && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                    <p className="mt-4 font-['Inter'] text-sm font-bold text-[#1D293D]">All Branches</p>
                    <p className="mt-1 font-['Inter'] text-xs text-[#94A3B8]">Apply everywhere</p>
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
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC]">
                            <Package className={`h-5 w-5 ${isSelected ? "text-[#EA580C]" : "text-[#94A3B8]"}`} />
                          </div>
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                            isSelected ? "border-[#EA580C] bg-[#EA580C]" : "border-[#CBD5E1]"
                          }`}>
                            {isSelected && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                        <p className="mt-4 font-['Inter'] text-sm font-bold text-[#1D293D]">{branch.name}</p>
                        <p className="mt-1 font-['Inter'] text-xs text-[#94A3B8] truncate">{branch.location || "123 Main St"}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Product Selection Area */}
              <div className="grid min-h-0 flex-1 grid-cols-2 gap-8 overflow-hidden">
                {/* Left Panel: Available Products */}
                <div className="flex flex-col overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-[#F8FAFC] p-4">
                  <h3 className="mb-4 font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                    Available Products
                  </h3>
                  <div className="relative mb-4 shrink-0">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-[12px] border border-[#F1F5F9] bg-white py-2.5 pl-11 pr-4 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {filteredProducts.map((p) => {
                      const isSelected = selectedProducts.some((s) => s.productId === p.id);
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => handleToggleSelect(p)}
                          className="flex cursor-pointer items-center justify-between rounded-[14px] border border-[#F1F5F9] bg-white p-3 transition-all hover:border-[#EA580C]/20"
                        >
                          <div className="flex items-center gap-3">
                            <img src={p.image || ""} className="h-11 w-11 rounded-lg object-cover" alt="" />
                            <div>
                                <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{p.name}</p>
                                <p className="font-['Inter'] text-[11px] text-[#94A3B8]">${Number(p.variations?.[0]?.options?.[0]?.prices?.[0]?.price || 0).toFixed(2)}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-[#009966]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Selected Combo Products */}
                <div className="flex flex-col overflow-hidden rounded-[20px] border border-[#F1F5F9] bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#1D293D]">
                      Combo Products
                    </h3>
                    <p className="font-['Inter'] text-xs text-[#94A3B8]">{selectedProducts.length} product(s) selected</p>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                    {selectedProducts.map((p) => (
                      <div key={p.productId} className="rounded-[16px] border border-[#F1F5F9] bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{p.name}</p>
                            <p className="mt-0.5 font-['Inter'] text-[11px] text-[#94A3B8]">Rs. {p.price.toFixed(2)} each</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setSelectedProducts(prev => prev.filter(s => s.productId !== p.productId))}
                            className="text-[#94A3B8] hover:text-[#EC003F]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] p-1">
                            <button 
                                type="button" 
                                onClick={() => updateQty(p.productId, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#94A3B8] shadow-sm hover:text-[#EA580C]"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center font-['Inter'] text-sm font-bold text-[#1D293D]">{p.qty}</span>
                            <button 
                                type="button" 
                                onClick={() => updateQty(p.productId, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#94A3B8] shadow-sm hover:text-[#EA580C]"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">
                            Rs. {(p.price * p.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                    <span className="font-['Inter'] text-sm font-bold text-[#1D293D]">Total Value:</span>
                    <span className="font-['Inter'] text-sm font-bold text-[#1D293D]">Rs. {originalTotalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Summary Bar */}
              <div className="flex items-center justify-between rounded-[20px] bg-[#ECFDF5]/60 p-6">
                <div>
                  <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Original Price</p>
                  <p className="mt-1 font-['Inter'] text-2xl font-bold text-[#94A3B8] line-through">
                    Rs. {originalTotalPrice.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <label className="mb-2 block font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#F43F5E]">
                    Combo Price <span className="text-[#F43F5E]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={comboPrice || ""}
                      onChange={(e) => setComboPrice(parseFloat(e.target.value) || 0)}
                      placeholder="Rs. 0.00"
                      className="w-48 rounded-[14px] border border-[#F1F5F9] bg-white px-5 py-4 text-center font-['Inter'] text-xl font-bold text-[#1D293D] shadow-sm focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Customer Saves</p>
                  <p className="mt-1 font-['Inter'] text-2xl font-bold text-[#009966]">
                    Rs. {customerSaves.toFixed(2)}
                  </p>
                </div>
              </div>
            </>
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
              disabled={isLoading || (step === 2 && selectedProducts.length < 2)}
              className="flex-[1.5] rounded-[16px] bg-[#EA580C] py-4 font-['Inter'] text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(234,88,12,0.3)] transition-all hover:bg-[#c2410c] disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
              {step === 1 ? "Next" : "Create Combo Pack"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
