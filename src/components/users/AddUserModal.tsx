"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { UserRole, User } from "./UserTable";
import type { UserFormPayload } from "./types";
import axiosInstance from "@/lib/api/axiosInstance";

interface Branch {
  id: number;
  name: string;
}

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (user: UserFormPayload) => void;
  initialData?: User | null;
}

export default function AddUserModal({ onClose, onAdd, initialData }: AddUserModalProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isBranchesLoading, setIsBranchesLoading] = useState(true);
  const [formData, setFormData] = useState<UserFormPayload>({
    id: initialData?.id,
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    username: initialData?.displayName ?? initialData?.name ?? "",
    password: "",
    role: initialData?.role ?? "CASHIER",
    employeeId: initialData?.employeeId ?? "",
    branchId: initialData?.branchId ?? 0,
    passcode: initialData?.passcode ?? "",
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/branches");
        setBranches(response.data);
        if (response.data.length > 0 && !initialData?.branchId) {
          setFormData((prev) => ({ ...prev, branchId: response.data[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setIsBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "branchId" ? (parseInt(value, 10) || 0) : value,
    }));
  };

  const showPasscode = formData.role === "ADMIN" || formData.role === "MANAGER";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl transition-all"
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
          {initialData ? "Edit User" : "Create New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
                USERNAME
              </label>
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required={!initialData}
                className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
                EMPLOYEE ID
              </label>
              <input
                type="text"
                name="employeeId"
                placeholder="EMP001"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
                BRANCH
              </label>
              <div className="relative">
                <select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  disabled={isBranchesLoading}
                  className="h-12 w-full appearance-none rounded-xl bg-[#F8FAFC] px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                  required
                >
                  {isBranchesLoading ? (
                    <option value="">Loading branches...</option>
                  ) : branches.length === 0 ? (
                    <option value="">No branches found</option>
                  ) : (
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))
                  )}
                </select>
                {isBranchesLoading ? (
                  <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9] animate-spin" />
                ) : (
                  <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9] pointer-events-none" />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {showPasscode && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[12px] font-bold uppercase text-[#90A1B9]">
                   PASSCODE (ADMIN/MANAGER ONLY)
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
          </div>

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
              {initialData ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
