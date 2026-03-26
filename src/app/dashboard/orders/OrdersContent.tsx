"use client";

import { useState, useCallback, useMemo } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import NewOrderDetailsModal from "@/components/menu/NewOrderDetailsModal";
import ProcessPaymentModal from "@/components/payments/ProcessPaymentModal";
import EditOrderModal from "@/components/orders/EditOrderModal";
import OrderDetailsViewModal from "@/components/orders/OrderDetailsViewModal";
import ManagerAuthorizationModal from "@/components/orders/ManagerAuthorizationModal";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersFilterSection from "@/components/orders/OrdersFilterSection";
import OrdersTable from "@/components/orders/OrdersTable";
import { useOrdersFilters } from "@/domains/orders/hooks/useOrdersFilters";
import { mapOrderToRow } from "@/domains/orders/types";
import {
  useOrderModals,
  type OrderNeedsPaymentAfterEditPayload,
} from "@/domains/orders/hooks/useOrderModals";
import { useGetOrderById } from "@/hooks/useOrder";
import { collectibleOrderAmount } from "@/domains/orders/orderCollectionAmount";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type ProcessingPayment = {
  orderId: number;
  orderNo: string | number;
  customerName: string;
  customerMobile: string;
  total: number;
  isAdditionalPayment?: boolean;
};

