"use client";

import { useState, useMemo, useEffect, type MutableRefObject } from "react";
import { Search, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { useGetParentCategories, useGetSubCategories } from "@/hooks/useCategory";
import { useGetProductsByBranch } from "@/hooks/useProduct";
import { useGetAllModifications } from "@/hooks/useModification";
import { useAuth } from "@/contexts/AuthContext";
import { mapProductsToMenuItems } from "./menuItemMapper";
import type { MenuItem } from "./types";
import { useOrder, type OrderItem, type MenuOrderSurface } from "@/contexts/OrderContext";
import ProductModal from "./ProductModal";

function useColumnCount() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCols(4);
      else if (w >= 768) setCols(3);
      else setCols(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function isVoucherMenuItem(item: MenuItem): boolean {
  const c = item.category.toLowerCase();
  const n = item.name.toLowerCase();
  return c.includes("voucher") || n.includes("voucher") || n.includes("gift voucher");
}

const DUMMY_VOUCHER_ITEMS: MenuItem[] = [
  { id: "voucher-2000", productId: 910001, name: "Gift Voucher", category: "Vouchers", subCategory: "All", price: 2000, image: "/voucer-img.png" },
  { id: "voucher-3000", productId: 910002, name: "Gift Voucher", category: "Vouchers", subCategory: "All", price: 3000, image: "/voucer-img.png" },
  { id: "voucher-5000", productId: 910003, name: "Gift Voucher", category: "Vouchers", subCategory: "All", price: 5000, image: "/voucer-img.png" },
  { id: "voucher-6000", productId: 910004, name: "Gift Voucher", category: "Vouchers", subCategory: "All", price: 6000, image: "/voucer-img.png" },
  { id: "voucher-8000", productId: 910005, name: "Gift Voucher", category: "Vouchers", subCategory: "All", price: 8000, image: "/voucer-img.png" },
  { id: "voucher-10000", productId: 910006, name: "Gift Voucher", category: "Vouchers", subCategory: "All", price: 10000, image: "/voucer-img.png" },
];

const DUMMY_PROMOTION_ITEMS: MenuItem[] = [
  {
    id: "promo-bogo-classic-beef",
    productId: 930001,
    name: "Classic Beef Burger - Buy 1 Get 1",
    category: "Promotions",
    subCategory: "BOGO",
    price: 2500,
    image: "/product-placeholder.jpg",
    bundleItems: [
      { productId: 300101, name: "Classic Beef Burger", qty: 2, unitPrice: 1250, details: "BOGO Deal" },
    ],
  },
  {
    id: "promo-bogo-latte",
    productId: 930002,
    name: "Iced Latte - Buy 1 Get 1",
    category: "Promotions",
    subCategory: "BOGO",
    price: 2500,
    image: "/product-placeholder.jpg",
    bundleItems: [{ productId: 300102, name: "Iced Latte", qty: 2, unitPrice: 1250, details: "BOGO Deal" }],
  },
  {
    id: "promo-combo-burger-latte",
    productId: 930003,
    name: "Burger + Iced Latte Combo",
    category: "Promotions",
    subCategory: "Combo",
    price: 4200,
    image: "/product-placeholder.jpg",
    bundleItems: [
      { productId: 300101, name: "Classic Beef Burger", qty: 1, unitPrice: 2500, details: "Combo Deal" },
      { productId: 300102, name: "Iced Latte", qty: 1, unitPrice: 1700, details: "Combo Deal" },
    ],
  },
  {
    id: "promo-combo-pizza-cocktail",
    productId: 930004,
    name: "Margherita + Fruit Cocktail Combo",
    category: "Promotions",
    subCategory: "Combo",
    price: 4600,
    image: "/product-placeholder.jpg",
    bundleItems: [
      { productId: 300103, name: "Margherita Pizza", qty: 1, unitPrice: 3000, details: "Combo Deal" },
      { productId: 300104, name: "Fruit Cocktail", qty: 1, unitPrice: 1600, details: "Combo Deal" },
    ],
  },
];

export default function MenuContent({
  menuSurfaceRef,
  editingOrderItem,
  onCancelEdit,
}: {
  menuSurfaceRef: MutableRefObject<MenuOrderSurface>;
  editingOrderItem?: OrderItem | null;
  onCancelEdit?: () => void;
}) {
  const { updateItem } = useOrder();
  const { user } = useAuth();
  const branchId = user?.branchId || 1;

  const [search, setSearch] = useState("");
  const [menuSurface, setMenuSurface] = useState<MenuOrderSurface>("menu");
  const [activeCategoryId, setActiveCategoryId] = useState<number | "All">("All");
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | "All">("All");
  const [voucherPriceFilter, setVoucherPriceFilter] = useState<number | "All">("All");
  const [promotionTypeFilter, setPromotionTypeFilter] = useState<"All" | "BOGO" | "Combo">("All");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    menuSurfaceRef.current = menuSurface;
  }, [menuSurface, menuSurfaceRef]);

  const { data: categories = [], isLoading: isLoadingCats } = useGetParentCategories("active");

  const { data: subCats = [], isLoading: isLoadingSubCats } = useGetSubCategories(
    typeof activeCategoryId === "number" ? activeCategoryId : 0,
    "active"
  );

  const { data: products = [], isLoading: isLoadingProducts } = useGetProductsByBranch(
    branchId,
    {
      categoryId: typeof activeCategoryId === "number" ? activeCategoryId : undefined,
      subCategoryId: typeof activeSubCategoryId === "number" ? activeSubCategoryId : undefined,
      status: "active",
    },
    { enabled: menuSurface === "menu" }
  );

  const { data: voucherCatalog = [], isLoading: isLoadingVoucherCatalog } = useGetProductsByBranch(
    branchId,
    { status: "active" },
    { enabled: menuSurface === "vouchers" }
  );

  const { data: allModifications = [] } = useGetAllModifications("active");

  const menuItems = useMemo(() => {
    return mapProductsToMenuItems(products, branchId, allModifications);
  }, [products, branchId, allModifications]);

  const voucherMenuItems = useMemo(() => {
    const mapped = mapProductsToMenuItems(voucherCatalog, branchId, allModifications);
    const filtered = mapped.filter(isVoucherMenuItem);
    return filtered.length > 0 ? filtered : DUMMY_VOUCHER_ITEMS;
  }, [voucherCatalog, branchId, allModifications]);

  const voucherPriceOptions = useMemo(() => {
    const s = new Set<number>();
    voucherMenuItems.forEach((i) => s.add(i.price));
    return [...s].sort((a, b) => a - b);
  }, [voucherMenuItems]);

  const promotionItems = useMemo(() => DUMMY_PROMOTION_ITEMS, []);

  const itemLookupList = useMemo(
    () => [...menuItems, ...voucherMenuItems],
    [menuItems, voucherMenuItems]
  );

  const displayItems: MenuItem[] = useMemo(() => {
    if (menuSurface === "vouchers") {
      let list = voucherMenuItems;
      if (voucherPriceFilter !== "All") {
        list = list.filter((i) => i.price === voucherPriceFilter);
      }
      return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (menuSurface === "promotions") {
      let list = promotionItems;
      if (promotionTypeFilter !== "All") {
        list = list.filter((i) => i.subCategory === promotionTypeFilter);
      }
      return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    return menuItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [menuSurface, voucherMenuItems, promotionItems, menuItems, voucherPriceFilter, promotionTypeFilter, search]);

  const columnCount = useColumnCount();

  const columns = useMemo(() => {
    const cols: (typeof displayItems)[] = Array.from({ length: columnCount }, () => []);
    displayItems.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });
    return cols;
  }, [displayItems, columnCount]);

  const handleCategoryChange = (id: number | "All") => {
    setMenuSurface("menu");
    setActiveCategoryId(id);
    setActiveSubCategoryId("All");
  };

  const isLoadingMain =
    menuSurface === "menu" && (isLoadingCats || isLoadingSubCats || isLoadingProducts);
  const isLoadingVouchers = menuSurface === "vouchers" && isLoadingVoucherCatalog;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={
              menuSurface === "promotions" ? "Search promotions..." : "Search menu items..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-[12px] pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("All")}
            className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${
              menuSurface === "menu" && activeCategoryId === "All"
                ? "bg-primary text-white"
                : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
            }`}
          >
            All
          </button>
          {categories.reduce((acc: { id: number; name: string }[], cat) => {
            if (!acc.find((c) => c.id === cat.id)) acc.push(cat);
            return acc;
          }, []).map((cat) => (
            <button
              key={`cat-${cat.id}`}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${
                menuSurface === "menu" && activeCategoryId === cat.id
                  ? "bg-primary text-white"
                  : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="mx-0.5 hidden h-8 border-l border-[#45556C] sm:block" aria-hidden />

          <button
            type="button"
            onClick={() => {
              setMenuSurface("vouchers");
              setActiveCategoryId("All");
              setActiveSubCategoryId("All");
              setVoucherPriceFilter("All");
            }}
            className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${
              menuSurface === "vouchers"
                ? "bg-primary text-white"
                : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
            }`}
          >
            Vouchers
          </button>
          <div className="mx-0.5 hidden h-8 border-l border-[#45556C] sm:block" aria-hidden />
          <button
            type="button"
            onClick={() => {
              setMenuSurface("promotions");
              setActiveCategoryId("All");
              setActiveSubCategoryId("All");
              setPromotionTypeFilter("All");
            }}
            className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${
              menuSurface === "promotions"
                ? "bg-primary text-white"
                : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
            }`}
          >
            Promotions
          </button>
        </div>

        {menuSurface === "menu" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">SUB:</span>
            <button
              type="button"
              onClick={() => setActiveSubCategoryId("All")}
              className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${
                activeSubCategoryId === "All"
                  ? "bg-[#1D293D] px-4 py-2 text-white"
                  : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
              }`}
            >
              All
            </button>
            {subCats.reduce((acc: { id: number; name: string }[], sub) => {
              if (!acc.find((s) => s.id === sub.id)) acc.push(sub);
              return acc;
            }, []).map((sub) => (
              <button
                key={`sub-${sub.id}`}
                type="button"
                onClick={() => setActiveSubCategoryId(sub.id)}
                className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${
                  activeSubCategoryId === sub.id
                    ? "bg-[#1D293D] px-4 py-2 text-white"
                    : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {menuSurface === "vouchers" && voucherPriceOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">SUB:</span>
            <button
              type="button"
              onClick={() => setVoucherPriceFilter("All")}
              className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${
                voucherPriceFilter === "All"
                  ? "bg-[#1D293D] px-4 py-2 text-white"
                  : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
              }`}
            >
              All
            </button>
            {voucherPriceOptions.map((price) => (
              <button
                key={`vp-${price}`}
                type="button"
                onClick={() => setVoucherPriceFilter(price)}
                className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${
                  voucherPriceFilter === price
                    ? "bg-[#1D293D] px-4 py-2 text-white"
                    : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
                }`}
              >
                Rs.{price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </button>
            ))}
          </div>
        )}

        {menuSurface === "promotions" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">SUB:</span>
            {(["All", "BOGO", "Combo"] as const).map((type) => (
              <button
                key={`promo-${type}`}
                type="button"
                onClick={() => setPromotionTypeFilter(type)}
                className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${
                  promotionTypeFilter === type
                    ? "bg-[#1D293D] px-4 py-2 text-white"
                    : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoadingMain || isLoadingVouchers ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex items-start gap-4">
            {columns.map((colItems, colIdx) => (
              <div key={colIdx} className="flex flex-1 flex-col gap-4">
                {colItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    isExpanded={expandedCardId === item.id}
                    onExpand={() => setExpandedCardId(item.id)}
                    onCollapse={() => setExpandedCardId(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {editingOrderItem &&
        (() => {
          const menuItem = itemLookupList.find((mi) => mi.productId === editingOrderItem.productId);
          if (!menuItem) return null;
          return (
            <ProductModal
              item={menuItem}
              isEditing={true}
              initialQty={editingOrderItem.qty}
              initialVariantId={editingOrderItem.variationOptionId}
              initialAddOns={editingOrderItem.modifications}
              initialRecipientName={editingOrderItem.recipientName}
              initialRecipientMobile={editingOrderItem.recipientMobile}
              onClose={() => onCancelEdit?.()}
              onUpdateOrder={(...args) => {
                updateItem(editingOrderItem.id, ...args);
                onCancelEdit?.();
              }}
              onAddToOrder={() => {}}
            />
          );
        })()}
    </div>
  );
}
