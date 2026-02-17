"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  CreditCard,
  Users,
  Calculator,
  LogOut,
  X,
} from "lucide-react";
import OrdersIcon from "@/components/icons/OrdersIcon";
import { ROUTES } from "@/lib/constants";
import { useCalculator } from "@/contexts/CalculatorContext";
import { useSidebar } from "@/contexts/SidebarContext";

const navLinks = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutGrid },
  { href: ROUTES.DASHBOARD_MENU, label: "Menu", icon: ShoppingBag },
  { href: ROUTES.DASHBOARD_ORDERS, label: "Orders", icon: OrdersIcon },
  { href: ROUTES.DASHBOARD_PAYMENTS, label: "Payments", icon: CreditCard },
  { href: ROUTES.DASHBOARD_CUSTOMERS, label: "Customers", icon: Users },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex flex-col items-center gap-1.5 py-2 min-[1920px]:gap-2 min-[1920px]:py-2.5 min-[2560px]:gap-2.5 min-[2560px]:py-3 transition-colors ${
        isActive ? "text-primary" : "text-[#90A1B9] hover:text-zinc-700"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-lg p-2 min-[1920px]:p-2.5 min-[2560px]:p-3 ${
          isActive ? "bg-primary-muted" : ""
        }`}
      >
        <Icon className="h-[22px] w-[22px] shrink-0 min-[1920px]:h-6 min-[1920px]:w-6 min-[2560px]:h-7 min-[2560px]:w-7" />
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider leading-tight min-[1920px]:text-[11px] min-[2560px]:text-xs">
        {label}
      </span>
    </Link>
  );
}

function CalculatorTab({ onToggle }: { onToggle?: () => void }) {
  const { isOpen, toggle } = useCalculator();

  const handleClick = () => {
    toggle();
    onToggle?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex flex-col items-center gap-1.5 py-2 min-[1920px]:gap-2 min-[1920px]:py-2.5 min-[2560px]:gap-2.5 min-[2560px]:py-3 transition-colors ${
        isOpen ? "text-primary" : "text-[#90A1B9] hover:text-zinc-700"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-lg p-2 min-[1920px]:p-2.5 min-[2560px]:p-3 ${
          isOpen ? "bg-primary-muted" : ""
        }`}
      >
        <Calculator className="h-[22px] w-[22px] shrink-0 min-[1920px]:h-6 min-[1920px]:w-6 min-[2560px]:h-7 min-[2560px]:w-7" />
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider leading-tight min-[1920px]:text-[11px] min-[2560px]:text-xs">
        Calculator
      </span>
    </button>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden
      />

      {/* Sidebar - overlay on mobile, inline on desktop */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#E2E8F0] bg-white transition-transform md:w-24 md:translate-x-0 min-[1920px]:w-28 min-[2560px]:w-32 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-end border-b border-zinc-200 p-2.5 md:hidden">
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items - icon above label, centered */}
        <nav className="flex flex-col items-center pt-5 min-[1920px]:pt-6 min-[2560px]:pt-7">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isDashboard = label === "Dashboard";
            const isMenu = label === "Menu";
            const isActive = isDashboard
              ? pathname === ROUTES.DASHBOARD
              : isMenu
                ? pathname === ROUTES.DASHBOARD_MENU
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <NavLink
                key={label}
                href={href}
                label={label}
                icon={Icon}
                isActive={isActive}
                onNavigate={close}
              />
            );
          })}
          <CalculatorTab onToggle={close} />
        </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom - User & Logout */}
      <div className="flex flex-col items-center gap-5 pb-5 min-[1920px]:gap-6 min-[1920px]:pb-6 min-[2560px]:gap-7 min-[2560px]:pb-6">
        <div className="flex flex-col items-center gap-1.5 min-[1920px]:gap-2 min-[2560px]:gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile.jpg"
            alt="Profile"
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl border-2 border-black object-cover shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] min-[1920px]:h-12 min-[1920px]:w-12 min-[2560px]:h-14 min-[2560px]:w-14"
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#90A1B9] min-[1920px]:text-[11px] min-[2560px]:text-xs">
            Sarah
          </span>
        </div>
        <Link
          href={ROUTES.HOME}
          className="flex flex-col items-center gap-1.5 text-[#90A1B9] transition-colors hover:text-zinc-700 min-[1920px]:gap-2 min-[2560px]:gap-2.5"
        >
          <LogOut className="h-5 w-5 min-[1920px]:h-6 min-[1920px]:w-6 min-[2560px]:h-7 min-[2560px]:w-7" />
          <span className="text-[10px] font-medium uppercase tracking-wider min-[1920px]:text-[11px] min-[2560px]:text-xs">
            Logout
          </span>
        </Link>
      </div>
    </aside>
    </>
  );
}
