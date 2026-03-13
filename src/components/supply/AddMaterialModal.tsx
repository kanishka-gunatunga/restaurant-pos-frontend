"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { MockMaterial } from "@/domains/supply/types";

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMaterial?: MockMaterial | null;
}

const BRANCH_OPTIONS = ["All Branches", "Downtown", "Uptown", "Westside"];

function parseMinStockLevel(value: string): number {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function unitToSelectValue(unit: string): string {
  return unit === "pieces" ? "pcs" : unit;
}

export default function AddMaterialModal({ isOpen, onClose, initialMaterial }: AddMaterialModalProps) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(() =>
    initialMaterial
      ? initialMaterial.allBranches
        ? ["All Branches"]
        : initialMaterial.branches.split(" ").filter(Boolean)
      : ["Downtown", "Uptown"]
  );

  const isEditing = !!initialMaterial;

  if (!isOpen) return null;

  const toggleBranch = (branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] overflow-hidden rounded-[32px] bg-white px-8 pb-8 pt-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-[#90A1B9] transition-colors hover:bg-[#F8FAFC]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="font-['Inter'] text-[20px] font-bold leading-7 text-[#1D293D]">
            {isEditing ? "Edit Material" : "Add New Material"}
          </h2>
          <p className="mt-1 font-['Inter'] text-sm leading-5 text-[#90A1B9]">
            {isEditing ? "Update material details" : "Define a new material to use across branches"}
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Material name */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                MATERIAL NAME<span className="text-[#EC003F]"> *</span>
              </label>
              <input
                type="text"
                placeholder="Enter material name"
                defaultValue={initialMaterial?.name}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                CATEGORY<span className="text-[#EC003F]"> *</span>
              </label>
              <select
                className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
                defaultValue={initialMaterial?.category ?? ""}
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </div>

            {/* Unit */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                UNIT<span className="text-[#EC003F]"> *</span>
              </label>
              <select
                className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
                defaultValue={initialMaterial ? unitToSelectValue(initialMaterial.unit) : "kg"}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="pcs">Pieces</option>
              </select>
            </div>

            {/* Min stock level */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                MIN STOCK LEVEL<span className="text-[#EC003F]"> *</span>
              </label>
              <input
                type="number"
                min={0}
                placeholder="0"
                defaultValue={initialMaterial ? parseMinStockLevel(initialMaterial.minStockLevel) : undefined}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                required
              />
            </div>
          </div>

          {/* Branch selection */}
          <div className="space-y-2">
            <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#314158]">
              SELECT BRANCHES<span className="text-[#EC003F]"> *</span>
            </label>
            <div className="mt-1 w-full max-w-[462px] rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="flex flex-col gap-4">
                {BRANCH_OPTIONS.map((branch) => {
                  const checked = selectedBranches.includes(branch);
                  return (
                    <label
                      key={branch}
                      className="flex cursor-pointer items-center gap-3 font-['Inter'] text-sm font-medium leading-[14px] text-[#0A0A0A]"
                    >
                      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBranch(branch)}
                          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        <span
                          className={`absolute inset-0 rounded-[4px] border p-[1px] shadow-[0px_1px_2px_0px_#0000000D] transition-colors ${
                            checked
                              ? "border-[#EA580C] bg-[#EA580C]"
                              : "border-[#E2E8F0] bg-white"
                          }`}
                        />
                        <svg
                          className={`pointer-events-none relative h-2.5 w-2.5 text-white transition-opacity ${
                            checked ? "opacity-100" : "opacity-0"
                          }`}
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 6l3 3 5-6" />
                        </svg>
                      </span>
                      <span>{branch}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 flex-1 items-center justify-center rounded-[16px] border border-[#E2E8F0] bg-white p-2.5 font-['Inter'] text-base font-bold leading-6 text-[#45556C] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-11 flex-1 items-center justify-center rounded-[16px] bg-[#EA580C] p-2.5 font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_8px_10px_-6px_#EA580C33,0px_20px_25px_-5px_#EA580C33] hover:bg-[#DC4C04]"
            >
              {isEditing ? "Save changes" : "Add material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

