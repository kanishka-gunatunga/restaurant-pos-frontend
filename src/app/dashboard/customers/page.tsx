"use client";

import { useState } from "react";
import MenuPageHeader from "@/components/menu/MenuPageHeader";
import { OrderProvider } from "@/contexts/OrderContext";
import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerTable from "@/components/customers/CustomerTable";
import AddCustomerModal from "@/components/customers/AddCustomerModal";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCustomer = (customer: {
    name: string;
    mobile: string;
    email: string;
    address: string;
  }) => {
    console.log("Adding customer:", customer);
    setIsAddModalOpen(false);
  };

  return (
    <OrderProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
        <MenuPageHeader />
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
    </OrderProvider>
  );
}
