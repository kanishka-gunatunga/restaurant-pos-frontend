import MenuPageHeader from "@/components/menu/MenuPageHeader";
import MenuContent from "@/components/menu/MenuContent";
import OrderSidebar from "@/components/menu/OrderSidebar";
import { OrderProvider } from "@/contexts/OrderContext";

export default function MenuPage() {
  return (
    <OrderProvider>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <MenuPageHeader />
        <div className="flex min-h-0 flex-1 overflow-hidden pr-[320px] md:pr-[380px]">
          <div className="min-w-0 flex-1 overflow-y-auto pb-6">
            <MenuContent />
          </div>
          <OrderSidebar />
        </div>
      </div>
    </OrderProvider>
  );
}
