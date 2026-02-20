"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFormattedTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function useRealTimeClock() {
  const [time, setTime] = useState(getFormattedTime);
  useEffect(() => {
    const interval = setInterval(() => setTime(getFormattedTime()), 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

export default function DashboardPageHeader() {
  const currentTime = useRealTimeClock();

  return (
    <header className="relative z-50 flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"
            style={{
              boxShadow:
                "0px 4px 6px -4px #EA580C33, 0px 10px 15px -3px #EA580C33",
            }}
          >
            <Image
              src="/house_icon.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-[22.5px] tracking-normal text-[#1D293D]">
              Savory Delights Bistro
            </h1>
            <p className="mt-1 text-[10px] font-bold leading-[15px] tracking-[1px] uppercase text-[#90A1B9]">
              MAHARAGAMA BRANCH
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-2">
          <Calendar className="h-4 w-4 text-[#EA580C]" />
          <span className="text-sm font-bold leading-5 tracking-normal text-[#45556C]">
            {getFormattedDate()}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-2">
          <Clock className="h-4 w-4 text-[#EA580C]" />
          <span className="text-sm font-bold leading-5 tracking-[-0.35px] text-[#1D293D]">
            {currentTime}
          </span>
        </div>
      </div>
    </header>
  );
}
