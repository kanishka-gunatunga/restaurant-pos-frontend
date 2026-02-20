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
  clearActiveOrder: () => void;
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
  loadOrderById: (orderId: string, orderData?: Partial<Order>) => void;
};

const OrderContext = createContext<OrderContextType | null>(null);

const createEmptyOrder = (): Order => ({
  id: crypto.randomUUID(),
  items: [],
  orderDetails: null,
  kitchenNote: "",
  orderNote: "",
});

const hasOrderData = (order: Order): boolean => {
  if (order.orderDetails) {
    const details = order.orderDetails;
    if (details.customerName?.trim() && details.phone?.trim()) {
      return true;
    }
  }
  
  if (order.items && order.items.length > 0) return true;
  if (order.kitchenNote && order.kitchenNote.trim().length > 0) return true;
  if (order.orderNote && order.orderNote.trim().length > 0) return true;
  
  return false;
};

const INITIAL_ORDER = createEmptyOrder();
const STORAGE_KEY = "pos_orders";
const ACTIVE_ORDER_KEY = "pos_active_order_id";

const loadOrdersFromStorage = (): Order[] => {
  if (typeof window === "undefined") return [INITIAL_ORDER];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    return [INITIAL_ORDER];
  }
  return [INITIAL_ORDER];
};

const saveOrdersToStorage = (orders: Order[]) => {
  if (typeof window === "undefined") return;
  try {
    const ordersWithData = orders.filter(hasOrderData);
    
    if (ordersWithData.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ordersWithData));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save orders to sessionStorage:", error);
  }
};

const loadActiveOrderIdFromStorage = (): string | null => {
  if (typeof window === "undefined") return INITIAL_ORDER.id;
  try {
    return sessionStorage.getItem(ACTIVE_ORDER_KEY);
  } catch {
    return INITIAL_ORDER.id;
  }
};

