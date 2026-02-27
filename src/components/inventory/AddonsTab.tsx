"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { MOCK_ADDON_GROUPS } from "@/domains/inventory/types";

type AddonsTabProps = {
  onAddGroup: () => void;
};

export default function AddonsTab({ onAddGroup }: AddonsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-['Inter'] text-[16px] font-bold leading-6 text-[#314158]">
          Add-on Groups
        </h2>
        <button
          type="button"
          onClick={onAddGroup}
          className="flex items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 text-center font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
          style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
        >
          <Plus className="h-4 w-4" />
          Add Group
        </button>
      </div>
      <div className="space-y-6">
        {MOCK_ADDON_GROUPS.map((group) => (
          <div
            key={group.id}
            className="rounded-[16px] border border-[#F1F5F9] bg-[#F8FAFC] p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-['Inter'] text-base font-bold text-[#1D293D]">
                {group.name}
              </h3>
              <div className="flex gap-1">
                <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-[5px]">
              {group.items.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-[5px] rounded-[14px] border border-[#E2E8F0] bg-white py-[9px] pl-[17px] pr-[17px] font-['Inter'] text-xs font-bold leading-4 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                >
                  <span className="text-[#45556C]">{item.name}</span>
                  <span className="text-[#EA580C]">{item.price}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
