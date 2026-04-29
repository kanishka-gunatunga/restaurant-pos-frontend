"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import CustomerHeader from "@/components/customers/CustomerHeader";
import CustomerTable from "@/components/customers/CustomerTable";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import SendPromotionModal from "@/components/customers/SendPromotionModal";
import CategoryDiscountModal from "@/components/customers/CategoryDiscountModal";
import TableManagement from "@/components/customers/TableManagement";
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
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
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
        toast.success("Customer updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Customer registered successfully");
      }
      setIsAddModalOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Failed to save customer:", error);
      toast.error("Failed to save customer. Please try again.");
      throw error;
    }
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsAddModalOpen(true);
  };

  const handleToggleStatus = async (customer: Customer) => {
    try {
      if (customer.status === "active") {
        await deactivateMutation.mutateAsync(customer.id);
        toast.success("Customer deactivated successfully");
      } else {
        await activateMutation.mutateAsync(customer.id);
        toast.success("Customer activated successfully");
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleTogglePromotion = async (customer: Customer) => {
    try {
      await promotionMutation.mutateAsync({
        id: customer.id,
        enabled: !customer.promotions_enabled,
      });
      toast.success("Promotion preference updated");
    } catch (error) {
      console.error("Failed to update promotion preference:", error);
      toast.error("Failed to update promotion preference");
    }
  };

  const [activeTab, setActiveTab] = useState<"customers" | "tables">("customers");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex gap-1 rounded-xl bg-[#F1F5F9] p-1 w-fit">
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-6 py-2 text-[14px] font-bold rounded-lg transition-all ${
              activeTab === "customers"
                ? "bg-white text-primary shadow-sm"
                : "text-[#62748E] hover:text-[#1D293D]"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`px-6 py-2 text-[14px] font-bold rounded-lg transition-all ${
              activeTab === "tables"
                ? "bg-white text-primary shadow-sm"
                : "text-[#62748E] hover:text-[#1D293D]"
            }`}
          >
            Table Management
          </button>
        </div>

        {activeTab === "customers" ? (
          <div className="">
            <CustomerHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddClick={() => setIsAddModalOpen(true)}
              onSendPromotionClick={() => setIsPromotionModalOpen(true)}
              onDiscountClick={() => setIsDiscountModalOpen(true)}
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
        ) : (
          <TableManagement />
        )}
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

      {isPromotionModalOpen && (
        <SendPromotionModal
          onClose={() => setIsPromotionModalOpen(false)}
        />
      )}

      {isDiscountModalOpen && (
        <CategoryDiscountModal
          onClose={() => setIsDiscountModalOpen(false)}
        />
      )}
    </div>
  );
}
