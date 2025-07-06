// ===== USER TYPES =====

export enum UserRole {
  MANUFACTURER = 'manufacturer',
  DISTRIBUTOR = 'distributor', 
  RETAILER = 'retailer',
  CUSTOMER = 'customer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  created_at: number;
  is_active: boolean;
}

// ===== PRODUCT TYPES =====

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  manufacturer: string;
  category: string;
  specifications: Array<{key: string, value: string}>;
  is_available: boolean;
  created_at: number;
}

export interface Inventory {
  product_id: string;
  quantity: number;
  location: string;
  owner: string; // user id
  last_updated: number;
}

// ===== ORDER TYPES =====

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PRODUCTION = 'in_production',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum OrderType {
  MANUFACTURER_TO_DISTRIBUTOR = 'manufacturer_to_distributor',
  DISTRIBUTOR_TO_RETAILER = 'distributor_to_retailer',
  RETAILER_TO_CUSTOMER = 'retailer_to_customer'
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name?: string; // for display purposes
}

export interface Order {
  id: string;
  buyer: string; // user id
  seller: string; // user id
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  order_type: OrderType;
  created_at: number;
  updated_at: number;
  delivery_date?: number;
}

// ===== TRACKING TYPES =====

export enum EventType {
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  PRODUCTION_STARTED = 'production_started',
  QUALITY_CHECK = 'quality_check',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered'
}

export interface SupplyChainEvent {
  id: string;
  order_id: string;
  event_type: EventType;
  location: string;
  timestamp: number;
  description: string;
  actor: string; // user id
}

// ===== DASHBOARD TYPES =====

export interface DashboardStats {
  total_products: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  inventory_value: number;
}

export interface OrderSummary {
  id: string;
  buyer_name: string;
  seller_name: string;
  total_amount: number;
  status: OrderStatus;
  created_at: number;
  item_count: number;
}

// ===== FORM TYPES =====

export interface CreateProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  specifications: Array<{key: string, value: string}>;
  manufacturer: string;
}

export interface CreateOrderForm {
  seller: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusForm {
  order_id: string;
  status: OrderStatus;
  location: string;
  notes: string;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
} 