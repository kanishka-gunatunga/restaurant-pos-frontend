"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  LayoutGrid,
  Layers,
  Package,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  FileText,
  X,
  ChevronDown,
  Link2,
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { getBranchById } from "../branchData";

type TabId = "categories" | "addons" | "products";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "categories", label: "Categories", icon: LayoutGrid },
  { id: "addons", label: "Add-on Groups", icon: Layers },
  { id: "products", label: "Products", icon: Package },
];

const MOCK_CATEGORIES = [
  { id: "1", name: "Burgers", subCount: 3, subCategories: ["Beef", "Chicken", "Vegetarian"] },
  { id: "2", name: "Pizza", subCount: 2, subCategories: ["Classic", "Specialty"] },
  { id: "3", name: "Pasta", subCount: 2, subCategories: ["Vegetarian", "Meat"] },
];

const MOCK_ADDON_GROUPS = [
  {
    id: "1",
    name: "Large Pizza Add-ons",
    items: [
      { name: "Extra Cheese", price: "Rs.200.00" },
      { name: "Onion", price: "Rs.50.00" },
      { name: "Tomato", price: "Rs.100.00" },
    ],
  },
  {
    id: "2",
    name: "Single Burger Add-ons",
    items: [
      { name: "Bacon", price: "Rs.500.00" },
      { name: "Avocado", price: "Rs.300.00" },
      { name: "BBQ Chicken", price: "Rs.1000.00" },
      { name: "Onion", price: "Rs.1000.00" },
    ],
  },
];

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Pepperoni Pizza",
    category: "PIZZA + CLASSIC",
    price: "Rs.2000.00",
    variants: "1 variants",
    stock: "100 left",
    batch: "# BTH-434546",
    expiry: "2/25/2026",
    addonGroup: "PIZZA ADD-ONS",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100&h=100&fit=crop",
  },
];

const CategoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M16.6667 8.33333C16.8877 8.33333 17.0996 8.24554 17.2559 8.08926C17.4122 7.93298 17.5 7.72101 17.5 7.5V5C17.5 4.77899 17.4122 4.56702 17.2559 4.41074C17.0996 4.25446 16.8877 4.16667 16.6667 4.16667H14.5833C14.454 4.16667 14.3264 4.13655 14.2107 4.07869C14.0949 4.02083 13.9943 3.93683 13.9167 3.83333L13.1667 2.83333C13.089 2.72984 12.9884 2.64583 12.8727 2.58798C12.757 2.53012 12.6294 2.5 12.5 2.5H10.8333C10.6123 2.5 10.4004 2.5878 10.2441 2.74408C10.0878 2.90036 10 3.11232 10 3.33333V7.5C10 7.72101 10.0878 7.93298 10.2441 8.08926C10.4004 8.24554 10.6123 8.33333 10.8333 8.33333H16.6667Z" stroke="#EA580C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.6667 17.5C16.8877 17.5 17.0996 17.4122 17.2559 17.2559C17.4122 17.0996 17.5 16.8876 17.5 16.6666V14.1666C17.5 13.9456 17.4122 13.7337 17.2559 13.5774C17.0996 13.4211 16.8877 13.3333 16.6667 13.3333H14.25C14.0975 13.3313 13.9485 13.2875 13.8192 13.2067C13.6899 13.1259 13.5853 13.0111 13.5167 12.875L13.1667 12.1666C13.1016 12.0176 12.9944 11.8908 12.8581 11.802C12.7219 11.7131 12.5626 11.6661 12.4 11.6666H10.8333C10.6123 11.6666 10.4004 11.7544 10.2441 11.9107C10.0878 12.067 10 12.279 10 12.5V16.6666C10 16.8876 10.0878 17.0996 10.2441 17.2559C10.4004 17.4122 10.6123 17.5 10.8333 17.5H16.6667Z" stroke="#EA580C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 4.16663C2.5 4.60865 2.67559 5.03258 2.98816 5.34514C3.30072 5.6577 3.72464 5.83329 4.16667 5.83329H6.66667" stroke="#EA580C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 2.5V13.3333C2.5 13.7754 2.67559 14.1993 2.98816 14.5118C3.30072 14.8244 3.72464 15 4.16667 15H6.66667" stroke="#EA580C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function SubCategoryIcon() {
  const id = useId();
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <g clipPath={`url(#${id})`}>
        <path d="M6.293 1.293C6.10551 1.10545 5.85119 1.00006 5.586 1H2C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2V5.586C1.00006 5.85119 1.10545 6.10551 1.293 6.293L5.645 10.645C5.87226 10.8708 6.17962 10.9976 6.5 10.9976C6.82038 10.9976 7.12774 10.8708 7.355 10.645L10.645 7.355C10.8708 7.12774 10.9976 6.82038 10.9976 6.5C10.9976 6.17962 10.8708 5.87226 10.645 5.645L6.293 1.293Z" stroke="#EA580C" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.75 4C3.88807 4 4 3.88807 4 3.75C4 3.61193 3.88807 3.5 3.75 3.5C3.61193 3.5 3.5 3.61193 3.5 3.75C3.5 3.88807 3.61193 4 3.75 4Z" fill="#EA580C" stroke="#EA580C" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id={id}>
          <rect width="12" height="12" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export default function BranchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params?.branchId as string;
  const { isCashier } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("categories");
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
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productImageUrl: "",
    basePrice: "15.00",
    quantity: "100",
    category: "",
    subCategory: "",
    batchNumber: "",
    expiryDate: "",
    variants: [] as { name: string; price: string }[],
    addonGroupIds: [] as string[],
  });

  const branch = getBranchById(branchId);

  const openAddCategory = () => {
    setNewCategoryName("");
    setNewSubCategories(["", ""]);
    setAddCategoryOverlayVisible(false);
    setAddCategoryOpen(true);
  };

  const closeAddCategory = () => {
    setAddCategoryOpen(false);
  };

  const addSubCategoryField = () => {
    setNewSubCategories((prev) => [...prev, ""]);
  };

  const removeSubCategoryField = (index: number) => {
    setNewSubCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSubCategory = (index: number, value: string) => {
    setNewSubCategories((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const openAddGroup = () => {
    setNewGroupName("");
    setNewGroupItems([{ name: "", price: "" }, { name: "", price: "" }, { name: "", price: "" }]);
    setAddGroupOverlayVisible(false);
    setAddGroupOpen(true);
  };

  const closeAddGroup = () => setAddGroupOpen(false);

  const addGroupItemField = () => {
    setNewGroupItems((prev) => [...prev, { name: "", price: "" }]);
  };

  const removeGroupItemField = (index: number) => {
    setNewGroupItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGroupItem = (index: number, field: "name" | "price", value: string) => {
    setNewGroupItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const openAddProduct = () => {
    setNewProduct({
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
    });
    setAddProductOverlayVisible(false);
    setAddProductOpen(true);
  };

  const closeAddProduct = () => setAddProductOpen(false);

  const addProductVariant = () => {
    setNewProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "" }],
    }));
  };

  const removeProductVariant = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateProductVariant = (index: number, field: "name" | "price", value: string) => {
    setNewProduct((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, variants: next };
    });
  };

  const toggleAddonGroup = (id: string) => {
    setNewProduct((prev) => ({
      ...prev,
      addonGroupIds: prev.addonGroupIds.includes(id)
        ? prev.addonGroupIds.filter((x) => x !== id)
        : [...prev.addonGroupIds, id],
    }));
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
    if (branchId && !branch) {
      router.replace(ROUTES.DASHBOARD_INVENTORY);
    }
  }, [branchId, branch, router]);

  if (isCashier) return null;
  if (!branch) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <DashboardPageHeader />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="font-['Inter'] text-[24px] font-bold leading-8 text-[#1D293D]">
              Menu & Branch Management
            </h1>
            <p className="mt-1 font-['Inter'] text-[14px] leading-5 text-[#62748E]">
              Manage products, prices, and branches
            </p>
          </div>

          <nav className="font-['Inter'] text-sm text-[#62748E]">
            <Link
              href={ROUTES.DASHBOARD_INVENTORY}
              className="hover:text-[#EA580C]"
            >
              Branches
            </Link>
            <span className="mx-1.5">&gt;</span>
            <span className="font-medium text-[#45556C]">{branch.name}</span>
          </nav>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-sm">
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

          {activeTab === "categories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-['Inter'] text-lg font-bold text-[#1D293D]">
                  Categories & Sub-Categories
                </h2>
                <button
                  type="button"
                  onClick={openAddCategory}
                  className="flex items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
                  style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {MOCK_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex gap-3">
                        <div className="flex shrink-0 self-start justify-center rounded-[14px] border border-[#E2E8F0] bg-white p-2.5 opacity-100">
                          <CategoryIcon />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-['Inter'] text-[18px] font-bold leading-7 text-[#1D293D]">
                            {cat.name}
                          </h3>
                          <p className="mt-0.5 font-['Inter'] text-xs font-normal leading-4 text-[#90A1B9]">
                            {cat.subCount} sub-categories
                          </p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {cat.subCategories.map((sub) => (
                              <span
                                key={sub}
                                className="inline-flex items-center gap-1 rounded-[14px] border border-[#E2E8F0] bg-white px-2.5 py-1 font-['Inter'] text-xs font-bold leading-4 text-[#45556C] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                              >
                                <SubCategoryIcon />
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "addons" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-['Inter'] text-lg font-bold text-[#1D293D]">
                  Add-on Groups
                </h2>
                <button
                  type="button"
                  onClick={openAddGroup}
                  className="flex items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 text-center font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
                  style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
                >
                  <Plus className="h-4 w-4" />
                  Add Group
                </button>
              </div>
              <div className="space-y-6">
                {MOCK_ADDON_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-[16px] border border-[#F1F5F9] bg-[#F8FAFC] p-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Inter'] text-base font-bold text-[#1D293D]">
                        {group.name}
                      </h3>
                      <div className="flex gap-1">
                        <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-[5px]">
                      {group.items.map((item) => (
                        <span
                          key={item.name}
                          className="inline-flex items-center gap-[5px] rounded-[14px] border border-[#E2E8F0] bg-white py-[9px] pl-[17px] pr-[17px] font-['Inter'] text-xs font-bold leading-4 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]"
                        >
                          <span className="text-[#45556C]">{item.name}</span>
                          <span className="text-[#EA580C]">{item.price}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-['Inter'] text-lg font-bold text-[#1D293D]">
                  Branch Products
                </h2>
                <button
                  type="button"
                  onClick={openAddProduct}
                  className="flex items-center gap-2 rounded-[14px] bg-[#EA580C] px-4 py-2.5 text-center font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] transition-opacity hover:bg-[#c2410c]"
                  style={{ transitionDuration: "300ms", transitionTimingFunction: "ease-out" }}
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse font-['Inter']">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                          Product Info
                        </th>
                        <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                          Price
                        </th>
                        <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                          Stock
                        </th>
                        <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                          Batch & Expiry
                        </th>
                        <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                          Add-on Groups
                        </th>
                        <th className="p-4 text-right text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PRODUCTS.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#E2E8F0]">
                                {"image" in product && product.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={product.image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package className="absolute inset-0 m-auto h-6 w-6 text-[#90A1B9]" />
                                )}
                              </div>
                              <div>
                                <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">{product.name}</p>
                                <p className="font-['Inter'] text-[10px] font-bold uppercase leading-[15px] tracking-[-0.5px] text-[#90A1B9]">{product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">{product.price}</p>
                            <p className="font-['Inter'] text-[10px] font-medium italic leading-[15px] text-[#90A1B9]">{product.variants}</p>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex rounded-[10px] bg-[#ECFDF5] px-2 py-1 font-['Inter'] text-[10px] font-bold leading-[15px] text-[#009966]">
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="flex items-center gap-1 font-['Consolas'] text-xs leading-4 text-[#45556C]">
                                <FileText className="h-3.5 w-3.5 shrink-0" />
                                {product.batch}
                              </span>
                              <span className="flex items-center gap-1 font-['Inter'] text-xs leading-4 text-[#45556C]">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                {product.expiry}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex rounded-[10px] bg-[#EFF6FF] px-3 py-1 font-['Inter'] text-[10px] font-bold uppercase leading-[15px] tracking-[0.5px] text-[#155DFC]">
                              {product.addonGroup}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {addCategoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-category-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
          style={{ opacity: addCategoryOverlayVisible ? 1 : 0 }}
          onClick={closeAddCategory}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-md flex-col rounded-[14px] border border-[#E2E8F0] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex shrink-0 items-center justify-between">
              <h2 id="add-category-title" className="font-['Inter'] text-lg font-bold text-[#1D293D]">
                New Category
              </h2>
              <button
                type="button"
                onClick={closeAddCategory}
                className="rounded-lg p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="shrink-0">
                <label htmlFor="category-name" className="mb-1.5 block font-['Inter'] text-xs font-medium uppercase tracking-wide text-[#90A1B9]">
                  Category Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Burgers"
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <div className="mb-1.5 flex shrink-0 items-center justify-between">
                  <label className="block font-['Inter'] text-xs font-medium uppercase tracking-wide text-[#90A1B9]">
                    Sub-Categories
                  </label>
                  <button
                    type="button"
                    onClick={addSubCategoryField}
                    className="flex items-center gap-1 font-['Inter'] text-sm font-bold text-[#EA580C]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Sub-Category
                  </button>
                </div>
                <div className="max-h-48 min-h-0 space-y-2 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                  {newSubCategories.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateSubCategory(index, e.target.value)}
                        placeholder="e.g. Beef, Chicken"
                        className="min-w-0 flex-1 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubCategoryField(index)}
                        className="shrink-0 rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove sub-category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex shrink-0 justify-end gap-3">
              <button
                type="button"
                onClick={closeAddCategory}
                className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 font-['Inter'] text-sm font-bold text-[#45556C] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] hover:bg-[#c2410c]"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {addGroupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-group-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
          style={{ opacity: addGroupOverlayVisible ? 1 : 0 }}
          onClick={closeAddGroup}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-md flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex shrink-0 items-center justify-between">
              <h2 id="add-group-title" className="font-['Inter'] text-[20px] font-bold text-[#1D293D]">
                New Add-on Group
              </h2>
              <button
                type="button"
                onClick={closeAddGroup}
                className="rounded-lg p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="shrink-0">
                <label htmlFor="group-name" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                  Group Name
                </label>
                <input
                  id="group-name"
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Large Pizza Add-ons"
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <div className="mb-3 mt-2 flex shrink-0 items-center justify-between">
                  <label className="block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Items in Group
                  </label>
                  <button
                    type="button"
                    onClick={addGroupItemField}
                    className="flex items-center gap-1 font-['Inter'] text-sm font-bold text-[#EA580C]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Item
                  </button>
                </div>
                <div className="max-h-48 min-h-0 space-y-4 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                  {newGroupItems.map((item, index) => (
                    <div key={index} className="flex shrink-0 gap-3">
                      <div className="min-w-0 flex-1">
                        <label className="mb-1 block font-['Inter'] text-xs font-medium text-[#45556C]">
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateGroupItem(index, "name", e.target.value)}
                          placeholder="Item Name"
                          className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                        />
                      </div>
                      <div className="w-24 shrink-0">
                        <label className="mb-1 block font-['Inter'] text-xs font-medium text-[#45556C]">
                          Price (Rs.)
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.price}
                          onChange={(e) => updateGroupItem(index, "price", e.target.value)}
                          placeholder="1000"
                          className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                        />
                      </div>
                      <div className="flex items-end pb-1">
                        <button
                          type="button"
                          onClick={() => removeGroupItemField(index)}
                          className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex shrink-0 justify-end gap-3">
              <button
                type="button"
                onClick={closeAddGroup}
                className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 font-['Inter'] text-sm font-bold text-[#45556C] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] hover:bg-[#c2410c]"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {addProductOpen && branch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-product-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out"
          style={{ opacity: addProductOverlayVisible ? 1 : 0 }}
          onClick={closeAddProduct}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex shrink-0 items-start justify-between">
              <div>
                <h2 id="add-product-title" className="font-['Inter'] text-[20px] font-bold text-[#1D293D]">
                  Create New Product
                </h2>
                <p className="mt-1 font-['Inter'] text-sm text-[#90A1B9]">
                  Add product details for {branch.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddProduct}
                className="rounded-lg p-1.5 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="product-name" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Product Name
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct((p) => ({ ...p, productName: e.target.value }))}
                    placeholder="e.g. Pepperoni Pizza"
                    className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>
                <div>
                  <label htmlFor="product-image" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Product Image URL
                  </label>
                  <div className="relative">
                    <input
                      id="product-image"
                      type="url"
                      value={newProduct.productImageUrl}
                      onChange={(e) => setNewProduct((p) => ({ ...p, productImageUrl: e.target.value }))}
                      placeholder="https://unsplash.com/..."
                      className="w-full rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-3 pr-10 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    />
                    <Link2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                  </div>
                </div>
                <div>
                  <label htmlFor="base-price" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Base Price (Rs.)
                  </label>
                  <input
                    id="base-price"
                    type="text"
                    inputMode="decimal"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct((p) => ({ ...p, basePrice: e.target.value }))}
                    placeholder="15.00"
                    className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Quantity (Stock)
                  </label>
                  <input
                    id="quantity"
                    type="text"
                    inputMode="numeric"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct((p) => ({ ...p, quantity: e.target.value }))}
                    placeholder="100"
                    className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                      className="w-full appearance-none rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-3 pr-10 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    >
                      <option value="">Category</option>
                      {MOCK_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                  </div>
                </div>
                <div>
                  <label htmlFor="sub-category" className="mb-1.5 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Sub-Category
                  </label>
                  <div className="relative">
                    <select
                      id="sub-category"
                      value={newProduct.subCategory}
                      onChange={(e) => setNewProduct((p) => ({ ...p, subCategory: e.target.value }))}
                      className="w-full appearance-none rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-3 pr-10 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    >
                      <option value="">Sub-Category</option>
                      {MOCK_CATEGORIES.flatMap((c) => c.subCategories.map((s) => ({ cat: c.name, sub: s }))).map(({ cat, sub }) => (
                        <option key={`${cat}-${sub}`} value={sub}>{sub}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-[#BFDBFE] bg-[#F0F9FF]/60 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#3B82F6]" />
                  <span className="font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Inventory Details
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="batch" className="mb-1.5 flex items-center gap-1 font-['Inter'] text-xs font-medium text-[#45556C]">
                      <span>#</span> Batch Number
                    </label>
                    <input
                      id="batch"
                      type="text"
                      value={newProduct.batchNumber}
                      onChange={(e) => setNewProduct((p) => ({ ...p, batchNumber: e.target.value }))}
                      placeholder="e.g. BTH2024-001"
                      className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label htmlFor="expiry" className="mb-1.5 flex items-center gap-1 font-['Inter'] text-xs font-medium text-[#45556C]">
                      <Calendar className="h-3.5 w-3.5" /> Expiry Date
                    </label>
                    <input
                      id="expiry"
                      type="date"
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct((p) => ({ ...p, expiryDate: e.target.value }))}
                      className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex shrink-0 items-center justify-between">
                  <label className="block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                    Product Variants (E.G. Sizes)
                  </label>
                  <button
                    type="button"
                    onClick={addProductVariant}
                    className="flex items-center gap-1 font-['Inter'] text-sm font-bold text-[#EA580C]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Variant
                  </button>
                </div>
                {newProduct.variants.length === 0 ? (
                  <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-6 font-['Inter'] text-sm text-[#90A1B9]">
                    No variants added yet. Add variants for different sizes or options.
                  </div>
                ) : (
                  <div className="max-h-40 space-y-3 overflow-y-auto [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                    {newProduct.variants.map((v, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="min-w-0 flex-1">
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => updateProductVariant(i, "name", e.target.value)}
                            placeholder="Variant Name (e.g. Large)"
                            className="w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                          />
                        </div>
                        <div className="w-28 shrink-0">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-['Inter'] text-sm text-[#90A1B9]">Rs.</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={v.price}
                              onChange={(e) => updateProductVariant(i, "price", e.target.value)}
                              placeholder="Price"
                              className="w-full rounded-[10px] border border-[#E2E8F0] bg-white py-2.5 pl-8 pr-3 font-['Inter'] text-sm text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                            />
                          </div>
                        </div>
                        <div className="flex items-end pb-1">
                          <button
                            type="button"
                            onClick={() => removeProductVariant(i)}
                            className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600"
                            aria-label="Remove variant"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block font-['Inter'] text-xs font-bold uppercase tracking-wide text-[#45556C]">
                  Attach Add-on Groups
                </label>
                <div className="flex flex-wrap gap-3">
                  {MOCK_ADDON_GROUPS.map((g) => {
                    const selected = newProduct.addonGroupIds.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleAddonGroup(g.id)}
                        className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition-colors ${
                          selected
                            ? "border-[#EA580C] bg-[#EA580C1A]"
                            : "border-[#E2E8F0] bg-white hover:border-[#CAD5E2]"
                        }`}
                      >
                        <span className={`h-4 w-4 shrink-0 rounded-full border-2 ${selected ? "border-[#EA580C] bg-[#EA580C]" : "border-[#90A1B9]"}`} />
                        <div>
                          <p className="font-['Inter'] text-xs text-[#90A1B9]">{g.items.length} items</p>
                          <p className="font-['Inter'] text-sm font-bold text-[#1D293D]">{g.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex shrink-0 justify-end gap-3">
              <button
                type="button"
                onClick={closeAddProduct}
                className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 font-['Inter'] text-sm font-bold text-[#45556C] hover:bg-[#F8FAFC]"
              >
                Discard
              </button>
              <button
                type="button"
                className="rounded-[14px] bg-[#EA580C] px-4 py-2.5 font-['Inter'] text-sm font-bold text-white shadow-[0px_4px_6px_-4px_#EA580C33,0px_10px_15px_-3px_#EA580C33] hover:bg-[#c2410c]"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
