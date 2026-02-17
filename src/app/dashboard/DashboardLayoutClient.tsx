"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileHeader from "@/components/dashboard/MobileHeader";
import CalculatorWindow from "@/components/calculator/CalculatorWindow";
import { CalculatorProvider, useCalculator } from "@/contexts/CalculatorContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useCalculator();

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto">{children}</main>
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
