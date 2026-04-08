"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Percent, Package, Gift } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useGetAllBranches } from "@/hooks/useBranch";
import DiscountsTab from "@/components/inventory/DiscountsTab";
import ComboPacksTab from "@/components/promotions/ComboPacksTab";
import BogoTab from "@/components/promotions/BogoTab";
import AddComboModal from "@/components/promotions/AddComboModal";
import AddBogoModal from "@/components/promotions/AddBogoModal";

type PromotionTabId = "productDiscounts" | "comboPacks" | "bogo";

const PROMOTION_TABS = [
  { id: "productDiscounts" as const, label: "Product Discounts", icon: Percent },
  { id: "comboPacks" as const, label: "Combo Packs", icon: Package },
  { id: "bogo" as const, label: "Buy One Get One", icon: Gift },
];

const PromotionsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchIdParam = searchParams.get("branchId");
  const { isCashier } = useAuth();
  const { data: branches = [] } = useGetAllBranches("active");

  const branch = branches.find((b) => b.id.toString() === branchIdParam) || branches[0];
  const [activeTab, setActiveTab] = useState<PromotionTabId>("productDiscounts");
  const [searchQuery, setSearchQuery] = useState("");
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isComboOverlayVisible, setIsComboOverlayVisible] = useState(false);

  const [isBogoModalOpen, setIsBogoModalOpen] = useState(false);
  const [isBogoOverlayVisible, setIsBogoOverlayVisible] = useState(false);

  useEffect(() => {
    if (!isComboModalOpen) {
      setIsComboOverlayVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setIsComboOverlayVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [isComboModalOpen]);

  useEffect(() => {
    if (!isBogoModalOpen) {
      setIsBogoOverlayVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setIsBogoOverlayVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [isBogoModalOpen]);

  useEffect(() => {
    if (isCashier) router.replace(ROUTES.DASHBOARD_MENU);
  }, [isCashier, router]);

  useEffect(() => {
    if (branchIdParam && branches.length > 0 && !branches.find(b => b.id.toString() === branchIdParam)) {
      router.replace(`${ROUTES.DASHBOARD_PROMOTIONS}?branchId=${branches[0].id}`);
    }
  }, [branchIdParam, router, branches]);

  if (isCashier) return null;
  if (!branch) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 pt-8 sm:px-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-['Inter'] text-[24px] font-bold leading-8 text-[#1D293D]">
                Promotions
              </h1>
              <p className="mt-1 font-['Inter'] text-[14px] leading-5 text-[#62748E]">
                Manage discounts, combo packs, and special offers
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2">
            {PROMOTION_TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 rounded-[10px] px-6 py-2.5 font-['Inter'] text-sm font-medium transition-all ${isActive
                    ? "bg-[#EA580C] text-white shadow-[0px_1px_3px_#0000001A,0px_1px_2px_-1px_#0000001A]"
                    : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F4]"
                    }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#90A1B9]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab === "productDiscounts" ? "discounts" : activeTab === "comboPacks" ? "combos" : "BOGO offers"}...`}
                className="w-full rounded-[14px] border border-[#E2E8F0] bg-white py-3.5 pl-12 pr-4 font-['Inter'] text-base text-[#1D293D] placeholder:text-[#0A0A0A80] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (activeTab === "comboPacks") setIsComboModalOpen(true);
                if (activeTab === "bogo") setIsBogoModalOpen(true);
                // Handle other tab's add buttons if needed, 
                // but DiscountsTab usually has its own internal button
              }}
              className="flex shrink-0 items-center justify-center gap-3 rounded-[14px] bg-[#EA580C] px-8 py-3.5 font-['Inter'] text-base font-bold text-white shadow-[0px_10px_15px_-3px_#0000001A,0px_4px_6px_-4px_#0000001A] transition-all hover:bg-[#c2410c]"
            >
              <Plus className="h-5 w-5" />
              {activeTab === "productDiscounts" ? "Add Discount" : activeTab === "comboPacks" ? "Add Combo" : "Add BOGO"}
            </button>
          </div>

          {/* Main Content Area */}
          <div className="rounded-[16px] border border-[#F1F5F9] bg-white p-6 shadow-sm">
            {activeTab === "productDiscounts" && <DiscountsTab />}
            {activeTab === "comboPacks" && <ComboPacksTab />}
            {activeTab === "bogo" && <BogoTab />}
          </div>
        </div>
      </div>

      <AddComboModal 
        open={isComboModalOpen}
        overlayVisible={isComboOverlayVisible}
        onClose={() => setIsComboModalOpen(false)}
      />

      <AddBogoModal 
        open={isBogoModalOpen}
        overlayVisible={isBogoOverlayVisible}
        onClose={() => setIsBogoModalOpen(false)}
      />
    </div>
  );
};

export default PromotionsContent;
