"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Check,
  RotateCcw,
  DollarSign,
  CreditCard,
  User,
  Building2,
  ChevronDown,
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ROUTES } from "@/lib/constants";
import { BRANCHES } from "@/lib/branchData";

export type ActivityType =
  | "order_placed"
  | "order_refunded"
  | "cash_out"
  | "payment_received"
  | "cash_in"
  | "discount_applied";

export type UserRole = "Cashier" | "Manager" | "Admin";

export interface ActivityLogEntry {
  id: string;
  dateTime: string;
  activityType: ActivityType;
  description: string;
  userName: string;
  role: UserRole;
  branchName: string;
  orderId: string | null;
  amount: number;
  currency: string;
  hasManagerApproval: boolean;
}

const MOCK_ACTIVITIES: ActivityLogEntry[] = [
  {
    id: "1",
    dateTime: "2026-03-04T12:52:00",
    activityType: "order_placed",
    description: "New order placed for dine-in at Table 5",
    userName: "Emma Johnson",
    role: "Cashier",
    branchName: "Maharagama",
    orderId: "ORD-0032",
    amount: 4700.5,
    currency: "Rs.",
    hasManagerApproval: false,
  },
  {
    id: "2",
    dateTime: "2026-03-04T12:22:00",
    activityType: "order_refunded",
    description: "Order refunded due to customer complaint about food quality",
    userName: "Michael Brown",
    role: "Manager",
    branchName: "Maharagama",
    orderId: "ORD-0028",
    amount: 4700.5,
    currency: "Rs.",
    hasManagerApproval: true,
  },
  {
    id: "3",
    dateTime: "2026-03-04T11:37:00",
    activityType: "cash_out",
    description: "Cash out performed during shift",
    userName: "Emma Johnson",
    role: "Cashier",
    branchName: "Maharagama",
    orderId: null,
    amount: 4700.5,
    currency: "Rs.",
    hasManagerApproval: true,
  },
  {
    id: "4",
    dateTime: "2026-03-04T11:07:00",
    activityType: "payment_received",
    description: "Payment received for Order #ORD-0031",
    userName: "Emma Johnson",
    role: "Cashier",
    branchName: "Maharagama",
    orderId: "ORD-0031",
    amount: 89.75,
    currency: "$",
    hasManagerApproval: false,
  },
];

const ACTIVITY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "order_placed", label: "Order Placed" },
  { value: "order_refunded", label: "Order Refunded" },
  { value: "cash_out", label: "Cash Out" },
  { value: "cash_in", label: "Cash In" },
  { value: "payment_received", label: "Payment Received" },
  { value: "discount_applied", label: "Discount Applied" },
];

const USER_ROLES = [
  { value: "all", label: "All Roles" },
  { value: "Cashier", label: "Cashier" },
  { value: "Manager", label: "Manager" },
  { value: "Admin", label: "Admin" },
];

function getActivityTypeDisplay(type: ActivityType) {
  switch (type) {
    case "order_placed":
      return { label: "Order Placed", icon: Check, color: "text-[#00BC7D]" };
    case "order_refunded":
      return { label: "Order Refunded", icon: RotateCcw, color: "text-[#E17100]" };
    case "cash_out":
      return { label: "Cash Out", icon: DollarSign, color: "text-[#E17100]" };
    case "cash_in":
      return { label: "Cash In", icon: DollarSign, color: "text-[#00BC7D]" };
    case "payment_received":
      return { label: "Payment Received", icon: CreditCard, color: "text-[#2B7FFF]" };
    case "discount_applied":
      return { label: "Discount Applied", icon: CreditCard, color: "text-[#2B7FFF]" };
    default:
      return { label: type, icon: Check, color: "text-[#90A1B9]" };
  }
}

