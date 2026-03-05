"use client";

import { useRouter } from "next/navigation";
import { X, Wallet } from "lucide-react";
import { ROUTES } from "@/lib/constants";

interface CloseDrawerBeforeLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CloseDrawerBeforeLogoutModal({
  isOpen,
  onClose,
}: CloseDrawerBeforeLogoutModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoToDrawer = () => {
    onClose();
    router.push(ROUTES.DASHBOARD_DRAWER);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[448px] flex-col gap-6 overflow-hidden rounded-[24px] bg-white p-8 shadow-[0px_25px_50px_-12px_#00000040] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-[#90A1B9] transition-colors hover:bg-[#F8FAFC]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FEF3C7]">
            <Wallet className="h-6 w-6 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-['Inter'] text-xl font-bold leading-7 text-[#1D293D]">
              Close Drawer Before Logout
            </h2>
            <p className="mt-1 font-['Inter'] text-sm font-normal leading-5 text-[#62748E]">
              You have an active drawer session. Please close it before logging out.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-14 flex-1 rounded-2xl bg-[#F1F5F9] font-['Inter'] text-base font-bold leading-6 text-[#45556C] transition-all hover:bg-[#E2E8F0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGoToDrawer}
            className="h-14 flex-1 rounded-2xl bg-[#F97316] font-['Inter'] text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] transition-all hover:bg-[#EA580C] active:scale-95"
          >
            Go to Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
