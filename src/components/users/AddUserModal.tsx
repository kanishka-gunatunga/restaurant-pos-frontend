"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { UserRole } from "./UserTable";

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (user: { name: string; email: string; role: UserRole; passcode?: string }) => void;
}

export default function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "CASHIER" as UserRole,
    passcode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

        <h2 className="mb-8 text-[20px] font-bold text-[#1D293D]">Create New User</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@bistro.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
              SYSTEM ROLE
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="h-12 w-full appearance-none rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
              >
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="CASHIER">Cashier</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9] pointer-events-none" />
            </div>
          </div>

          {formData.role === "MANAGER" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
                MANAGER PASSCODE
              </label>
              <input
                type="text"
                name="passcode"
                placeholder="4-digit code"
                value={formData.passcode}
                onChange={handleChange}
                maxLength={4}
                className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10 font-mono"
              />
            </div>
          )}

          <div className="mt-8 flex items-center gap-4 pt-2">
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
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
