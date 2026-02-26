"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { MOCK_CATEGORIES } from "../types";
import { CategoryIcon, SubCategoryIcon } from "./CategoryIcons";

type CategoriesTabProps = {
  onAddCategory: () => void;
};

export default function CategoriesTab({ onAddCategory }: CategoriesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-['Inter'] text-lg font-bold text-[#1D293D]">
          Categories & Sub-Categories
        </h2>
        <button
          type="button"
          onClick={onAddCategory}
          className="flex items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
          style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {MOCK_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex gap-3">
                <div className="flex shrink-0 self-start justify-center rounded-[14px] border border-[#E2E8F0] bg-white p-2.5 opacity-100">
                  <CategoryIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-['Inter'] text-[18px] font-bold leading-7 text-[#1D293D]">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 font-['Inter'] text-xs font-normal leading-4 text-[#90A1B9]">
                    {cat.subCount} sub-categories
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {cat.subCategories.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1 rounded-[14px] border border-[#E2E8F0] bg-white px-2.5 py-1 font-['Inter'] text-xs font-bold leading-4 text-[#45556C] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                      >
                        <SubCategoryIcon />
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
