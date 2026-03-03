import { CircleCheck, History, RotateCcw, X } from "lucide-react";

export default function PaymentStats() {
  const stats = [
    {
      label: "TOTAL COLLECTED",
      value: "Rs.144,500.00",
      icon: CircleCheck,
      color: "text-[#00BC7D]",
    },
    {
      label: "PENDING PAYMENTS",
      value: "Rs.12,800.00",
      icon: History,
      color: "text-[#FE9A00]",
    },
    {
      label: "TOTAL REFUNDS",
      value: "Rs.1,500.00",
      icon: RotateCcw,
      color: "text-[#62748E]",
    },
    {
      label: "REFUND RATE",
      value: "01.00%",
      icon: X,
      color: "text-[#FF2056]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex flex-col gap-4 rounded-[32px] border border-[#E2E8F0] bg-white p-8 shadow-sm transition-all hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-[#90A1B9] uppercase">
              {stat.label}
            </p>
            <div className={`flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F8FAFC]`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#1D293D]">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
