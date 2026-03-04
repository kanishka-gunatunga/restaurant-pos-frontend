import { useState, useMemo } from "react";
import type { OrderRow, OrderStatus, PaymentStatus } from "../types";

export function useOrdersFilters(orders: OrderRow[]) {
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | "All">("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | "All">("All");

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNo.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }
    if (orderStatusFilter !== "All") list = list.filter((o) => o.status === orderStatusFilter);
    if (paymentStatusFilter !== "All")
      list = list.filter((o) => o.paymentStatus === paymentStatusFilter);
    return list;
  }, [orders, search, orderStatusFilter, paymentStatusFilter]);

  return {
    search,
    setSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    filteredOrders,
  };
}
