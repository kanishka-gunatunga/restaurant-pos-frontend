"use client";

import { User as UserIcon, Mail, Key, Pencil, Trash2 } from "lucide-react";

export type UserRole = "ADMIN" | "MANAGER" | "CASHIER";

export type User = {
  id: string;
  displayName: string;
  name: string;
  role: UserRole;
  email: string;
  passcode: string | null;
};

const MOCK_USERS: User[] = [
  {
    id: "U1",
    displayName: "ID: U33234934",
    name: "Sarah Connor",
    role: "ADMIN",
    email: "sarah@bistro.com",
    passcode: "****",
  },
  {
    id: "U2",
    displayName: "ID: U33234934",
    name: "John Doe",
    role: "MANAGER",
    email: "john@bistro.com",
    passcode: "****",
  },
  {
    id: "U3",
    displayName: "ID: U33234934",
    name: "Mike Tyson",
    role: "CASHIER",
    email: "mike@bistro.com",
    passcode: null,
  },
  {
    id: "U4",
    displayName: "ID: U33234934",
    name: "Emma Watson",
    role: "MANAGER",
    email: "emma@bistro.com",
    passcode: "****",
  },
];

interface UserTableProps {
  searchTerm: string;
}

export default function UserTable({ searchTerm }: UserTableProps) {
  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-[#F3E8FF] text-[#A855F7]";
      case "MANAGER":
        return "bg-[#DBEAFE] text-[#3B82F6]";
      case "CASHIER":
        return "bg-[#F1F5F9] text-[#64748B]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                USER
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                ROLE
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                CONTACT
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                SECURITY
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9] text-right">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="group hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center border border-[#F1F5F9] justify-center rounded-full bg-[#F8FAFC] text-[#90A1B9]">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#314158]">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-[#90A1B9]">
                        {user.displayName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold ${getRoleBadgeStyle(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[14px] text-[#45556C] font-semibold">
                    <Mail className="h-3.5 w-3.5 text-[#90A1B9]" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[14px] text-[#45556C] font-medium">
                    {user.passcode ? (
                      <>
                        <Key className="h-3.5 w-3.5 text-[#90A1B9]" />
                        <span className="bg-[#F1F5F9] px-2 py-1 rounded-md text-[12px] font-bold">
                           {user.passcode}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#90A1B9] italic text-[12px]">N/A</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-[#90A1B9]">
                    <button className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-xl border border-[#E2E8F0] hover:bg-white hover:text-primary transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-xl border border-[#E2E8F0] hover:bg-white hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
