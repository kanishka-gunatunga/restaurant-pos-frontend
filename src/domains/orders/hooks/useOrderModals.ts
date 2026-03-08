import { useState, useCallback } from "react";
import type { OrderRow, OrderDetailsView } from "../types";
import { useUpdateOrderStatus, useUpdateOrder, useDeleteOrder } from "@/hooks/useOrder";

export function useOrderModals() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; orderNo: string | null }>({
    isOpen: false,
    orderNo: null,
  });
  const [editOrderModal, setEditOrderModal] = useState<OrderRow | null>(null);
  const [viewOrder, setViewOrder] = useState<OrderRow | null>(null);

  const orderToView = useCallback((order: OrderRow): OrderDetailsView => ({
    orderNo: order.orderNo,
    date: order.date,
    time: order.time,
    status: order.status,
    paymentStatus: order.paymentStatus,
    customerName: order.customerName,
    phone: order.phone,
    totalAmount: order.totalAmount,
    orderType: order.orderType as any,
    tableNumber: order.tableNumber,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
  }), []);

  const updateStatusMutation = useUpdateOrderStatus();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  const handleDeleteClick = useCallback((orderNo: string) => {
    setAuthModal({ isOpen: true, orderNo });
  }, []);

  const handleVerify = useCallback((passcode: string) => {
    if (authModal.orderNo) {
      updateStatusMutation.mutate({
        id: authModal.orderNo,
        data: {
          status: "cancel",
          passcode,
        },
      }, {
        onSuccess: () => {
          setAuthModal({ isOpen: false, orderNo: null });
        }
      });
    }
  }, [authModal.orderNo, updateStatusMutation]);

  const handleCloseAuthModal = useCallback(() => {
    setAuthModal({ isOpen: false, orderNo: null });
  }, []);

  const handleViewOrder = useCallback((order: OrderRow) => {
    setViewOrder(order);
  }, []);

  const handleEditClick = useCallback((order: OrderRow) => {
    if (order.status === "pending") {
      setEditOrderModal(order);
    }
  }, []);

  const handleEditOrderSubmit = useCallback(
    (data: { items: { id: string; productId?: string; variationId?: string; qty: number; price: number }[] }) => {
      if (editOrderModal) {
        updateOrderMutation.mutate({
          id: editOrderModal.id,
          data: {
            order_products: data.items.map(item => ({
              productId: Number(item.productId || item.id),
              variationId: item.variationId ? Number(item.variationId) : undefined,
              quantity: item.qty,
              unitPrice: item.price,
              productDiscount: 0,
            }))
          }
        }, {
          onSuccess: () => {
            setEditOrderModal(null);
          }
        });
      }
    },
    [editOrderModal, updateOrderMutation]
  );

  const closeEditModal = useCallback(() => setEditOrderModal(null), []);
  const closeViewModal = useCallback(() => setViewOrder(null), []);

  const openEditFromView = useCallback((order: OrderRow) => {
    setViewOrder(null);
    setEditOrderModal(order);
  }, []);

  const openCancelFromView = useCallback((orderNo: string) => {
    setAuthModal({ isOpen: true, orderNo });
    setViewOrder(null);
  }, []);

  return {
    authModal,
    editOrderModal,
    viewOrder,
    orderToView,
    handleDeleteClick,
    handleVerify,
    handleCloseAuthModal,
    handleViewOrder,
    handleEditClick,
    handleEditOrderSubmit,
    closeEditModal,
    closeViewModal,
    openEditFromView,
    openCancelFromView,
  };
}
