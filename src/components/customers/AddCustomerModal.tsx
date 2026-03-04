"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Customer, CreateCustomerData } from "@/types/customer";

interface AddCustomerModalProps {
  onClose: () => void;
  onSave: (customer: CreateCustomerData) => void;
  initialData?: Customer | null;
}

export default function AddCustomerModal({ onClose, onSave, initialData }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CreateCustomerData>({
    name: initialData?.name || "",
    mobile: initialData?.mobile || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    promotions_enabled: initialData?.promotions_enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-[#90A1B9] hover:bg-[#F8FAFC] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-8 text-[20px] font-bold text-[#1D293D]">
          {initialData ? "Edit Customer" : "Create New Customer"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
              FULL NAME
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter user name"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
              MOBILE NUMBER
            </label>
            <input
              type="text"
              name="mobile"
              placeholder="07XXXXXXXX"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@bistro.com"
              value={formData.email}
              onChange={handleChange}
              className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
              ADDRESS
            </label>
            <input
              type="text"
              name="address"
              placeholder="Enter customer address"
              value={formData.address}
              onChange={handleChange}
              className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-xl cursor-pointer border border-[#E2E8F0] text-[14px] font-bold text-[#62748E] transition-all hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-12 flex-1 rounded-xl cursor-pointer bg-[#EA580C] text-[14px] font-bold text-white shadow-lg shadow-[#EA580C]/20 transition-all hover:bg-[#DC4C04] hover:shadow-xl active:scale-95"
            >
              {initialData ? "Save Changes" : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
