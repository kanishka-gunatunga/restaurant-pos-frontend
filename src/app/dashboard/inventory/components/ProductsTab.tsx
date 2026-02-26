"use client";

import { Package, Pencil, Trash2, Calendar, FileText } from "lucide-react";
import { MOCK_PRODUCTS } from "../types";

export default function ProductsTab() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse font-['Inter']">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
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
              {MOCK_PRODUCTS.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#E2E8F0]">
                        {"image" in product && product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="absolute inset-0 m-auto h-6 w-6 text-[#90A1B9]" />
                        )}
                      </div>
                      <div>
                        <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">{product.name}</p>
                        <p className="font-['Inter'] text-[10px] font-bold uppercase leading-[15px] tracking-[-0.5px] text-[#90A1B9]">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-['Inter'] text-base font-bold leading-6 text-[#1D293D]">{product.price}</p>
                    <p className="font-['Inter'] text-[10px] font-medium italic leading-[15px] text-[#90A1B9]">{product.variants}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-[10px] bg-[#ECFDF5] px-2 py-1 font-['Inter'] text-[10px] font-bold leading-[15px] text-[#009966]">
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 font-['Consolas'] text-xs leading-4 text-[#45556C]">
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        {product.batch}
                      </span>
                      <span className="flex items-center gap-1 font-['Inter'] text-xs leading-4 text-[#45556C]">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {product.expiry}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-[10px] bg-[#EFF6FF] px-3 py-1 font-['Inter'] text-[10px] font-bold uppercase leading-[15px] tracking-[0.5px] text-[#155DFC]">
                      {product.addonGroup}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-[#F1F5F9] hover:text-[#45556C]">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" className="rounded-lg p-2 text-[#90A1B9] hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
