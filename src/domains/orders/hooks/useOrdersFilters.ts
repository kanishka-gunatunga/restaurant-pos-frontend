import { useState, useMemo } from "react";
import type { OrderRow, OrderStatus, PaymentStatus } from "../types";
import { mapOrderToRow } from "../types";
import { useGetAllOrders, useSearchOrders, useFilterOrders } from "@/hooks/useOrder";

export function useOrdersFilters() {
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | "All">("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | "All">("All");

  const isSearching = !!search.trim();
  const isFiltering = orderStatusFilter !== "All" || paymentStatusFilter !== "All";

  const { data: allOrders, isLoading: isLoadingAll } = useGetAllOrders();
  
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchOrders({
    q: search.trim(),
  });

  const { data: filteredResults, isLoading: isLoadingFilter } = useFilterOrders({
    status: orderStatusFilter !== "All" ? orderStatusFilter : undefined,
    paymentStatus: paymentStatusFilter !== "All" ? paymentStatusFilter : undefined,
  });

  const ordersData = useMemo(() => {
    if (isSearching) return searchResults || [];
    if (isFiltering) return filteredResults || [];
    return allOrders || [];
  }, [allOrders, searchResults, filteredResults, isSearching, isFiltering]);

  const filteredOrders = useMemo(() => {
    return (ordersData || []).map(mapOrderToRow);
  }, [ordersData]);

  const isLoading = isLoadingAll || isLoadingSearch || isLoadingFilter;

  return {
    search,
    setSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    filteredOrders,
    isLoading,
  };
}
