export type ProductVariant = {
  name: string;
  price: number;
};

export type ProductAddOn = {
  id: string;
  name: string;
  price: number;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  variants?: ProductVariant[];
  addOns?: ProductAddOn[];
};