const saveActiveOrderIdToStorage = (orderId: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (orderId) {
      sessionStorage.setItem(ACTIVE_ORDER_KEY, orderId);
    } else {
      sessionStorage.removeItem(ACTIVE_ORDER_KEY);
    }
  } catch {
    return;
  }
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const initialOrders = (() => {
    const loaded = loadOrdersFromStorage();
    const ordersWithData = loaded.filter(hasOrderData);
    
    if (ordersWithData.length === 0) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(ACTIVE_ORDER_KEY);
      }
      return [INITIAL_ORDER];
    }
    
    const validated = ordersWithData.slice(0, 2);
    saveOrdersToStorage(validated);
    
    return validated;
  })();
  
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  const [activeOrderId, setActiveOrderIdState] = useState<string | null>(() => {
    const storedId = loadActiveOrderIdFromStorage();
    if (storedId && initialOrders.some((o) => o.id === storedId)) {
      return storedId;
    }
    return initialOrders[0]?.id ?? INITIAL_ORDER.id;
  });

  const setActiveOrderId = useCallback((id: string | null) => {
    setActiveOrderIdState(id);
    saveActiveOrderIdToStorage(id);
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
      setOrders((prev) => {
        const updated = prev.map((order) =>
          order.id === orderId ? { ...order, orderDetails: data } : order
        );
        saveOrdersToStorage(updated);
        return updated;
      });
    },
    [activeOrderId, orders]
  );

  const setActiveKitchenNote = useCallback(
    (value: string) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;
      setOrders((prev) => {
        const updated = prev.map((order) =>
          order.id === orderId ? { ...order, kitchenNote: value } : order
        );
        saveOrdersToStorage(updated);
        return updated;
      });
    },
    [activeOrderId, orders]
  );

  const setActiveOrderNote = useCallback(
    (value: string) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;
      setOrders((prev) => {
        const updated = prev.map((order) =>
          order.id === orderId ? { ...order, orderNote: value } : order
        );
        saveOrdersToStorage(updated);
        return updated;
      });
    },
    [activeOrderId, orders]
  );

  const addOrder = useCallback(() => {
    if (orders.length >= 2) return;
    const newOrder = createEmptyOrder();
    setOrders((prev) => {
      const updated = [...prev, newOrder];
      const ordersWithData = updated.filter(hasOrderData);
      if (ordersWithData.length > 0) {
        saveOrdersToStorage(ordersWithData);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      return updated;
    });
    setActiveOrderIdState(newOrder.id);
    saveActiveOrderIdToStorage(newOrder.id);
  }, [orders.length]);

  const closeOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      if (prev.length <= 1) {
        if (prev.length === 1 && prev[0].id === orderId) {
          sessionStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(ACTIVE_ORDER_KEY);
        }
        return prev;
      }
      
      const filtered = prev.filter((o) => o.id !== orderId);
      saveOrdersToStorage(filtered);
      
      setActiveOrderIdState((current) => {
        if (current === orderId) {
          const newActiveId = filtered[0]?.id ?? null;
          saveActiveOrderIdToStorage(newActiveId);
          return newActiveId;
        }
        return current;
      });
      
      return filtered;
    });
  }, []);

  const clearActiveOrder = useCallback(() => {
    const orderId = activeOrderId;
    if (!orderId) return;

    setOrders((prev) => {
      const clearedOrder = prev.find((o) => o.id === orderId);
      if (!clearedOrder) return prev;

      const cleared = {
        ...clearedOrder,
        items: [],
        orderDetails: null,
        kitchenNote: "",
        orderNote: "",
      };

      const updated = prev.map((order) => (order.id === orderId ? cleared : order));
      const ordersWithData = updated.filter((o) => o.id === orderId || hasOrderData(o));
      const finalOrders = ordersWithData.length > 0 ? ordersWithData : [cleared];

      saveOrdersToStorage(finalOrders);
      return finalOrders;
    });
  }, [activeOrderId]);

  const addItem = useCallback(
    (name: string, price: number, details = "REGULAR", image?: string, variant?: string, addOnsList?: string[]) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;

      setOrders((prev) => {
        const updated = prev.map((order) => {
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
        });
        saveOrdersToStorage(updated);
        return updated;
      });
    },
    [activeOrderId, orders]
  );

  const updateQty = useCallback(
    (itemId: string, delta: number) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;

      setOrders((prev) => {
        const updated = prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items
              .map((i) =>
                i.id === itemId ? { ...i, qty: Math.max(0, i.qty + delta) } : i
              )
              .filter((i) => i.qty > 0),
          };
        });
        saveOrdersToStorage(updated);
        return updated;
      });
    },
    [activeOrderId, orders]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      const orderId = activeOrderId ?? orders[0]?.id;
      if (!orderId) return;

      setOrders((prev) => {
        const updated = prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items.filter((i) => i.id !== itemId),
          };
        });
        saveOrdersToStorage(updated);
        return updated;
      });
    },
    [activeOrderId, orders]
  );

  const loadOrderById = useCallback(
    (orderId: string, orderData?: Partial<Order>) => {
      const existingOrder = orders.find((o) => o.id === orderId);
      if (existingOrder) {
        if (orderData) {
          setOrders((prev) => {
            const updated = prev.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    orderDetails: orderData.orderDetails !== undefined ? orderData.orderDetails : o.orderDetails,
                    items: orderData.items !== undefined ? orderData.items : o.items,
                    kitchenNote: orderData.kitchenNote !== undefined ? orderData.kitchenNote : o.kitchenNote,
                    orderNote: orderData.orderNote !== undefined ? orderData.orderNote : o.orderNote,
                  }
                : o
            );
            saveOrdersToStorage(updated);
            return updated;
          });
        }
        setActiveOrderIdState(orderId);
        saveActiveOrderIdToStorage(orderId);
        return;
      }

      const newOrder: Order = {
        id: orderId,
        items: orderData?.items ?? [],
        orderDetails: orderData?.orderDetails ?? null,
        kitchenNote: orderData?.kitchenNote ?? "",
        orderNote: orderData?.orderNote ?? "",
      };

      setOrders((prev) => {
        let updated: Order[];
        if (prev.length < 2) {
          updated = [...prev, newOrder];
        } else {
          const emptyOrderIndex = prev.findIndex(
            (o) => !o.orderDetails && o.items.length === 0 && !o.kitchenNote && !o.orderNote
          );
          if (emptyOrderIndex !== -1) {
            updated = prev.map((o, i) => (i === emptyOrderIndex ? newOrder : o));
          } else {
            updated = [prev[1], newOrder];
          }
        }
        const ordersToSave = updated.slice(0, 2);
        saveOrdersToStorage(ordersToSave);
        return updated;
      });
      setActiveOrderIdState(orderId);
      saveActiveOrderIdToStorage(orderId);
    },
    [orders]
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
        clearActiveOrder,
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
        loadOrderById,
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
