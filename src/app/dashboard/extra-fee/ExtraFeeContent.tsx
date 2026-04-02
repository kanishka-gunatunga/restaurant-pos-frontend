"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ExtraFeeTabs from "@/components/extra-fee/ExtraFeeTabs";
import AddDeliveryFeeModal from "@/components/extra-fee/AddDeliveryFeeModal";
import AddServiceChargeModal from "@/components/extra-fee/AddServiceChargeModal";
import DeliveryFeeBranchSection from "@/components/extra-fee/DeliveryFeeBranchSection";
import ServiceChargeCard from "@/components/extra-fee/ServiceChargeCard";
import {
  DELIVERY_FEE_MOCKS,
  SERVICE_CHARGE_MOCKS,
} from "@/domains/extra-fee/mockData";
import type {
  BranchOption,
  DeliveryFeeItem,
  ExtraFeeTabId,
  ServiceChargeItem,
} from "@/domains/extra-fee/types";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/lib/constants";
import { useGetAllBranches } from "@/hooks/useBranch";

function normalizeBranchLocation(location: string | null | undefined): string {
  return location?.trim() || "Location not set";
}

export default function ExtraFeeContent() {
  const router = useRouter();
  const { isCashier } = useAuth();
  const { data: branches = [] } = useGetAllBranches("active");

  const [activeTab, setActiveTab] = useState<ExtraFeeTabId>("delivery");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDeliveryModalOpen, setIsAddDeliveryModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [editingDeliveryFee, setEditingDeliveryFee] = useState<DeliveryFeeItem | null>(null);
  const [editingServiceCharge, setEditingServiceCharge] = useState<ServiceChargeItem | null>(null);
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFeeItem[]>(DELIVERY_FEE_MOCKS);
  const [serviceCharges, setServiceCharges] = useState<ServiceChargeItem[]>(SERVICE_CHARGE_MOCKS);

  useEffect(() => {
    if (isCashier) router.replace(ROUTES.DASHBOARD_MENU);
  }, [isCashier, router]);

  const branchOptions: BranchOption[] = useMemo(() => {
    if (branches.length > 0) {
      return branches.map((b) => ({
        id: b.id,
        name: b.name,
        location: normalizeBranchLocation(b.location),
      }));
    }
    return Array.from(
      new Map(
        DELIVERY_FEE_MOCKS.map((fee) => [
          fee.branchId,
          { id: fee.branchId, name: fee.branchName, location: fee.branchLocation },
        ])
      ).values()
    );
  }, [branches]);

  const branchById = useMemo(() => {
    return new Map(branchOptions.map((b) => [b.id, b]));
  }, [branchOptions]);

  const filteredDeliveryFees = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return deliveryFees;
    return deliveryFees.filter(
      (fee) =>
        fee.zoneName.toLowerCase().includes(q) ||
        fee.branchName.toLowerCase().includes(q) ||
        fee.branchLocation.toLowerCase().includes(q)
    );
  }, [deliveryFees, searchTerm]);

  const deliveryGroups = useMemo(() => {
    const groups = new Map<
      string,
      { branchId: number; branchName: string; branchLocation: string; fees: DeliveryFeeItem[] }
    >();

    filteredDeliveryFees.forEach((fee) => {
      const branchMeta = branchById.get(fee.branchId);
      const branchName = branchMeta?.name ?? fee.branchName;
      const branchLocation = branchMeta?.location ?? fee.branchLocation;
      const key = `${fee.branchId}-${branchName}`;
      const existing = groups.get(key);
      if (existing) {
        existing.fees.push(fee);
      } else {
        groups.set(key, { branchId: fee.branchId, branchName, branchLocation, fees: [fee] });
      }
    });

    return Array.from(groups.values()).sort((a, b) => a.branchName.localeCompare(b.branchName));
  }, [filteredDeliveryFees, branchById]);

  const filteredServiceCharges = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return serviceCharges;
    return serviceCharges.filter(
      (item) => item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q)
    );
  }, [serviceCharges, searchTerm]);

  if (isCashier) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-[#E2E8F0]">
          <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div>
              <h1 className="font-['Inter'] text-[24px] font-bold leading-8 text-[#1D293D]">
                Additional Fees
              </h1>
              <p className="mt-1 font-['Inter'] text-[14px] leading-5 text-[#62748E]">
                Manage delivery fees and service charges for branches
              </p>
            </div>

            <div className="mt-6">
              <ExtraFeeTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTab === "delivery" ? "Search delivery fees..." : "Search service charges..."
                }
                className="h-11 w-full rounded-[14px] border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (activeTab === "delivery") {
                  setEditingDeliveryFee(null);
                  setIsAddDeliveryModalOpen(true);
                } else {
                  setEditingServiceCharge(null);
                  setIsAddServiceModalOpen(true);
                }
              }}
              className="flex h-11 shrink-0 items-center gap-2 self-start rounded-[14px] bg-[#EA580C] px-4 font-['Inter'] text-sm font-bold text-white shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              {activeTab === "delivery" ? "Add Delivery Fee" : "Add Service Charge"}
            </button>
          </div>

          {activeTab === "delivery" ? (
            <div className="space-y-4">
              {deliveryGroups.length === 0 ? (
                <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-10 text-center">
                  <p className="font-['Inter'] text-base font-medium text-[#45556C]">
                    No delivery fees found
                  </p>
                  <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
                    Try another search or add a new delivery fee.
                  </p>
                </div>
              ) : (
                deliveryGroups.map((group) => (
                  <DeliveryFeeBranchSection
                    key={`${group.branchId}-${group.branchName}`}
                    branchName={group.branchName}
                    branchLocation={group.branchLocation}
                    fees={group.fees}
                    onEdit={(fee) => {
                      setEditingDeliveryFee(fee);
                      setIsAddDeliveryModalOpen(true);
                    }}
                    onDelete={(fee) => {
                      setDeliveryFees((prev) => prev.filter((item) => item.id !== fee.id));
                    }}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredServiceCharges.map((item) => (
                  <ServiceChargeCard
                    key={item.id}
                    item={item}
                    onEdit={(selected) => {
                      setEditingServiceCharge(selected);
                      setIsAddServiceModalOpen(true);
                    }}
                  />
              ))}
              {filteredServiceCharges.length === 0 && (
                <div className="col-span-full rounded-[14px] border border-[#E2E8F0] bg-white p-10 text-center">
                  <p className="font-['Inter'] text-base font-medium text-[#45556C]">
                    No service charge records found
                  </p>
                  <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
                    Try another search query.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAddDeliveryModalOpen && (
        <AddDeliveryFeeModal
          isOpen={isAddDeliveryModalOpen}
          branches={branchOptions}
          editingFee={editingDeliveryFee}
          onClose={() => {
            setIsAddDeliveryModalOpen(false);
            setEditingDeliveryFee(null);
          }}
          onSubmit={({ branchId, feeName, price }) => {
            const branch = branchById.get(branchId);
            if (!branch) return;
            if (editingDeliveryFee) {
              setDeliveryFees((prev) =>
                prev.map((item) =>
                  item.id === editingDeliveryFee.id
                    ? {
                        ...item,
                        branchId: branch.id,
                        branchName: branch.name,
                        branchLocation: branch.location,
                        zoneName: feeName,
                        price,
                      }
                    : item
                )
              );
              return;
            }
            const nextId = Date.now();
            const addedOn = new Date().toISOString().slice(0, 10);
            setDeliveryFees((prev) => [
              ...prev,
              {
                id: nextId,
                branchId: branch.id,
                branchName: branch.name,
                branchLocation: branch.location,
                zoneName: feeName,
                price,
                addedOn,
              },
            ]);
          }}
        />
      )}

      {isAddServiceModalOpen && (
        <AddServiceChargeModal
          isOpen={isAddServiceModalOpen}
          branches={branchOptions}
          initialCharge={editingServiceCharge}
          onClose={() => {
            setIsAddServiceModalOpen(false);
            setEditingServiceCharge(null);
          }}
          onSubmit={({ branchId, percentage, chargeId }) => {
            const branch = branchById.get(branchId);
            if (!branch) return;
            setServiceCharges((prev) => {
              if (chargeId) {
                return prev.map((item) =>
                  item.id === chargeId
                    ? {
                        ...item,
                        branchId: branch.id,
                        title: branch.name,
                        location: branch.location,
                        rate: percentage,
                      }
                    : item
                );
              }
              const existing = prev.find((item) => item.branchId === branchId);
              if (existing && !editingServiceCharge) {
                return prev.map((item) =>
                  item.branchId === branchId ? { ...item, rate: percentage } : item
                );
              }
              return [
                {
                  id: Date.now(),
                  branchId: branch.id,
                  title: branch.name,
                  location: branch.location,
                  rate: percentage,
                  addedOn: new Date().toISOString().slice(0, 10),
                },
                ...prev,
              ];
            });
          }}
        />
      )}
    </div>
  );
}
