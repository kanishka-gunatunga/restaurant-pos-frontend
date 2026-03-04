"use client";

import { Package, Pencil, Calendar, FileText, Loader2, Power, Hash } from "lucide-react";
import {
  useGetAllProducts,
  useSearchProducts,
  useActivateProduct,
  useDeactivateProduct
} from "@/hooks/useProduct";
import { Product } from "@/types/product";
import { formatDate } from "@/lib/format";

type ProductsTabProps = {
  branchId: string;
  searchQuery: string;
  onEditProduct: (product: Product) => void;
};

export default function ProductsTab({ branchId, searchQuery, onEditProduct }: ProductsTabProps) {
  const { data: allProducts, isLoading: isAllLoading, error: allWarning } = useGetAllProducts({ status: "all" });
  const { data: searchResults, isLoading: isSearchLoading } = useSearchProducts(searchQuery, "all");
  const activateMutation = useActivateProduct();
  const deactivateMutation = useDeactivateProduct();

  const products = searchQuery ? searchResults : allProducts;
  const isLoading = searchQuery ? isSearchLoading : isAllLoading;

  const handleToggleStatus = async (product: Product) => {
    try {
      if (product.status === "active") {
        await deactivateMutation.mutateAsync(product.id);
      } else {
        await activateMutation.mutateAsync(product.id);
      }
    } catch (err) {
      console.error("Failed to toggle product status:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EA580C]" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]  font-['Inter']">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Product Info
                </th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Price
                </th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Stock
                </th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Batch & Expiry
                </th>
                <th className="p-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Add-on Groups
                </th>
                <th className="p-4 text-right text-[10px] font-bold uppercase tracking-wider text-[#90A1B9]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => {
                // Find variation data for the selected branch
                // For simplicity in list, we find the first option's first branch price if specific branch logic isn't fully detailed in the model
                const variationOption = product.variations?.[0]?.options?.[0];
                const branchPrice = variationOption?.prices?.find(p => p.branchId.toString() === branchId);

                return (
                  <tr key={product.id} className={`border-b border-[#F1F5F9] transition-opacity hover:bg-[#F8FAFC]/50 ${product.status === 'inactive' ? 'opacity-60 bg-[#F8FAFC]' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#E2E8F0]">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package className="absolute inset-0 m-auto h-6 w-6 text-[#90A1B9]" />
                          )}
                        </div>
                        <div>
                          <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                            {product.name}
                          </p>
                          <p className="font-['Inter'] text-[10px] font-bold uppercase leading-[15px] tracking-[-0.5px] text-[#90A1B9]">
                            {product.category?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">
                        Rs. {branchPrice?.price || "N/A"}
                      </p>
                      <p className="font-['Inter'] text-[10px] font-medium italic leading-[15px] text-[#90A1B9]">
                        {variationOption?.name || "Standard"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-[10px] px-2 py-1 font-['Inter'] text-[10px] font-bold leading-[15px] ${(branchPrice?.quantity || 0) > 10 ? 'bg-[#ECFDF5] text-[#009966]' : 'bg-red-50 text-red-600'
                        }`}>
                        {branchPrice?.quantity || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 font-['Consolas'] text-xs leading-4 text-[#45556C]">
                          <Hash className="h-3.5 w-3.5 shrink-0" />
                          {branchPrice?.batchNo || "N/A"}
                        </span>
                        <span className="flex items-center gap-1 font-['Inter'] text-xs leading-4 text-[#45556C]">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {formatDate(branchPrice?.expireDate)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.productModifications?.slice(0, 2).map((pm) => (
                          <span key={pm.id} className="inline-flex rounded-[10px] bg-[#EFF6FF] px-2 py-0.5 font-['Inter'] text-[10px] font-bold uppercase leading-[15px] tracking-[0.5px] text-[#155DFC]">
                            {pm.Modification?.title}
                          </span>
                        ))}
                        {(product.productModifications?.length || 0) > 2 && (
                          <span className="text-[10px] text-[#90A1B9]">+{product.productModifications!.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEditProduct(product)}
                          className="rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          className={`rounded-lg p-2 transition-colors ${product.status === "inactive"
                            ? "text-[#00BC7D] hover:bg-[#00BC7D]/10"
                            : "text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]"
                            }`}
                          title={product.status === "inactive" ? "Activate" : "Deactivate"}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
