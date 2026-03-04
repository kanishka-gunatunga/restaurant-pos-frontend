import { Payment } from "./payment";

export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "delivered" | "cancel" | "hold";
export type OrderType = "dine-in" | "take-away" | "delivery";

export interface OrderItemModification {
  id: string | number;
  orderItemId: string | number;
  modificationId: string | number;
  price: number;
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
  modifications?: OrderItemModification[];
}

export interface Order {
  id: string | number;
  customerId?: string | number;
  totalAmount: number;
  orderType: OrderType;
  tableNumber?: string;
  orderDiscount: number;
  tax: number;
  orderNote?: string;
  kitchenNote?: string;
  orderTimer?: string;
  deliveryAddress?: string;
  landmark?: string;
  zipcode?: string;
  deliveryInstructions?: string;
  status: OrderStatus;
  paymentStatus: "paid" | "pending" | "refund";
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
  orderTimer?: string;
  deliveryAddress?: string;
  landmark?: string;
  zipcode?: string;
  deliveryInstructions?: string;
  order_products: {
    productId: string | number;
    variationId?: string | number;
    quantity: number;
    unitPrice: number;
    productDiscount: number;
    status?: "pending" | "complete";
    modifications?: {
      modificationId: string | number;
      price: number;
    }[];
  }[];
}

export interface UpdateOrderData extends Partial<CreateOrderData> {
  passcode?: string;
}

export interface OrderSearchParams {
  q?: string;
  orderId?: string;
  customerName?: string;
  phone?: string;
}

export interface OrderFilterParams {
  status?: OrderStatus;
  paymentStatus?: string;
}
