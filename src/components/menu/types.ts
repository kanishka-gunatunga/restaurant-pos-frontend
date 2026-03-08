export type ProductVariant = {
  id: number;
  variationId?: number;
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
  productId: number;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  image?: string;
  variants?: ProductVariant[];
  addOns?: ProductAddOn[];
};
