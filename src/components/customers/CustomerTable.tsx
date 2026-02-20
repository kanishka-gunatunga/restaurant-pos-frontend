"use client";

import { User, Phone, MapPin, Pencil, Trash2 } from "lucide-react";

export type Customer = {
  id: string;
  displayName: string;
  name: string;
  lastVisit: string;
  mobile: string;
  address: string;
  orderCount: number;
};

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "C1",
    displayName: "#C1",
    name: "Samantha Reed",
    lastVisit: "Feb 19, 2026",
    mobile: "0712345678",
    address: "42 Willow Way, Apartment 12",
    orderCount: 15,
  },
  {
    id: "C2",
    displayName: "#C2",
    name: "Michael Chen",
    lastVisit: "Feb 19, 2026",
    mobile: "0723456789",
    address: "-",
    orderCount: 8,
  },
  {
    id: "C3",
    displayName: "#C3",
    name: "Alice Thompson",
    lastVisit: "Feb 18, 2026",
    mobile: "0745678901",
    address: "123 Maple St, Apt 4B, Central Park",
    orderCount: 24,
  },
  {
    id: "C4",
    displayName: "#C4",
    name: "David Wilson",
    lastVisit: "Feb 17, 2026",
    mobile: "0756789012",
    address: "88 Pine Crescent",
    orderCount: 4,
  },
  {
    id: "C5",
    displayName: "#C5",
    name: "Elena Rodriguez",
    lastVisit: "Feb 19, 2026",
    mobile: "0767890123",
    address: "12 Riverside Plaza",
    orderCount: 31,
  },
];

interface CustomerTableProps {
  searchTerm: string;
}

export default function CustomerTable({ searchTerm }: CustomerTableProps) {
  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm)
  );

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                ID
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                Customer Info
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                Mobile
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                Address
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9] text-center">
                Orders
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#90A1B9] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="group hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-6 py-4 text-[11px] font-bold text-[#90A1B9]">
                  {customer.displayName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center border border-[#F1F5F9] justify-center rounded-full bg-[#F8FAFC] text-[#90A1B9]">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#314158]">
                        {customer.name}
                      </p>
                      <p className="text-[10px] text-[#90A1B9]">
                        Last visit: {customer.lastVisit}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[14px] text-[#45556C] font-semibold">
                    <Phone className="h-3.5 w-3.5 text-[#90A1B9]" />
                    {customer.mobile}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[12px] text-[#45556C] font-medium max-w-[250px] truncate">
                    <MapPin className="h-3.5 w-3.5 text-[#90A1B9] shrink-0" />
                    {customer.address}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex h-7 min-w-[32px] items-center justify-center rounded-full bg-[#EEF2FF] px-3 text-[12px] font-bold text-[#4F39F6]">
                    {customer.orderCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg border border-[#E2E8F0] text-[#62748E] hover:bg-white hover:text-primary transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg border border-[#E2E8F0] text-[#62748E] hover:bg-white hover:text-red-500 transition-colors">
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
