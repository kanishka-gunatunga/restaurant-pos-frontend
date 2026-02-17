"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  CreditCard,
  Calculator,
  LogOut,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useCalculator } from "@/contexts/CalculatorContext";

const navLinks = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutGrid },
  { href: ROUTES.DASHBOARD_ORDER, label: "Order", icon: ShoppingBag },
  { href: ROUTES.DASHBOARD_PAYMENTS, label: "Payments", icon: CreditCard },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-2 py-3 transition-colors ${
        isActive ? "text-primary" : "text-[#90A1B9] hover:text-zinc-700"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-lg p-2 ${
          isActive ? "bg-primary-muted" : ""
        }`}
      >
        <Icon className="h-6 w-6 shrink-0" />
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider">
        {label}
      </span>
    </Link>
  );
}

function CalculatorTab() {
  const { isOpen, toggle } = useCalculator();

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex flex-col items-center gap-2 py-3 transition-colors ${
        isOpen ? "text-primary" : "text-[#90A1B9] hover:text-zinc-700"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-lg p-2 ${
          isOpen ? "bg-primary-muted" : ""
        }`}
      >
        <Calculator className="h-6 w-6 shrink-0" />
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider">
        Calculator
      </span>
    </button>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-24 shrink-0 flex-col border-r border-[#E2E8F0] bg-white">
      {/* Nav items - icon above label, centered */}
      <nav className="flex flex-col items-center pt-6">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isDashboard = label === "Dashboard";
          const isActive = isDashboard
            ? pathname === ROUTES.DASHBOARD
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <NavLink
              key={label}
              href={href}
              label={label}
              icon={Icon}
              isActive={isActive}
            />
          );
        })}
        <CalculatorTab />
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom - User & Logout */}
      <div className="flex flex-col items-center gap-10 pb-6">
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile.jpg"
            alt="Profile"
            width={48}
            height={48}
            className="h-12 w-12 rounded-2xl border-2 border-black object-cover shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]"
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#90A1B9]">
            Sarah
          </span>
        </div>
        <Link
          href={ROUTES.HOME}
          className="flex flex-col items-center gap-4 text-[#90A1B9] transition-colors hover:text-zinc-700"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
}
