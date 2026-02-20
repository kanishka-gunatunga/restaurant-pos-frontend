"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import MenuPageHeader from "@/components/menu/MenuPageHeader";
import MenuContent from "@/components/menu/MenuContent";
import OrderSidebar from "@/components/menu/OrderSidebar";
import { OrderProvider, useOrder, type OrderDetailsData } from "@/contexts/OrderContext";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const { loadOrderById } = useOrder();
  const loadedOrderIdRef = useRef<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && loadedOrderIdRef.current !== orderId) {
      loadedOrderIdRef.current = orderId;
      
      // Try to get order data from sessionStorage
      const storedData = sessionStorage.getItem(`order_${orderId}`);
      
      if (storedData) {
        try {
          const orderData = JSON.parse(storedData);
          
          const orderDetails: OrderDetailsData | null = orderData.customerName
            ? {
                customerName: orderData.customerName,
                phone: orderData.phone,
                orderType: "Dine In",
              }
            : null;

          loadOrderById(orderId, {
            orderDetails,
            items: orderData.items || [],
            kitchenNote: "",
            orderNote: "",
          });

          sessionStorage.removeItem(`order_${orderId}`);
        } catch (error) {
          console.error("Failed to parse order data:", error);
          loadOrderById(orderId);
        }
      } else {
        loadOrderById(orderId);
      }
    }
  }, [searchParams, loadOrderById]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <MenuPageHeader />
      <div className="flex min-h-0 flex-1 overflow-hidden pr-[320px] md:pr-[380px]">
        <div className="min-w-0 flex-1 overflow-y-auto pb-6">
          <MenuContent />
        </div>
        <OrderSidebar />
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <OrderProvider>
      <MenuPageContent />
    </OrderProvider>
  );
}
