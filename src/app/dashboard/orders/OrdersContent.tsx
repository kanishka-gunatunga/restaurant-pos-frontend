"use client";

import { useState } from "react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { MENU_ITEMS } from "@/components/menu/menuData";
import ProcessPaymentModal from "@/components/menu/ProcessPaymentModal";
import EditOrderModal from "@/components/orders/EditOrderModal";
import OrderDetailsViewModal from "@/components/orders/OrderDetailsViewModal";
import ManagerAuthorizationModal from "@/components/orders/ManagerAuthorizationModal";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersFilterSection from "@/components/orders/OrdersFilterSection";
import OrdersTable from "@/components/orders/OrdersTable";
import { useOrdersFilters } from "@/domains/orders/hooks/useOrdersFilters";
import { useOrderModals } from "@/domains/orders/hooks/useOrderModals";
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
  } = useOrderModals();

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
            items: (editOrderModal.items ?? []).map((item, index) => {
              const matchingMenuItem = MENU_ITEMS.find(
                (menuItem) => menuItem.name === item.name
              );

              return {
                id: `line-${editOrderModal.orderNo}-${index}-${item.name}`,
                productId: String(matchingMenuItem?.id ?? index + 1),
                name: item.name,
                qty: item.qty,
                price: item.price,
              };
            }),
          }}
          onSubmit={handleEditOrderSubmit}
          onClose={closeEditModal}
        />
      )}

      {viewOrder && (
        <OrderDetailsViewModal
          order={orderToView(viewOrder)}
          onClose={closeViewModal}
          onPayNow={() => {
            openPaymentFlow(viewOrder);
            closeViewModal();
          }}
          onEdit={
            viewOrder.status === "pending"
              ? () => openEditFromView(viewOrder)
              : undefined
          }
          onCancel={() => openCancelFromView(viewOrder.id)}
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
