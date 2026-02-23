"use client";

import { useState, useEffect } from "react";
import MenuPageHeader from "@/components/menu/MenuPageHeader";
import { OrderProvider } from "@/contexts/OrderContext";
import { Search, UserPlus } from "lucide-react";
import UserTable from "@/components/users/UserTable";
import AddUserModal from "@/components/users/AddUserModal";
import type { UserRole, User } from "@/components/users/UserTable";

import axiosInstance from "@/lib/api/axiosInstance";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      // Map API role to UI role if needed
      const formattedUsers = response.data.map((u: any) => ({
        ...u,
        role: u.role.toUpperCase() as UserRole,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (user: any) => {
    setLoading(true);
    try {
      const payload = {
        ...user,
        role: user.role.toLowerCase(), // API expects lowercase roles
      };

      const response = await axiosInstance.post("/auth/register", payload);
      
      if (response.status === 200 || response.status === 201) {
        console.log("User registered successfully:", response.data);
        setIsAddModalOpen(false);
        fetchUsers(); // Refresh the list without full reload
      }
    } catch (error: any) {
      console.error("Failed to register user:", error);
      alert(error.response?.data?.message || "Failed to register user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-50/50">
        <MenuPageHeader />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[24px] font-bold text-[#1D293D]">User Management</h1>
                <p className="mt-1 text-[14px] text-[#62748E]">
                  Manage system access roles and permissions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
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
            />
          </div>
        </div>

        {isAddModalOpen && (
          <AddUserModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddUser}
          />
        )}
      </div>
    </OrderProvider>
  );
}
