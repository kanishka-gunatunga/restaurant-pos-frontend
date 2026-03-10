import { useState, useCallback } from "react";
import type { OrderRow, OrderDetailsView } from "../types";
import { EditOrderLineItem } from "@/components/orders/EditOrderModal";
import { useUpdateOrderStatus, useUpdateOrder } from "@/hooks/useOrder";
import { useUpdatePaymentStatus, useGetPaymentsByOrder } from "@/hooks/usePayment";
import type { OrderDetailsData } from "@/contexts/OrderContext";

function mapOrderTypeToApi(orderType: OrderDetailsData["orderType"]) {
  if (orderType === "Dine In") return "dining";
  if (orderType === "Take Away") return "takeaway";
  return "delivery";
}

export function useOrderModals() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; orderNo: string | null }>({
    isOpen: false,
    orderNo: null,
  });
  const [editOrderModal, setEditOrderModal] = useState<OrderRow | null>(null);
  const [editOrderInfoModal, setEditOrderInfoModal] = useState<OrderRow | null>(null);
  const [viewOrder, setViewOrder] = useState<OrderRow | null>(null);

  const orderToView = useCallback((order: OrderRow): OrderDetailsView => ({
    id: order.id,
    orderNo: order.orderNo,
    date: order.date,
    time: order.time,
    status: order.status,
    paymentStatus: order.paymentStatus,
    customerName: order.customerName,
    phone: order.phone,
    totalAmount: order.totalAmount,
    orderType: order.orderType,
    tableNumber: order.tableNumber,
    deliveryAddress: order.deliveryAddress,
    landmark: order.landmark,
    zipCode: order.zipCode,
    deliveryInstructions: order.deliveryInstructions,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
  }), []);

  const updateStatusMutation = useUpdateOrderStatus();
  const updateOrderMutation = useUpdateOrder();
  const updatePaymentStatusMutation = useUpdatePaymentStatus();

  // We'll fetch payments for the current edit order to handle refunds
  const { data: payments = [] } = useGetPaymentsByOrder(Number(editOrderModal?.id || 0));

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
    (data: { items: EditOrderLineItem[] }) => {
      if (editOrderModal) {
        const TAX_RATE = 0.1;
        const subtotal = data.items.reduce((sum, it) => sum + it.qty * (it.price - (it.productDiscount ?? 0)), 0);
        const newTotal = subtotal * (1 + TAX_RATE);
        const originalTotal = editOrderModal.totalAmount;
        const refundAmount = originalTotal - newTotal;

        const isPaid = editOrderModal.paymentStatus === "paid";

        updateOrderMutation.mutate({
          id: editOrderModal.id,
          data: {
            // If already paid, don't change the totalAmount on the order itself
            // The difference will be handled as a refund in the payments table
            ...(isPaid ? {} : { totalAmount: newTotal }),
            tax: subtotal * TAX_RATE,
            order_products: data.items.map(item => ({
              productId: Number(item.productId || item.id),
              variationId: item.variationId ? Number(item.variationId) : undefined,
              quantity: item.qty,
              unitPrice: item.price,
              productDiscount: item.productDiscount ?? 0,
              modifications: item.modifications,
            }))
          }
        }, {
          onSuccess: () => {
            // Handle refund if necessary
            if (refundAmount > 0 && payments.length > 0) {
              const payment = payments[0]; // Assuming first payment for now
              const isFullRefund = refundAmount >= Number(payment.amount);
              
              updatePaymentStatusMutation.mutate({
                id: payment.id,
                payload: {
                  is_refund: 1,
                  refund_type: isFullRefund ? "full" : "partial",
                  refund_amount: refundAmount,
                  status: isFullRefund ? "refund" : "partial_refund"
                }
              });
            }
            setEditOrderModal(null);
          }
        });
      }
    },
    [editOrderModal, updateOrderMutation, updatePaymentStatusMutation, payments]
  );

  const closeEditModal = useCallback(() => setEditOrderModal(null), []);
  const closeEditInfoModal = useCallback(() => setEditOrderInfoModal(null), []);
  const closeViewModal = useCallback(() => setViewOrder(null), []);

  const openEditFromView = useCallback((order: OrderRow) => {
    setViewOrder(null);
    setEditOrderModal(order);
  }, []);

  const openEditInfoFromView = useCallback((order: OrderRow) => {
    setViewOrder(null);
    setEditOrderInfoModal(order);
  }, []);

  const handleEditOrderInfoSubmit = useCallback(
    (data: OrderDetailsData) => {
      if (editOrderInfoModal) {
        updateOrderMutation.mutate(
          {
            id: editOrderInfoModal.id,
            data: {
              customerName: data.customerName,
              customerMobile: data.phone,
              orderType: mapOrderTypeToApi(data.orderType),
              tableNumber: data.orderType === "Dine In" ? data.tableNumber : undefined,
              deliveryAddress: data.orderType === "Delivery" ? data.deliveryAddress : undefined,
              landmark: data.orderType === "Delivery" ? data.landmark : undefined,
              zipcode: data.orderType === "Delivery" ? data.zipCode : undefined,
              deliveryInstructions: data.orderType === "Delivery" ? data.deliveryInstructions : undefined,
            },
          },
          {
            onSuccess: () => {
              setEditOrderInfoModal(null);
            },
          }
        );
      }
    },
    [editOrderInfoModal, updateOrderMutation]
  );

  const openCancelFromView = useCallback((orderNo: string) => {
    setAuthModal({ isOpen: true, orderNo });
    setViewOrder(null);
  }, []);

  return {
    authModal,
    editOrderModal,
    editOrderInfoModal,
    viewOrder,
    orderToView,
    handleDeleteClick,
    handleVerify,
    handleCloseAuthModal,
    handleViewOrder,
    handleEditClick,
    handleEditOrderSubmit,
    handleEditOrderInfoSubmit,
    closeEditModal,
    closeEditInfoModal,
    closeViewModal,
    openEditFromView,
    openEditInfoFromView,
    openCancelFromView,
    isUpdatingOrder: updateOrderMutation.isPending,
  };
}
