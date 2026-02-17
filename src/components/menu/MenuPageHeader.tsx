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

export default function MenuPageHeader() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Image
            src="/house_icon.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">
            Savory Delights Bistro
          </h1>
          <p className="text-xs font-medium text-zinc-500">
            MAHARAGAMA BRANCH
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{getFormattedDate()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{getFormattedTime()}</span>
        </div>
      </div>
    </header>
  );
}
