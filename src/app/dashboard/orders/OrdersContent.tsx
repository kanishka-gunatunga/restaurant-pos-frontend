"use client";

import { useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import NewOrderDetailsModal from "@/components/menu/NewOrderDetailsModal";
import ProcessPaymentModal from "@/components/menu/ProcessPaymentModal";
import EditOrderModal from "@/components/orders/EditOrderModal";
import OrderDetailsViewModal from "@/components/orders/OrderDetailsViewModal";
import ManagerAuthorizationModal from "@/components/orders/ManagerAuthorizationModal";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersFilterSection from "@/components/orders/OrdersFilterSection";
import OrdersTable from "@/components/orders/OrdersTable";
import { useOrdersFilters } from "@/domains/orders/hooks/useOrdersFilters";
import { mapOrderToRow } from "@/domains/orders/types";
import { useOrderModals } from "@/domains/orders/hooks/useOrderModals";
import { useGetOrderById } from "@/hooks/useOrder";
import { Loader2 } from "lucide-react";

type ProcessingPayment = {
  orderId: number;
  customerName: string;
  total: number;
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
    handleEditOrderInfoSubmit,
    closeEditModal,
    closeEditInfoModal,
    closeViewModal,
    openEditFromView,
    openEditInfoFromView,
    openCancelFromView,
    isUpdatingOrder,
  } = useOrderModals();

  const { data: viewOrderDetails } = useGetOrderById(viewOrder?.id);
  const activeViewOrder = viewOrderDetails ? mapOrderToRow(viewOrderDetails) : viewOrder;

  const openPaymentFlow = (order: {
    id: string;
    orderNo: string;
    customerName: string;
    phone: string;
    totalAmount: number;
  }) => {
    setProcessingPayment({
      orderId: Number(order.id),
      customerName: order.customerName,
      total: order.totalAmount,
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
          order={{
            id: editOrderModal.id,
            orderNo: editOrderModal.orderNo,
            customerName: editOrderModal.customerName,
            totalAmount: editOrderModal.totalAmount,
            items: editOrderModal.items?.map((item, index) => ({
              id: item.id ?? `line-${editOrderModal.orderNo}-${index}-${item.name}`,
              productId: item.productId,
              variationId: item.variationId,
              name: item.name,
              qty: item.qty,
              price: item.price,
              productDiscount: item.productDiscount,
              image: item.image,
              variant: item.variant,
              addOns: item.addOns,
              modifications: item.modifications,
            })),
          }}
          onSubmit={handleEditOrderSubmit}
          onClose={closeEditModal}
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
          onPayNow={() => {
            openPaymentFlow(activeViewOrder);
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
          customerName={processingPayment.customerName}
          total={processingPayment.total}
          orderId={processingPayment.orderId}
          onClose={() => setProcessingPayment(null)}
          onComplete={() => setProcessingPayment(null)}
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
