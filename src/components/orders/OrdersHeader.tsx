import { Search } from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function OrdersHeader({ search, onSearchChange }: Props) {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-['Inter'] text-[24px] font-bold leading-[32px] tracking-normal text-[#1D293D]">
          Orders
        </h1>
        <p className="mt-2 font-['Inter'] text-sm font-normal leading-5 text-[#62748E]">
          Manage and track all current restaurant orders.
        </p>
      </div>
      <div className="relative w-full sm:min-w-[384px] sm:max-w-[384px]">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order ID, Customer, or Phone..."
          className="w-full rounded-[16px] border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 font-['Inter'] text-sm leading-[100%] text-[#0A0A0A] placeholder:font-medium placeholder:text-[#45556C80] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]/20"
        />
      </div>
    </div>
  );
}
