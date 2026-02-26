"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { Search, UserPlus } from "lucide-react";
import UserTable from "@/components/users/UserTable";
import AddUserModal from "@/components/users/AddUserModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { UserRole, User } from "@/components/users/UserTable";
import type { UserFormPayload } from "@/components/users/types";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import * as userService from "@/services/userService";

export default function UsersContent() {
  const router = useRouter();
  const { isCashier } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; userId: string }>({
    isOpen: false,
    userId: "",
  });

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const data = await userService.getUsers();
      const list = Array.isArray(data) ? data : (data?.users ?? []);
      const formattedUsers = list.map((u: Record<string, unknown>) => ({
        id: String(u?.id ?? u?.employeeId ?? ""),
        name: String(u?.name ?? ""),
        displayName: String(u?.displayName ?? u?.name ?? ""),
        email: String(u?.email ?? ""),
        role: (String(u?.role ?? "").toUpperCase() || "CASHIER") as UserRole,
        passcode: u?.passcode != null ? String(u.passcode) : null,
        branchId: typeof u?.branchId === "number" ? u.branchId : undefined,
        employeeId: u?.employeeId != null ? String(u.employeeId) : undefined,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (user: UserFormPayload) => {
    setLoading(true);
    setSaveError(null);
    try {
      const payload = {
        ...user,
        role: user.role.toLowerCase(),
      };

      if (selectedUser && !payload.password) {
        delete (payload as Record<string, unknown>).password;
      }

      if (selectedUser) {
        await userService.updateUser(selectedUser.id, payload);
      } else {
        await userService.registerUser(payload);
      }

      setIsAddModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : null;
      setSaveError(message || "Failed to save user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserClick = (user: User) => {
    setSelectedUser(user);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, userId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(deleteConfirm.userId);
      setDeleteConfirm({ isOpen: false, userId: "" });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      setDeleteConfirm({ isOpen: false, userId: "" });
    }
  };

  useEffect(() => {
    if (isCashier) router.replace(ROUTES.DASHBOARD_MENU);
  }, [isCashier, router]);

  if (isCashier) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50/50">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {saveError && (
            <div
              role="alert"
              className="rounded-xl border border-[#FFE6EB] bg-[#FFF1F2] px-4 py-3 text-sm font-medium text-[#EC003F]"
            >
              {saveError}
              <button
                type="button"
                onClick={() => setSaveError(null)}
                className="ml-2 underline focus:outline-none focus:ring-2 focus:ring-[#EC003F]/20"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-[#1D293D]">User Management</h1>
              <p className="mt-1 text-[14px] text-[#62748E]">
                Manage system access roles and permissions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSaveError(null);
                  setIsAddModalOpen(true);
                }}
                className="flex h-11 items-center gap-2 rounded-xl bg-[#EA580C] cursor-pointer px-5 text-[14px] font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                Add New User
              </button>
            </div>
          </div>

          <div className="relative w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#90A1B9]" />
              <input
                type="text"
                placeholder="Search users by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 w-full rounded-[20px] border border-[#E2E8F0] bg-white pl-12 pr-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5"
              />
            </div>
          </div>

          <UserTable
            searchTerm={searchTerm}
            users={users}
            isLoading={isUsersLoading}
            onEdit={handleEditUserClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <AddUserModal
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedUser(null);
            setSaveError(null);
          }}
          onAdd={handleSaveUser}
          initialData={selectedUser}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, userId: "" })}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