export default function OrdersContent() {
  const [processingPayment, setProcessingPayment] = useState<ProcessingPayment | null>(null);

  const {
    search,
    setSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    filteredOrders,
    isLoading,
  } = useOrdersFilters();

  const clearPaymentIfCancelled = useCallback((orderNo: string) => {
    setProcessingPayment((prev) => (prev?.orderNo === orderNo ? null : prev));
  }, []);

  const handleOrderNeedsPaymentAfterEdit = useCallback(
    (ctx: OrderNeedsPaymentAfterEditPayload) => {
      setProcessingPayment({
        orderId: Number(ctx.orderId),
        orderNo: ctx.orderNo,
        customerName: ctx.customerName,
        customerMobile: ctx.phone,
        total: ctx.amount,
        isAdditionalPayment: true,
      });
    },
    []
  );

  const {
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
    handleEditOrderAndPay,
    handleEditOrderInfoSubmit,
    closeEditModal,
    closeEditInfoModal,
    closeViewModal,
    openEditFromView,
    openEditInfoFromView,
    openCancelFromView,
    isUpdatingOrder,
  } = useOrderModals({
    onOrderCancelled: clearPaymentIfCancelled,
    onOrderNeedsPaymentAfterEdit: handleOrderNeedsPaymentAfterEdit,
  });

  const { data: viewOrderDetails } = useGetOrderById(viewOrder?.id);
  const activeViewOrder = useMemo(() => {
    if (!viewOrder) return null;
    if (viewOrderDetails) return mapOrderToRow(viewOrderDetails);
    const fromList = filteredOrders.find((o) => o.id === viewOrder.id);
    return fromList ?? viewOrder;
  }, [viewOrder, viewOrderDetails, filteredOrders]);

  const openPaymentFlow = (order: {
    id: string;
    orderNo: string;
    customerName: string;
    phone: string;
    totalAmount: number;
    balanceDue?: number | null;
  }) => {
    const total = collectibleOrderAmount(order);
    if (total <= 0.02) {
      toast.message("No balance due on this order.");
      return;
    }
    setProcessingPayment({
      orderId: Number(order.id),
      orderNo: order.orderNo,
      customerName: order.customerName,
      customerMobile: order.phone,
      total,
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <DashboardPageHeader />
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="">
          <OrdersHeader search={search} onSearchChange={setSearch} />
          <OrdersFilterSection
            orderStatusFilter={orderStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            onOrderStatusChange={setOrderStatusFilter}
            onPaymentStatusChange={setPaymentStatusFilter}
          />

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#EA580C]" />
            </div>
          ) : (
            <OrdersTable
              orders={filteredOrders}
              onView={handleViewOrder}
              onPay={openPaymentFlow}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {editOrderModal && (
        <EditOrderModal
          isSubmitting={isUpdatingOrder}
          order={{
            id: editOrderModal.id,
            orderNo: editOrderModal.orderNo,
            customerName: editOrderModal.customerName,
            totalAmount: editOrderModal.totalAmount,
            orderDiscount: editOrderModal.orderDiscount ?? 0,
            items: editOrderModal.items?.map((item, index) => ({
              id: item.id ?? `line-${editOrderModal.orderNo}-${index}-${item.name}`,
              productId: item.productId,
              variationId: item.variationId,
              name: item.name,
              qty: item.qty,
              price: item.price,
              productDiscount: item.productDiscount ?? 0,
              image: item.image,
              variant: item.variant,
              addOns: item.addOns,
              modifications: item.modifications,
            })),
          }}
          onSubmit={handleEditOrderSubmit}
          onClose={closeEditModal}
          onOrderAndPay={async ({ items }) => {
            const row = editOrderModal;
            if (!row) return null;
            const additional = await handleEditOrderAndPay({ items });
            if (additional != null && additional > 0.02) {
              setProcessingPayment({
                orderId: Number(row.id),
                orderNo: row.orderNo,
                customerName: row.customerName,
                customerMobile: row.phone,
                total: additional,
                isAdditionalPayment: true,
              });
            }
            return additional;
          }}
        />
      )}

      {editOrderInfoModal && (
        <NewOrderDetailsModal
          title="Edit Order Details"
          submitButtonText="Save Details"
          initialData={{
            customerName: editOrderInfoModal.customerName,
            phone: editOrderInfoModal.phone,
            orderType: editOrderInfoModal.orderType ?? "Dine In",
            tableNumber: editOrderInfoModal.tableNumber,
            deliveryAddress: editOrderInfoModal.deliveryAddress,
            landmark: editOrderInfoModal.landmark,
            zipCode: editOrderInfoModal.zipCode,
            deliveryInstructions: editOrderInfoModal.deliveryInstructions,
          }}
          isSubmitting={isUpdatingOrder}
          onSubmit={handleEditOrderInfoSubmit}
          onClose={closeEditInfoModal}
        />
      )}

      {activeViewOrder && (
        <OrderDetailsViewModal
          order={orderToView(activeViewOrder)}
          onClose={closeViewModal}
          onEditInfo={() => openEditInfoFromView(activeViewOrder)}
          onPayNow={(details) => {
            openPaymentFlow({
              id: details.id,
              orderNo: details.orderNo,
              customerName: details.customerName,
              phone: details.phone,
              totalAmount: details.totalAmount,
              balanceDue: details.balanceDue,
            });
            closeViewModal();
          }}
          onEdit={
            activeViewOrder.status === "pending"
              ? () => openEditFromView(activeViewOrder)
              : undefined
          }
          onCancel={() => openCancelFromView(activeViewOrder.id)}
        />
      )}

      {processingPayment && (
        <ProcessPaymentModal
          payment={{
            id: processingPayment.orderId,
            orderNo: Number(processingPayment.orderNo),
            customerName: processingPayment.customerName,
            customerMobile: processingPayment.customerMobile,
            dateTime: new Date().toISOString(),
            method: null,
            paymentStatus: "pending",
            amount: processingPayment.total,
            isAdditionalCharge: processingPayment.isAdditionalPayment,
          }}
          amountCaption={
            processingPayment.isAdditionalPayment ? "Amount to collect" : "Total"
          }
          onClose={() => setProcessingPayment(null)}
        />
      )}

      {authModal.orderNo && (
        <ManagerAuthorizationModal
          orderNo={authModal.orderNo}
          isOpen={authModal.isOpen}
          onClose={handleCloseAuthModal}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
}
