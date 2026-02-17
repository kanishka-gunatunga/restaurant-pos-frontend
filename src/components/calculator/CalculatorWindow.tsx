"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import Calculator from "./Calculator";

const DEFAULT_POSITION = { x: 100, y: 100 };

export default function CalculatorWindow({
  onClose,
}: {
  onClose: () => void;
}) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="fixed z-50 flex w-[280px] flex-col overflow-hidden rounded-xl border-2 border-zinc-200 bg-white shadow-xl"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      {/* Draggable header */}
      <div
        className="flex cursor-grab items-center justify-between border-b border-zinc-200 bg-zinc-100 px-3 py-2 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-medium text-zinc-700">Calculator</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-800"
          aria-label="Close calculator"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Calculator body */}
      <div className="p-3">
        <Calculator />
      </div>
    </div>
  );
}
