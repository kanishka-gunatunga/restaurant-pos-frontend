import { CircleCheck, History, RotateCcw, X } from "lucide-react";

export default function PaymentStats() {
  const stats = [
    {
      label: "Total Collected",
      value: "Rs.144,500.00",
      icon: CircleCheck,
      color: "text-[#00BC7D]",
      bgColor: "bg-[#F8FAFC]",
    },
    {
      label: "Pending Payments",
      value: "Rs.12,800.00",
      icon: History,
      color: "text-[#FE9A00]",
      bgColor: "bg-[#F8FAFC]",
    },
    {
      label: "Total Refunds",
      value: "Rs.1,500.00",
      icon: RotateCcw,
      color: "text-[#62748E]",
      bgColor: "bg-[#F8FAFC]",
    },
    {
      label: "Refund Rate",
      value: "98.00%",
      icon: X,
      color: "text-[#FF2056]",
      bgColor: "bg-[#F8FAFC]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col rounded-[24px] border-[#E2E8F0] bg-white p-6 shadow-sm ring-1 ring-zinc-200"
        >
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-bold text-[#90A1B9]">{stat.label}</p>
            <div className={`mr-4 rounded-lg p-3 ${stat.bgColor}`}>
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
