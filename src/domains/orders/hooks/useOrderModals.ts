import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { OrderRow, OrderDetailsView } from "../types";
import { EditOrderLineItem } from "@/components/orders/EditOrderModal";
import { useUpdateOrderStatus, useUpdateOrder } from "@/hooks/useOrder";
import { useUpdateCustomer } from "@/hooks/useCustomer";
import { useUpdatePaymentStatus, useGetPaymentsByOrder } from "@/hooks/usePayment";
import type { OrderDetailsData } from "@/contexts/OrderContext";
import { totalsFromOrderLineItems } from "@/domains/orders/orderLineTotals";
import { isInvalidManagerPasscodeError } from "@/lib/api/managerPasscodeError";

const MONEY_EPS = 0.02;

function paymentRowAmount(p: { amount?: unknown }): number {
  const n = Number(p.amount);
  return Number.isFinite(n) ? n : 0;
}

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
    orderDiscount: order.orderDiscount ?? 0,
    balanceDue: order.balanceDue,
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
    } catch (error: unknown) {
      console.error("Cancellation process failed:", error);
      if (!isInvalidManagerPasscodeError(error)) {
        const ax = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          ax?.response?.data?.message ||
            (error instanceof Error ? error.message : null) ||
            "Failed to cancel order"
        );
      }
      throw error;
    }
  }, [authModal.orderNo, updateStatusMutation, onOrderCancelled]);

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
        const computed = totalsFromOrderLineItems(
          data.items.map((it) => ({
            name: it.name,
            qty: it.qty,
            price: it.price,
            productDiscount: it.productDiscount,
            modifications: it.modifications?.map((m) => ({ price: m.price })),
          })),
          editOrderModal.orderDiscount ?? 0
        );
        const newTotal = computed?.totalAmount ?? 0;
        const originalTotal = editOrderModal.totalAmount;
        const refundAmount = originalTotal - newTotal;
        const additionalDue = newTotal - originalTotal;

        const paySt = String(editOrderModal.paymentStatus).toLowerCase();
        const notifyBalanceAfterEdit =
          additionalDue > MONEY_EPS &&
          (paySt === "paid" || paySt === "partial_refund" || paySt === "pending");

        updateOrderMutation.mutate(
          {
            id: editOrderModal.id,
            data: {
              // Server recomputes totals + syncBalanceDuePayment (balance_due row) in the same transaction.
              order_products: data.items.map((item) => ({
                productId: Number(item.productId || item.id),
                variationId: item.variationId ? Number(item.variationId) : undefined,
                quantity: item.qty,
                unitPrice: item.price,
                productDiscount: item.productDiscount ?? 0,
                modifications: item.modifications,
              })),
            },
          },
          {
            onSuccess: async () => {
              try {
                if (refundAmount > MONEY_EPS && payments.length > 0) {
                  const payment = payments[0] as { id: number; amount?: number };
                  const isFullRefund = refundAmount >= paymentRowAmount(payment);
                  await updatePaymentStatusMutation.mutateAsync({
                    id: payment.id,
                    payload: {
                      is_refund: 1,
                      refund_type: isFullRefund ? "full" : "partial",
                      refund_amount: refundAmount,
                      status: isFullRefund ? "refund" : "partial_refund",
                    },
                  });
                }
                if (notifyBalanceAfterEdit) {
                  toast.success(
                    "Order updated. Use Pay to collect the balance due when the customer is ready."
                  );
                }
              } catch (err: unknown) {
                const msg =
                  err && typeof err === "object" && "message" in err
                    ? String((err as { message?: string }).message)
                    : "Payment update failed";
                toast.error(msg);
              } finally {
                setEditOrderModal(null);
              }
            },
          }
        );
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
