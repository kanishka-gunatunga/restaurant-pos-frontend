"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import { MENU_ITEMS } from "./menuData";

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

const CATEGORIES = ["All", "Burgers", "Pizza", "Pasta", "Drinks", "Dessert"] as const;

const SUB_CATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  All: ["All", "Beef", "Chicken", "Cheese", "Meat", "Cream", "Cold", "Hot", "Chocolate", "Fruit"],
  Burgers: ["All", "Beef", "Chicken", "Veggie", "Fish"],
  Pizza: ["All", "Cheese", "Meat", "Veggie", "Special"],
  Pasta: ["All", "Cream", "Tomato", "Seafood", "Veggie"],
  Drinks: ["All", "Cold", "Hot", "Smoothies", "Juices"],
  Dessert: ["All", "Chocolate", "Fruit", "Ice Cream", "Cake"],
};

export default function MenuContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const subCategories = useMemo(
    () => SUB_CATEGORIES_BY_CATEGORY[activeCategory] ?? ["All"],
    [activeCategory]
  );

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSubCategory =
      activeSubCategory === "All" || item.subCategory === activeSubCategory;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const columnCount = useColumnCount();

  const columns = useMemo(() => {
    const cols: typeof filteredItems[] = Array.from({ length: columnCount }, () => []);
    filteredItems.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });
    return cols;
  }, [filteredItems, columnCount]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory("All");
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-[14px] px-5.5 py-2.5 text-center text-sm font-bold leading-5 tracking-normal transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-[#F1F5F9] text-[#45556C] hover:bg-[#E2E8F0]"
              }`}
              style={
                activeCategory === cat
                  ? {
                      boxShadow:
                        "0px 2px 4px -2px #EA580C33, 0px 4px 6px -1px #EA580C33",
                    }
                  : undefined
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-category filter row - always visible */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            SUB:
          </span>
          {subCategories.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setActiveSubCategory(sub)}
              className={`rounded-[10px] text-center text-sm font-bold leading-4 tracking-normal transition-colors ${
                activeSubCategory === sub
                  ? "bg-[#1D293D] px-4 py-2 text-white"
                  : "border border-[#F1F5F9] bg-white px-4 py-2 text-[#62748E] hover:bg-zinc-50"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
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
      </div>
    </div>
  );
}
