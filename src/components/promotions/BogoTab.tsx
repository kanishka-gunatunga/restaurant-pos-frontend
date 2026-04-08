"use client";

import { 
  Gift, 
  Pencil, 
  Trash2, 
  MapPin, 
  Calendar,
  Plus as PlusIcon,
  Package
} from "lucide-react";

interface BogoItem {
  name: string;
  qty: number;
}

interface BogoOffer {
  id: string;
  name: string;
  status: "active" | "inactive";
  buyQty: number;
  buyItems: BogoItem[];
  getQty: number;
  getItems: BogoItem[];
  branches: string;
  expiryDate?: string;
}

const MOCK_BOGO_OFFERS: BogoOffer[] = [
  {
    id: "1",
    name: "Pizza Tuesday",
    status: "active",
    buyQty: 1,
    buyItems: [{ name: "Artisan Pizza", qty: 1 }],
    getQty: 1,
    getItems: [{ name: "Artisan Pizza", qty: 1 }],
    branches: "All Branches",
    expiryDate: "12/31/2026"
  },
  {
    id: "2",
    name: "Burger Bonanza",
    status: "active",
    buyQty: 2,
    buyItems: [{ name: "Classic Beef Burger", qty: 2 }],
    getQty: 1,
    getItems: [{ name: "Classic Beef Burger", qty: 1 }],
    branches: "Downtown"
  },
  {
    id: "3",
    name: "Cocktail Hour",
    status: "inactive",
    buyQty: 1,
    buyItems: [{ name: "Fresh Cocktail", qty: 1 }],
    getQty: 1,
    getItems: [{ name: "Fresh Cocktail", qty: 1 }],
    branches: "Main Branch"
  }
];

function BogoCard({ offer }: { offer: BogoOffer }) {
  const isActive = offer.status === "active";

  return (
    <div className={`rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden transition-all ${!isActive ? "opacity-75" : ""}`}>
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${isActive ? "bg-[#FFF1F2] text-[#F43F5E]" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-['Inter'] text-[18px] font-bold leading-[28px] text-[#1D293D]">
                  {offer.name}
                </h3>
                <span className={`rounded-[10px] px-2 py-1 font-['Inter'] text-xs font-bold leading-4 ${
                  isActive ? "bg-[#D0FAE5] text-[#009966]" : "bg-[#F1F5F9] text-[#64748B]"
                }`}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
                {/* Buy Column */}
                <div className="space-y-1">
                  {offer.buyItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#45556C]">
                      <Package className="h-3.5 w-3.5 text-[#94A3B8]" />
                      <span className="font-['Inter'] text-sm font-medium">{item.qty}x {item.name}</span>
                    </div>
                  ))}
                </div>
                {/* Get Column */}
                <div className="space-y-1">
                  {offer.getItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#45556C]">
                      <Package className="h-3.5 w-3.5 text-[#94A3B8]" />
                      <span className="font-['Inter'] text-sm font-medium">{item.qty}x {item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-[#64748B]">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  {offer.branches}
                </div>
                {offer.expiryDate && (
                   <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    Expires: {offer.expiryDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              isActive 
                ? "bg-[#F1F5F9] text-[#314158] hover:bg-[#E2E8F0]" 
                : "bg-[#D0FAE5] text-[#009966] hover:bg-[#BBF7D0]"
            }`}>
              {isActive ? "Deactivate" : "Activate"}
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

      {/* Ratio Summary Bar */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center gap-16 rounded-2xl bg-[#FDF2F8] py-4">
          <div className="text-center">
            <p className="font-['Inter'] text-[32px] font-bold text-[#D946EF]">{offer.buyQty}</p>
            <p className="font-['Inter'] text-xs font-medium text-[#D946EF] opacity-70">Buy</p>
          </div>
          <div className="flex items-center justify-center">
            <PlusIcon className="h-6 w-6 text-[#D946EF] opacity-40" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p className="font-['Inter'] text-[32px] font-bold text-[#D946EF]">{offer.getQty}</p>
            <p className="font-['Inter'] text-xs font-medium text-[#D946EF] opacity-70">Get Free</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BogoTab() {
  return (
    <div className="space-y-4">
      {MOCK_BOGO_OFFERS.map(offer => (
        <BogoCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
