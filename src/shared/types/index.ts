// ===== CANDID VARIANT TYPES =====

export type UserRole = {
  Manufacturer?: null;
  Distributor?: null;
  Retailer?: null;
  Customer?: null;
};

export const UserRoles = {
  Manufacturer: { Manufacturer: null } as UserRole,
  Distributor: { Distributor: null } as UserRole,
  Retailer: { Retailer: null } as UserRole,
  Customer: { Customer: null } as UserRole,
};

export type ProductStatus = {
  Available?: null;
  OutOfStock?: null;
  Discontinued?: null;
};

export const ProductStatuses = {
  Available: { Available: null } as ProductStatus,
  OutOfStock: { OutOfStock: null } as ProductStatus,
  Discontinued: { Discontinued: null } as ProductStatus,
};

// ===== SHARED INTERFACES =====

export interface User {
  user_principal: string;
  name: string;
  role: UserRole;
  email: string;
  company: string;
  is_active: boolean;
  created_at: bigint;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  current_owner: string;
  price: number;
  quantity: number;
  status: ProductStatus;
  category: string;
  created_at: bigint;
  updated_at: bigint;
}

export interface ProductEvent {
  product_id: string;
  event_type: string;
  description: string;
  from_user: string;
  to_user: string;
  timestamp: bigint;
}

// ===== HELPER FUNCTIONS =====

export const getRoleString = (role: UserRole | undefined): string => {
  if (!role) return 'Unknown Role';
  return Object.keys(role)[0] || 'Unknown Role';
};

export const getStatusString = (status: ProductStatus | undefined): string => {
  if (!status) return 'Unknown Status';
  return Object.keys(status)[0] || 'Unknown Status';
}; 