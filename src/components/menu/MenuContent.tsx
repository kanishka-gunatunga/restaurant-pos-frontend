"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { useGetParentCategories, useGetSubCategories } from "@/hooks/useCategory";
import { useGetProductsByBranch } from "@/hooks/useProduct";
import { useGetAllModifications } from "@/hooks/useModification";
import { useAuth } from "@/contexts/AuthContext";
import { mapProductsToMenuItems, collectAddOns } from "./menuItemMapper";
import type { MenuItem, ProductVariant, ProductAddOn } from "./types";
import type { Product, Modification } from "@/types/product";
import { useOrder, type OrderItem } from "@/contexts/OrderContext";
import ProductModal from "./ProductModal";
import { normalizeProductImageUrl } from "@/lib/productImage";
import { useGetComboPacksByBranch } from "@/hooks/useComboPack";
import { useGetBogoPromotionsByBranch } from "@/hooks/useBogoPromotion";
import type { ComboPack } from "@/types/comboPack";
import type { BogoPromotion } from "@/types/bogoPromotion";

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
  const [activeMainTab, setActiveMainTab] = useState<"Categories" | "Vouchers" | "Promotions">("Categories");
  const [promoFilter, setPromoFilter] = useState<"All" | "Combo" | "BOGO">("All");
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
  const { data: comboPacks = [] } = useGetComboPacksByBranch();
  const { data: bogoPromotions = [] } = useGetBogoPromotionsByBranch();



  const menuItems = useMemo(() => {
    return mapProductsToMenuItems(products, branchId, allModifications);
  }, [products, branchId, allModifications]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [menuItems, search]);

  const columnCount = useColumnCount();


  const handleCategoryChange = (id: number | "All") => {
    setActiveMainTab("Categories");
    setActiveCategoryId(id);
    setActiveSubCategoryId("All");
  };

  const promotionItems = useMemo(() => {
    const items: MenuItem[] = [];

    if (promoFilter === "All" || promoFilter === "Combo") {
      comboPacks.forEach((combo: ComboPack) => {
        const branchPricing = combo.branches?.find(b => b.branchId === branchId);
        const comboPrice = branchPricing?.price ? Number(branchPricing.price) : Number(combo.price);

        const firstComboItem = combo.items?.[0];
        if (!firstComboItem?.product) return;

        items.push({
          id: `offer-combo-${combo.id}`,
          productId: firstComboItem.product.id,
          name: combo.name,
          category: "Combo Packs",
          subCategory: "Offer",
          price: comboPrice,
          image: normalizeProductImageUrl(combo.image || firstComboItem.product.image) || undefined,
          description: combo.description || undefined,
          isOffer: true,
          promotionInfo: {
            type: "combo",
            promotionId: combo.id,
            items: combo.items?.map(i => ({
              productId: i.productId,
              name: i.product?.name || "Unknown",
              price: 0,
              image: normalizeProductImageUrl(i.product?.image) || undefined,
              variationOptionId: i.variationOptionId,
              quantity: 1, 
              addOns: i.product ? collectAddOns(i.product, allModifications) : undefined,
            }))
          }
        });
      });
    }

    if (promoFilter === "All" || promoFilter === "BOGO") {
      bogoPromotions.forEach((bogo: BogoPromotion) => {
        if (!bogo.buyProduct || !bogo.getProduct) return;

        const buyVariantId = bogo.buyVariationOptionId;
        const buyProduct = bogo.buyProduct;
        
        let buyOption = null;
        if (buyVariantId) {
          buyOption = buyProduct.variations?.flatMap(v => v.options || []).find(o => o.id === buyVariantId);
        }
        if (!buyOption) {
          buyOption = buyProduct.variations?.[0]?.options?.[0];
        }

        const branchPriceObj = buyOption?.prices?.find(p => p.branchId === branchId);
        const basePrice = branchPriceObj ? Number(branchPriceObj.price) : 0;
        const offerPrice = basePrice * (bogo.buyQuantity || 1);

        items.push({
          id: `offer-bogo-${bogo.id}`,
          productId: bogo.buyProduct.id,
          name: bogo.name,
          category: "BOGO",
          subCategory: "Offer",
          price: offerPrice,
          image: normalizeProductImageUrl(bogo.image || bogo.buyProduct.image) || undefined,
          isOffer: true,
          promotionInfo: {
            type: "bogo",
            promotionId: bogo.id,
            buyItem: {
              productId: bogo.buyProduct.id,
              name: bogo.buyProduct.name,
              price: offerPrice,
              image: normalizeProductImageUrl(bogo.buyProduct.image) || undefined,
              quantity: bogo.buyQuantity,
              addOns: bogo.buyProduct ? collectAddOns(bogo.buyProduct, allModifications) : undefined,
            },
            getFreeItem: {
              productId: bogo.getProduct.id,
              name: bogo.getProduct.name,
              price: 0,
              image: normalizeProductImageUrl(bogo.getProduct.image) || undefined,
              variationOptionId: bogo.getVariationOptionId,
              quantity: bogo.getQuantity,
              addOns: bogo.getProduct ? collectAddOns(bogo.getProduct, allModifications) : undefined,
            }
          }
        });
      });
    }

    return items;
  }, [comboPacks, bogoPromotions, branchId, promoFilter, allModifications]);


  const sectionedPromotions = useMemo(() => {
    const groups: { title: string; items: MenuItem[] }[] = [];
    
    const comboItems = promotionItems.filter(i => i.category === "Combo Packs");
    if (comboItems.length > 0) {
      groups.push({ title: "Combo Packs", items: comboItems });
    }
    
    const bogoItems = promotionItems.filter(i => i.category === "BOGO");
    if (bogoItems.length > 0) {
      groups.push({ title: "BOGO", items: bogoItems });
    }
    
    return groups;
  }, [promotionItems]);

  const displayItems = activeMainTab === "Promotions" ? promotionItems : filteredItems;

  const columns = useMemo(() => {
    const cols: typeof displayItems[] = Array.from({ length: columnCount }, () => []);
    displayItems.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });
    return cols;
  }, [displayItems, columnCount]);

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

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("All")}
            className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${activeMainTab === "Categories" && activeCategoryId === "All"
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
              className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${activeMainTab === "Categories" && activeCategoryId === cat.id
                ? "bg-primary text-white"
                : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
                }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="mx-2 h-8 w-[1px] bg-[#E2E8F0]" />

          <button
            type="button"
            onClick={() => {
              setActiveMainTab("Vouchers");
              setPromoFilter("All");
            }}
            className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${activeMainTab === "Vouchers"
              ? "bg-primary text-white"
              : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
              }`}
          >
            Vouchers
          </button>

          <div className="mx-2 h-8 w-[1px] bg-[#E2E8F0]" />

          <button
            type="button"
            onClick={() => {
              setActiveMainTab("Promotions");
              setPromoFilter("All");
            }}
            className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${activeMainTab === "Promotions"
              ? "bg-primary text-white"
              : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
              }`}
          >
            Promotions
          </button>
        </div>

        {/* Sub-category filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            SUB:
          </span>
          {activeMainTab === "Promotions" ? (
            <>
              <button
                type="button"
                onClick={() => setPromoFilter("All")}
                className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${promoFilter === "All"
                  ? "bg-[#1D293D] px-4 py-2 text-white"
                  : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
                  }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPromoFilter("Combo")}
                className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${promoFilter === "Combo"
                  ? "bg-[#1D293D] px-4 py-2 text-white"
                  : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
                  }`}
              >
                Combo Packs
              </button>
              <button
                type="button"
                onClick={() => setPromoFilter("BOGO")}
                className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${promoFilter === "BOGO"
                  ? "bg-[#1D293D] px-4 py-2 text-white"
                  : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
                  }`}
              >
                BOGO
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {activeMainTab === "Vouchers" ? (
          <div className="flex h-full flex-col items-center justify-center text-[#64748B]">
            <div className="rounded-full bg-[#F1F5F9] p-6 mb-4">
              <svg className="h-12 w-12 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="font-bold text-lg">Vouchers coming soon</p>
            <p className="text-sm">We are working on bringing vouchers to the menu.</p>
          </div>
        ) : activeMainTab === "Promotions" ? (
          <div className="space-y-8">
            {sectionedPromotions.map((section) => (
              <div key={section.title} className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-[#1D293D]">{section.title}</h2>
                  <div className="h-[1px] flex-1 bg-[#E2E8F0]" />
                </div>
                <div className="flex items-start gap-4">
                  {(() => {
                    const cols: typeof section.items[] = Array.from({ length: columnCount }, () => []);
                    section.items.forEach((item, i) => {
                      cols[i % columnCount].push(item);
                    });
                    return cols;
                  })().map((colItems, colIdx) => (
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
              </div>
            ))}
            {sectionedPromotions.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center text-[#64748B]">
                <p className="font-medium">No promotions found for the selected filter.</p>
              </div>
            )}
          </div>
        ) : isLoadingProducts ? (
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
