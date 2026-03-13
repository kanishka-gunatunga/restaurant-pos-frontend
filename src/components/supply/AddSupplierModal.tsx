"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface SupplierFormData {
  name: string;
  branch: string;
  contactPerson: string;
  email?: string;
  country?: string;
  phone: string;
  address?: string;
  taxId?: string;
  paymentTerms?: string;
  status?: "active" | "inactive";
}

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSupplier?: SupplierFormData | null;
}

export default function AddSupplierModal({
  isOpen,
  onClose,
  initialSupplier,
}: AddSupplierModalProps) {
  const [status, setStatus] = useState<"active" | "inactive">(
    () => initialSupplier?.status ?? "active"
  );
  const isEditing = !!initialSupplier;

  if (!isOpen) return null;

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
            {isEditing ? "Edit Supplier" : "Add New Supplier"}
          </h2>
          <p className="mt-1 font-['Inter'] text-sm leading-5 text-[#90A1B9]">
            Enter supplier details to add to the system
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
            {/* Supplier name */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                SUPPLIER NAME<span className="text-[#EC003F]"> *</span>
              </label>
              <input
                type="text"
                placeholder="Enter supplier name"
                defaultValue={initialSupplier?.name}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                required
              />
            </div>

            {/* Branch */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                BRANCH<span className="text-[#EC003F]"> *</span>
              </label>
              <select
                className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
                defaultValue={initialSupplier?.branch ?? "Maharagama"}
              >
                <option value="Maharagama">Maharagama</option>
                <option value="Nugegoda">Nugegoda</option>
              </select>
            </div>

            {/* Contact person */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                CONTACT PERSON<span className="text-[#EC003F]"> *</span>
              </label>
              <input
                type="text"
                placeholder="Enter contact person"
                defaultValue={initialSupplier?.contactPerson}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                defaultValue={initialSupplier?.email}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                COUNTRY
              </label>
              <select
                className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
                defaultValue={initialSupplier?.country ?? "Sri Lanka"}
              >
                <option value="Sri Lanka">Sri Lanka</option>
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                PHONE<span className="text-[#EC003F]"> *</span>
              </label>
              <input
                type="tel"
                placeholder="+94 234-567-8900"
                defaultValue={initialSupplier?.phone}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                ADDRESS
              </label>
              <input
                type="text"
                placeholder="Enter full address"
                defaultValue={initialSupplier?.address}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>

            {/* Tax ID */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                TAX ID
              </label>
              <input
                type="text"
                placeholder="Enter tax ID"
                defaultValue={initialSupplier?.taxId}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>

            {/* Payment terms */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                PAYMENT TERMS
              </label>
              <input
                type="text"
                placeholder="e.g., Net 30"
                defaultValue={initialSupplier?.paymentTerms}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 font-['Inter'] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.04em] text-[#90A1B9]">
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                className="mt-1 h-10 w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3.5 pr-10 font-['Inter'] text-sm text-[#0F172A] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%20stroke%3D%22%2390A1B9%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [background-position:right_1rem_center] [background-repeat:no-repeat] [background-size:12px]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
              {isEditing ? "Save changes" : "Add supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

