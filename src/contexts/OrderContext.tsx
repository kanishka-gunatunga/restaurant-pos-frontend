"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type OrderItem = {
  id: string;
  name: string;
  details: string;
  price: number;
  qty: number;
  image?: string;
};

type OrderContextType = {
  items: OrderItem[];
  addItem: (name: string, price: number, details?: string, image?: string) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
};

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", name: "Fresh Cocktails", details: "REGULAR", price: 2300, qty: 1, image: "/prod/7.png" },
    { id: "2", name: "Pepperoni Pizza", details: "SMALL +4 Mushrooms", price: 2800, qty: 2, image: "/prod/4.png" },
    { id: "3", name: "Margherita Pizza", details: "LARGE", price: 2500, qty: 1, image: "/prod/3.png" },
  ]);

  const addItem = useCallback((name: string, price: number, details = "REGULAR", image?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name && i.details === details);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          name,
          details,
          price,
          qty: 1,
          image,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <OrderContext.Provider value={{ items, addItem, updateQty, removeItem }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return ctx;
}
