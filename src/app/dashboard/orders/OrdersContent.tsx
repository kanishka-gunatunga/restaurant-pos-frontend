"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import EditOrderModal from "@/components/orders/EditOrderModal";
import OrderDetailsViewModal from "@/components/orders/OrderDetailsViewModal";
import ManagerAuthorizationModal from "@/components/orders/ManagerAuthorizationModal";
import OrdersHeader from "./components/OrdersHeader";
import OrdersFilterSection from "./components/OrdersFilterSection";
import OrdersTable from "./components/OrdersTable";
import { useOrdersFilters } from "./hooks/useOrdersFilters";
import { useOrderModals } from "./hooks/useOrderModals";
import { MOCK_ORDERS } from "./mockOrders";

export default function OrdersContent() {
  const {
    search,
    setSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    filteredOrders,
  } = useOrdersFilters(MOCK_ORDERS);

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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <DashboardPageHeader />
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <OrdersHeader search={search} onSearchChange={setSearch} />
          <OrdersFilterSection
            orderStatusFilter={orderStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            onOrderStatusChange={setOrderStatusFilter}
            onPaymentStatusChange={setPaymentStatusFilter}
          />
          <OrdersTable
            orders={filteredOrders}
            onView={handleViewOrder}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {editOrderModal && (
        <EditOrderModal
          order={{
            orderNo: editOrderModal.orderNo,
            customerName: editOrderModal.customerName,
            totalAmount: editOrderModal.totalAmount,
            items: editOrderModal.items,
          }}
          onSubmit={handleEditOrderSubmit}
          onClose={closeEditModal}
        />
      )}

      {viewOrder && (
        <OrderDetailsViewModal
          order={orderToView(viewOrder)}
          onClose={closeViewModal}
          onEdit={
            viewOrder.status === "PENDING"
              ? () => openEditFromView(viewOrder)
              : undefined
          }
          onCancel={() => openCancelFromView(viewOrder.orderNo)}
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
