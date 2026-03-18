import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { OrderRow, OrderDetailsView } from "../types";
import { EditOrderLineItem } from "@/components/orders/EditOrderModal";
import { useUpdateOrderStatus, useUpdateOrder } from "@/hooks/useOrder";
import { useUpdateCustomer } from "@/hooks/useCustomer";
import { useUpdatePaymentStatus, useGetPaymentsByOrder } from "@/hooks/usePayment";
import * as paymentService from "@/services/paymentService";
import type { OrderDetailsData } from "@/contexts/OrderContext";

function mapOrderTypeToApi(orderType: OrderDetailsData["orderType"]) {
  if (orderType === "Dine In") return "dining";
  if (orderType === "Take Away") return "takeaway";
  return "delivery";
}

type UseOrderModalsOptions = {
  onOrderCancelled?: (orderNo: string) => void;
};

export function useOrderModals(options?: UseOrderModalsOptions) {
  const { onOrderCancelled } = options ?? {};
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
    customerId: order.customerId,
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
  const updateCustomerMutation = useUpdateCustomer();
  const updatePaymentStatusMutation = useUpdatePaymentStatus();

  // We'll fetch payments for the current edit order to handle refunds
  const { data: payments = [] } = useGetPaymentsByOrder(Number(editOrderModal?.id || 0));

  const handleDeleteClick = useCallback((orderNo: string) => {
    setAuthModal({ isOpen: true, orderNo });
  }, []);

  const handleVerify = useCallback(async (passcode: string) => {
    if (!authModal.orderNo) return;
    const cancelledOrderNo = authModal.orderNo;
    
    try {
      // 1. Fetch payments for this order
      const orderPayments = await paymentService.getPaymentsByOrder(Number(cancelledOrderNo));
      
      // 2. Trigger refunds for each payment
      if (orderPayments && orderPayments.length > 0) {
        toast.info(`Processing ${orderPayments.length} refund(s)...`);
        
        await Promise.all(orderPayments.map(async (payment) => {
          try {
            await updatePaymentStatusMutation.mutateAsync({
              id: payment.id,
              payload: {
                is_refund: 1,
                refund_type: "full",
                status: "refund"
              }
            });
            toast.success(`Refund processed for payment #${payment.id}`);
          } catch (err) {
            console.error(`Refund failed for payment #${payment.id}:`, err);
            toast.error(`Refund failed for payment #${payment.id}`);
          }
        }));
      }

      // 3. Cancel the order
      await updateStatusMutation.mutateAsync({
        id: cancelledOrderNo,
        data: {
          status: "cancel",
          passcode,
        },
      });
      
      toast.success("Order cancelled successfully");
      setAuthModal({ isOpen: false, orderNo: null });
      onOrderCancelled?.(cancelledOrderNo);
    } catch (error: any) {
      console.error("Cancellation process failed:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to cancel order");
    }
  }, [authModal.orderNo, updateStatusMutation, updatePaymentStatusMutation, onOrderCancelled]);

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
              // Update the customer record as well if we have a customerId
              if (editOrderInfoModal.customerId) {
                updateCustomerMutation.mutate({
                  id: editOrderInfoModal.customerId,
                  data: {
                    name: data.customerName,
                    mobile: data.phone,
                  },
                });
              }
              setEditOrderInfoModal(null);
            },
          }
        );
      }
    },
    [editOrderInfoModal, updateOrderMutation, updateCustomerMutation]
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
