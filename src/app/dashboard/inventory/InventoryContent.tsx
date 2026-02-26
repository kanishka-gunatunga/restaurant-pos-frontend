"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { BRANCHES, getBranchById } from "@/lib/branchData";
import { TABS, type TabId, type NewProductForm } from "./types";
import AddCategoryModal from "./components/AddCategoryModal";
import AddGroupModal from "./components/AddGroupModal";
import AddProductModal from "./components/AddProductModal";
import CategoriesTab from "./components/CategoriesTab";
import AddonsTab from "./components/AddonsTab";
import ProductsTab from "./components/ProductsTab";
import DiscountsTab from "./components/DiscountsTab";

const INITIAL_PRODUCT: NewProductForm = {
  productName: "",
  productImageUrl: "",
  basePrice: "15.00",
  quantity: "100",
  category: "",
  subCategory: "",
  batchNumber: "",
  expiryDate: "",
  variants: [],
  addonGroupIds: [],
};

export default function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchIdParam = searchParams.get("branchId");
  const branchId = branchIdParam && getBranchById(branchIdParam) ? branchIdParam : BRANCHES[0]?.id ?? "";
  const { isCashier } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("products");
  const [searchQuery, setSearchQuery] = useState("");

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addCategoryOverlayVisible, setAddCategoryOverlayVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategories, setNewSubCategories] = useState<string[]>(["", ""]);

  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [addGroupOverlayVisible, setAddGroupOverlayVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupItems, setNewGroupItems] = useState<{ name: string; price: string }[]>([
    { name: "", price: "" },
    { name: "", price: "" },
    { name: "", price: "" },
  ]);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addProductOverlayVisible, setAddProductOverlayVisible] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductForm>(INITIAL_PRODUCT);

  const branch = getBranchById(branchId);

  const openAddCategory = () => {
    setNewCategoryName("");
    setNewSubCategories(["", ""]);
    setAddCategoryOverlayVisible(false);
    setAddCategoryOpen(true);
  };

  const openAddGroup = () => {
    setNewGroupName("");
    setNewGroupItems([{ name: "", price: "" }, { name: "", price: "" }, { name: "", price: "" }]);
    setAddGroupOverlayVisible(false);
    setAddGroupOpen(true);
  };

  const openAddProduct = () => {
    setNewProduct(INITIAL_PRODUCT);
    setAddProductOverlayVisible(false);
    setAddProductOpen(true);
  };

  useEffect(() => {
    if (!addCategoryOpen) return;
    const raf = requestAnimationFrame(() => setAddCategoryOverlayVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [addCategoryOpen]);

  useEffect(() => {
    if (!addGroupOpen) return;
    const raf = requestAnimationFrame(() => setAddGroupOverlayVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [addGroupOpen]);

  useEffect(() => {
    if (!addProductOpen) return;
    const raf = requestAnimationFrame(() => setAddProductOverlayVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [addProductOpen]);

  useEffect(() => {
    if (isCashier) router.replace(ROUTES.DASHBOARD_MENU);
  }, [isCashier, router]);

  useEffect(() => {
    if (branchIdParam && !getBranchById(branchIdParam) && BRANCHES[0]) {
      router.replace(`${ROUTES.DASHBOARD_INVENTORY}?branchId=${BRANCHES[0].id}`);
    }
  }, [branchIdParam, router]);

  if (isCashier) return null;
  if (!branch) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-['Inter'] text-[24px] font-bold leading-8 text-[#1D293D]">
                Inventory
              </h1>
              <p className="mt-1 font-['Inter'] text-[14px] leading-5 text-[#62748E]">
                Manage products, prices, Categories & Discounts
              </p>
            </div>
            {activeTab === "products" && (
              <div className="relative w-full max-w-xs shrink-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Product Name, Category..."
                  className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-4 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
            )}
          </div>

          <div className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-sm">
            <div className="flex gap-1">
              {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-center font-['Inter'] text-sm font-bold leading-5 transition-colors ${
                      isActive
                        ? "bg-[#EA580C1A] text-[#EA580C]"
                        : "text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === "products" && (
            <div className="flex items-center justify-between">
              <h2 className="font-['Inter'] text-[16px] font-bold leading-6 text-[#314158]">Products</h2>
              <button
                type="button"
                onClick={openAddProduct}
                className="flex shrink-0 items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
                style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>
          )}

          {activeTab === "categories" && <CategoriesTab onAddCategory={openAddCategory} />}
          {activeTab === "addons" && <AddonsTab onAddGroup={openAddGroup} />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "discounts" && <DiscountsTab />}
        </div>
      </div>

      <AddCategoryModal
        open={addCategoryOpen}
        overlayVisible={addCategoryOverlayVisible}
        categoryName={newCategoryName}
        subCategories={newSubCategories}
        onCategoryNameChange={setNewCategoryName}
        onSubCategoryAdd={() => setNewSubCategories((prev) => [...prev, ""])}
        onSubCategoryRemove={(index) => setNewSubCategories((prev) => prev.filter((_, i) => i !== index))}
        onSubCategoryUpdate={(index, value) =>
          setNewSubCategories((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
          })
        }
        onClose={() => setAddCategoryOpen(false)}
      />

      <AddGroupModal
        open={addGroupOpen}
        overlayVisible={addGroupOverlayVisible}
        groupName={newGroupName}
        items={newGroupItems}
        onGroupNameChange={setNewGroupName}
        onItemAdd={() => setNewGroupItems((prev) => [...prev, { name: "", price: "" }])}
        onItemRemove={(index) => setNewGroupItems((prev) => prev.filter((_, i) => i !== index))}
        onItemUpdate={(index, field, value) =>
          setNewGroupItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
          })
        }
        onClose={() => setAddGroupOpen(false)}
      />

      {branch && (
        <AddProductModal
          open={addProductOpen}
          overlayVisible={addProductOverlayVisible}
          branchName={branch.name}
          product={newProduct}
          onProductChange={setNewProduct}
          onVariantAdd={() =>
            setNewProduct((prev) => ({
              ...prev,
              variants: [...prev.variants, { name: "", price: "" }],
            }))
          }
          onVariantRemove={(index) =>
            setNewProduct((prev) => ({
              ...prev,
              variants: prev.variants.filter((_, i) => i !== index),
            }))
          }
          onVariantUpdate={(index, field, value) =>
            setNewProduct((prev) => {
              const next = [...prev.variants];
              next[index] = { ...next[index], [field]: value };
              return { ...prev, variants: next };
            })
          }
          onAddonGroupToggle={(id) =>
            setNewProduct((prev) => ({
              ...prev,
              addonGroupIds: prev.addonGroupIds.includes(id)
                ? prev.addonGroupIds.filter((x) => x !== id)
                : [...prev.addonGroupIds, id],
            }))
          }
          onClose={() => setAddProductOpen(false)}
        />
      )}
    </div>
  );
}
