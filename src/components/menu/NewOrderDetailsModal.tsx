"use client";

import { useState } from "react";
import { User, Phone, Home, MapPin, Navigation } from "lucide-react";

export type OrderType = "Dine In" | "Take Away" | "Delivery";

export type OrderDetailsData = {
  customerName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  landmark?: string;
  zipCode?: string;
  deliveryInstructions?: string;
};

type Props = {
  onSubmit: (data: OrderDetailsData) => void;
  initialData?: OrderDetailsData | null;
};

const DineInIcon = ({ active }: { active: boolean }) => (
  <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11H21" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V7" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11C5 8.17157 5 6.75736 5.87868 5.87868C6.75736 5 8.17157 5 11 5H13C15.8284 5 17.2426 5 18.1213 5.87868C19 6.75736 19 8.17157 19 11" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 11L20.5 17C20.5 19.2091 18.7091 21 16.5 21H7.5C5.29086 21 3.5 19.2091 3.5 17L4 11" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TakeAwayIcon = ({ active }: { active: boolean }) => (
  <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 11L14 20" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 11L15 4" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 11H22" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 11L5.1 18.4C5.19357 18.8585 5.44491 19.2697 5.81034 19.5621C6.17578 19.8545 6.63217 20.0094 7.1 20H16.9C17.3678 20.0094 17.8242 19.8545 18.1897 19.5621C18.5551 19.2697 18.8064 18.8585 18.9 18.4L20.6 11" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.5 15.5H19.5" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11L9 4" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11L10 20" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeliveryIcon = ({ active }: { active: boolean }) => (
  <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 18V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H5" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 8H17L20 11V17H19" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7.5" cy="18.5" r="1.5" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5"/>
    <circle cx="16.5" cy="18.5" r="1.5" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5"/>
    <path d="M9 18H15" stroke={active ? "#EA580C" : "#45556C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function NewOrderDetailsModal({ onSubmit, initialData }: Props) {
  const [customerName, setCustomerName] = useState(initialData?.customerName ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [orderType, setOrderType] = useState<OrderType>(initialData?.orderType ?? "Dine In");
  const [tableNumber, setTableNumber] = useState(initialData?.tableNumber ?? "");
  const [deliveryAddress, setDeliveryAddress] = useState(initialData?.deliveryAddress ?? "");
  const [landmark, setLandmark] = useState(initialData?.landmark ?? "");
  const [zipCode, setZipCode] = useState(initialData?.zipCode ?? "");
  const [deliveryInstructions, setDeliveryInstructions] = useState(initialData?.deliveryInstructions ?? "");

  const handleSubmit = () => {
    onSubmit({
      customerName,
      phone,
      orderType,
      ...(orderType === "Dine In" && { tableNumber }),
      ...(orderType === "Delivery" && { deliveryAddress, landmark, zipCode, deliveryInstructions }),
    });
  };

  const labelClass = "font-['Arial'] text-xs font-bold leading-4 text-[#45556C]";
  const inputClass = "w-full rounded-[14px] border border-[#E2E8F0] bg-white px-3 py-2.5 pl-10 font-['Arial'] text-sm leading-5 text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]/20";
  const iconClass = "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]";

  const orderTypes: OrderType[] = ["Dine In", "Take Away", "Delivery"];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-lg overflow-y-auto rounded-[20px] bg-white p-8 shadow-xl"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-['Arial'] text-2xl font-bold leading-8 text-[#0F172B]">
          New Order Details
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Customer Name</label>
            <div className="relative mt-1.5">
              <User className={iconClass} />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter name"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Mobile Number</label>
            <div className="relative mt-1.5">
              <Phone className={iconClass} />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter number"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className={labelClass}>Order Type</label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {orderTypes.map((type) => {
              const isActive = orderType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`flex flex-col items-center gap-2 rounded-[14px] border-2 px-4 py-4 transition-colors ${
                    isActive
                      ? "border-[#EA580C] bg-[#EA580C08]"
                      : "border-[#E2E8F0] bg-white hover:bg-zinc-50"
                  }`}
                >
                  {type === "Dine In" && <DineInIcon active={isActive} />}
                  {type === "Take Away" && <TakeAwayIcon active={isActive} />}
                  {type === "Delivery" && <DeliveryIcon active={isActive} />}
                  <span
                    className={`font-['Arial'] text-sm font-bold leading-5 ${
                      isActive ? "text-[#EA580C]" : "text-[#45556C]"
                    }`}
                  >
                    {type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {orderType === "Dine In" && (
          <div className="mt-6">
            <label className={labelClass}>Table Number</label>
            <div className="relative mt-1.5">
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. T6"
                className="w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 font-['Arial'] text-sm leading-5 text-[#1D293D] placeholder:text-[#90A1B9] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]/20"
              />
            </div>
          </div>
        )}

        {orderType === "Delivery" && (
          <>
            <div className="mt-6">
              <label className={labelClass}>Delivery Address</label>
              <div className="relative mt-1.5">
                <Home className={iconClass} />
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street, House No, Building name"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Landmark</label>
                <div className="relative mt-1.5">
                  <MapPin className={iconClass} />
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Eg: Near Petrol Pump"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Zip Code</label>
                <div className="relative mt-1.5">
                  <Navigation className={iconClass} />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Eg: 10280"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Delivery Instructions</label>
              <div className="relative mt-1.5">
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Eg: Leave at front door"
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-8 w-full rounded-[14px] bg-[#EA580C] py-3.5 font-['Arial'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#EA580C4D,0px_10px_15px_-3px_#EA580C4D] transition-all duration-300 ease-out hover:bg-[#DC4C04] active:scale-[0.98]"
        >
          Proceed to Menu
        </button>
      </div>
    </div>
  );
}
