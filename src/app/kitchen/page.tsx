"use client";

import { useState, useEffect } from "react";
import {
  ChefHat,
  Clock,
  Package,
  Timer,
  Pause,
  Play,
  Info,
  Check,
  CircleAlert,
  CircleCheck,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  Box,
  CircleX
} from "lucide-react";
import Image from "next/image";
import { getOrders } from "@/services/orderService";

// --- MOCK DATA ---
type OrderStatus = "Pending" | "Preparing" | "Ready" | "Hold";
type OrderType = "Dine In" | "Take Away" | "Delivery";

interface OrderItem {
  id: string;
  quantity: number;
  name: string;
  size?: string;
  addons?: string[];
  completed?: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  time: string;
  minutesAgo: number;
  customerName: string;
  type: OrderType;
  table?: string;
  items: OrderItem[];
  kitchenNote?: string;
  orderNote?: string;
}


const mapBackendOrderToOrder = (backendOrder: any): Order => {
  const createdAt = new Date(backendOrder.createdAt || new Date());
  const now = new Date();
  const diffInMs = Math.abs(now.getTime() - createdAt.getTime());
  const minutesAgo = Math.floor(diffInMs / (1000 * 60));

  let type: OrderType = "Take Away";
  const backendType = (backendOrder.orderType || backendOrder.type || "").toLowerCase();
  if (backendType === "dine in" || backendType === "dine-in" || backendType === "dine_in") {
    type = "Dine In";
  } else if (backendType === "delivery") {
    type = "Delivery";
  }


  let mappedStatus: OrderStatus = "Pending";
  const bStatus = (backendOrder.status || '').toLowerCase();
  if (bStatus === 'preparing') mappedStatus = "Preparing";
  else if (bStatus === 'ready' || bStatus === 'completed') mappedStatus = "Ready";
  else if (bStatus === 'hold') mappedStatus = "Hold";

  return {
    id: backendOrder.id?.toString() || Math.random().toString(),
    orderNumber: backendOrder.orderNumber || `#${backendOrder.id ? String(backendOrder.id).padStart(4, '0') : Math.floor(Math.random() * 10000)}`,
    status: mappedStatus,
    time: createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    minutesAgo: minutesAgo,
    customerName: backendOrder.customer?.name || "Walk-in Customer",
    type: type,
    table: backendOrder.tableNumber || backendOrder.tableId ? `Table ${backendOrder.tableNumber || backendOrder.tableId}` : undefined,
    items: (backendOrder.items || []).map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(),
      quantity: item.quantity || 1,
      name: item.product?.name || item.name || "Unknown Item",
      size: item.variation?.name || item.size,
      addons: item.modifications?.map((mod: any) => mod.modification?.name).filter(Boolean) || item.addons,
      completed: item.status === 'completed' || false,
    })),
    kitchenNote: backendOrder.kitchenNote || "",
    orderNote: backendOrder.orderNote || backendOrder.notes || "",
  };
};

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "#1024",
    status: "Preparing",
    time: "11:30 AM",
    minutesAgo: 37,
    customerName: "Samantha Reed",
    type: "Dine In",
    table: "Table 4",
    items: [
      {
        id: "i1",
        quantity: 2,
        name: "Classic Beef Burger",
        addons: ["Extra Cheese", "Bacon"],
        completed: false,
      }
    ],
    kitchenNote: "Extra crispy please",
    orderNote: "Extra cutlery please"
  },
  {
    id: "2",
    orderNumber: "#1025",
    status: "Pending",
    time: "11:45 AM",
    minutesAgo: 16,
    customerName: "Michael Chen",
    type: "Take Away",
    items: [
      {
        id: "i2",
        quantity: 1,
        name: "Pepperoni Pizza",
        size: "Large",
        addons: ["Extra Pepperoni", "Mushrooms"],
        completed: false,
      }
    ]
  },
  {
    id: "3",
    orderNumber: "#1026",
    status: "Preparing",
    time: "12:05 PM",
    minutesAgo: 35,
    customerName: "Alice Thompson",
    type: "Delivery",
    items: [
      {
        id: "i3",
        quantity: 1,
        name: "Pepperoni Pizza",
        size: "Medium",
        addons: ["Olives"],
        completed: false,
      },
      {
        id: "i4",
        quantity: 2,
        name: "Fresh Cocktails",
        size: "Regular",
        completed: false,
      }
    ],
    kitchenNote: "No ice in cocktails"
  },
  {
    id: "4",
    orderNumber: "#1028",
    status: "Hold",
    time: "12:30 PM",
    minutesAgo: 33,
    customerName: "Elena Rodriguez",
    type: "Dine In",
    table: "Table 12",
    items: [
      { id: "i5", quantity: 3, name: "Pepperoni Pizza", completed: false },
      { id: "i6", quantity: 2, name: "Truffle Pasta", completed: false },
      { id: "i7", quantity: 2, name: "Fresh Cocktails", size: "Regular", completed: false }
    ]
  },
  {
    id: "5",
    orderNumber: "#1029",
    status: "Ready",
    time: "12:45 PM",
    minutesAgo: 17,
    customerName: "James Bond",
    type: "Dine In",
    table: "Table 07",
    items: [
      { id: "i8", quantity: 2, name: "Fresh Cocktails", size: "Regular", completed: true }
    ]
  }
];

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<OrderStatus | "All Orders">("All Orders");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        if (data && Array.isArray(data)) {
          setOrders(data.map(mapBackendOrderToOrder));
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
        if (orders.length === 0) {
          setOrders(MOCK_ORDERS);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const counts = {
    "All Orders": orders.length,
    "Pending": orders.filter(o => o.status === "Pending").length,
    "Preparing": orders.filter(o => o.status === "Preparing").length,
    "Ready": orders.filter(o => o.status === "Ready").length,
    "Hold": orders.filter(o => o.status === "Hold").length,
  };

  const filteredOrders = filter === "All Orders" ? orders : orders.filter(o => o.status === filter);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  const toggleItemCompletion = (orderId: string, itemId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId && order.status === "Preparing") {
          return {
            ...order,
            items: order.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          };
        }
        return order;
      })
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Header */}
      <header className="flex flex-col p-6 bg-white border-b border-[#E2E8F0] shrink-0">
        <div className="flex justify-between items-center bg-white shrink-0">

          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary"
              style={{
                boxShadow: "var(--shadow-primary)",
              }}
            >
              <ChefHat className="text-white w-6 h-6" />
            </div>
            <div className="items-center">
              <h1 className="text-[24px] font-bold leading-[22.5px] tracking-normal text-[#1D293D]">
                Kitchen Order Display
              </h1>
              <p className="mt-1 text-[14px] font-normal text-[#62748E]">
                Manage incoming orders and track preparation
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[30px] font-bold text-[#1D293D]">{formatTime(currentTime)}</div>
            <div className="text-[12px] font-medium text-[#62748E]">{formatDate(currentTime)}</div>
          </div>
        </div>


        <div className="flex gap-3 mt-4 shrink-0 overflow-x-auto no-scrollbar">
          {(["All Orders", "Pending", "Preparing", "Ready", "Hold"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-[14px] text-[16px] font-bold transition-colors whitespace-nowrap ${filter === f
                ? "bg-[#1D293D] text-white drop-shadow-[#0000001A]"
                : "bg-[#F1F5F9] text-[#45556C] border border-[#F1F5F9] hover:bg-gray-50"
                }`}
            >
              {f === "All Orders" && <Package className="w-4 h-4" />}
              {f === "Pending" && <CircleAlert className="w-4 h-4" />}
              {f === "Preparing" && <Timer className="w-4 h-4" />}
              {f === "Ready" && <CircleCheck className="w-4 h-4" />}
              {f === "Hold" && <Pause className="w-4 h-4 fill-current stroke-none" />}
              {f}
              <span className={`px-2 py-0.5 rounded-full text-xs ${filter === f ? "bg-[#314158] text-white" : "bg-[#E2E8F0] text-[#314158]"
                }`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Filters */}


      {/* Order Grid */}
      <div className="flex-1 overflow-y-auto p-6 pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#62748E]">
            <Package className="w-16 h-16 mb-4 text-[#CBD5E1]" />
            <h3 className="text-xl font-bold text-[#1D293D]">No orders found</h3>
            <p className="mt-2 text-sm">There are no {filter !== "All Orders" ? filter.toLowerCase() : ""} orders at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onToggleItem={toggleItemCompletion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onToggleItem
}: {
  order: Order;
  onToggleItem: (orderId: string, itemId: string) => void;
}) {
  const getTheme = (status: OrderStatus) => {
    switch (status) {
      case "Pending": return { border: "border-[#FFD230]", bg: "bg-[#FEF3C6]", badge: "text-[#BB4D00] bg-[#FFFFFF33] border-[#FFD230]", button: "bg-[#2B7FFF] hover:bg-[#2563EB]" };
      case "Preparing": return { border: "border-[#8EC5FF]", bg: "bg-[#DBEAFE]", badge: "text-[#1447E6] bg-[#FFFFFF33] border-[#8EC5FF]", button: "bg-[#00BC7D] hover:bg-[#00BC7D]" };
      case "Ready": return { border: "border-[#5EE9B5]", bg: "bg-[#D0FAE5]", badge: "text-[#007A55] bg-[#FFFFFF33] border-[#5EE9B5]", button: "bg-[#AD46FF] hover:bg-[#9333EA]" };
      case "Hold": return { border: "border-[#FFA1AD]", bg: "bg-[#FFE4E6]", badge: "text-[#C70036] bg-[#FFFFFF33] border-[#FFA1AD]", button: "bg-[#2B7FFF] hover:bg-[#2563EB]" };
    }
  };

  const theme = getTheme(order.status);
  const completedItems = order.items.filter(i => i.completed).length;
  const allItemsCompleted = completedItems === order.items.length;

  return (
    <div className={`h-full border-2 rounded-2xl flex flex-col bg-white overflow-hidden shadow-sm whitespace-normal ${theme.border}`}>
      {/* Header */}
      <div className={`p-4 border-b shrink-0 ${theme.bg} ${theme.border.replace("border-", "border-b-")}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className={`text-[30px] font-[900] ${order.status === "Pending" ? "text-[#D97706]" : order.status === "Preparing" ? "text-[#2563EB]" : order.status === "Hold" ? "text-[#E11D48]" : "text-[#059669]"}`}>
              {order.orderNumber}
            </h2>
            <div className={`flex items-center ${order.status === "Pending" ? "text-[#D97706]" : order.status === "Preparing" ? "text-[#2563EB]" : order.status === "Hold" ? "text-[#E11D48]" : "text-[#059669]"} gap-1 text-sm font-bold`}>
              <Clock className="w-3.5 h-3.5" />
              {order.time} • {order.minutesAgo}m ago
            </div>
          </div>
          <div className={`px-3 py-3 rounded-[14px] text-xs font-bold border-2 ${theme.badge} uppercase tracking-wide`}>
            {order.status}
          </div>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div>
            <div className={`font-bold text-[18px] ${order.status === "Pending" ? "text-[#D97706]" : order.status === "Preparing" ? "text-[#2563EB]" : order.status === "Hold" ? "text-[#E11D48]" : "text-[#059669]"}`}>{order.customerName}</div>
            <div className={`flex items-center gap-1 mt-1 text-xs font-bold px-2 py-0.5 rounded border border-transparent w-fit ${order.type === "Dine In" ? "bg-[#F3E8FF] text-[#8200DB]" :
              order.type === "Take Away" ? "bg-[#DBEAFE] text-[#1447E6]" :
                order.type === "Delivery" ? "bg-[#FFEDD4] text-[#CA3500]" : ""
              }`}>
              {order.type === "Dine In" ? <UtensilsCrossed className="w-4 h-4" /> : order.type === "Take Away" ? <ShoppingBag className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
              {order.type}{order.table ? ` • ${order.table}` : ""}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium uppercase">Items</div>
            <div className="font-bold">
              <span className={allItemsCompleted ? "text-green-600" : `${order.status === "Pending" ? "text-[#D97706]" : order.status === "Preparing" ? "text-[#2563EB]" : order.status === "Hold" ? "text-[#E11D48]" : "text-[#059669]"} text-xl`}>
                {completedItems}
              </span>
              <span className="text-gray-400"> / {order.items.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-white no-scrollbar">
        {order.items.map(item => (
          <div key={item.id} className={`p-3 rounded-xl border flex gap-3 transition-colors ${item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <button
              onClick={() => onToggleItem(order.id, item.id)}
              disabled={order.status !== "Preparing"}
              className={`w-6 h-6 rounded-full border flex flex-shrink-0 items-center justify-center transition-all ${item.completed
                ? 'bg-green-500 border-green-500 text-white'
                : order.status === "Preparing"
                  ? 'bg-white border-gray-300 hover:border-gray-400 cursor-pointer'
                  : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                }`}
            >
              {item.completed && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </button>
            <div className="flex-1">
              <div className="flex gap-2 items-start text-gray-900 font-semibold text-sm">
                <span className={`${item.completed ? "text-green-700 bg-green-100" : "text-[#FF6B00] bg-[#FFF0E5]"} px-1.5 rounded text-xs py-0.5 transition-colors`}>{item.quantity}x</span>
                <span className={item.completed ? "line-through text-gray-500 transition-colors" : "transition-colors"}>{item.name}</span>
              </div>
              {item.size && (
                <div className="mt-2 flex">
                  <span className="text-xs flex items-center gap-1 font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-0.5">
                    <Box className="w-3 h-3" />{item.size}
                  </span>
                </div>
              )}
              {item.addons && item.addons.length > 0 && (
                <div className="mt-2">
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">ADD-ONS:</div>
                  <div className="flex flex-wrap gap-1">
                    {item.addons.map(addon => (
                      <span key={addon} className="text-xs font-semibold text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] rounded px-2 py-0.5">
                        {addon}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Notes */}
        {order.kitchenNote && (
          <div className="p-3 bg-[#FFFBEB] border border-[#FFD230] rounded-xl text-left">
            <div className="flex gap-2 items-center text-[12px] uppercase font-bold text-[#BB4D00] mb-1">
              <Info className="w-4 h-4" />
              Kitchen Note
            </div>
            <div className="text-sm font-normal ml-5 text-[#7B3306]">{order.kitchenNote}</div>
          </div>
        )}

        {order.orderNote && (
          <div className="p-3 bg-[#FFFBEB] border border-[#FFD230] rounded-xl text-left">
            <div className="flex gap-2 items-center text-[12px] uppercase font-bold text-[#BB4D00] mb-1">
              <Info className="w-4 h-4" />
              Order Note
            </div>
            <div className="text-sm font-normal ml-5 text-[#7B3306]">{order.orderNote}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border-t space-y-2 mt-auto shrink-0">
        {order.status === "Pending" && (
          <>
            <button className={`w-full py-3 rounded-xl font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-2 ${theme.button}`}>
              <Play className="w-4 h-4" /> Start Preparing
            </button>
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors">
                <Pause className="w-4 h-4" /> Hold
              </button>
              <button className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex justify-center items-center gap-2 border border-red-200 transition-colors">
                <CircleX className="w-4 h-4" /> Cancel
              </button>
            </div>
          </>
        )}
        {order.status === "Preparing" && (
          <>
            <button
              disabled={!allItemsCompleted}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-2 ${allItemsCompleted ? theme.button : 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-200'
                }`}
            >
              <CircleCheck className="w-4 h-4" />
              {allItemsCompleted ? "Mark as Ready" : "Complete All Items"}
            </button>
            <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors">
              <Pause className="w-4 h-4" /> Hold
            </button>
          </>
        )}
        {order.status === "Ready" && (
          <>
            <button className={`w-full py-3 rounded-xl font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-2 ${theme.button}`}>
              <CircleCheck className="w-4 h-4" /> Mark as Served
            </button>
          </>
        )}
        {order.status === "Hold" && (
          <>
            <button className={`w-full py-3 rounded-xl font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-2 ${theme.button}`}>
              <Play className="w-4 h-4" /> Resume Order
            </button>
            <button disabled className="w-full mt-2 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl flex justify-center items-center gap-2 border border-gray-200 cursor-not-allowed">
              <CircleX className="w-4 h-4" /> Cancel Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
