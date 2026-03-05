"use client";

import { useState, useCallback } from "react";
import MenuPageHeader from "@/components/menu/MenuPageHeader";
import MenuContent from "@/components/menu/MenuContent";
import OrderSidebar from "@/components/menu/OrderSidebar";
import { OrderProvider } from "@/contexts/OrderContext";
import { useDrawerSession } from "@/contexts/DrawerSessionContext";
import { useAuth } from "@/contexts/AuthContext";
import DrawerSessionRequiredModal from "@/components/drawer/DrawerSessionRequiredModal";

function ManagerMenuContent() {
  const drawerSession = useDrawerSession();
  if (!drawerSession) {
    throw new Error("ManagerMenuContent must be used within DrawerSessionProvider");
  }
  const {
    hasSession,
    hasDrawerStarted,
    hasActiveSession,
    setHasDrawerStarted,
    setHasActiveSession,
    setSessionData,
  } = drawerSession;
  const [showDrawerModal, setShowDrawerModal] = useState(false);

  const beforeAddItem = useCallback(() => {
    if (hasSession) return true;
    setShowDrawerModal(true);
    return false;
  }, [hasSession]);

  const beforeAddOrder = useCallback(() => {
    if (hasSession) return true;
    setShowDrawerModal(true);
    return false;
  }, [hasSession]);

  const handleStartDrawer = useCallback(
    async (_openingAmount: number, _managerPasscode: string) => {
      setHasDrawerStarted(true);
    },
    [setHasDrawerStarted]
  );

  const handleCreateSession = useCallback(
    async (openingAmount: number) => {
      const now = new Date();
      const startedAt = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setSessionData({ initialAmount: openingAmount, startedAt });
      setHasActiveSession(true);
    },
    [setSessionData, setHasActiveSession]
  );

  return (
    <>
      <OrderProvider beforeAddItem={beforeAddItem} beforeAddOrder={beforeAddOrder}>
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
      <DrawerSessionRequiredModal
        isOpen={showDrawerModal}
        onClose={() => setShowDrawerModal(false)}
        hasDrawerStarted={hasDrawerStarted}
        hasActiveSession={hasActiveSession}
        onStartDrawer={handleStartDrawer}
        onCreateSession={handleCreateSession}
      />
    </>
  );
}

export default function MenuPageContent() {
  const { isManagerOrAdmin } = useAuth();

  if (isManagerOrAdmin) {
    return <ManagerMenuContent />;
  }

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
