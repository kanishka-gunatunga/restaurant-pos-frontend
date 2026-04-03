import { Payment } from "./payment";

export type OrderStatus = "pending" | "preparing" | "ready" | "hold" | "complete" | "cancel";
export type OrderType = "takeaway" | "dining" | "delivery";

export interface OrderItemModification {
  id: string | number;
  orderItemId: string | number;
  modificationId: string | number;
  price: number;
  quantity?: number;
  modification?: {
    id: string | number;
    title: string;
    price: number;
    modificationId: string | number;
  };
}

export interface OrderItem {
  id: string | number;
  orderId: string | number;
  productId: string | number;
  variationId?: string | number;
  quantity: number;
  unitPrice: number;
  productDiscount: number;
  status: "pending" | "complete";
  product?: {
    id: string | number;
    name: string;
    code: string;
    image?: string;
    shortDescription?: string;
    description?: string;
    sku?: string;
    status: "active" | "inactive";
  };
  variation?: {
    id: string | number;
    productId: string | number;
    name: string;
    status: "active" | "inactive";
  };
  variationOption?: {
    id?: string | number;
    name: string;
  };
  modifications?: OrderItemModification[];
}

export interface Order {
  id: string | number;
  branchId?: number | null;
  customerId?: string | number;
  totalAmount: number;
  orderType: OrderType;
  tableNumber?: string;
  orderDiscount: number;
  tax: number;
  orderNote?: string;
  kitchenNote?: string;
  orderTimer?: number;
  deliveryAddress?: string;
  landmark?: string;
  zipcode?: string;
  deliveryInstructions?: string;
  serviceCharge?: number | string;
  deliveryChargeAmount?: number | string;
  deliveryChargeId?: number | null;
  status: OrderStatus;
  paymentStatus: "paid" | "pending" | "refund" | "partial_refund" | string;
  balanceDue?: number;
  requiresAdditionalPayment?: boolean;
  requires_additional_payment?: boolean;
  totalRefunded?: number;
  refundedAmount?: number;
  userId?: string | number;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string | number;
    name: string;
    mobile: string;
  };
  payments?: Payment[];
  items?: OrderItem[];
}

export interface CreateOrderData {
  customerMobile?: string;
  customerName?: string;
  customerId?: string | number;
  totalAmount: number;
  orderType: OrderType;
  tableNumber?: string;
  orderDiscount: number;
  tax: number;
  orderNote?: string;
  kitchenNote?: string;
  orderTimer?: number;
  deliveryAddress?: string;
  landmark?: string;
  zipcode?: string;
  deliveryInstructions?: string;
  serviceCharge?: number;
  deliveryChargeAmount?: number;
  deliveryChargeId?: number | null;
  deliveryChargeSelectedId?: number | null;
  order_products: {
    productId: string | number;
    variationId?: string | number;
    quantity: number;
    unitPrice: number;
    productDiscount: number;
    status?: "pending" | "complete";
    modifications?: {
      modificationId: number;
      price: number;
    }[];
  }[];
}

export interface UpdateOrderData extends Partial<CreateOrderData> {
  passcode?: string;
  paymentStatus?: string;
}

export interface OrdersListQueryParams {
  page?: number;
  pageSize?: number;
  placedByMe?: boolean;
}

export interface OrdersListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  placedByMe?: boolean;
}

export interface OrdersPageResponse {
  data: Order[];
  meta: OrdersListMeta;
}

export interface OrderSearchParams extends OrdersListQueryParams {
  q?: string;
  orderId?: string;
  customerName?: string;
  phone?: string;
}

export interface OrderFilterParams extends OrdersListQueryParams {
  status?: OrderStatus;
  paymentStatus?: string;
}
