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
    <path d="M14 2V4" stroke={active ? "#E26522" : "#62748E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 8C16.2652 8 16.5196 8.10536 16.7071 8.29289C16.8946 8.48043 17 8.73478 17 9V17C17 18.0609 16.5786 19.0783 15.8284 19.8284C15.0783 20.5786 14.0609 21 13 21H7C5.93913 21 4.92172 20.5786 4.17157 19.8284C3.42143 19.0783 3 18.0609 3 17V9C3 8.73478 3.10536 8.48043 3.29289 8.29289C3.48043 8.10536 3.73478 8 4 8H18C19.0609 8 20.0783 8.42143 20.8284 9.17157C21.5786 9.92172 22 10.9391 22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16H17" stroke={active ? "#E26522" : "#62748E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 2V4" stroke={active ? "#E26522" : "#62748E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TakeAwayIcon = ({ active }: { active: boolean }) => (
  <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 11L14 20" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 11L15 4" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 11H22" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 11L5.1 18.4C5.19357 18.8585 5.44491 19.2697 5.81034 19.5621C6.17578 19.8545 6.63217 20.0094 7.1 20H16.9C17.3678 20.0094 17.8242 19.8545 18.1897 19.5621C18.5551 19.2697 18.8064 18.8585 18.9 18.4L20.6 11" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.5 15.5H19.5" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11L9 4" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11L10 20" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeliveryIcon = ({ active }: { active: boolean }) => (
  <svg className="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 18V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H5" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 8H17L20 11V17H19" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7.5" cy="18.5" r="1.5" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5"/>
    <circle cx="16.5" cy="18.5" r="1.5" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5"/>
    <path d="M9 18H15" stroke={active ? "#E26522" : "#62748E"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

  const labelClass = "font-['Arial'] text-sm leading-5 text-[#62748E]";
  const inputClass = "w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3 pr-4 pl-11 font-['Arial'] text-base leading-[100%] text-[#0A0A0A80] placeholder:text-[#0A0A0A80] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]/20";
  const iconClass = "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]";

  const orderTypes: OrderType[] = ["Dine In", "Take Away", "Delivery"];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-lg overflow-y-auto rounded-[16px] border border-[#F1F5F9] bg-white px-8 py-5 shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A] [scrollbar-color:#E2E8F0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E2E8F0] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-['Arial'] text-2xl font-bold leading-8 text-[#1D293D]">
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
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d+\-\s]/g, "");
                  setPhone(val);
                }}
                pattern="^(?:0|94|\+94)?7[0-9]{8}$"
                placeholder="07X-XXXX-XXX"
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
                  className={`flex flex-col items-center gap-2 rounded-[14px] border px-4 py-4 transition-all duration-300 ease-out ${
                    isActive
                      ? "border-[#E26522] bg-[#E265220D]"
                      : "border-[#E2E8F0] bg-white hover:bg-zinc-50"
                  }`}
                >
                  {type === "Dine In" && <DineInIcon active={isActive} />}
                  {type === "Take Away" && <TakeAwayIcon active={isActive} />}
                  {type === "Delivery" && <DeliveryIcon active={isActive} />}
                  <span
                    className={`font-['Arial'] text-sm font-bold leading-5 ${
                      isActive ? "text-[#E26522]" : "text-[#62748E]"
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
                className="w-full rounded-[14px] border border-[#E3E4EA] bg-[#F8FAFC] px-4 py-3 font-['Arial'] text-base leading-[100%] text-[#0A0A0A80] placeholder:text-[#0A0A0A80] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]/20"
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
          className="mt-8 w-full rounded-[14px] bg-[#EA580C] py-4 font-['Arial'] text-lg font-bold leading-7 text-white shadow-[0px_4px_6px_-4px_#EA580C4D,0px_10px_15px_-3px_#EA580C4D] transition-all duration-300 ease-out hover:bg-[#DC4C04] active:scale-[0.98]"
        >
          Proceed to Menu
        </button>
      </div>
    </div>
  );
}
