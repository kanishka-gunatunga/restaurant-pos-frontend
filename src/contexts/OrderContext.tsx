"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type OrderType = "Dine In" | "Take Away" | "Delivery";

export type OrderDetailsData = {
  customerName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  landmark?: string;
  zipCode?: string;
  deliveryInstructions?: string;
};

export type OrderItem = {
  id: string;
  name: string;
  details: string;
  variant?: string;
  addOnsList?: string[];
  price: number;
  qty: number;
  image?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  orderDetails: OrderDetailsData | null;
  kitchenNote?: string;
  orderNote?: string;
};

type OrderContextType = {
  orders: Order[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  addOrder: () => void;
  closeOrder: (orderId: string) => void;
  getActiveOrder: () => Order | null;
  items: OrderItem[];
  activeOrderDetails: OrderDetailsData | null;
  setActiveOrderDetails: (data: OrderDetailsData) => void;
  activeKitchenNote: string;
  activeOrderNote: string;
  setActiveKitchenNote: (value: string) => void;
  setActiveOrderNote: (value: string) => void;
  addItem: (name: string, price: number, details?: string, image?: string, variant?: string, addOnsList?: string[]) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  canAddOrder: boolean;
  canCloseOrder: boolean;
};

const OrderContext = createContext<OrderContextType | null>(null);

const createEmptyOrder = (): Order => ({
  id: crypto.randomUUID(),
  items: [],
  orderDetails: null,
  kitchenNote: "",
  orderNote: "",
});

const INITIAL_ORDER = createEmptyOrder();

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([INITIAL_ORDER]);
  const [activeOrderId, setActiveOrderIdState] = useState<string | null>(INITIAL_ORDER.id);

  const setActiveOrderId = useCallback((id: string | null) => {
    setActiveOrderIdState(id);
  }, []);

  const getActiveOrder = useCallback(() => {
    return orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null;
  }, [orders, activeOrderId]);

  const items = getActiveOrder()?.items ?? [];
  const activeOrderDetails = getActiveOrder()?.orderDetails ?? null;
  const activeKitchenNote = getActiveOrder()?.kitchenNote ?? "";
  const activeOrderNote = getActiveOrder()?.orderNote ?? "";

  const setActiveOrderDetails = useCallback(
    (data: OrderDetailsData) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderDetails: data } : order
        )
      );
    },
    [activeOrderId, orders]
  );

  const setActiveKitchenNote = useCallback(
    (value: string) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, kitchenNote: value } : order
        )
      );
    },
    [activeOrderId, orders]
  );

  const setActiveOrderNote = useCallback(
    (value: string) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderNote: value } : order
        )
      );
    },
    [activeOrderId, orders]
  );

  const addOrder = useCallback(() => {
    if (orders.length >= 2) return;
    const newOrder = createEmptyOrder();
    setOrders((prev) => [...prev, newOrder]);
    setActiveOrderIdState(newOrder.id);
  }, [orders.length]);

  const closeOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((o) => o.id !== orderId);
    });
    setActiveOrderIdState((current) => {
      if (current !== orderId) return current;
      const remaining = orders.filter((o) => o.id !== orderId);
      return remaining[0]?.id ?? null;
    });
  }, [orders]);

  const addItem = useCallback(
    (name: string, price: number, details = "REGULAR", image?: string, variant?: string, addOnsList?: string[]) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          const existing = order.items.find((i) => i.name === name && i.details === details);
          if (existing) {
            return {
              ...order,
              items: order.items.map((i) =>
                i.id === existing.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return {
            ...order,
            items: [
              ...order.items,
              {
                id: crypto.randomUUID(),
                name,
                details,
                price,
                qty: 1,
                image,
                variant,
                addOnsList,
              },
            ],
          };
        })
      );
    },
    [activeOrderId, orders]
  );

  const updateQty = useCallback(
    (itemId: string, delta: number) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items
              .map((i) =>
                i.id === itemId ? { ...i, qty: Math.max(0, i.qty + delta) } : i
              )
              .filter((i) => i.qty > 0),
          };
        })
      );
    },
    [activeOrderId, orders]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items.filter((i) => i.id !== itemId),
          };
        })
      );
    },
    [activeOrderId, orders]
  );

  const canAddOrder = orders.length < 2;
  const canCloseOrder = orders.length > 1;

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrderId,
        setActiveOrderId,
        addOrder,
        closeOrder,
        getActiveOrder,
        items,
        activeOrderDetails,
        setActiveOrderDetails,
        activeKitchenNote,
        activeOrderNote,
        setActiveKitchenNote,
        setActiveOrderNote,
        addItem,
        updateQty,
        removeItem,
        canAddOrder,
        canCloseOrder,
      }}
    >
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
