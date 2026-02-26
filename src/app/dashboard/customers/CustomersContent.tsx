"use client";

import { useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerTable from "@/components/customers/CustomerTable";
import AddCustomerModal from "@/components/customers/AddCustomerModal";

export default function CustomersContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCustomer = (customer: {
    name: string;
    mobile: string;
    email: string;
    address: string;
  }) => {
    void customer; // TODO: Call API to add customer
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <CustomerHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => setIsAddModalOpen(true)}
          />
          <CustomerTable searchTerm={searchTerm} />
        </div>
      </div>

      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCustomer}
        />
      )}
    </div>
  );
}
