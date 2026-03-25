import type { MenuItem, ProductAddOn, ProductVariant } from "./types";
import type { Modification, Product } from "@/types/product";
import { normalizeProductImageUrl } from "@/lib/productImage";

export function mapProductToMenuItem(
  product: Product,
  branchId: number,
  allModifications: Modification[]
): MenuItem {
  const variants: ProductVariant[] = [];

  product.variations?.forEach((variation) => {
    variation.options?.forEach((option) => {
      const branchPrice = option.prices?.find((price) => price.branchId === branchId);

      if (!branchPrice) return;

      const isGeneric =
        variation.name.toLowerCase().includes("variant") ||
        variation.name.toLowerCase().includes("standard");

      variants.push({
        id: option.id,
        variationId: variation.id,
        name: isGeneric ? option.name : `${variation.name}: ${option.name}`,
        price: Number(branchPrice.price),
      });
    });
  });

  const modificationIds = new Set<number>();
  product.productModifications?.forEach((productModification) => {
    modificationIds.add(productModification.modificationId);
  });
  product.variations?.forEach((variation) => {
    variation.variationModifications?.forEach((variationModification) => {
      modificationIds.add(variationModification.modificationId);
    });
  });

  const addOns: ProductAddOn[] = [];
  const seenItemIds = new Set<string>();

  modificationIds.forEach((modificationId) => {
    const modificationGroup = allModifications.find((modification) => modification.id === modificationId);
    modificationGroup?.items?.forEach((item) => {
      const itemId = item.id.toString();
      if (seenItemIds.has(itemId)) return;

      addOns.push({
        id: itemId,
        name: item.title,
        price: Number(item.price),
      });
      seenItemIds.add(itemId);
    });
  });

  const basePrice = variants.length > 0 ? variants[0].price : 0;

  return {
    id: `${product.id}-${product.code}`,
    productId: product.id,
    name: product.name,
    category: product.category?.name || "Other",
    subCategory: product.subCategory?.name || "General",
    price: basePrice,
    image: normalizeProductImageUrl(product.image),
    variants: variants.length > 0 ? variants : undefined,
    addOns: addOns.length > 0 ? addOns : undefined,
  };
}

export function mapProductsToMenuItems(
  products: Product[],
  branchId: number,
  allModifications: Modification[]
): MenuItem[] {
  const uniqueItems: MenuItem[] = [];
  const seenIds = new Set<string>();

  products.forEach((product) => {
    const item = mapProductToMenuItem(product, branchId, allModifications);
    if (seenIds.has(item.id)) return;
    uniqueItems.push(item);
    seenIds.add(item.id);
  });

  return uniqueItems;
}
