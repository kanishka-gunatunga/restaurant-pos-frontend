"use client";

import { useState, useEffect } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerTable from "@/components/customers/CustomerTable";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import {
  useGetAllCustomers,
  useSearchCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useActivateCustomer,
  useDeactivateCustomer,
  useUpdatePromotionPreference,
} from "@/hooks/useCustomer";
import { Customer } from "@/types/customer";

export default function CustomersContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const parsing = (() => {
    const term = debouncedSearchTerm.toLowerCase().trim();
    if (!term) return { query: "", status: "all" as const };

    const parts = term.split(/\s+/);
    let status: "active" | "inactive" | "all" = "all";

    const statuses = ["active", "inactive", "all"];

    const queryParts = parts.filter((part) => {
      if (statuses.includes(part)) {
        status = part as any;
        return false;
      }
      return true;
    });

    return {
      query: queryParts.join(" "),
      status: status || "active",
    };
  })();

  const { data: allCustomers = [], isLoading: isAllLoading } = useGetAllCustomers({
    status: parsing.status,
  });
  const { data: searchResults = [], isLoading: isSearchLoading } = useSearchCustomers(parsing);

  const hasNameQuery = parsing.query.trim().length > 0;
  const customers = hasNameQuery ? searchResults : allCustomers;
  const isLoading = hasNameQuery ? isSearchLoading : isAllLoading;

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const activateMutation = useActivateCustomer();
  const deactivateMutation = useDeactivateCustomer();
  const promotionMutation = useUpdatePromotionPreference();

  const handleSaveCustomer = async (data: any) => {
    try {
      if (selectedCustomer) {
        await updateMutation.mutateAsync({ id: selectedCustomer.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsAddModalOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Failed to save customer:", error);
      throw error;
    }
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsAddModalOpen(true);
  };

  const handleToggleStatus = async (customer: Customer) => {
    if (customer.status === "active") {
      await deactivateMutation.mutateAsync(customer.id);
    } else {
      await activateMutation.mutateAsync(customer.id);
    }
  };

  const handleTogglePromotion = async (customer: Customer) => {
    await promotionMutation.mutateAsync({
      id: customer.id,
      enabled: !customer.promotions_enabled,
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="">
          <CustomerHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => setIsAddModalOpen(true)}
          />
          <CustomerTable
            searchTerm={searchTerm}
            customers={customers}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onToggleStatus={handleToggleStatus}
            onTogglePromotion={handleTogglePromotion}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSaveCustomer}
          initialData={selectedCustomer}
        />
      )}
    </div>
  );
}
