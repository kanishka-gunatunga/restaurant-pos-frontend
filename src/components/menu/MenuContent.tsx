"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";

const CATEGORIES = ["All", "Burgers", "Pizza", "Pasta", "Drinks", "Dessert"] as const;

const SUB_CATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  All: ["All", "Beef", "Chicken", "Cheese", "Meat", "Cream", "Cold", "Hot", "Chocolate", "Fruit"],
  Burgers: ["All", "Beef", "Chicken", "Veggie", "Fish"],
  Pizza: ["All", "Cheese", "Meat", "Veggie", "Special"],
  Pasta: ["All", "Cream", "Tomato", "Seafood", "Veggie"],
  Drinks: ["All", "Cold", "Hot", "Smoothies", "Juices"],
  Dessert: ["All", "Chocolate", "Fruit", "Ice Cream", "Cake"],
};

function getProdImage(id: string) {
  const num = parseInt(id, 10);
  const imgNum = num <= 7 ? num : (num % 7) || 1;
  return `/prod/${imgNum}.png`;
}

const MENU_ITEMS = [
  { id: "1", name: "Classic Beef Burger", category: "Burgers", subCategory: "Beef", price: 2500 },
  { id: "2", name: "Spicy Chicken Burger", category: "Burgers", subCategory: "Chicken", price: 2500 },
  { id: "3", name: "Veggie Deluxe Burger", category: "Burgers", subCategory: "Veggie", price: 2200 },
  { id: "4", name: "Fish Fillet Burger", category: "Burgers", subCategory: "Fish", price: 2600 },
  { id: "5", name: "Margherita Pizza", category: "Pizza", subCategory: "Cheese", price: 2500 },
  { id: "6", name: "Pepperoni Pizza", category: "Pizza", subCategory: "Meat", price: 2500 },
  { id: "7", name: "Garden Veggie Pizza", category: "Pizza", subCategory: "Veggie", price: 2300 },
  { id: "8", name: "BBQ Special Pizza", category: "Pizza", subCategory: "Special", price: 2800 },
  { id: "9", name: "Truffle Pasta", category: "Pasta", subCategory: "Cream", price: 2500 },
  { id: "10", name: "Seafood Linguine", category: "Pasta", subCategory: "Tomato", price: 2500 },
  { id: "11", name: "Shrimp Alfredo", category: "Pasta", subCategory: "Seafood", price: 2700 },
  { id: "12", name: "Pesto Veggie Pasta", category: "Pasta", subCategory: "Veggie", price: 2200 },
  { id: "13", name: "Fruit Cocktail", category: "Drinks", subCategory: "Cold", price: 2500 },
  { id: "14", name: "Iced Latte", category: "Drinks", subCategory: "Cold", price: 2500 },
  { id: "15", name: "Hot Chocolate", category: "Drinks", subCategory: "Hot", price: 1200 },
  { id: "16", name: "Mango Smoothie", category: "Drinks", subCategory: "Smoothies", price: 1800 },
  { id: "17", name: "Fresh Orange Juice", category: "Drinks", subCategory: "Juices", price: 900 },
  { id: "18", name: "Chocolate Brownie", category: "Dessert", subCategory: "Chocolate", price: 2500 },
  { id: "19", name: "Tiramisu", category: "Dessert", subCategory: "Chocolate", price: 2500 },
  { id: "20", name: "Fruit Salad", category: "Dessert", subCategory: "Fruit", price: 1500 },
  { id: "21", name: "Vanilla Ice Cream", category: "Dessert", subCategory: "Ice Cream", price: 800 },
  { id: "22", name: "Red Velvet Cake", category: "Dessert", subCategory: "Cake", price: 2000 },
];

export default function MenuContent() {
  const { addItem } = useOrder();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");

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
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
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
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeSubCategory === sub
                  ? "bg-[#1D293D] text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                addItem(item.name, item.price, "REGULAR", getProdImage(item.id))
              }
              className="group flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-zinc-200 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-zinc-100">
                <Image
                  src={getProdImage(item.id)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-col gap-1 p-3">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {item.category}
                </span>
                <span className="font-semibold text-zinc-800">{item.name}</span>
                <span className="text-sm font-medium text-zinc-700">
                  Rs.
                  {item.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
