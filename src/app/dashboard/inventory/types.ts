import { Package, LayoutGrid, Layers, Tag } from "lucide-react";

export type TabId = "products" | "categories" | "addons" | "discounts";

export const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: LayoutGrid },
  { id: "addons", label: "Add-on Groups", icon: Layers },
  { id: "discounts", label: "Discounts", icon: Tag },
];

export const MOCK_CATEGORIES = [
  { id: "1", name: "Burgers", subCount: 3, subCategories: ["Beef", "Chicken", "Vegetarian"] },
  { id: "2", name: "Pizza", subCount: 2, subCategories: ["Classic", "Specialty"] },
  { id: "3", name: "Pasta", subCount: 2, subCategories: ["Vegetarian", "Meat"] },
];

export const MOCK_ADDON_GROUPS = [
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

export const MOCK_PRODUCTS = [
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

export type AddonGroupItem = { name: string; price: string };
export type ProductVariant = { name: string; price: string };

export type NewProductForm = {
  productName: string;
  productImageUrl: string;
  basePrice: string;
  quantity: string;
  category: string;
  subCategory: string;
  batchNumber: string;
  expiryDate: string;
  variants: ProductVariant[];
  addonGroupIds: string[];
};
