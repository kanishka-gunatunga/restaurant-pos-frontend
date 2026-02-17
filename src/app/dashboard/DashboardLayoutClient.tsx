"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CalculatorWindow from "@/components/calculator/CalculatorWindow";
import { CalculatorProvider, useCalculator } from "@/contexts/CalculatorContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useCalculator();

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
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
    <CalculatorProvider>
      <DashboardContent>{children}</DashboardContent>
    </CalculatorProvider>
  );
}
