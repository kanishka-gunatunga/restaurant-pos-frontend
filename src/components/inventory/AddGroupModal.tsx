"use client";

import { Plus, Trash2, X } from "lucide-react";
import type { AddonGroupItem } from "@/domains/inventory/types";

type AddGroupModalProps = {
  open: boolean;
  overlayVisible: boolean;
  groupName: string;
  items: AddonGroupItem[];
  onGroupNameChange: (value: string) => void;
  onItemAdd: () => void;
  onItemRemove: (index: number) => void;
  onItemUpdate: (index: number, field: "name" | "price", value: string) => void;
  onClose: () => void;
};

export default function AddGroupModal({
  open,
  overlayVisible,
  groupName,
  items,
  onGroupNameChange,
  onItemAdd,
  onItemRemove,
  onItemUpdate,
  onClose,
}: AddGroupModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-group-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
      style={{ opacity: overlayVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <h2 id="add-group-title" className="font-['Inter'] text-[20px] font-bold text-[#1D293D]">
            New Add-on Group
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
            <label htmlFor="group-name" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
              Group Name
            </label>
            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              placeholder="e.g. Large Pizza Add-ons"
              className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>

          <div>
            <div className="mb-3 mt-2 flex shrink-0 items-center justify-between">
              <label className="block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                Items in Group
              </label>
              <button
                type="button"
                onClick={onItemAdd}
                className="flex items-center gap-1 font-['Inter'] text-sm font-bold text-[#EA580C]"
              >
                <Plus className="h-4 w-4" />
                Add Another Item
              </button>
            </div>
            <div className="max-h-48 min-h-0 space-y-4 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
              {items.map((item, index) => (
                <div key={index} className="flex shrink-0 gap-3">
                  <div className="min-w-0 flex-1">
                    <label className="mb-1 block font-['Inter'] text-xs font-medium text-[#45556C]">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => onItemUpdate(index, "name", e.target.value)}
                      placeholder="Item Name"
                      className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>
                  <div className="w-24 shrink-0">
                    <label className="mb-1 block font-['Inter'] text-xs font-medium text-[#45556C]">
                      Price (Rs.)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={item.price}
                      onChange={(e) => onItemUpdate(index, "price", e.target.value)}
                      placeholder="1000"
                      className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <button
                      type="button"
                      onClick={() => onItemRemove(index)}
                      className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