function getRoleBadgeClass(role: UserRole) {
  switch (role) {
    case "Cashier":
      return "bg-[#00BC7D]/20 text-[#00BC7D]";
    case "Manager":
      return "bg-[#2B7FFF]/20 text-[#2B7FFF]";
    case "Admin":
      return "bg-[#45556C]/20 text-[#45556C]";
    default:
      return "bg-[#F1F5F9] text-[#45556C]";
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ActivityContent() {
  const [search, setSearch] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [userRole, setUserRole] = useState("all");
  const [branch, setBranch] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [managerApprovalOnly, setManagerApprovalOnly] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredActivities = useMemo(() => {
    return MOCK_ACTIVITIES.filter((activity) => {
      const matchesSearch =
        !search ||
        activity.description.toLowerCase().includes(search.toLowerCase()) ||
        activity.userName.toLowerCase().includes(search.toLowerCase()) ||
        (activity.orderId?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesActivityType =
        activityType === "all" || activity.activityType === activityType;

      const matchesRole = userRole === "all" || activity.role === userRole;

      const matchesBranch =
        branch === "all" ||
        activity.branchName.toLowerCase().includes(branch.toLowerCase());

      const matchesDateRange =
        (!fromDate || new Date(activity.dateTime) >= new Date(fromDate)) &&
        (!toDate || new Date(activity.dateTime) <= new Date(toDate));

      const matchesManagerApproval =
        !managerApprovalOnly || activity.hasManagerApproval;

      return (
        matchesSearch &&
        matchesActivityType &&
        matchesRole &&
        matchesBranch &&
        matchesDateRange &&
        matchesManagerApproval
      );
    });
  }, [
    search,
    activityType,
    userRole,
    branch,
    fromDate,
    toDate,
    managerApprovalOnly,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-[24px] font-bold text-[#1D293D]">Activity Log</h1>
            <p className="mt-1 text-[14px] text-[#62748E]">
              Monitor all system activities
            </p>
          </div>

          {/* Filters */}
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-[14px] font-bold text-[#314158]">Filters</span>
            </div>
            <div className="rounded-[16px] bg-[#F8FAFC] p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 w-full rounded-[14px] border border-[#E2E8F0] bg-white pl-10 pr-4 text-[14px] text-[#1D293D] placeholder:text-[#90A1B9] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="h-11 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    {ACTIVITY_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                    User Role
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="h-11 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    {USER_ROLES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="h-11 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="all">All Branches</option>
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="h-11 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="h-11 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 text-[14px] text-[#1D293D] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={managerApprovalOnly}
                      onChange={(e) => setManagerApprovalOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-[#E2E8F0] text-primary focus:ring-primary/20"
                    />
                    <span className="text-[14px] font-medium text-[#45556C]">
                      With Manager Approval Only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Table */}
          <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Date & Time
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Activity Type
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Description
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      User
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Role
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Branch
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Order ID
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Amount
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Manager
                    </th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#90A1B9]">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredActivities.map((activity) => {
                    const typeDisplay = getActivityTypeDisplay(
                      activity.activityType
                    );
                    const TypeIcon = typeDisplay.icon;
                    return (
                      <tr
                        key={activity.id}
                        className="group transition-colors hover:bg-[#F8FAFC]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#1D293D]">
                              {formatDate(activity.dateTime)}
                            </span>
                            <span className="text-[12px] text-[#90A1B9]">
                              {formatTime(activity.dateTime)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div
                            className={`flex items-center gap-2 ${typeDisplay.color}`}
                          >
                            <TypeIcon className="h-4 w-4 shrink-0" />
                            <span className="text-[14px] font-medium">
                              {typeDisplay.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-[14px] text-[#45556C]">
                          {activity.description}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-[#90A1B9]" />
                            <span className="text-[14px] font-medium text-[#1D293D]">
                              {activity.userName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeClass(activity.role)}`}
                          >
                            {activity.role}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-[#90A1B9]" />
                            <span className="text-[14px] text-[#45556C]">
                              {activity.branchName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {activity.orderId ? (
                            <Link
                              href={`${ROUTES.DASHBOARD_ORDERS}?order=${activity.orderId}`}
                              className="text-[14px] font-semibold text-[#2B7FFF] hover:underline"
                            >
                              {activity.orderId}
                            </Link>
                          ) : (
                            <span className="text-[#90A1B9]">—</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[14px] font-bold text-[#1D293D]">
                            {activity.currency}
                            {activity.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {activity.hasManagerApproval ? (
                            <span className="inline-flex rounded-full bg-[#E17100]/20 px-3 py-1 text-[10px] font-bold text-[#E17100]">
                              Yes
                            </span>
                          ) : (
                            <span className="text-[#90A1B9]">—</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === activity.id ? null : activity.id
                              )
                            }
                            className="rounded-lg p-1.5 text-[#90A1B9] transition-colors hover:bg-[#F1F5F9] hover:text-[#45556C]"
                            aria-label="Toggle details"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedRow === activity.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredActivities.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-[14px] text-[#90A1B9]">
                  No activities match your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
