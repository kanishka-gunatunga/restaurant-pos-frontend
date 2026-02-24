"use client";

import { useState, useEffect } from "react";
import MenuPageHeader from "@/components/menu/MenuPageHeader";
import { OrderProvider } from "@/contexts/OrderContext";
import { Search, UserPlus } from "lucide-react";
import UserTable from "@/components/users/UserTable";
import AddUserModal from "@/components/users/AddUserModal";
import type { UserRole, User } from "@/components/users/UserTable";

import * as userService from "@/services/userService";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const data = await userService.getUsers();
      // Map API role to UI role if needed
      const formattedUsers = data.map((u: any) => ({
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

  const handleSaveUser = async (user: any) => {
    setLoading(true);
    try {
      const payload = {
        ...user,
        role: user.role.toLowerCase(), // API expects lowercase roles
      };
      
      // Remove empty password if it is an edit and not provided
      if (selectedUser && !payload.password) {
        delete payload.password;
      }

      if (selectedUser) {
         // Has an ID since we're editing
         const data = await userService.updateUser(selectedUser.id, payload);
         console.log("User updated successfully:", data);
      } else {
         const data = await userService.registerUser(payload);
         console.log("User registered successfully:", data);
      }
      
      setIsAddModalOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list without full reload
    } catch (error: any) {
      console.error("Failed to save user:", error);
      alert(error.response?.data?.message || "Failed to save user. Please try again.");
    } finally {
      loading && setLoading(false);
    }
  };

  const handleEditUserClick = (user: User) => {
    setSelectedUser(user);
    setIsAddModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      alert(error.response?.data?.message || "Failed to delete user. Please try again.");
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
                  onClick={() => {
                    setSelectedUser(null);
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
              onDelete={handleDeleteUser}
            />
          </div>
        </div>

        {isAddModalOpen && (
          <AddUserModal
            onClose={() => {
              setIsAddModalOpen(false);
              setSelectedUser(null);
            }}
            onAdd={handleSaveUser}
            initialData={selectedUser}
          />
        )}
      </div>
    </OrderProvider>
  );
}
