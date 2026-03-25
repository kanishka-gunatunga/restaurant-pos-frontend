"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { useGetParentCategories, useGetSubCategories } from "@/hooks/useCategory";
import { useGetProductsByBranch } from "@/hooks/useProduct";
import { useGetAllModifications } from "@/hooks/useModification";
import { useAuth } from "@/contexts/AuthContext";
import { mapProductsToMenuItems } from "./menuItemMapper";
import type { MenuItem, ProductVariant, ProductAddOn } from "./types";
import type { Product } from "@/types/product";
import { useOrder, type OrderItem } from "@/contexts/OrderContext";
import ProductModal from "./ProductModal";
import { normalizeProductImageUrl } from "@/lib/productImage";

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

export default function MenuContent({
  editingOrderItem,
  onCancelEdit,
}: {
  editingOrderItem?: OrderItem | null;
  onCancelEdit?: () => void;
}) {
  const { updateItem } = useOrder();
  const { user } = useAuth();
  const branchId = user?.branchId || 1;

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | "All">("All");
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | "All">("All");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const { data: categories = [], isLoading: isLoadingCats } = useGetParentCategories("active");

  const { data: subCats = [], isLoading: isLoadingSubCats } = useGetSubCategories(
    typeof activeCategoryId === "number" ? activeCategoryId : 0,
    "active"
  );

  const { data: products = [], isLoading: isLoadingProducts } = useGetProductsByBranch(branchId, {
    categoryId: typeof activeCategoryId === "number" ? activeCategoryId : undefined,
    subCategoryId: typeof activeSubCategoryId === "number" ? activeSubCategoryId : undefined,
    status: "active",
  });

  const { data: allModifications = [] } = useGetAllModifications("active");

  const mapProductToMenuItem = (p: Product): MenuItem => {
    const variants: ProductVariant[] = [];
    p.variations?.forEach((v) => {
      v.options?.forEach((opt) => {
        const branchPrice = opt.prices?.find((pr) => pr.branchId === branchId);
        if (branchPrice) {
          const isGeneric = v.name.toLowerCase().includes("variant") || v.name.toLowerCase().includes("standard");
          variants.push({
            id: opt.id,
            name: isGeneric ? opt.name : `${v.name}: ${opt.name}`,
            price: Number(branchPrice.price),
          });
        }
      });
    });

    const modificationIds = new Set<number>();
    p.productModifications?.forEach((pm) => modificationIds.add(pm.modificationId));
    p.variations?.forEach((v) => {
      v.variationModifications?.forEach((vm) => modificationIds.add(vm.modificationId));
    });

    const addOns: ProductAddOn[] = [];
    const seenItemIds = new Set<string>();

    modificationIds.forEach((mId) => {
      const modGroup = allModifications.find((m) => m.id === mId);
      modGroup?.items?.forEach((mi) => {
        const itemId = mi.id.toString();
        if (!seenItemIds.has(itemId)) {
          addOns.push({
            id: itemId,
            name: mi.title,
            price: Number(mi.price),
          });
          seenItemIds.add(itemId);
        }
      });
    });

    const basePrice = variants.length > 0 ? variants[0].price : 0;

    return {
      id: `${p.id}-${p.code}`,
      productId: p.id,
      name: p.name,
      category: p.category?.name || "Other",
      subCategory: p.subCategory?.name || "General",
      price: basePrice,
      image: normalizeProductImageUrl(p.image),
      variants: variants.length > 0 ? variants : undefined,
      addOns: addOns.length > 0 ? addOns : undefined,
    };
  };

  const menuItems = useMemo(() => {
    return mapProductsToMenuItems(products, branchId, allModifications);
  }, [products, branchId, allModifications]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [menuItems, search]);

  const columnCount = useColumnCount();

  const columns = useMemo(() => {
    const cols: typeof filteredItems[] = Array.from({ length: columnCount }, () => []);
    filteredItems.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });
    return cols;
  }, [filteredItems, columnCount]);

  const handleCategoryChange = (id: number | "All") => {
    setActiveCategoryId(id);
    setActiveSubCategoryId("All");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-[12px] pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("All")}
            className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${activeCategoryId === "All"
              ? "bg-primary text-white"
              : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
              }`}
          >
            All
          </button>
          {categories.reduce((acc: any[], cat) => {
            if (!acc.find(c => c.id === cat.id)) acc.push(cat);
            return acc;
          }, []).map((cat) => (
            <button
              key={`cat-${cat.id}`}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${activeCategoryId === cat.id
                ? "bg-primary text-white"
                : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sub-category filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            SUB:
          </span>
          <button
            type="button"
            onClick={() => setActiveSubCategoryId("All")}
            className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${activeSubCategoryId === "All"
              ? "bg-[#1D293D] px-4 py-2 text-white"
              : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
              }`}
          >
            All
          </button>
          {subCats.reduce((acc: any[], sub) => {
            if (!acc.find(s => s.id === sub.id)) acc.push(sub);
            return acc;
          }, []).map((sub) => (
            <button
              key={`sub-${sub.id}`}
              type="button"
              onClick={() => setActiveSubCategoryId(sub.id)}
              className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${activeSubCategoryId === sub.id
                ? "bg-[#1D293D] px-4 py-2 text-white"
                : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
                }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoadingProducts ? (
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

      {editingOrderItem && (
        (() => {
          const menuItem = menuItems.find(mi => mi.productId === editingOrderItem.productId);
          if (!menuItem) return null;
          return (
            <ProductModal
              item={menuItem}
              isEditing={true}
              initialQty={editingOrderItem.qty}
              initialVariantId={editingOrderItem.variationOptionId}
              initialAddOns={editingOrderItem.modifications}
              onClose={() => onCancelEdit?.()}
              onUpdateOrder={(...args) => {
                updateItem(editingOrderItem.id, ...args);
                onCancelEdit?.();
              }}
              onAddToOrder={() => {}} // Not used in edit mode
            />
          );
        })()
      )}
    </div >
  );
}
