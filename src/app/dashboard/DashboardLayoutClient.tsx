"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileHeader from "@/components/dashboard/MobileHeader";
import CalculatorWindow from "@/components/calculator/CalculatorWindow";
import { CalculatorProvider, useCalculator } from "@/contexts/CalculatorContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useCalculator();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col md:ml-24 min-[1920px]:ml-28 min-[2560px]:ml-32">
        <MobileHeader />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
      {isOpen && <CalculatorWindow onClose={close} />}
    </div>
  );
}

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <CalculatorProvider>
        <DashboardContent>{children}</DashboardContent>
      </CalculatorProvider>
    </SidebarProvider>
  );
}
