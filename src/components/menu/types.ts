export type ProductVariant = {
  id: number;
  name: string;
  price: number;
};

export type ProductAddOn = {
  id: string; // modification item id
  name: string;
  price: number;
};

export type MenuItem = {
  id: string; // product id (stored as string in UI for consistency)
  productId: number;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  variants?: ProductVariant[];
  addOns?: ProductAddOn[];
};
