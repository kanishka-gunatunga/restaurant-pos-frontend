"use client";

import { useState } from "react";
import { 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  Trash2, 
  MapPin, 
  Calendar,
  X
} from "lucide-react";

interface ProductItem {
  name: string;
  qty: number;
  image: string;
}

interface ComboPack {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  originalPrice: number;
  comboPrice: number;
  branches: string;
  expiryDate: string;
  products: ProductItem[];
}

const MOCK_COMBOS: ComboPack[] = [
  {
    id: "1",
    name: "Family Feast",
    description: "Perfect meal for the whole family",
    status: "active",
    originalPrice: 4000,
    comboPrice: 2500,
    branches: "All Branches",
    expiryDate: "6/30/2026",
    products: [
      { name: "Classic Beef Burger", qty: 4, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=40&h=40&fit=crop" },
      { name: "Artisan Pizza", qty: 2, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=40&h=40&fit=crop" },
      { name: "Fresh Cocktails", qty: 4, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=40&h=40&fit=crop" },
    ]
  },
  {
    id: "2",
    name: "Lunch Combo",
    description: "Quick and delicious lunch deal",
    status: "active",
    originalPrice: 5000,
    comboPrice: 4000,
    branches: "Downtown, Westside",
    expiryDate: "7/15/2026",
    products: [
      { name: "Chicken Wrap", qty: 2, image: "https://images.unsplash.com/photo-1626700051175-6019134e7592?w=40&h=40&fit=crop" },
      { name: "Coke", qty: 2, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=40&h=40&fit=crop" },
    ]
  }
];

function ComboPackCard({ combo }: { combo: ComboPack }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const savings = combo.originalPrice - combo.comboPrice;

  return (
    <div className={`rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden transition-all duration-300`}>
      {/* Header Section */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-[#FFF7ED] text-[#EA580C]`}>
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-['Inter'] text-[18px] font-bold leading-[28px] text-[#1D293D]">
                  {combo.name}
                </h3>
                <span className="rounded-[10px] bg-[#D0FAE5] px-2 py-1 font-['Inter'] text-xs font-bold leading-4 text-[#009966]">
                  Active
                </span>
              </div>
              <p className="mt-1 font-['Inter'] text-sm font-normal text-[#64748B]">
                {combo.description}
              </p>
              <div className="mt-2 flex items-center gap-4 text-[#64748B]">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  {combo.branches}
                </div>
                {combo.expiryDate && (
                   <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    Expires: {combo.expiryDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-[#94A3B8] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#F1F5F9] px-4 py-2 text-sm font-bold text-[#314158] hover:bg-[#E2E8F0] transition-colors">
              Deactivate
            </button>
            <button className="p-2 text-[#155DFC] hover:bg-[#F1F5F9] rounded-lg transition-colors">
              <Pencil className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 text-[#EC003F] hover:bg-[#F1F5F9] rounded-lg transition-colors">
              <Trash2 className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-0 border-t border-[#F1F5F9] pt-6">
          <div className="border-r border-[#F1F5F9] pr-6">
            <p className="font-['Inter'] text-xs font-medium text-[#90A1B9]">Original Price</p>
            <p className="mt-1 font-['Inter'] text-[18px] font-bold text-[#90A1B9] line-through">
              Rs. {combo.originalPrice.toFixed(2)}
            </p>
          </div>
          <div className="border-r border-[#F1F5F9] px-6">
            <p className="font-['Inter'] text-xs font-medium text-[#90A1B9]">Combo Price</p>
            <p className="mt-1 font-['Inter'] text-[24px] font-bold text-[#009966]">
              Rs. {combo.comboPrice.toFixed(2)}
            </p>
          </div>
          <div className="pl-6">
            <p className="font-['Inter'] text-xs font-medium text-[#90A1B9]">You Save</p>
            <p className="mt-1 font-['Inter'] text-[18px] font-bold text-[#155DFC]">
              Rs. {savings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Section: Included Products */}
      {isExpanded && (
        <div className="border-t border-[#F1F5F9] bg-[#FAFAFA] px-6 py-6 transition-all">
          <h4 className="font-['Inter'] text-[12px] font-bold uppercase tracking-wider text-[#314158] mb-4">
            Included Products
          </h4>
          <div className="space-y-2">
            {combo.products.map((product, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between rounded-xl bg-white p-3 border border-[#F1F5F9]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-[#F1F5F9]">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <span className="font-['Inter'] text-sm font-bold text-[#314158]">
                    {product.name}
                  </span>
                </div>
                <span className="font-['Inter'] text-sm font-bold text-[#314158]">
                  Qty: {product.qty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComboPacksTab() {
  return (
    <div className="space-y-4">
      {MOCK_COMBOS.map(combo => (
        <ComboPackCard key={combo.id} combo={combo} />
      ))}
    </div>
  );
}
