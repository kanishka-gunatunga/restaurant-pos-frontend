"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";

const CATEGORIES = ["All", "Burgers", "Pizza", "Pasta", "Drinks", "Dessert"] as const;

function getProdImage(id: string) {
  const num = parseInt(id, 10);
  const imgNum = num <= 7 ? num : ((num % 7) || 1);
  return `/prod/${imgNum}.png`;
}

const MENU_ITEMS = [
  { id: "1", name: "Classic Beef Burger", category: "Burgers", price: 2500 },
  { id: "2", name: "Spicy Chicken Burger", category: "Burgers", price: 2500 },
  { id: "3", name: "Margherita Pizza", category: "Pizza", price: 2500 },
  { id: "4", name: "Pepperoni Pizza", category: "Pizza", price: 2500 },
  { id: "5", name: "Truffle Pasta", category: "Pasta", price: 2500 },
  { id: "6", name: "Seafood Linguine", category: "Pasta", price: 2500 },
  { id: "7", name: "Fruit Cocktail", category: "Drinks", price: 2500 },
  { id: "8", name: "Iced Latte", category: "Drinks", price: 2500 },
  { id: "9", name: "Chocolate Brownie", category: "Dessert", price: 2500 },
  { id: "10", name: "Tiramisu", category: "Dessert", price: 2500 },
];

export default function MenuContent() {
  const { addItem } = useOrder();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
              onClick={() => setActiveCategory(cat)}
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
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addItem(item.name, item.price, "REGULAR", getProdImage(item.id))}
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
                  Rs.{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
