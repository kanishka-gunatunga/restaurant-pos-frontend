export type ProductStatus = "active" | "inactive";

export interface Category {
  id: number;
  name: string;
  parentId?: number | null;
  status: ProductStatus;
  subcategories?: Category[];
  parent?: Category;
}

export interface VariationPrice {
  id: number;
  variationOptionId: number;
  branchId: number;
  price: string | number;
  discountPrice?: string | number | null;
  quantity: number;
  expireDate?: string | null;
  batchNo?: string | null;
}

export interface VariationOption {
  id: number;
  variationId: number;
  name: string;
  status: ProductStatus;
  prices?: VariationPrice[];
  discountItems?: DiscountItem[];
}

export interface ModificationItem {
  id: number;
  title: string;
  price: string | number;
  modificationId: number;
}

export interface Modification {
  id: number;
  title: string;
  status: ProductStatus;
  items?: ModificationItem[];
}

export interface ProductModification {
  id: number;
  productId: number;
  variationId?: number | null;
  modificationId: number;
  Modification?: Modification;
}

export interface Variation {
  id: number;
  productId: number;
  name: string;
  status: ProductStatus;
  options?: VariationOption[];
  variationModifications?: ProductModification[];
}

export interface ProductBranch {
  id: number;
  productId: number;
  branchId: number;
}

export interface Discount {
  id: number;
  name: string;
  expiryDate?: string | null;
  isForAllBranches: boolean;
  status: ProductStatus;
  branches?: { branchId: number }[];
  items?: DiscountItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscountItem {
  id: number;
  discountId: number;
  productId?: number | null;
  variationOptionId?: number | null;
  branchId?: number | null;
  discountType: "percentage" | "fixed";
  discountValue: string | number;
  product?: Partial<Product>;
  variationOption?: Partial<VariationOption>;
  Discount?: Discount;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  image?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  sku?: string | null;
  categoryId?: number | null;
  subCategoryId?: number | null;
  status: ProductStatus;
  category?: Category;
  subCategory?: Category;
  branches?: ProductBranch[];
  variations?: Variation[];
  productModifications?: ProductModification[];
  discountItems?: DiscountItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  code: string;
  shortDescription?: string;
  description?: string;
  sku?: string;
  categoryId?: number;
  subCategoryId?: number;
  branches?: number[]; // Array of branch IDs
  variations?: {
    name: string;
    options: {
      name: string;
      prices: {
        branchId: number;
        price: number;
        discountPrice?: number;
        quantity?: number;
        expireDate?: string;
        batchNo?: string;
      }[];
    }[];
    modifications?: { modificationId: number }[];
  }[];
  modifications?: { modificationId: number }[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  image?: string | null;
}

export interface CreateCategoryPayload {
  name: string;
  subcategories?: string[];
}

export interface UpdateCategoryPayload {
  name: string;
  subcategories?: { id?: number; name: string }[];
}

export interface CreateModificationPayload {
  title: string;
  items?: { title: string; price: number }[];
}

export interface UpdateModificationPayload {
  title?: string;
  items?: { id?: number; title: string; price: number }[];
}

export interface CreateDiscountPayload {
  name: string;
  expiryDate?: string;
  isForAllBranches: boolean;
  branches?: number[];
  items: {
    productId?: number;
    variationOptionId?: number;
    discountType: "percentage" | "fixed";
    discountValue?: number;
    branchDiscounts?: {
      branchId: number;
      discountValue: number;
    }[];
  }[];
}

export interface UpdateDiscountPayload extends Partial<CreateDiscountPayload> {}
