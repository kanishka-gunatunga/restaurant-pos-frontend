"use client";

import { useState } from "react";
import { X, Trash2, Pencil } from "lucide-react";
import type { MockAssignment } from "@/domains/supply/types";

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAssignment?: MockAssignment | null;
}

type MaterialRow = { id: string; name: string; qty: number; available: string; expiry: string };

type MaterialStockOption = {
  id: string;
  name: string;
  available: string;
  expiryLabel: string;
  expiryDate: Date;
};

const MOCK_MATERIAL_STOCKS: MaterialStockOption[] = [
  {
    id: "beef-patties-250",
    name: "Beef Patties",
    available: "250 pieces",
    expiryLabel: "3/15/2026",
    expiryDate: new Date("2026-03-15"),
  },
  {
    id: "cheddar-500",
    name: "Cheddar Cheese",
    available: "500 slices",
    expiryLabel: "3/22/2026",
    expiryDate: new Date("2026-03-22"),
  },
  {
    id: "mozzarella-43",
    name: "Mozzarella Cheese",
    available: "43 kg",
    expiryLabel: "3/3/2026",
    expiryDate: new Date("2026-03-03"),
  },
  {
    id: "mozzarella-45",
    name: "Mozzarella Cheese",
    available: "45 kg",
    expiryLabel: "3/15/2026",
    expiryDate: new Date("2026-03-15"),
  },
  {
    id: "lettuce-10",
    name: "Lettuce",
    available: "10 kg",
    expiryLabel: "3/10/2026",
    expiryDate: new Date("2026-03-10"),
  },
  {
    id: "onion-60",
    name: "Onion",
    available: "60 kg",
    expiryLabel: "3/15/2026",
    expiryDate: new Date("2026-03-15"),
  },
  {
    id: "wheat-buns-300",
    name: "Wheat Buns",
    available: "300 pieces",
    expiryLabel: "4/20/2026",
    expiryDate: new Date("2026-04-20"),
  },
  {
    id: "tomatoes-7",
    name: "Tomatoes",
    available: "7 kg",
    expiryLabel: "3/15/2026",
    expiryDate: new Date("2026-03-15"),
  },
];

function parseMaterialQty(qty: string): number {
  const match = qty.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function toDateInputValue(dateStr: string): string {
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [m, d, y] = parts;
    const month = m.padStart(2, "0");
    const day = d.padStart(2, "0");
    return `${y}-${month}-${day}`;
  }
  return "";
}

function getCategoryForProduct(productName: string | undefined): string {
  if (!productName) return "All Categories";
  if (productName.toLowerCase().includes("pizza")) return "Pizza";
  return "All Categories";
}

