"use client";

import { Plus, Trash2, X } from "lucide-react";

type AddCategoryModalProps = {
  open: boolean;
  overlayVisible: boolean;
  categoryName: string;
  subCategories: string[];
  onCategoryNameChange: (value: string) => void;
  onSubCategoryAdd: () => void;
  onSubCategoryRemove: (index: number) => void;
  onSubCategoryUpdate: (index: number, value: string) => void;
  onClose: () => void;
};

export default function AddCategoryModal({
  open,
  overlayVisible,
  categoryName,
  subCategories,
  onCategoryNameChange,
  onSubCategoryAdd,
  onSubCategoryRemove,
  onSubCategoryUpdate,
  onClose,
}: AddCategoryModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-category-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
      style={{ opacity: overlayVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col rounded-[14px] border border-[#E2E8F0] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <h2 id="add-category-title" className="font-['Inter'] text-lg font-bold text-[#1D293D]">
            New Category
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="shrink-0">
            <label htmlFor="category-name" className="mb-1.5 block font-['Inter'] text-xs font-medium uppercase tracking-wide text-[#90A1B9]">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => onCategoryNameChange(e.target.value)}
              placeholder="e.g. Burgers"
              className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>

          <div>
            <div className="mb-1.5 flex shrink-0 items-center justify-between">
              <label className="block font-['Inter'] text-xs font-medium uppercase tracking-wide text-[#90A1B9]">
                Sub-Categories
              </label>
              <button
                type="button"
                onClick={onSubCategoryAdd}
                className="flex items-center gap-1 font-['Inter'] text-sm font-bold text-[#EA580C]"
              >
                <Plus className="h-4 w-4" />
                Add Sub-Category
              </button>
            </div>
            <div className="max-h-48 min-h-0 space-y-2 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
              {subCategories.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onSubCategoryUpdate(index, e.target.value)}
                    placeholder="e.g. Beef, Chicken"
                    className="min-w-0 flex-1 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                  />
                  <button
                    type="button"
                    onClick={() => onSubCategoryRemove(index)}
                    className="shrink-0 rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove sub-category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex shrink-0 justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 font-['Inter'] text-sm font-bold text-[#45556C] hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] hover:bg-[#c2410c]"
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
}
