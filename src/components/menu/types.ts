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
  description?: string;
  isOffer?: boolean;
  variants?: ProductVariant[];
  addOns?: ProductAddOn[];
  promotionInfo?: {
    type: "combo" | "bogo";
    promotionId: number;
    items?: {
      productId: number;
      name: string;
      price: number;
      image?: string;
      variationOptionId?: number;
      quantity: number;
      addOns?: ProductAddOn[];
    }[];
    buyItem?: {
      productId: number;
      name: string;
      price: number;
      image?: string;
      variationOptionId?: number;
      quantity: number;
      addOns?: ProductAddOn[];
    };
    getFreeItem?: {
      productId: number;
      name: string;
      price: number;
      image?: string;
      variationOptionId?: number;
      quantity: number;
      addOns?: ProductAddOn[];
    };

  };
};