export default function AddAssignmentModal({
  isOpen,
  onClose,
  initialAssignment,
}: AddAssignmentModalProps) {
  const sortedMaterialOptions = MOCK_MATERIAL_STOCKS.slice().sort(
    (a, b) => a.expiryDate.getTime() - b.expiryDate.getTime()
  );
  const nearestExpiryTime =
    sortedMaterialOptions.length > 0 ? sortedMaterialOptions[0].expiryDate.getTime() : null;

  const [materials, setMaterials] = useState<MaterialRow[]>(() =>
    initialAssignment
      ? initialAssignment.materialsUsed.map((m, index) => {
          const stock = sortedMaterialOptions.find((opt) => opt.name === m.name) ?? null;
          return {
            id: `${m.name}-${index}`,
            name: m.name,
            qty: parseMaterialQty(m.qty),
            available: stock?.available ?? m.qty,
            expiry: stock?.expiryLabel ?? "",
          };
        })
      : []
  );
  const [materialQty, setMaterialQty] = useState(0);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");

  const isEditing = !!initialAssignment;

  if (!isOpen) return null;

  const handleAddMaterial = () => {
    if (!selectedMaterialId || materialQty <= 0) return;
    const stock = sortedMaterialOptions.find((opt) => opt.id === selectedMaterialId);
    if (!stock) return;
    setMaterials((prev) => [
      ...prev,
      {
        id: `${stock.id}-${Date.now()}`,
        name: stock.name,
        qty: materialQty,
        available: stock.available,
        expiry: stock.expiryLabel,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-8 pt-7 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-[#90A1B9] transition-colors hover:bg-[#F8FAFC]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div>
            <h2 className="font-['Inter'] text-[20px] font-bold leading-7 text-[#1D293D]">
              {isEditing ? "Edit Product Assignment" : "Create Product Assignment"}
            </h2>
            <p className="mt-1 font-['Inter'] text-sm leading-5 text-[#90A1B9]">
              {isEditing
                ? "Update the materials used for this product"
                : "Assign materials to a product – stock will be reduced automatically"}
            </p>
          </div>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="scrollbar-subtle min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-8 py-2">
          {/* Filter */}
          <div className="space-y-1.5">
            <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
              FILTER BY CATEGORY
            </label>
            <select
              className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
              defaultValue={getCategoryForProduct(initialAssignment?.productName)}
            >
              <option>All Categories</option>
              <option>Pizza</option>
              <option>Burgers</option>
            </select>
          </div>

          {/* Product row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                PRODUCT<span className="text-[#EC003F]"> *</span>
              </label>
              <select
                className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
                defaultValue={initialAssignment?.productName ?? ""}
                required
              >
                <option value="" disabled>
                  Select product
                </option>
                <option>Margherita Pizza</option>
                <option>Pepperoni Pizza</option>
                <option>Veggie Pizza</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                PRODUCT QUANTITY<span className="text-[#EC003F]"> *</span>
              </label>
              <input
                type="number"
                min={0}
                defaultValue={initialAssignment ? Number(initialAssignment.quantity) : 0}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                required
              />
            </div>
          </div>

          {/* Batch / expiry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                BATCH NUMBER (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="Enter batch number"
                defaultValue={initialAssignment?.batchNo}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                EXPIRY DATE (OPTIONAL)
              </label>
              <input
                type="date"
                defaultValue={
                  initialAssignment ? toDateInputValue(initialAssignment.expiryDate) : undefined
                }
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
          </div>

          {/* Materials selector */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                MATERIALS
              </label>
              <span className="font-['Inter'] text-xs text-[#94A3B8]">
                Add materials required for this product
              </span>
            </div>

            <div className="flex h-[70px] items-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-[17px]">
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="h-9 flex-1 cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-white pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
              >
                <option value="">Select material</option>
                {sortedMaterialOptions.map((opt) => {
                  const isNearest =
                    nearestExpiryTime != null &&
                    opt.expiryDate.getTime() === nearestExpiryTime;
                  return (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className={isNearest ? "text-[#DC2626] font-medium" : ""}
                    >
                      {opt.name} (Available: {opt.available}) (Expire: {opt.expiryLabel})
                    </option>
                  );
                })}
              </select>
              <input
                type="number"
                min={0}
                value={materialQty}
                onChange={(e) => setMaterialQty(Number(e.target.value))}
                className="h-9 w-20 rounded-[10px] border border-[#E2E8F0] bg-white px-2 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
              <button
                type="button"
                onClick={handleAddMaterial}
                className="flex h-9 min-w-[40px] items-center justify-center rounded-[10px] bg-[#EA580C] px-2 font-['Inter'] text-sm font-bold text-white hover:bg-[#DC4C04]"
                aria-label="Add material"
              >
                ✓
              </button>
            </div>

            <div className="scrollbar-subtle mt-3 max-h-[200px] overflow-y-auto rounded-[18px] border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-4">
              {materials.length === 0 ? (
                <div className="flex min-h-[100px] flex-col items-center justify-center gap-1 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#94A3B8]">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#90A1B9]"
                    >
                      <g opacity="0.5">
                        <path
                          d="M14.6667 28.9729C15.0721 29.2069 15.5319 29.3301 16 29.3301C16.4681 29.3301 16.9279 29.2069 17.3333 28.9729L26.6667 23.6395C27.0717 23.4057 27.408 23.0695 27.6421 22.6647C27.8761 22.2598 27.9995 21.8005 28 21.3329V10.6662C27.9995 10.1986 27.8761 9.73929 27.6421 9.33443C27.408 8.92956 27.0717 8.59336 26.6667 8.35954L17.3333 3.02621C16.9279 2.79216 16.4681 2.66895 16 2.66895C15.5319 2.66895 15.0721 2.79216 14.6667 3.02621L5.33333 8.35954C4.92835 8.59336 4.59197 8.92956 4.35795 9.33443C4.12392 9.73929 4.00048 10.1986 4 10.6662V21.3329C4.00048 21.8005 4.12392 22.2598 4.35795 22.6647C4.59197 23.0695 4.92835 23.4057 5.33333 23.6395L14.6667 28.9729Z"
                          stroke="currentColor"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 29.3333V16"
                          stroke="currentColor"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.38672 9.33301L16.0001 15.9997L27.6134 9.33301"
                          stroke="currentColor"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 5.69336L22 12.56"
                          stroke="currentColor"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Inter'] text-sm text-[#94A3B8]">No materials added yet</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {materials.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between rounded-[12px] bg-white px-3 py-2"
                    >
                      <div>
                        <p className="font-['Inter'] text-sm font-medium leading-5 text-[#0A0A0A]">
                          {m.name}
                        </p>
                        <p className="font-['Inter'] text-xs font-normal leading-4 text-[#62748E]">
                          Use: {m.qty} pieces ·{" "}
                          <span className="font-medium text-[#00A63E]">
                            Available: {m.available}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMaterialId(
                              sortedMaterialOptions.find((opt) => opt.name === m.name)?.id ?? ""
                            );
                            setMaterialQty(m.qty);
                            setMaterials((prev) => prev.filter((row) => row.id !== m.id));
                          }}
                          className="rounded-lg p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#475569]"
                          aria-label="Edit material"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setMaterials((prev) => prev.filter((row) => row.id !== m.id))
                          }
                          className="rounded-lg p-1.5 text-[#FB2C36] hover:bg-[#FEE2E2]"
                          aria-label="Remove material"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          </div>

          <div className="mt-4 flex w-full shrink-0 gap-3 border-t border-[#E2E8F0] bg-white px-8 py-4">
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
              {isEditing ? "Save changes" : "Create & reduce stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

